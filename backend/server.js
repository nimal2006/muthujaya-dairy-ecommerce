const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");
const passport = require("passport");

// Load environment variables
dotenv.config();

// Import passport config
require("./config/passport");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const deliveryRoutes = require("./routes/deliveries");
const productRoutes = require("./routes/products");
const billingRoutes = require("./routes/billing");
const routeRoutes = require("./routes/routes");
const analyticsRoutes = require("./routes/analytics");
const paymentRoutes = require("./routes/payments");
const notificationRoutes = require("./routes/notifications");

// Import cron jobs
const { scheduleReminders, scheduleDailyReports } = require("./utils/cronJobs");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/muthujaya_dairy"
  )
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "🥛 Muthujaya Dairy Farm API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Schedule cron jobs
scheduleReminders();
scheduleDailyReports();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🥛 Muthujaya Dairy Farm API Ready!`);
});
