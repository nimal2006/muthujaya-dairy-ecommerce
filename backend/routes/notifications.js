const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protect, authorize } = require("../middleware/auth");
const {
  sendEmail,
  sendSMS,
  sendNotification,
} = require("../utils/notifications");

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const { isRead, type, page = 1, limit = 20 } = req.query;

    const query = { user: req.user._id };
    if (isRead !== undefined) query.isRead = isRead === "true";
    if (type) query.type = type;

    const notifications = await Notification.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.json({
      success: true,
      count: notifications.length,
      total,
      unreadCount,
      pages: Math.ceil(total / limit),
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put("/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all read error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/notifications/send
// @desc    Send notification to user(s) - Admin only
// @access  Private/Admin
router.post("/send", protect, authorize("admin"), async (req, res) => {
  try {
    const { userIds, title, message, type, channels } = req.body;

    const User = require("../models/User");
    const users = await User.find({ _id: { $in: userIds } });

    const results = {
      sent: 0,
      failed: 0,
    };

    for (const user of users) {
      const result = await sendNotification(user, title, message, type);
      if (result.push || result.email || result.sms) {
        results.sent++;
      } else {
        results.failed++;
      }
    }

    res.json({
      success: true,
      message: "Notifications sent",
      results,
    });
  } catch (error) {
    console.error("Send notification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/notifications/broadcast
// @desc    Broadcast notification to all users - Admin only
// @access  Private/Admin
router.post("/broadcast", protect, authorize("admin"), async (req, res) => {
  try {
    const { title, message, type, role } = req.body;

    const User = require("../models/User");
    const query = { isActive: true };
    if (role) query.role = role;

    const users = await User.find(query);

    const results = {
      total: users.length,
      sent: 0,
      failed: 0,
    };

    for (const user of users) {
      try {
        await Notification.create({
          user: user._id,
          title,
          message,
          type: type || "announcement",
          priority: "medium",
        });
        results.sent++;
      } catch (err) {
        results.failed++;
      }
    }

    res.json({
      success: true,
      message: "Broadcast sent",
      results,
    });
  } catch (error) {
    console.error("Broadcast error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
