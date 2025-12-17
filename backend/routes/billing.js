const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");
const Delivery = require("../models/Delivery");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
const { generateBillPDF } = require("../utils/pdfGenerator");
const { sendNotification } = require("../utils/notifications");

// @route   GET /api/billing
// @desc    Get bills
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const { month, year, status, page = 1, limit = 20 } = req.query;

    const query = {};

    if (req.user.role === "user") {
      query.user = req.user._id;
    }

    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    if (status) query.status = status;

    const bills = await Bill.find(query)
      .populate("user", "name email phone")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Bill.countDocuments(query);

    res.json({
      success: true,
      count: bills.length,
      total,
      pages: Math.ceil(total / limit),
      bills,
    });
  } catch (error) {
    console.error("Get bills error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/billing/:id
// @desc    Get single bill
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate("user", "name email phone address")
      .populate("deliveries")
      .populate("items.product");

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    // Authorization check
    if (
      req.user.role === "user" &&
      bill.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.json({
      success: true,
      bill,
    });
  } catch (error) {
    console.error("Get bill error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/billing/generate
// @desc    Generate monthly bill for a user
// @access  Private/Admin
router.post("/generate", protect, authorize("admin"), async (req, res) => {
  try {
    const { userId, month, year } = req.body;

    const m = parseInt(month) || new Date().getMonth() + 1;
    const y = parseInt(year) || new Date().getFullYear();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if bill already exists
    const existingBill = await Bill.findOne({
      user: userId,
      month: m,
      year: y,
    });
    if (existingBill) {
      return res.status(400).json({
        success: false,
        message: "Bill already exists for this period",
        bill: existingBill,
      });
    }

    // Get deliveries for the month
    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const deliveries = await Delivery.find({
      user: userId,
      deliveryDate: { $gte: startDate, $lte: endDate },
      status: "delivered",
    }).populate("items.product");

    if (deliveries.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No deliveries found for this period",
      });
    }

    // Calculate bill items
    const itemsMap = {};
    let totalLitres = 0;

    deliveries.forEach((delivery) => {
      delivery.items.forEach((item) => {
        const productId = item.product._id.toString();
        if (!itemsMap[productId]) {
          itemsMap[productId] = {
            product: item.product._id,
            productName: item.product.name,
            totalQuantity: 0,
            unit: item.product.unit,
            pricePerUnit: item.pricePerUnit,
            totalAmount: 0,
          };
        }
        itemsMap[productId].totalQuantity += item.quantity;
        itemsMap[productId].totalAmount += item.totalPrice;

        if (item.product.unit === "litre") {
          totalLitres += item.quantity;
        }
      });
    });

    const items = Object.values(itemsMap);
    const subtotal = items.reduce((sum, item) => sum + item.totalAmount, 0);

    // Create bill
    const bill = await Bill.create({
      user: userId,
      month: m,
      year: y,
      billingPeriod: {
        startDate,
        endDate,
      },
      deliveries: deliveries.map((d) => d._id),
      items,
      totalLitres,
      totalDeliveries: deliveries.length,
      skippedDeliveries: await Delivery.countDocuments({
        user: userId,
        deliveryDate: { $gte: startDate, $lte: endDate },
        status: "skipped",
      }),
      subtotal,
      totalAmount: subtotal,
      pendingAmount: subtotal,
      dueDate: new Date(y, m, 7), // 7th of next month
      status: "generated",
    });

    // Update user's pending amount
    user.pendingAmount = (user.pendingAmount || 0) + subtotal;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Bill generated successfully",
      bill,
    });
  } catch (error) {
    console.error("Generate bill error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/billing/generate-all
// @desc    Generate bills for all users
// @access  Private/Admin
router.post("/generate-all", protect, authorize("admin"), async (req, res) => {
  try {
    const { month, year } = req.body;

    const m = parseInt(month) || new Date().getMonth() + 1;
    const y = parseInt(year) || new Date().getFullYear();

    const users = await User.find({ role: "user", isActive: true });

    const results = {
      generated: 0,
      skipped: 0,
      errors: [],
    };

    for (const user of users) {
      try {
        // Check if bill already exists
        const existingBill = await Bill.findOne({
          user: user._id,
          month: m,
          year: y,
        });
        if (existingBill) {
          results.skipped++;
          continue;
        }

        // Get deliveries
        const startDate = new Date(y, m - 1, 1);
        const endDate = new Date(y, m, 0, 23, 59, 59);

        const deliveries = await Delivery.find({
          user: user._id,
          deliveryDate: { $gte: startDate, $lte: endDate },
          status: "delivered",
        }).populate("items.product");

        if (deliveries.length === 0) {
          results.skipped++;
          continue;
        }

        // Calculate items
        const itemsMap = {};
        let totalLitres = 0;

        deliveries.forEach((delivery) => {
          delivery.items.forEach((item) => {
            const productId = item.product._id.toString();
            if (!itemsMap[productId]) {
              itemsMap[productId] = {
                product: item.product._id,
                productName: item.product.name,
                totalQuantity: 0,
                unit: item.product.unit,
                pricePerUnit: item.pricePerUnit,
                totalAmount: 0,
              };
            }
            itemsMap[productId].totalQuantity += item.quantity;
            itemsMap[productId].totalAmount += item.totalPrice;

            if (item.product.unit === "litre") {
              totalLitres += item.quantity;
            }
          });
        });

        const items = Object.values(itemsMap);
        const subtotal = items.reduce((sum, item) => sum + item.totalAmount, 0);

        await Bill.create({
          user: user._id,
          month: m,
          year: y,
          billingPeriod: { startDate, endDate },
          deliveries: deliveries.map((d) => d._id),
          items,
          totalLitres,
          totalDeliveries: deliveries.length,
          skippedDeliveries: await Delivery.countDocuments({
            user: user._id,
            deliveryDate: { $gte: startDate, $lte: endDate },
            status: "skipped",
          }),
          subtotal,
          totalAmount: subtotal,
          pendingAmount: subtotal,
          dueDate: new Date(y, m, 7),
          status: "generated",
        });

        user.pendingAmount = (user.pendingAmount || 0) + subtotal;
        await user.save();

        results.generated++;
      } catch (err) {
        results.errors.push({ userId: user._id, error: err.message });
      }
    }

    res.json({
      success: true,
      message: "Bills generation completed",
      results,
    });
  } catch (error) {
    console.error("Generate all bills error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/billing/:id/download
// @desc    Download bill PDF
// @access  Private
router.get("/:id/download", protect, async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate("user")
      .populate("items.product");

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    // Authorization
    if (
      req.user.role === "user" &&
      bill.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const pdfBuffer = await generateBillPDF(bill, bill.user);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bill-${bill.billNumber}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Download bill error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /api/billing/:id/payment
// @desc    Record payment for a bill
// @access  Private/Admin,Labour
router.put(
  "/:id/payment",
  protect,
  authorize("admin", "labour"),
  async (req, res) => {
    try {
      const { amount, method, transactionId, notes } = req.body;

      const bill = await Bill.findById(req.params.id).populate("user");
      if (!bill) {
        return res.status(404).json({
          success: false,
          message: "Bill not found",
        });
      }

      // Add payment
      bill.payments.push({
        amount,
        method,
        transactionId,
        paidAt: new Date(),
        receivedBy: req.user._id,
        notes,
      });

      // Update amounts
      bill.paidAmount += amount;
      bill.pendingAmount = bill.totalAmount - bill.paidAmount;

      // Update status
      if (bill.pendingAmount <= 0) {
        bill.status = "paid";
        bill.pendingAmount = 0;
      } else {
        bill.status = "partial";
      }

      await bill.save();

      // Update user's pending amount
      if (bill.user) {
        bill.user.pendingAmount = Math.max(0, bill.user.pendingAmount - amount);
        await bill.user.save();

        // Send notification
        await sendNotification(
          bill.user,
          "Payment Received",
          `₹${amount} received for bill ${bill.billNumber}. Pending: ₹${bill.pendingAmount}`,
          "payment"
        );
      }

      res.json({
        success: true,
        message: "Payment recorded successfully",
        bill,
      });
    } catch (error) {
      console.error("Record payment error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

module.exports = router;
