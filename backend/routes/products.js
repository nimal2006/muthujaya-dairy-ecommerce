const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, authorize } = require("../middleware/auth");

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, isAvailable } = req.query;

    const query = {};
    if (category) query.category = category;
    if (isAvailable !== undefined) query.isAvailable = isAvailable === "true";

    const products = await Product.find(query).sort({ category: 1, name: 1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/products
// @desc    Create product
// @access  Private/Admin
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      unit,
      pricePerUnit,
      costPrice,
      image,
      minOrderQuantity,
      maxOrderQuantity,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      category,
      unit,
      pricePerUnit,
      costPrice,
      image,
      minOrderQuantity,
      maxOrderQuantity,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      unit,
      pricePerUnit,
      costPrice,
      image,
      isAvailable,
      minOrderQuantity,
      maxOrderQuantity,
      stock,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        unit,
        pricePerUnit,
        costPrice,
        image,
        isAvailable,
        minOrderQuantity,
        maxOrderQuantity,
        stock,
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /api/products/:id/price
// @desc    Update product price
// @access  Private/Admin
router.put("/:id/price", protect, authorize("admin"), async (req, res) => {
  try {
    const { pricePerUnit, costPrice } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { pricePerUnit, costPrice },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Price updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update price error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isAvailable: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
