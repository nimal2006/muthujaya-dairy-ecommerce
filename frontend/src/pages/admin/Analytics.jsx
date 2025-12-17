import { useState, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiPackage,
  FiTruck,
  FiDollarSign,
  FiCalendar,
  FiDownload,
  FiFilter,
  FiBarChart2,
  FiPieChart,
  FiActivity,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AnimatedMeshBackground } from "../../components/ui/AnimatedBackground";

// Animated Counter Component
const AnimatedCounter = ({ value, prefix = "", suffix = "" }) => {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (val) => {
    if (typeof value === "string") return value;
    return prefix + Math.floor(val).toLocaleString() + suffix;
  });

  useEffect(() => {
    if (typeof value === "number") {
      spring.set(value);
    }
  }, [value, spring]);

  if (typeof value === "string") {
    return <span>{value}</span>;
  }
  return <motion.span>{display}</motion.span>;
};

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState("month");

  // Revenue Data
  const revenueData = [
    { month: "Jan", revenue: 185000, expenses: 95000, profit: 90000 },
    { month: "Feb", revenue: 198000, expenses: 98000, profit: 100000 },
    { month: "Mar", revenue: 215000, expenses: 102000, profit: 113000 },
    { month: "Apr", revenue: 205000, expenses: 100000, profit: 105000 },
    { month: "May", revenue: 225000, expenses: 108000, profit: 117000 },
    { month: "Jun", revenue: 240000, expenses: 112000, profit: 128000 },
  ];

  // Delivery Data
  const deliveryData = [
    { day: "Mon", successful: 245, failed: 12, skipped: 8 },
    { day: "Tue", successful: 258, failed: 8, skipped: 15 },
    { day: "Wed", successful: 262, failed: 5, skipped: 10 },
    { day: "Thu", successful: 255, failed: 10, skipped: 12 },
    { day: "Fri", successful: 270, failed: 6, skipped: 8 },
    { day: "Sat", successful: 285, failed: 4, skipped: 5 },
    { day: "Sun", successful: 275, failed: 7, skipped: 6 },
  ];

  // Product Sales
  const productData = [
    { name: "Cow Milk", value: 45, color: "#16a34a" },
    { name: "Buffalo Milk", value: 28, color: "#22c55e" },
    { name: "Fresh Curd", value: 15, color: "#4ade80" },
    { name: "Pure Ghee", value: 7, color: "#86efac" },
    { name: "Others", value: 5, color: "#bbf7d0" },
  ];

  // Customer Growth
  const customerGrowth = [
    { month: "Jan", newUsers: 45, churned: 8, total: 850 },
    { month: "Feb", newUsers: 52, churned: 5, total: 897 },
    { month: "Mar", newUsers: 68, churned: 12, total: 953 },
    { month: "Apr", newUsers: 55, churned: 7, total: 1001 },
    { month: "May", newUsers: 72, churned: 9, total: 1064 },
    { month: "Jun", newUsers: 85, churned: 11, total: 1138 },
  ];

  // Route Performance
  const routePerformance = [
    { route: "Anna Nagar", deliveries: 1250, rating: 4.8, efficiency: 95 },
    { route: "T. Nagar", deliveries: 1180, rating: 4.6, efficiency: 92 },
    { route: "Velachery", deliveries: 1050, rating: 4.7, efficiency: 94 },
    { route: "Adyar", deliveries: 980, rating: 4.5, efficiency: 90 },
    { route: "Porur", deliveries: 920, rating: 4.4, efficiency: 88 },
  ];

  // Top Customers
  const topCustomers = [
    { name: "Priya Sharma", orders: 182, amount: 54600, growth: 12 },
    { name: "Rajesh Kumar", orders: 168, amount: 50400, growth: 8 },
    { name: "Lakshmi Devi", orders: 155, amount: 46500, growth: 15 },
    { name: "Suresh M", orders: 142, amount: 42600, growth: -3 },
    { name: "Anitha R", orders: 138, amount: 41400, growth: 6 },
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "₹12.4L",
      change: "+18.2%",
      isPositive: true,
      icon: FiDollarSign,
      gradient: "from-green-500 to-emerald-500",
      bgGlow: "bg-green-500/10",
    },
    {
      title: "Total Customers",
      value: "1,138",
      change: "+85 new",
      isPositive: true,
      icon: FiUsers,
      gradient: "from-blue-500 to-cyan-500",
      bgGlow: "bg-blue-500/10",
    },
    {
      title: "Products Sold",
      value: "8,542",
      change: "+12.5%",
      isPositive: true,
      icon: FiPackage,
      gradient: "from-purple-500 to-pink-500",
      bgGlow: "bg-purple-500/10",
    },
    {
      title: "Delivery Rate",
      value: "96.8%",
      change: "+2.1%",
      isPositive: true,
      icon: FiTruck,
      gradient: "from-orange-500 to-amber-500",
      bgGlow: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Premium Animated Background */}
      <AnimatedMeshBackground />

      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 shadow-2xl"
      >
        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FiBarChart2 className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium">
                Live Data
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-white/80">
              Comprehensive business insights and metrics
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-1 bg-white/10 backdrop-blur-sm rounded-2xl p-1">
              {["week", "month", "quarter", "year"].map((range) => (
                <motion.button
                  key={range}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                    dateRange === range
                      ? "bg-white text-purple-600 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {range}
                </motion.button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 bg-white text-purple-600 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <FiDownload className="w-4 h-4" />
              Export
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Premium Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            whileHover={{ y: -4 }}
            className={`relative bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-soft border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300`}
          >
            <div
              className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${stat.bgGlow} blur-2xl`}
            />
            <div className="relative flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-sm font-semibold flex items-center gap-1 px-3 py-1 rounded-xl ${
                  stat.isPositive
                    ? "text-green-600 bg-green-50"
                    : "text-rose-600 bg-rose-50"
                }`}
              >
                {stat.isPositive ? (
                  <FiTrendingUp className="w-4 h-4" />
                ) : (
                  <FiTrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Premium Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 p-6 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <FiActivity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Revenue & Profit Analysis
              </h3>
              <p className="text-sm text-gray-500">
                Monthly financial overview
              </p>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickFormatter={(v) => `₹${v / 1000}K`}
            />
            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString()}`, ""]}
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorProfit)"
              name="Profit"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Second Row: Delivery Stats & Product Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Premium Delivery Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 p-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FiTruck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Delivery Statistics
              </h3>
              <p className="text-sm text-gray-500">Weekly delivery breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deliveryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                }}
              />
              <Legend />
              <Bar
                dataKey="successful"
                fill="#10b981"
                name="Successful"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="failed"
                fill="#f43f5e"
                name="Failed"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="skipped"
                fill="#f59e0b"
                name="Skipped"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Premium Product Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 p-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <FiPieChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Product Distribution
              </h3>
              <p className="text-sm text-gray-500">Sales by product category</p>
            </div>
          </div>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={250}>
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {productData.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="w-4 h-4 rounded-lg"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600 flex-1 font-medium">
                    {item.name}
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {item.value}%
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Customer Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Customer Growth
              </h3>
              <p className="text-sm text-gray-500">
                New customers vs churn rate
              </p>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={customerGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#9ca3af"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="newUsers"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              name="New Customers"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="churned"
              stroke="#f43f5e"
              strokeWidth={3}
              dot={{ fill: "#f43f5e", strokeWidth: 2, r: 4 }}
              name="Churned"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="total"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
              name="Total Customers"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Fourth Row: Route Performance & Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Premium Route Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 p-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
              <FiTruck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Route Performance
              </h3>
              <p className="text-sm text-gray-500">
                Efficiency by delivery route
              </p>
            </div>
          </div>
          <div className="space-y-5">
            {routePerformance.map((route, index) => (
              <motion.div
                key={route.route}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center">
                  <span className="text-teal-700 font-bold text-sm">
                    {index + 1}
                  </span>
                </div>
                <div className="w-24 truncate">
                  <p className="font-semibold text-gray-800">{route.route}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500 font-medium">
                      {route.deliveries} deliveries
                    </span>
                    <span className="font-bold text-gray-800">
                      {route.efficiency}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${route.efficiency}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-500"
                    />
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                    ⭐ {route.rating}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Premium Top Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 p-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Top Customers</h3>
              <p className="text-sm text-gray-500">
                Highest value customers this month
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <motion.div
                key={customer.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                    index === 0
                      ? "bg-gradient-to-br from-amber-400 to-yellow-500 shadow-amber-500/30"
                      : index === 1
                      ? "bg-gradient-to-br from-gray-300 to-gray-400 shadow-gray-400/30"
                      : index === 2
                      ? "bg-gradient-to-br from-amber-600 to-orange-600 shadow-orange-500/30"
                      : "bg-gradient-to-br from-gray-100 to-gray-200"
                  }`}
                >
                  <span
                    className={`font-bold ${
                      index < 3 ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{customer.name}</p>
                  <p className="text-sm text-gray-500">
                    {customer.orders} orders
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    ₹{customer.amount.toLocaleString()}
                  </p>
                  <p
                    className={`text-sm font-medium flex items-center justify-end gap-1 ${
                      customer.growth >= 0 ? "text-green-600" : "text-rose-600"
                    }`}
                  >
                    {customer.growth >= 0 ? (
                      <FiTrendingUp className="w-3 h-3" />
                    ) : (
                      <FiTrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(customer.growth)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Premium Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl shadow-2xl p-8"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl" />

        <div className="relative">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-2xl">📊</span>
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Best Performing Day",
                value: "Saturday",
                sub: "285 avg. deliveries",
                icon: "📅",
              },
              {
                label: "Top Product",
                value: "Cow Milk",
                sub: "45% of total sales",
                icon: "🥛",
              },
              {
                label: "Growth Rate",
                value: "+18.2%",
                sub: "vs. last month",
                icon: "📈",
              },
            ].map((insight, index) => (
              <motion.div
                key={insight.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{insight.icon}</span>
                  <p className="text-white/70 text-sm font-medium">
                    {insight.label}
                  </p>
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  {insight.value}
                </p>
                <p className="text-sm text-white/60">{insight.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;
