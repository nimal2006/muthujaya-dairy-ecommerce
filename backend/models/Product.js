const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["milk", "curd", "ghee", "buttermilk", "paneer", "other"],
      default: "milk",
    },
    unit: {
      type: String,
      enum: ["litre", "kg", "piece", "packet"],
      default: "litre",
    },
    pricePerUnit: {
      type: Number,
      required: [true, "Price per unit is required"],
      min: 0,
    },
    costPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
    stock: {
      available: { type: Number, default: 0 },
      unit: { type: String, default: "litre" },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    minOrderQuantity: {
      type: Number,
      default: 0.5,
    },
    maxOrderQuantity: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
