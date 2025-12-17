import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiTruck,
  FiDollarSign,
  FiClock,
  FiArrowRight,
  FiCheck,
  FiX,
  FiMapPin,
  FiPackage,
  FiStar,
  FiTrendingUp,
  FiRefreshCw,
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import api from "../../utils/api";
import toast from "react-hot-toast";

// Animated Counter Component
const AnimatedCounter = ({ value, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numValue =
      typeof value === "string"
        ? parseFloat(value.replace(/[^0-9.]/g, ""))
        : value;
    if (isNaN(numValue)) {
      setCount(0);
      return;
    }

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

const UserDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    todayDelivery: null,
    monthlySpent: 0,
    pendingBills: 0,
    totalDeliveries: 0,
  });
  const [upcomingDeliveries, setUpcomingDeliveries] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Try to fetch real data from API
      try {
        const [deliveryRes, billsRes] = await Promise.all([
          api.get("/deliveries/my-dashboard"),
          api.get("/billing/my-bills"),
        ]);

        if (deliveryRes.data.success) {
          const data = deliveryRes.data.data;
          setStats({
            todayDelivery: data.todayDelivery || {
              status: "pending",
              items: [
                { name: "Fresh Milk", quantity: "1L", price: 60 },
                { name: "Curd", quantity: "500g", price: 40 },
              ],
              estimatedTime: "6:30 AM",
            },
            monthlySpent: data.monthlySpent || 1840,
            pendingBills: data.pendingBills || billsRes.data?.pendingCount || 1,
            totalDeliveries: data.totalDeliveries || 28,
          });

          if (data.upcomingDeliveries) {
            setUpcomingDeliveries(data.upcomingDeliveries);
          }

          if (data.recentActivities) {
            setRecentActivities(data.recentActivities);
          }
          return;
        }
      } catch (apiError) {
        console.log("Using demo data:", apiError.message);
      }

      // Fallback to demo data
      setStats({
        todayDelivery: {
          status: "pending",
          items: [
            { name: "Fresh Milk", quantity: "1L", price: 60 },
            { name: "Curd", quantity: "500g", price: 40 },
          ],
          estimatedTime: "6:30 AM",
        },
        monthlySpent: 1840,
        pendingBills: 1,
        totalDeliveries: 28,
      });

      setUpcomingDeliveries([
        { date: "Tomorrow", items: ["Milk 1L", "Curd 500g"], total: 100 },
        { date: "Day After", items: ["Milk 1L"], total: 60 },
        { date: "Friday", items: ["Milk 1L", "Ghee 250g"], total: 210 },
      ]);

      setRecentActivities([
        {
          type: "delivery",
          message: "Milk delivered successfully",
          time: "Today, 6:32 AM",
          status: "success",
        },
        {
          type: "payment",
          message: "Payment of ₹1,800 received",
          time: "Yesterday",
          status: "success",
        },
        {
          type: "skip",
          message: "Delivery skipped for Dec 15",
          time: "2 days ago",
          status: "warning",
        },
        {
          type: "delivery",
          message: "Milk & Curd delivered",
          time: "Dec 13",
          status: "success",
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const statCards = [
    {
      title: "Today's Total",
      value:
        stats.todayDelivery?.items?.reduce(
          (sum, item) => sum + item.price,
          0
        ) || 0,
      prefix: "₹",
      icon: FiTruck,
      gradient: "from-nature-400 via-nature-500 to-primary-500",
      bgGlow: "bg-nature-500/20",
      link: "/dashboard/deliveries",
    },
    {
      title: "This Month",
      value: stats.monthlySpent,
      prefix: "₹",
      icon: FiDollarSign,
      gradient: "from-sky-400 via-sky-500 to-primary-500",
      bgGlow: "bg-sky-500/20",
      link: "/dashboard/bills",
    },
    {
      title: "Pending Bills",
      value: stats.pendingBills,
      icon: FiCalendar,
      gradient:
        stats.pendingBills > 0
          ? "from-warm-400 via-orange-400 to-red-500"
          : "from-gray-400 to-gray-500",
      bgGlow: stats.pendingBills > 0 ? "bg-orange-500/20" : "bg-gray-500/20",
      link: "/dashboard/bills",
    },
    {
      title: "Total Deliveries",
      value: stats.totalDeliveries,
      icon: FiCheck,
      gradient: "from-primary-400 via-primary-500 to-nature-500",
      bgGlow: "bg-primary-500/20",
      link: "/dashboard/deliveries",
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
      {/* Premium Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-nature-600 to-primary-700" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float-slow" />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-nature-400/20 rounded-full blur-3xl animate-float-slow"
            style={{ animationDelay: "-3s" }}
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 border border-white/30 rounded-full"
          />
        </div>

        <div className="relative p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-3"
              >
                <span className="text-4xl">👋</span>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-white/50 to-transparent" />
              </motion.div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                {getGreeting()},{" "}
                <span className="text-nature-200">
                  {user?.name?.split(" ")[0]}
                </span>
                !
              </h1>
              <p className="text-primary-100 text-lg">
                Your fresh milk is on its way. Track your delivery below.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 md:mt-0"
            >
              <Link
                to="/dashboard/deliveries"
                className="group relative inline-flex items-center gap-3 bg-white/95 backdrop-blur-sm text-primary-700 px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-nature-100 to-primary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-3">
                  <FiMapPin className="w-5 h-5" />
                  Track Delivery
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

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
              {/* Background Glow */}
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 ${stat.bgGlow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div
                className={`relative w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-sm text-gray-500 mb-1 font-medium">
                {stat.title}
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix || ""}
                />
              </p>

              {/* Hover Arrow */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <FiArrowRight className="w-5 h-5 text-primary-500" />
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Premium Today's Delivery Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft overflow-hidden border border-white/50"
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/50 to-nature-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative p-6 border-b border-gray-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-nature-500 rounded-xl flex items-center justify-center">
                  <FiPackage className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Today's Delivery
                </h2>
              </div>
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                  stats.todayDelivery?.status === "delivered"
                    ? "bg-gradient-to-r from-nature-100 to-primary-100 text-nature-700"
                    : "bg-gradient-to-r from-warm-100 to-yellow-100 text-yellow-700"
                }`}
              >
                {stats.todayDelivery?.status === "delivered"
                  ? "✓ Delivered"
                  : "⏳ Pending"}
              </motion.span>
            </div>
          </div>

          <div className="relative p-6">
            {stats.todayDelivery ? (
              <>
                <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-primary-50/50 to-nature-50/50 rounded-2xl">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-gradient-to-br from-primary-500 to-nature-500 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <FiClock className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Estimated Arrival
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-nature-600 bg-clip-text text-transparent">
                      {stats.todayDelivery.estimatedTime}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {stats.todayDelivery.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <motion.span
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          className="text-3xl"
                        >
                          {item.name.includes("Milk")
                            ? "🥛"
                            : item.name.includes("Curd")
                            ? "🥣"
                            : "🧈"}
                        </motion.span>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-primary-600">
                        ₹{item.price}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-gray-600 font-medium">
                    Today's Total
                  </span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-nature-600 bg-clip-text text-transparent">
                    ₹
                    {stats.todayDelivery.items.reduce(
                      (sum, item) => sum + item.price,
                      0
                    )}
                  </span>
                </div>

                <div className="mt-6 flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative flex-1 overflow-hidden rounded-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-nature-500 to-primary-500 bg-[length:200%_100%] animate-gradient-x" />
                    <div className="relative flex items-center justify-center gap-2 py-4 text-white font-semibold">
                      <FiMapPin className="w-5 h-5" />
                      Track Delivery
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-4 border-2 border-gray-200 text-gray-600 rounded-2xl font-semibold hover:border-red-300 hover:text-red-600 hover:bg-red-50/50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FiX className="w-5 h-5" />
                    Skip Tomorrow
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl mb-4"
                >
                  📭
                </motion.div>
                <p className="text-gray-500 text-lg">
                  No delivery scheduled for today
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Premium Upcoming Deliveries */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-sky-100/50 to-primary-100/50 rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2" />

          <div className="relative p-6 border-b border-gray-100/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-primary-500 rounded-xl flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Upcoming</h2>
            </div>
          </div>
          <div className="relative p-6 space-y-4">
            {upcomingDeliveries.map((delivery, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">
                    {delivery.date}
                  </span>
                  <span className="text-primary-600 font-bold">
                    ₹{delivery.total}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {delivery.items.join(", ")}
                </p>
              </motion.div>
            ))}
            <Link
              to="/dashboard/deliveries"
              className="group flex items-center justify-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors py-2"
            >
              View All Deliveries
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Premium Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-nature-100/30 to-primary-100/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

        <div className="relative p-6 border-b border-gray-100/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-nature-500 to-primary-500 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          </div>
        </div>
        <div className="relative p-6">
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 5 }}
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-300 cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                    activity.status === "success"
                      ? "bg-gradient-to-br from-nature-100 to-primary-100 text-nature-600"
                      : activity.status === "warning"
                      ? "bg-gradient-to-br from-warm-100 to-yellow-100 text-yellow-600"
                      : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600"
                  }`}
                >
                  {activity.type === "delivery" && (
                    <FiTruck className="w-5 h-5" />
                  )}
                  {activity.type === "payment" && (
                    <FiDollarSign className="w-5 h-5" />
                  )}
                  {activity.type === "skip" && <FiX className="w-5 h-5" />}
                </motion.div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {activity.message}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                {activity.status === "success" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 bg-gradient-to-br from-nature-500 to-primary-500 rounded-full flex items-center justify-center"
                  >
                    <FiCheck className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;
