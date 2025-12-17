const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Route name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    assignedLabour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    area: {
      type: String,
      required: true,
    },
    deliveryTime: {
      type: String,
      enum: ["morning", "evening", "both"],
      default: "morning",
    },
    stops: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        order: { type: Number },
        estimatedTime: { type: String },
        address: {
          street: String,
          area: String,
          coordinates: {
            lat: Number,
            lng: Number,
          },
        },
      },
    ],
    startPoint: {
      name: { type: String, default: "Dairy Farm" },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    endPoint: {
      name: { type: String, default: "Dairy Farm" },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    totalDistance: {
      type: Number,
      default: 0,
    },
    estimatedDuration: {
      type: Number, // in minutes
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: "#10B981",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Route", routeSchema);
