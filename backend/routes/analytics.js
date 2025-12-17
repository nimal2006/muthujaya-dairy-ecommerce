const express = require("express");
const router = express.Router();
const Delivery = require("../models/Delivery");
const Bill = require("../models/Bill");
const Expense = require("../models/Expense");
const User = require("../models/User");
const Product = require("../models/Product");
const { protect, authorize } = require("../middleware/auth");

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private/Admin
router.get("/dashboard", protect, authorize("admin"), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    // Today's stats
    const todayDeliveries = await Delivery.aggregate([
      {
        $match: {
          deliveryDate: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          amount: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Monthly stats
    const monthlyDeliveries = await Delivery.aggregate([
      {
        $match: {
          deliveryDate: { $gte: thisMonth, $lt: nextMonth },
          status: "delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalDeliveries: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          totalItems: { $sum: { $size: "$items" } },
        },
      },
    ]);

    // Monthly expenses
    const monthlyExpenses = await Expense.aggregate([
      {
        $match: {
          month: today.getMonth() + 1,
          year: today.getFullYear(),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Pending payments
    const pendingPayments = await Bill.aggregate([
      {
        $match: {
          status: { $in: ["generated", "sent", "partial", "overdue"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$pendingAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // User stats
    const userStats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format response
    const delivered = todayDeliveries.find((d) => d._id === "delivered") || {
      count: 0,
      amount: 0,
    };
    const pending = todayDeliveries.find(
      (d) => d._id === "pending" || d._id === "scheduled"
    ) || { count: 0 };
    const skipped = todayDeliveries.find((d) => d._id === "skipped") || {
      count: 0,
    };

    const monthly = monthlyDeliveries[0] || {
      totalDeliveries: 0,
      totalRevenue: 0,
    };
    const expenses = monthlyExpenses[0]?.total || 0;
    const pendingTotal = pendingPayments[0] || { total: 0, count: 0 };

    res.json({
      success: true,
      dashboard: {
        today: {
          delivered: delivered.count,
          pending: pending.count,
          skipped: skipped.count,
          revenue: delivered.amount,
        },
        monthly: {
          deliveries: monthly.totalDeliveries,
          revenue: monthly.totalRevenue,
          expenses,
          profit: monthly.totalRevenue - expenses,
        },
        payments: {
          pending: pendingTotal.total,
          pendingBills: pendingTotal.count,
        },
        users: {
          customers: userStats.find((u) => u._id === "user")?.count || 0,
          labours: userStats.find((u) => u._id === "labour")?.count || 0,
          admins: userStats.find((u) => u._id === "admin")?.count || 0,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/analytics/revenue
// @desc    Get revenue analytics
// @access  Private/Admin
router.get("/revenue", protect, authorize("admin"), async (req, res) => {
  try {
    const { period = "monthly", year = new Date().getFullYear() } = req.query;

    let matchStage, groupStage;

    if (period === "daily") {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      matchStage = {
        deliveryDate: { $gte: last30Days },
        status: "delivered",
      };

      groupStage = {
        _id: {
          year: { $year: "$deliveryDate" },
          month: { $month: "$deliveryDate" },
          day: { $dayOfMonth: "$deliveryDate" },
        },
        revenue: { $sum: "$totalAmount" },
        deliveries: { $sum: 1 },
      };
    } else {
      matchStage = {
        deliveryDate: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(parseInt(year) + 1, 0, 1),
        },
        status: "delivered",
      };

      groupStage = {
        _id: {
          year: { $year: "$deliveryDate" },
          month: { $month: "$deliveryDate" },
        },
        revenue: { $sum: "$totalAmount" },
        deliveries: { $sum: 1 },
      };
    }

    const revenueData = await Delivery.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Get expenses for the same period
    const expenseData = await Expense.aggregate([
      {
        $match: {
          year: parseInt(year),
        },
      },
      {
        $group: {
          _id: { month: "$month" },
          expenses: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // Combine data
    const combinedData = revenueData.map((rev) => {
      const expense = expenseData.find(
        (exp) => exp._id.month === rev._id.month
      );
      return {
        ...rev,
        expenses: expense?.expenses || 0,
        profit: rev.revenue - (expense?.expenses || 0),
      };
    });

    res.json({
      success: true,
      period,
      year,
      data: combinedData,
    });
  } catch (error) {
    console.error("Revenue analytics error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/analytics/products
// @desc    Get product performance analytics
// @access  Private/Admin
router.get("/products", protect, authorize("admin"), async (req, res) => {
  try {
    const { month, year = new Date().getFullYear() } = req.query;

    const m = month ? parseInt(month) : null;
    const y = parseInt(year);

    const matchStage = {
      status: "delivered",
      deliveryDate: m
        ? { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) }
        : { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) },
    };

    const productStats = await Delivery.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.totalPrice" },
          deliveries: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          category: "$product.category",
          unit: "$product.unit",
          totalQuantity: 1,
          totalRevenue: 1,
          deliveries: 1,
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.json({
      success: true,
      month: m,
      year: y,
      products: productStats,
    });
  } catch (error) {
    console.error("Product analytics error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/analytics/delivery-efficiency
// @desc    Get delivery efficiency analytics
// @access  Private/Admin
router.get(
  "/delivery-efficiency",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { month, year = new Date().getFullYear() } = req.query;

      const m = month ? parseInt(month) : new Date().getMonth() + 1;
      const y = parseInt(year);

      const startDate = new Date(y, m - 1, 1);
      const endDate = new Date(y, m, 0, 23, 59, 59);

      const stats = await Delivery.aggregate([
        {
          $match: {
            deliveryDate: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const total = stats.reduce((sum, s) => sum + s.count, 0);
      const delivered = stats.find((s) => s._id === "delivered")?.count || 0;
      const skipped = stats.find((s) => s._id === "skipped")?.count || 0;

      // Labour-wise efficiency
      const labourStats = await Delivery.aggregate([
        {
          $match: {
            deliveryDate: { $gte: startDate, $lte: endDate },
            labour: { $exists: true },
          },
        },
        {
          $group: {
            _id: { labour: "$labour", status: "$status" },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.labour",
            statuses: {
              $push: {
                status: "$_id.status",
                count: "$count",
              },
            },
            total: { $sum: "$count" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "labour",
          },
        },
        { $unwind: "$labour" },
        {
          $project: {
            name: "$labour.name",
            statuses: 1,
            total: 1,
          },
        },
      ]);

      res.json({
        success: true,
        month: m,
        year: y,
        efficiency: {
          total,
          delivered,
          skipped,
          rate: total > 0 ? ((delivered / total) * 100).toFixed(2) : 0,
        },
        labourStats,
      });
    } catch (error) {
      console.error("Delivery efficiency error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// @route   GET /api/analytics/customer-growth
// @desc    Get customer growth analytics
// @access  Private/Admin
router.get(
  "/customer-growth",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { year = new Date().getFullYear() } = req.query;

      const growth = await User.aggregate([
        {
          $match: {
            role: "user",
            createdAt: {
              $gte: new Date(parseInt(year), 0, 1),
              $lt: new Date(parseInt(year) + 1, 0, 1),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            newCustomers: { $sum: 1 },
          },
        },
        { $sort: { "_id.month": 1 } },
      ]);

      // Calculate cumulative
      let cumulative = 0;
      const growthWithCumulative = growth.map((g) => {
        cumulative += g.newCustomers;
        return {
          ...g,
          totalCustomers: cumulative,
        };
      });

      res.json({
        success: true,
        year,
        growth: growthWithCumulative,
      });
    } catch (error) {
      console.error("Customer growth error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// @route   POST /api/analytics/expenses
// @desc    Add expense
// @access  Private/Admin
router.post("/expenses", protect, authorize("admin"), async (req, res) => {
  try {
    const {
      category,
      description,
      amount,
      date,
      paymentMethod,
      receipt,
      notes,
      isRecurring,
      recurringFrequency,
    } = req.body;

    const expenseDate = new Date(date);

    const expense = await Expense.create({
      category,
      description,
      amount,
      date: expenseDate,
      month: expenseDate.getMonth() + 1,
      year: expenseDate.getFullYear(),
      paymentMethod,
      receipt,
      notes,
      createdBy: req.user._id,
      isRecurring,
      recurringFrequency,
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/analytics/expenses
// @desc    Get expenses
// @access  Private/Admin
router.get("/expenses", protect, authorize("admin"), async (req, res) => {
  try {
    const { month, year, category, page = 1, limit = 20 } = req.query;

    const query = {};
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    if (category) query.category = category;

    const expenses = await Expense.find(query)
      .populate("createdBy", "name")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const total = await Expense.countDocuments(query);

    // Category breakdown
    const breakdown = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json({
      success: true,
      count: expenses.length,
      total,
      pages: Math.ceil(total / limit),
      breakdown,
      expenses,
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/analytics/profit-loss
// @desc    Get profit/loss report
// @access  Private/Admin
router.get("/profit-loss", protect, authorize("admin"), async (req, res) => {
  try {
    const { month, year = new Date().getFullYear() } = req.query;

    const y = parseInt(year);
    const reports = [];

    // If month specified, get that month only, otherwise all months
    const months = month
      ? [parseInt(month)]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    for (const m of months) {
      const startDate = new Date(y, m - 1, 1);
      const endDate = new Date(y, m, 0, 23, 59, 59);

      // Revenue
      const revenueResult = await Delivery.aggregate([
        {
          $match: {
            deliveryDate: { $gte: startDate, $lte: endDate },
            status: "delivered",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]);

      // Expenses
      const expenseResult = await Expense.aggregate([
        {
          $match: {
            month: m,
            year: y,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const revenue = revenueResult[0]?.total || 0;
      const expenses = expenseResult[0]?.total || 0;
      const profit = revenue - expenses;

      reports.push({
        month: m,
        year: y,
        revenue,
        expenses,
        profit,
        profitMargin: revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : 0,
      });
    }

    // Calculate totals
    const totals = reports.reduce(
      (acc, r) => ({
        revenue: acc.revenue + r.revenue,
        expenses: acc.expenses + r.expenses,
        profit: acc.profit + r.profit,
      }),
      { revenue: 0, expenses: 0, profit: 0 }
    );

    res.json({
      success: true,
      year: y,
      reports,
      totals: {
        ...totals,
        profitMargin:
          totals.revenue > 0
            ? ((totals.profit / totals.revenue) * 100).toFixed(2)
            : 0,
      },
    });
  } catch (error) {
    console.error("Profit/loss report error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
