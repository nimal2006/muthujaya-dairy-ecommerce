const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Bill = require("../models/Bill");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { sendNotification } = require("../utils/notifications");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Private
router.post("/create-order", protect, async (req, res) => {
  try {
    const { amount, billId } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `bill_${billId}_${Date.now()}`,
      notes: {
        billId,
        userId: req.user._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create payment order" });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post("/verify", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      billId,
      amount,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Create payment record
    const payment = await Payment.create({
      user: req.user._id,
      bill: billId,
      amount,
      method: "razorpay",
      status: "completed",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paidAt: new Date(),
    });

    // Update bill
    if (billId) {
      const bill = await Bill.findById(billId);
      if (bill) {
        bill.payments.push({
          amount,
          method: "online",
          transactionId: razorpay_payment_id,
          paidAt: new Date(),
        });
        bill.paidAmount += amount;
        bill.pendingAmount = Math.max(0, bill.totalAmount - bill.paidAmount);
        bill.status = bill.pendingAmount <= 0 ? "paid" : "partial";
        await bill.save();

        // Update user's pending amount
        const user = await User.findById(req.user._id);
        if (user) {
          user.pendingAmount = Math.max(0, user.pendingAmount - amount);
          await user.save();
        }
      }
    }

    // Send notification
    await sendNotification(
      req.user,
      "Payment Successful",
      `₹${amount} payment received successfully. Transaction ID: ${razorpay_payment_id}`,
      "payment"
    );

    res.json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
});

// @route   GET /api/payments
// @desc    Get payments
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    if (req.user.role === "user") {
      query.user = req.user._id;
    }
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate("user", "name email phone")
      .populate("bill", "billNumber month year")
      .populate("receivedBy", "name")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ paidAt: -1 });

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      count: payments.length,
      total,
      pages: Math.ceil(total / limit),
      payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/payments/cash
// @desc    Record cash payment
// @access  Private/Admin,Labour
router.post("/cash", protect, async (req, res) => {
  try {
    const { userId, billId, amount, notes } = req.body;

    // Only admin or labour can record cash payments
    if (!["admin", "labour"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const payment = await Payment.create({
      user: userId,
      bill: billId,
      amount,
      method: "cash",
      status: "completed",
      receivedBy: req.user._id,
      notes,
      paidAt: new Date(),
    });

    // Update bill if specified
    if (billId) {
      const bill = await Bill.findById(billId);
      if (bill) {
        bill.payments.push({
          amount,
          method: "cash",
          transactionId: payment.transactionId,
          paidAt: new Date(),
          receivedBy: req.user._id,
          notes,
        });
        bill.paidAmount += amount;
        bill.pendingAmount = Math.max(0, bill.totalAmount - bill.paidAmount);
        bill.status = bill.pendingAmount <= 0 ? "paid" : "partial";
        await bill.save();
      }
    }

    // Update user's pending amount
    const user = await User.findById(userId);
    if (user) {
      user.pendingAmount = Math.max(0, user.pendingAmount - amount);
      await user.save();

      // Send notification
      await sendNotification(
        user,
        "Payment Received",
        `₹${amount} cash payment received. Thank you!`,
        "payment"
      );
    }

    res.status(201).json({
      success: true,
      message: "Cash payment recorded successfully",
      payment,
    });
  } catch (error) {
    console.error("Cash payment error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("bill")
      .populate("receivedBy", "name");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Authorization
    if (
      req.user.role === "user" &&
      payment.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
