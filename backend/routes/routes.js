const express = require("express");
const router = express.Router();
const Route = require("../models/Route");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

// @route   GET /api/routes
// @desc    Get all routes
// @access  Private/Admin,Labour
router.get("/", protect, authorize("admin", "labour"), async (req, res) => {
  try {
    const { isActive, deliveryTime } = req.query;

    const query = {};
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (deliveryTime) query.deliveryTime = deliveryTime;

    // Labour can only see their assigned route
    if (req.user.role === "labour") {
      query.assignedLabour = req.user._id;
    }

    const routes = await Route.find(query)
      .populate("assignedLabour", "name phone")
      .populate("stops.user", "name phone address subscription");

    res.json({
      success: true,
      count: routes.length,
      routes,
    });
  } catch (error) {
    console.error("Get routes error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/routes/:id
// @desc    Get single route
// @access  Private/Admin,Labour
router.get("/:id", protect, authorize("admin", "labour"), async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate("assignedLabour", "name phone email")
      .populate({
        path: "stops.user",
        select: "name phone address subscription",
        populate: {
          path: "subscription.products.product",
          select: "name pricePerUnit unit",
        },
      });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.json({
      success: true,
      route,
    });
  } catch (error) {
    console.error("Get route error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/routes
// @desc    Create route
// @access  Private/Admin
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const {
      name,
      description,
      area,
      deliveryTime,
      assignedLabour,
      stops,
      startPoint,
      endPoint,
      color,
    } = req.body;

    const route = await Route.create({
      name,
      description,
      area,
      deliveryTime,
      assignedLabour,
      stops,
      startPoint,
      endPoint,
      color,
    });

    // Update labour's assigned route
    if (assignedLabour) {
      await User.findByIdAndUpdate(assignedLabour, {
        assignedRoute: route._id,
      });
    }

    res.status(201).json({
      success: true,
      message: "Route created successfully",
      route,
    });
  } catch (error) {
    console.error("Create route error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /api/routes/:id
// @desc    Update route
// @access  Private/Admin
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const {
      name,
      description,
      area,
      deliveryTime,
      assignedLabour,
      stops,
      startPoint,
      endPoint,
      isActive,
      color,
      totalDistance,
      estimatedDuration,
    } = req.body;

    const route = await Route.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        area,
        deliveryTime,
        assignedLabour,
        stops,
        startPoint,
        endPoint,
        isActive,
        color,
        totalDistance,
        estimatedDuration,
      },
      { new: true, runValidators: true }
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.json({
      success: true,
      message: "Route updated successfully",
      route,
    });
  } catch (error) {
    console.error("Update route error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /api/routes/:id/stops
// @desc    Update route stops order
// @access  Private/Admin
router.put("/:id/stops", protect, authorize("admin"), async (req, res) => {
  try {
    const { stops } = req.body;

    const route = await Route.findByIdAndUpdate(
      req.params.id,
      { stops },
      { new: true }
    ).populate("stops.user", "name phone address");

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.json({
      success: true,
      message: "Route stops updated successfully",
      route,
    });
  } catch (error) {
    console.error("Update stops error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/routes/:id/add-stop
// @desc    Add stop to route
// @access  Private/Admin
router.post("/:id/add-stop", protect, authorize("admin"), async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    // Add stop
    const newStop = {
      user: userId,
      order: route.stops.length + 1,
      address: user.address,
    };

    route.stops.push(newStop);
    await route.save();

    // Update user's assigned route
    user.assignedRoute = route._id;
    await user.save();

    res.json({
      success: true,
      message: "Stop added successfully",
      route,
    });
  } catch (error) {
    console.error("Add stop error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   DELETE /api/routes/:id/remove-stop/:userId
// @desc    Remove stop from route
// @access  Private/Admin
router.delete(
  "/:id/remove-stop/:userId",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const route = await Route.findById(req.params.id);
      if (!route) {
        return res.status(404).json({
          success: false,
          message: "Route not found",
        });
      }

      // Remove stop
      route.stops = route.stops.filter(
        (stop) => stop.user.toString() !== req.params.userId
      );

      // Reorder remaining stops
      route.stops.forEach((stop, index) => {
        stop.order = index + 1;
      });

      await route.save();

      // Update user's assigned route
      await User.findByIdAndUpdate(req.params.userId, { assignedRoute: null });

      res.json({
        success: true,
        message: "Stop removed successfully",
        route,
      });
    } catch (error) {
      console.error("Remove stop error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// @route   DELETE /api/routes/:id
// @desc    Delete route
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.json({
      success: true,
      message: "Route deleted successfully",
    });
  } catch (error) {
    console.error("Delete route error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/routes/:id/optimized
// @desc    Get optimized route for delivery
// @access  Private/Labour,Admin
router.get(
  "/:id/optimized",
  protect,
  authorize("admin", "labour"),
  async (req, res) => {
    try {
      const route = await Route.findById(req.params.id).populate({
        path: "stops.user",
        select: "name phone address subscription",
        match: { isActive: true, "subscription.isActive": true },
        populate: {
          path: "subscription.products.product",
          select: "name pricePerUnit unit",
        },
      });

      if (!route) {
        return res.status(404).json({
          success: false,
          message: "Route not found",
        });
      }

      // Filter out null stops (inactive users)
      const activeStops = route.stops
        .filter((stop) => stop.user !== null)
        .sort((a, b) => a.order - b.order);

      // Generate Google Maps directions URL
      const waypoints = activeStops
        .map((stop) => {
          if (stop.user.address?.coordinates) {
            return `${stop.user.address.coordinates.lat},${stop.user.address.coordinates.lng}`;
          }
          return encodeURIComponent(
            `${stop.user.address?.street || ""}, ${
              stop.user.address?.area || ""
            }, ${stop.user.address?.city || ""}`
          );
        })
        .join("|");

      const origin = route.startPoint?.coordinates
        ? `${route.startPoint.coordinates.lat},${route.startPoint.coordinates.lng}`
        : "current+location";

      const destination = route.endPoint?.coordinates
        ? `${route.endPoint.coordinates.lat},${route.endPoint.coordinates.lng}`
        : origin;

      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;

      res.json({
        success: true,
        route: {
          ...route.toObject(),
          stops: activeStops,
        },
        mapsUrl,
        totalStops: activeStops.length,
      });
    } catch (error) {
      console.error("Get optimized route error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

module.exports = router;
