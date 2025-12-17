const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    // Social Login IDs
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "labour", "admin"],
      default: "user",
    },
    address: {
      street: String,
      area: String,
      city: String,
      pincode: String,
      landmark: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    profileImage: {
      type: String,
      default: "",
    },
    subscription: {
      isActive: { type: Boolean, default: true },
      startDate: Date,
      plan: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        default: "daily",
      },
      products: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          quantity: { type: Number, default: 1 },
          deliveryTime: {
            type: String,
            enum: ["morning", "evening", "both"],
            default: "morning",
          },
        },
      ],
    },
    assignedRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
    assignedLabour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pendingAmount: {
      type: Number,
      default: 0,
    },
    notificationPreferences: {
      sms: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
