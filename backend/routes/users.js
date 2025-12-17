const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .populate("assignedRoute", "name")
      .populate("assignedLabour", "name phone")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/users/customers
// @desc    Get all customers (for Labour)
// @access  Private/Labour,Admin
router.get(
  "/customers",
  protect,
  authorize("labour", "admin"),
  async (req, res) => {
    try {
      const query = { role: "user", isActive: true };

      // If labour, only get assigned customers
      if (req.user.role === "labour") {
        query.assignedLabour = req.user._id;
      }

      const customers = await User.find(query)
        .populate("subscription.products.product")
        .populate("assignedRoute", "name")
        .select("-password");

      res.json({
        success: true,
        count: customers.length,
        customers,
      });
    } catch (error) {
      console.error("Get customers error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// @route   GET /api/users/labours
// @desc    Get all labour/delivery staff
// @access  Private/Admin
router.get("/labours", protect, authorize("admin"), async (req, res) => {
  try {
    const labours = await User.find({ role: "labour", isActive: true })
      .populate("assignedRoute", "name area")
      .select("-password");

    res.json({
      success: true,
      count: labours.length,
      labours,
    });
  } catch (error) {
    console.error("Get labours error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("subscription.products.product")
      .populate("assignedRoute")
      .populate("assignedLabour", "name phone")
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only admin or the user themselves can view
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    // Only admin or user themselves can update
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const {
      name,
      phone,
      address,
      subscription,
      notificationPreferences,
      profileImage,
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (subscription) updateData.subscription = subscription;
    if (notificationPreferences)
      updateData.notificationPreferences = notificationPreferences;
    if (profileImage) updateData.profileImage = profileImage;

    // Admin-only fields
    if (req.user.role === "admin") {
      const { role, isActive, assignedRoute, assignedLabour } = req.body;
      if (role) updateData.role = role;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (assignedRoute) updateData.assignedRoute = assignedRoute;
      if (assignedLabour) updateData.assignedLabour = assignedLabour;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (soft delete)
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /api/users/:id/subscription
// @desc    Update user subscription
// @access  Private
router.put("/:id/subscription", protect, async (req, res) => {
  try {
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const { products, plan, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        "subscription.products": products,
        "subscription.plan": plan,
        "subscription.isActive": isActive,
      },
      { new: true }
    ).populate("subscription.products.product");

    res.json({
      success: true,
      message: "Subscription updated successfully",
      subscription: user.subscription,
    });
  } catch (error) {
    console.error("Update subscription error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
