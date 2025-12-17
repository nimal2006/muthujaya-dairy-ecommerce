const express = require("express");
const router = express.Router();
const Delivery = require("../models/Delivery");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
const { sendNotification } = require("../utils/notifications");

// @route   GET /api/deliveries
// @desc    Get deliveries (filtered by role)
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const {
      date,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // Filter by role
    if (req.user.role === "user") {
      query.user = req.user._id;
    } else if (req.user.role === "labour") {
      query.labour = req.user._id;
    }

    // Date filters
    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      query.deliveryDate = { $gte: dayStart, $lte: dayEnd };
    } else if (startDate && endDate) {
      query.deliveryDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (status) query.status = status;

    const deliveries = await Delivery.find(query)
      .populate("user", "name phone address")
      .populate("labour", "name phone")
      .populate("items.product", "name pricePerUnit unit")
      .populate("route", "name")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ deliveryDate: -1, deliveryTime: 1 });

    const total = await Delivery.countDocuments(query);

    res.json({
      success: true,
      count: deliveries.length,
      total,
      pages: Math.ceil(total / limit),
      deliveries,
    });
  } catch (error) {
    console.error("Get deliveries error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/deliveries/today
// @desc    Get today's deliveries
// @access  Private
router.get("/today", protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const query = {
      deliveryDate: { $gte: today, $lt: tomorrow },
    };

    if (req.user.role === "user") {
      query.user = req.user._id;
    } else if (req.user.role === "labour") {
      query.labour = req.user._id;
    }

    const deliveries = await Delivery.find(query)
      .populate("user", "name phone address")
      .populate("items.product", "name pricePerUnit unit image")
      .populate("route", "name")
      .sort({ "items.product.name": 1 });

    // Stats
    const stats = {
      total: deliveries.length,
      delivered: deliveries.filter((d) => d.status === "delivered").length,
      pending: deliveries.filter(
        (d) => d.status === "pending" || d.status === "scheduled"
      ).length,
      skipped: deliveries.filter((d) => d.status === "skipped").length,
      totalAmount: deliveries.reduce(
        (sum, d) => sum + (d.status === "delivered" ? d.totalAmount : 0),
        0
      ),
    };

    res.json({
      success: true,
      stats,
      deliveries,
    });
  } catch (error) {
    console.error("Get today deliveries error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/deliveries/:id
// @desc    Get single delivery
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate("user", "name phone address email")
      .populate("labour", "name phone")
      .populate("items.product")
      .populate("route");

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    // Check authorization
    if (
      (req.user.role === "user" &&
        delivery.user._id.toString() !== req.user._id.toString()) ||
      (req.user.role === "labour" &&
        delivery.labour._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.json({
      success: true,
      delivery,
    });
  } catch (error) {
    console.error("Get delivery error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/deliveries
// @desc    Create delivery (Admin/Labour)
// @access  Private/Admin,Labour
router.post("/", protect, authorize("admin", "labour"), async (req, res) => {
  try {
    const { user, deliveryDate, deliveryTime, items, route, notes } = req.body;

    // Calculate total
    let totalAmount = 0;
    for (const item of items) {
      item.totalPrice = item.quantity * item.pricePerUnit;
      totalAmount += item.totalPrice;
    }

    const userData = await User.findById(user);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const delivery = await Delivery.create({
      user,
      labour: req.user.role === "labour" ? req.user._id : req.body.labour,
      route: route || userData.assignedRoute,
      deliveryDate,
      deliveryTime,
      items,
      totalAmount,
      status: "scheduled",
      address: userData.address,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Delivery scheduled successfully",
      delivery,
    });
  } catch (error) {
    console.error("Create delivery error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /api/deliveries/:id/status
// @desc    Update delivery status
// @access  Private
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status, skipReason, paymentMethod } = req.body;

    const delivery = await Delivery.findById(req.params.id).populate("user");

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    // Update status
    delivery.status = status;

    if (status === "delivered") {
      delivery.deliveredAt = new Date();
      if (paymentMethod) {
        delivery.paymentMethod = paymentMethod;
        if (paymentMethod === "cash") {
          delivery.paymentStatus = "paid";
        }
      }
    } else if (status === "skipped") {
      delivery.skipReason = skipReason;
      delivery.skippedBy = req.user.role;
      delivery.totalAmount = 0;
    }

    await delivery.save();

    // Send notification to user
    if (delivery.user) {
      const message =
        status === "delivered"
          ? `✅ Your milk has been delivered! Amount: ₹${delivery.totalAmount}`
          : `❌ Today's delivery has been skipped. Reason: ${
              skipReason || "Not specified"
            }`;

      await sendNotification(
        delivery.user,
        status === "delivered" ? "Delivery Complete" : "Delivery Skipped",
        message,
        "delivery"
      );
    }

    res.json({
      success: true,
      message: `Delivery marked as ${status}`,
      delivery,
    });
  } catch (error) {
    console.error("Update delivery status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /api/deliveries/:id/skip
// @desc    Skip delivery (User can skip their own delivery)
// @access  Private
router.put("/:id/skip", protect, async (req, res) => {
  try {
    const { reason } = req.body;

    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    // User can only skip their own
    if (
      req.user.role === "user" &&
      delivery.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Can only skip scheduled or pending deliveries
    if (!["scheduled", "pending"].includes(delivery.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot skip this delivery",
      });
    }

    delivery.status = "skipped";
    delivery.skipReason = reason;
    delivery.skippedBy = req.user.role;
    delivery.totalAmount = 0;

    await delivery.save();

    res.json({
      success: true,
      message: "Delivery skipped successfully",
      delivery,
    });
  } catch (error) {
    console.error("Skip delivery error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /api/deliveries/:id/confirm
// @desc    Confirm tomorrow's delivery (User)
// @access  Private
router.put("/:id/confirm", protect, async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    if (delivery.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    delivery.status = "pending";
    await delivery.save();

    res.json({
      success: true,
      message: "Delivery confirmed",
      delivery,
    });
  } catch (error) {
    console.error("Confirm delivery error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/deliveries/history/monthly
// @desc    Get monthly delivery history
// @access  Private
router.get("/history/monthly", protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    const m = parseInt(month) || new Date().getMonth() + 1;
    const y = parseInt(year) || new Date().getFullYear();

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const query = {
      deliveryDate: { $gte: startDate, $lte: endDate },
    };

    if (req.user.role === "user") {
      query.user = req.user._id;
    }

    const deliveries = await Delivery.find(query)
      .populate("items.product", "name unit")
      .sort({ deliveryDate: 1 });

    // Calculate summary
    const summary = {
      totalDeliveries: deliveries.length,
      delivered: deliveries.filter((d) => d.status === "delivered").length,
      skipped: deliveries.filter((d) => d.status === "skipped").length,
      totalLitres: 0,
      totalAmount: 0,
    };

    deliveries.forEach((d) => {
      if (d.status === "delivered") {
        summary.totalAmount += d.totalAmount;
        d.items.forEach((item) => {
          summary.totalLitres += item.quantity;
        });
      }
    });

    res.json({
      success: true,
      month: m,
      year: y,
      summary,
      deliveries,
    });
  } catch (error) {
    console.error("Get monthly history error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
