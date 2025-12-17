import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiTruck,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiPackage,
  FiCalendar,
  FiArrowRight,
  FiAlertCircle,
  FiActivity,
  FiPieChart,
  FiBarChart2,
  FiRefreshCw,
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import api from "../../utils/api";
import toast from "react-hot-toast";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Animated Counter Component
const AnimatedCounter = ({ value, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numValue =
      typeof value === "string"
        ? parseFloat(value.replace(/[^0-9.]/g, ""))
        : value;
    if (isNaN(numValue)) return;

    const duration = 1500;
    const steps = 60;
    const stepValue = numValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= numValue) {
        setCount(numValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeDeliveries: 0,
    monthlyRevenue: 0,
    pendingBills: 0,
    revenueChange: 0,
    customerChange: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch real data from API
      const response = await api.get("/analytics/dashboard");

      if (response.data.success) {
        const data = response.data.data;

        setStats({
          totalCustomers: data.totalUsers || 0,
          activeDeliveries: data.todayStats?.delivered || 0,
          monthlyRevenue: data.monthlyStats?.totalRevenue || 0,
          pendingBills: data.pendingPayments?.count || 0,
          revenueChange: data.revenueChange || 12.5,
          customerChange: data.customerChange || 8.3,
        });

        // Revenue data from API or fallback
        if (data.revenueData && data.revenueData.length > 0) {
          setRevenueData(data.revenueData);
        } else {
          setRevenueData([
            { month: "Jan", revenue: 320000, expenses: 180000 },
            { month: "Feb", revenue: 340000, expenses: 175000 },
            { month: "Mar", revenue: 380000, expenses: 190000 },
            { month: "Apr", revenue: 420000, expenses: 200000 },
            { month: "May", revenue: 450000, expenses: 210000 },
            { month: "Jun", revenue: 485000, expenses: 220000 },
          ]);
        }

        // Delivery data from API or fallback
        if (data.deliveryStats && data.deliveryStats.length > 0) {
          setDeliveryData(data.deliveryStats);
        } else {
          setDeliveryData([
            { day: "Mon", delivered: 245, skipped: 12 },
            { day: "Tue", delivered: 238, skipped: 15 },
            { day: "Wed", delivered: 250, skipped: 8 },
            { day: "Thu", delivered: 242, skipped: 18 },
            { day: "Fri", delivered: 255, skipped: 10 },
            { day: "Sat", delivered: 260, skipped: 5 },
            { day: "Sun", delivered: 220, skipped: 20 },
          ]);
        }

        // Product data from API or fallback
        if (data.productData && data.productData.length > 0) {
          setProductData(data.productData);
        } else {
          setProductData([
            { name: "Milk", value: 65, color: "#22c55e" },
            { name: "Curd", value: 20, color: "#3b82f6" },
            { name: "Ghee", value: 10, color: "#f59e0b" },
            { name: "Others", value: 5, color: "#8b5cf6" },
          ]);
        }

        // Recent activities
        if (data.recentActivities && data.recentActivities.length > 0) {
          setRecentActivities(data.recentActivities);
        } else {
          setRecentActivities([
            {
              type: "order",
              message: "New subscription from Ramesh K.",
              time: "2 mins ago",
            },
            {
              type: "payment",
              message: "Payment of ₹2,400 received",
              time: "15 mins ago",
            },
            {
              type: "delivery",
              message: "Route #5 completed by Raju",
              time: "30 mins ago",
            },
            {
              type: "alert",
              message: "Low stock alert: Buffalo Milk",
              time: "1 hour ago",
            },
            {
              type: "user",
              message: "New customer registered: Priya S.",
              time: "2 hours ago",
            },
          ]);
        }

        // Alerts
        if (data.alerts && data.alerts.length > 0) {
          setAlerts(data.alerts);
        } else {
          setAlerts([
            {
              type: "warning",
              message: `${
                data.pendingPayments?.count || 5
              } customers have overdue payments`,
              action: "View",
            },
            {
              type: "info",
              message: "Monthly report ready for download",
              action: "Download",
            },
            {
              type: "error",
              message: "2 delivery routes need optimization",
              action: "Fix",
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Fallback to demo data if API fails
      setStats({
        totalCustomers: 2456,
        activeDeliveries: 128,
        monthlyRevenue: 485000,
        pendingBills: 23,
        revenueChange: 12.5,
        customerChange: 8.3,
      });

      setRevenueData([
        { month: "Jan", revenue: 320000, expenses: 180000 },
        { month: "Feb", revenue: 340000, expenses: 175000 },
        { month: "Mar", revenue: 380000, expenses: 190000 },
        { month: "Apr", revenue: 420000, expenses: 200000 },
        { month: "May", revenue: 450000, expenses: 210000 },
        { month: "Jun", revenue: 485000, expenses: 220000 },
      ]);

      setDeliveryData([
        { day: "Mon", delivered: 245, skipped: 12 },
        { day: "Tue", delivered: 238, skipped: 15 },
        { day: "Wed", delivered: 250, skipped: 8 },
        { day: "Thu", delivered: 242, skipped: 18 },
        { day: "Fri", delivered: 255, skipped: 10 },
        { day: "Sat", delivered: 260, skipped: 5 },
        { day: "Sun", delivered: 220, skipped: 20 },
      ]);

      setProductData([
        { name: "Milk", value: 65, color: "#22c55e" },
        { name: "Curd", value: 20, color: "#3b82f6" },
        { name: "Ghee", value: 10, color: "#f59e0b" },
        { name: "Others", value: 5, color: "#8b5cf6" },
      ]);

      setRecentActivities([
        {
          type: "order",
          message: "New subscription from Ramesh K.",
          time: "2 mins ago",
        },
        {
          type: "payment",
          message: "Payment of ₹2,400 received",
          time: "15 mins ago",
        },
        {
          type: "delivery",
          message: "Route #5 completed by Raju",
          time: "30 mins ago",
        },
        {
          type: "alert",
          message: "Low stock alert: Buffalo Milk",
          time: "1 hour ago",
        },
        {
          type: "user",
          message: "New customer registered: Priya S.",
          time: "2 hours ago",
        },
      ]);

      setAlerts([
        {
          type: "warning",
          message: "5 customers have overdue payments",
          action: "View",
        },
        {
          type: "info",
          message: "Monthly report ready for download",
          action: "Download",
        },
        {
          type: "error",
          message: "2 delivery routes need optimization",
          action: "Fix",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      change: `+${stats.customerChange}%`,
      trend: "up",
      icon: FiUsers,
      gradient: "from-sky-400 via-sky-500 to-primary-500",
      bgGlow: "bg-sky-500/20",
      link: "/admin/users",
    },
    {
      title: "Today's Deliveries",
      value: stats.activeDeliveries,
      change: "98.2% success",
      trend: "up",
      icon: FiTruck,
      gradient: "from-nature-400 via-nature-500 to-primary-500",
      bgGlow: "bg-nature-500/20",
      link: "/admin/deliveries",
    },
    {
      title: "Monthly Revenue",
      value: stats.monthlyRevenue,
      prefix: "₹",
      suffix: "",
      change: `+${stats.revenueChange}%`,
      trend: "up",
      icon: FiDollarSign,
      gradient: "from-primary-400 via-primary-500 to-nature-500",
      bgGlow: "bg-primary-500/20",
      link: "/admin/billing",
    },
    {
      title: "Pending Bills",
      value: stats.pendingBills,
      change: `₹${(23 * 1800).toLocaleString()}`,
      trend: "neutral",
      icon: FiCalendar,
      gradient: "from-warm-400 via-orange-400 to-red-500",
      bgGlow: "bg-orange-500/20",
      link: "/admin/billing",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-primary-400 opacity-30" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-nature-600 to-sky-600 p-8"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-float-slow" />
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-nature-400/20 rounded-full blur-3xl animate-float-slow"
            style={{ animationDelay: "-3s" }}
          />
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FiActivity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Welcome, {user?.name?.split(" ")[0]}! 👋
                </h1>
                <p className="text-white/70 text-sm">@{user?.username}</p>
                <p className="text-white/80">Here's your business overview</p>
              </div>
            </motion.div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/50">
              <option value="7" className="text-gray-800">
                Last 7 days
              </option>
              <option value="30" className="text-gray-800">
                Last 30 days
              </option>
              <option value="90" className="text-gray-800">
                Last 3 months
              </option>
              <option value="365" className="text-gray-800">
                This year
              </option>
            </select>
            <Link
              to="/admin/analytics"
              className="group inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-primary-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-white transition-all duration-300"
            >
              View Reports
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Premium Alerts */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-3 gap-4"
          >
            {alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`p-4 rounded-2xl flex items-center justify-between backdrop-blur-sm border ${
                  alert.type === "error"
                    ? "bg-red-50/80 text-red-700 border-red-200"
                    : alert.type === "warning"
                    ? "bg-warm-50/80 text-yellow-700 border-yellow-200"
                    : "bg-sky-50/80 text-sky-700 border-sky-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      alert.type === "error"
                        ? "bg-red-100"
                        : alert.type === "warning"
                        ? "bg-yellow-100"
                        : "bg-sky-100"
                    }`}
                  >
                    <FiAlertCircle className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{alert.message}</span>
                </div>
                <button className="text-sm font-semibold hover:underline px-3 py-1 rounded-lg hover:bg-white/50 transition-colors">
                  {alert.action}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-luxury transition-all duration-500 border border-white/50 overflow-hidden"
            >
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 ${stat.bgGlow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative flex items-start justify-between mb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </motion.div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${
                    stat.trend === "up"
                      ? "text-nature-600 bg-nature-100"
                      : stat.trend === "down"
                      ? "text-red-600 bg-red-100"
                      : "text-gray-600 bg-gray-100"
                  }`}
                >
                  {stat.trend === "up" && <FiTrendingUp className="w-4 h-4" />}
                  {stat.trend === "down" && (
                    <FiTrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1 font-medium">
                {stat.title}
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                {stat.prefix ? (
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix || ""}
                  />
                ) : (
                  <AnimatedCounter value={stat.value} />
                )}
              </p>

              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <FiArrowRight className="w-5 h-5 text-primary-500" />
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Premium Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-white/50 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/30 to-nature-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-nature-500 rounded-xl flex items-center justify-center">
                <FiBarChart2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Revenue Overview
                </h3>
                <p className="text-sm text-gray-500">
                  Monthly revenue vs expenses
                </p>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-nature-400 to-primary-500 rounded-full shadow-sm"></div>
                <span className="text-gray-600 font-medium">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-orange-400 rounded-full shadow-sm"></div>
                <span className="text-gray-600 font-medium">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorExpenses"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  fontSize={12}
                  fontWeight={500}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => `₹${value / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, ""]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Product Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-white/50 overflow-hidden"
        >
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-sky-100/50 to-primary-100/50 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-primary-500 rounded-xl flex items-center justify-center">
              <FiPieChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Product Distribution
              </h3>
              <p className="text-sm text-gray-500">Sales by category</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, ""]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                    background: "rgba(255,255,255,0.95)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="relative flex flex-wrap justify-center gap-4 mt-4">
            {productData.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full"
              >
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600 font-medium">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Premium Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Delivery Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-white/50 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-nature-100/30 to-primary-100/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-nature-500 to-primary-500 rounded-xl flex items-center justify-center">
              <FiTruck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Weekly Deliveries
              </h3>
              <p className="text-sm text-gray-500">Delivered vs Skipped</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  stroke="#9ca3af"
                  fontSize={12}
                  fontWeight={500}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="delivered"
                  fill="url(#deliveredGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="skipped"
                  fill="url(#skippedGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient
                    id="deliveredGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                  <linearGradient
                    id="skippedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-white/50 overflow-hidden"
        >
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/50 to-nature-100/50 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />

          <div className="relative flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-sky-500 rounded-xl flex items-center justify-center">
              <FiActivity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
          </div>
          <div className="relative space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 5 }}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50/50 transition-colors cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                    activity.type === "order"
                      ? "bg-gradient-to-br from-sky-100 to-blue-100 text-sky-600"
                      : activity.type === "payment"
                      ? "bg-gradient-to-br from-nature-100 to-primary-100 text-nature-600"
                      : activity.type === "delivery"
                      ? "bg-gradient-to-br from-purple-100 to-violet-100 text-purple-600"
                      : activity.type === "alert"
                      ? "bg-gradient-to-br from-warm-100 to-yellow-100 text-yellow-600"
                      : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600"
                  }`}
                >
                  {activity.type === "order" && (
                    <FiPackage className="w-5 h-5" />
                  )}
                  {activity.type === "payment" && (
                    <FiDollarSign className="w-5 h-5" />
                  )}
                  {activity.type === "delivery" && (
                    <FiTruck className="w-5 h-5" />
                  )}
                  {activity.type === "alert" && (
                    <FiAlertCircle className="w-5 h-5" />
                  )}
                  {activity.type === "user" && <FiUsers className="w-5 h-5" />}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium truncate">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full mt-6 text-center text-sm text-primary-600 hover:text-primary-700 font-semibold py-3 rounded-xl bg-primary-50/50 hover:bg-primary-100/50 transition-colors"
          >
            View All Activity
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
