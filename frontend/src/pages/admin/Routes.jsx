import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiMapPin,
  FiUsers,
  FiClock,
  FiTruck,
  FiNavigation,
  FiMap,
  FiList,
  FiMoreVertical,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { AnimatedMeshBackground } from "../../components/ui/AnimatedBackground";

// Animated counter component
const AnimatedCounter = ({ value }) => {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (val) => Math.round(val));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{Math.round(value)}</motion.span>;
};

const AdminRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    setTimeout(() => {
      setRoutes([
        {
          id: "RT001",
          name: "Anna Nagar Route",
          area: "Anna Nagar",
          assignedLabour: {
            id: "LAB001",
            name: "Rajesh Kumar",
            phone: "9876543210",
          },
          totalStops: 45,
          completedToday: 32,
          estimatedTime: "4 hours",
          distance: "12 km",
          status: "active",
          startTime: "5:00 AM",
          endTime: "9:00 AM",
          stops: [
            { id: 1, address: "12, 1st Main Road, Anna Nagar", customers: 3 },
            { id: 2, address: "45, 2nd Cross Street", customers: 2 },
            { id: 3, address: "78, 3rd Avenue", customers: 4 },
            { id: 4, address: "23, 4th Block", customers: 1 },
          ],
        },
        {
          id: "RT002",
          name: "T. Nagar Route",
          area: "T. Nagar",
          assignedLabour: {
            id: "LAB002",
            name: "Suresh M",
            phone: "9876543211",
          },
          totalStops: 52,
          completedToday: 52,
          estimatedTime: "4.5 hours",
          distance: "15 km",
          status: "completed",
          startTime: "5:30 AM",
          endTime: "10:00 AM",
          stops: [
            { id: 1, address: "56, Pondy Bazaar", customers: 5 },
            { id: 2, address: "89, Usman Road", customers: 3 },
            { id: 3, address: "12, GN Chetty Road", customers: 2 },
          ],
        },
        {
          id: "RT003",
          name: "Velachery Route",
          area: "Velachery",
          assignedLabour: {
            id: "LAB003",
            name: "Kumar S",
            phone: "9876543212",
          },
          totalStops: 38,
          completedToday: 0,
          estimatedTime: "3.5 hours",
          distance: "10 km",
          status: "pending",
          startTime: "6:00 AM",
          endTime: "9:30 AM",
          stops: [
            { id: 1, address: "34, Velachery Main Road", customers: 4 },
            { id: 2, address: "67, 100 Feet Road", customers: 2 },
          ],
        },
        {
          id: "RT004",
          name: "Adyar Route",
          area: "Adyar",
          assignedLabour: null,
          totalStops: 40,
          completedToday: 0,
          estimatedTime: "3 hours",
          distance: "8 km",
          status: "unassigned",
          startTime: "5:30 AM",
          endTime: "8:30 AM",
          stops: [
            { id: 1, address: "45, Gandhi Nagar", customers: 3 },
            { id: 2, address: "78, LB Road", customers: 4 },
          ],
        },
        {
          id: "RT005",
          name: "Porur Route",
          area: "Porur",
          assignedLabour: {
            id: "LAB004",
            name: "Manikandan",
            phone: "9876543213",
          },
          totalStops: 35,
          completedToday: 18,
          estimatedTime: "3 hours",
          distance: "9 km",
          status: "active",
          startTime: "5:00 AM",
          endTime: "8:00 AM",
          stops: [
            { id: 1, address: "23, Mount Poonamallee Road", customers: 2 },
            { id: 2, address: "56, Arcot Road", customers: 3 },
          ],
        },
      ]);
      setLoading(false);
    }, 500);
  };

  const filteredRoutes = routes.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalRoutes: routes.length,
    activeRoutes: routes.filter((r) => r.status === "active").length,
    completedRoutes: routes.filter((r) => r.status === "completed").length,
    unassignedRoutes: routes.filter((r) => r.status === "unassigned").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700";
      case "completed":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700";
      case "pending":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700";
      case "unassigned":
        return "bg-gradient-to-r from-rose-100 to-red-100 text-rose-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDeleteRoute = (id) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      setRoutes((prev) => prev.filter((r) => r.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiMap className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Animated Background */}
      <AnimatedMeshBackground />

      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-3xl p-8 text-white"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FiNavigation className="w-6 h-6" />
              </div>
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {routes.length} Routes
              </span>
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Routes Management</h1>
            <p className="text-white/80 text-lg">
              Organize and optimize delivery routes
            </p>
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-white text-cyan-600 rounded-xl font-semibold shadow-lg flex items-center gap-2 hover:shadow-xl transition-all duration-300"
          >
            <FiPlus className="w-5 h-5" />
            Add Route
          </motion.button>
        </div>
      </motion.div>

      {/* Premium Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Total Routes",
            value: stats.totalRoutes,
            icon: FiMap,
            gradient: "from-blue-500 to-cyan-500",
            bgGlow: "bg-blue-500/10",
          },
          {
            label: "Active Now",
            value: stats.activeRoutes,
            icon: FiNavigation,
            gradient: "from-orange-500 to-amber-500",
            bgGlow: "bg-orange-500/10",
          },
          {
            label: "Completed",
            value: stats.completedRoutes,
            icon: FiCheckCircle,
            gradient: "from-emerald-500 to-teal-500",
            bgGlow: "bg-emerald-500/10",
          },
          {
            label: "Unassigned",
            value: stats.unassignedRoutes,
            icon: FiAlertCircle,
            gradient: "from-rose-500 to-pink-500",
            bgGlow: "bg-rose-500/10",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/50 hover:shadow-xl transition-all duration-300 overflow-hidden`}
          >
            {/* Hover glow */}
            <div
              className={`absolute inset-0 ${stat.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <div className="relative z-10 flex items-center gap-4">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">
                  <AnimatedCounter value={stat.value} />
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Premium Search and View Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-soft border border-white/50"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search routes by name or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300"
            />
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode("cards")}
              className={`px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium ${
                viewMode === "cards"
                  ? "bg-white shadow-lg text-cyan-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FiList className="w-5 h-5" />
              Cards
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode("map")}
              className={`px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium ${
                viewMode === "map"
                  ? "bg-white shadow-lg text-cyan-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FiMap className="w-5 h-5" />
              Map
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Premium Map View Placeholder */}
      {viewMode === "map" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 overflow-hidden"
        >
          <div className="h-96 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
              className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl"
            >
              <FiMap className="w-12 h-12 text-white" />
            </motion.div>
            <p className="text-xl font-bold text-gray-800 mb-2">Map View</p>
            <p className="text-gray-500">Google Maps integration coming soon</p>
          </div>
        </motion.div>
      )}

      {/* Premium Routes Cards */}
      {viewMode === "cards" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredRoutes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ y: -4 }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              {/* Status indicator bar at top */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  route.status === "active"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                    : route.status === "completed"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : route.status === "pending"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                    : "bg-gradient-to-r from-rose-500 to-red-500"
                }`}
              />

              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {route.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize ${getStatusColor(
                          route.status
                        )}`}
                      >
                        {route.status}
                      </span>
                    </div>
                    <p className="text-gray-600 flex items-center gap-2">
                      <FiMapPin className="w-4 h-4 text-cyan-500" />
                      {route.area}
                    </p>
                  </div>
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors group-hover:bg-gray-100"
                    >
                      <FiMoreVertical className="w-5 h-5 text-gray-500" />
                    </motion.button>
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 min-w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <button
                        onClick={() => setSelectedRoute(route)}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-cyan-50 flex items-center gap-3 transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4 text-cyan-600" /> Edit Route
                      </button>
                      <button
                        onClick={() => handleDeleteRoute(route.id)}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-rose-50 text-rose-600 flex items-center gap-3 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Premium Progress */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-gray-600 font-medium">
                      Today's Progress
                    </span>
                    <span className="font-bold text-gray-800">
                      {route.completedToday}/{route.totalStops} stops
                    </span>
                  </div>
                  <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (route.completedToday / route.totalStops) * 100
                        }%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        route.status === "completed"
                          ? "bg-gradient-to-r from-green-400 to-emerald-500"
                          : "bg-gradient-to-r from-cyan-400 to-blue-500"
                      }`}
                    />
                    {/* Shimmer effect */}
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                  </div>
                </div>

                {/* Premium Info Grid */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    {
                      icon: FiMapPin,
                      value: route.totalStops,
                      label: "Stops",
                      gradient: "from-blue-500 to-cyan-500",
                    },
                    {
                      icon: FiClock,
                      value: route.estimatedTime,
                      label: "Duration",
                      gradient: "from-amber-500 to-orange-500",
                    },
                    {
                      icon: FiNavigation,
                      value: route.distance,
                      label: "Distance",
                      gradient: "from-purple-500 to-pink-500",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100"
                    >
                      <div
                        className={`w-8 h-8 mx-auto mb-2 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center`}
                      >
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm font-bold text-gray-800">
                        {item.value}
                      </p>
                      <p className="text-xs text-gray-500">{item.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Premium Assigned Labour */}
                <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                  {route.assignedLabour ? (
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30"
                      >
                        <span className="text-white font-bold text-lg">
                          {route.assignedLabour.name.charAt(0)}
                        </span>
                      </motion.div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {route.assignedLabour.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {route.assignedLabour.phone}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 text-rose-600">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-red-100 rounded-2xl flex items-center justify-center">
                        <FiUsers className="w-6 h-6 text-rose-500" />
                      </div>
                      <span className="font-medium">No labour assigned</span>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium">
                      Schedule
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {route.startTime} - {route.endTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Premium Stops Preview */}
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-semibold mb-3 uppercase tracking-wider">
                  Recent Stops
                </p>
                <div className="flex flex-wrap gap-2">
                  {route.stops.slice(0, 3).map((stop, i) => (
                    <span
                      key={stop.id}
                      className="px-3 py-1.5 bg-white rounded-xl text-xs text-gray-600 border border-gray-200 font-medium"
                    >
                      {stop.address.length > 20
                        ? stop.address.substring(0, 20) + "..."
                        : stop.address}
                    </span>
                  ))}
                  {route.stops.length > 3 && (
                    <span className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl text-xs font-semibold">
                      +{route.stops.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {filteredRoutes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 p-16 text-center"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6">
            <FiMap className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No routes found
          </h3>
          <p className="text-gray-500">
            Try a different search or create a new route
          </p>
        </motion.div>
      )}

      {/* Premium Add/Edit Route Modal */}
      <AnimatePresence>
        {(showAddModal || selectedRoute) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddModal(false);
              setSelectedRoute(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Premium Modal Header */}
              <div className="relative bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 p-6">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <FiMap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {selectedRoute ? "Edit Route" : "Add New Route"}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {selectedRoute
                          ? "Update route details"
                          : "Create a delivery route"}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedRoute(null);
                    }}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <FiX className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>

              <form className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Route Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedRoute?.name}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all placeholder-gray-400"
                    placeholder="e.g., Anna Nagar Route"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Area
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedRoute?.area}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all placeholder-gray-400"
                    placeholder="e.g., Anna Nagar"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      defaultValue={selectedRoute?.startTime
                        ?.replace(" AM", "")
                        .replace(" PM", "")}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      defaultValue={selectedRoute?.endTime
                        ?.replace(" AM", "")
                        .replace(" PM", "")}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assign Labour
                  </label>
                  <select
                    defaultValue={selectedRoute?.assignedLabour?.id || ""}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  >
                    <option value="">Select Labour</option>
                    <option value="LAB001">Rajesh Kumar</option>
                    <option value="LAB002">Suresh M</option>
                    <option value="LAB003">Kumar S</option>
                    <option value="LAB004">Manikandan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stops (Address per line)
                  </label>
                  <textarea
                    defaultValue={selectedRoute?.stops
                      ?.map((s) => s.address)
                      .join("\n")}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all resize-none placeholder-gray-400"
                    rows={4}
                    placeholder="12, 1st Main Road&#10;45, 2nd Cross Street&#10;78, 3rd Avenue"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedRoute(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                  >
                    {selectedRoute ? "Save Changes" : "Create Route"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminRoutes;
