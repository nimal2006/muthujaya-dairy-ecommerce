const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    labour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    deliveryTime: {
      type: String,
      enum: ["morning", "evening"],
      default: "morning",
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        pricePerUnit: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["scheduled", "pending", "delivered", "skipped", "cancelled"],
      default: "scheduled",
    },
    skipReason: {
      type: String,
      trim: true,
    },
    skippedBy: {
      type: String,
      enum: ["user", "labour", "admin", "system"],
    },
    deliveredAt: Date,
    address: {
      street: String,
      area: String,
      city: String,
      pincode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    notes: {
      type: String,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partial"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online", "wallet"],
      default: "cash",
    },
    rating: {
      score: { type: Number, min: 1, max: 5 },
      feedback: String,
      ratedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
deliverySchema.index({ user: 1, deliveryDate: 1 });
deliverySchema.index({ labour: 1, deliveryDate: 1 });
deliverySchema.index({ status: 1, deliveryDate: 1 });

module.exports = mongoose.model("Delivery", deliverySchema);
