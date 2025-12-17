const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "fuel",
        "salary",
        "maintenance",
        "product_cost",
        "utilities",
        "rent",
        "equipment",
        "marketing",
        "other",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "upi", "card", "other"],
      default: "cash",
    },
    receipt: {
      type: String, // URL to receipt image
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
expenseSchema.index({ month: 1, year: 1 });
expenseSchema.index({ category: 1, date: 1 });

module.exports = mongoose.model("Expense", expenseSchema);
