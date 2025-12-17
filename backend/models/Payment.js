const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: ["cash", "razorpay", "stripe", "upi", "bank_transfer", "wallet"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      trim: true,
    },
    receiptUrl: String,
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Generate transaction ID for cash payments
paymentSchema.pre("save", async function (next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.transactionId = `TXN-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Index for efficient queries
paymentSchema.index({ user: 1, paidAt: -1 });
paymentSchema.index({ status: 1, paidAt: -1 });

module.exports = mongoose.model("Payment", paymentSchema);
