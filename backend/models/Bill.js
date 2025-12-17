const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    billNumber: {
      type: String,
      unique: true,
      required: true,
    },
    month: {
      type: Number,
      required: true, // 1-12
    },
    year: {
      type: Number,
      required: true,
    },
    billingPeriod: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
    deliveries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery",
      },
    ],
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        productName: String,
        totalQuantity: Number,
        unit: String,
        pricePerUnit: Number,
        totalAmount: Number,
      },
    ],
    totalLitres: {
      type: Number,
      default: 0,
    },
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    skippedDeliveries: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    pendingAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "generated", "sent", "paid", "partial", "overdue"],
      default: "draft",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    payments: [
      {
        amount: Number,
        method: { type: String, enum: ["cash", "online", "wallet"] },
        transactionId: String,
        paidAt: Date,
        receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        notes: String,
      },
    ],
    pdfUrl: String,
    sentAt: Date,
    remindersSent: [
      {
        type: { type: String, enum: ["email", "sms", "push"] },
        sentAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Generate unique bill number
billSchema.pre("save", async function (next) {
  if (!this.billNumber) {
    const count = await mongoose.model("Bill").countDocuments();
    this.billNumber = `MDF-${this.year}${String(this.month).padStart(
      2,
      "0"
    )}-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

// Index for efficient queries
billSchema.index({ user: 1, month: 1, year: 1 });
billSchema.index({ status: 1, dueDate: 1 });

module.exports = mongoose.model("Bill", billSchema);
