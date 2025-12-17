const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "delivery",
        "payment",
        "reminder",
        "announcement",
        "system",
        "alert",
      ],
      default: "system",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    channels: [
      {
        type: String,
        enum: ["push", "email", "sms"],
      },
    ],
    sentVia: [
      {
        channel: { type: String, enum: ["push", "email", "sms"] },
        sentAt: Date,
        status: { type: String, enum: ["sent", "failed", "delivered"] },
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    link: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
