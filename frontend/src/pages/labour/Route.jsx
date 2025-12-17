import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  FiNavigation,
  FiMapPin,
  FiClock,
  FiCheck,
  FiList,
  FiMap,
  FiPhone,
  FiTruck,
  FiTarget,
  FiActivity,
  FiZap,
  FiRefreshCw,
} from "react-icons/fi";
import { AnimatedMeshBackground } from "../../components/ui/AnimatedBackground";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

// Animated counter component
const AnimatedCounter = ({ value, suffix = "" }) => {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (val) => Math.round(val));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span>
      {Math.round(value)}
      {suffix}
    </motion.span>
  );
};

const LabourRoute = () => {
  const { user } = useAuthStore();
  const mapRef = useRef(null);
  const [viewMode, setViewMode] = useState("map");
  const [selectedStop, setSelectedStop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [routeInfo, setRouteInfo] = useState({
    totalDistance: "12.5 km",
    estimatedTime: "45 mins",
    stops: 8,
  });
  const [stops, setStops] = useState([]);

  useEffect(() => {
    fetchRouteData();
  }, []);

  const fetchRouteData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/routes/today");

      if (response.data.success && response.data.data) {
        const routeData = response.data.data;
        setRouteInfo({
          totalDistance: routeData.totalDistance || "12.5 km",
          estimatedTime: routeData.estimatedTime || "45 mins",
          stops: routeData.stops?.length || 0,
        });

        if (routeData.stops?.length > 0) {
          setStops(routeData.stops);
        } else {
          setStops(getDemoStops());
        }
      } else {
        setStops(getDemoStops());
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      setStops(getDemoStops());
    } finally {
      setLoading(false);
    }
  };

  const getDemoStops = () => [
    {
      id: 1,
      order: 1,
      customer: "Ramesh Kumar",
      address: "45, Gandhi Street, RS Puram",
      phone: "+91 98765 43210",
      items: ["Milk 1L", "Curd 500g"],
      status: "current",
      eta: "6:30 AM",
      coordinates: { lat: 11.0168, lng: 76.9558 },
    },
    {
      id: 2,
      order: 2,
      customer: "Lakshmi S",
      address: "78, MG Road, Coimbatore",
      phone: "+91 98765 43211",
      items: ["Milk 1L"],
      status: "pending",
      eta: "6:38 AM",
      coordinates: { lat: 11.0198, lng: 76.9578 },
    },
    {
      id: 3,
      order: 3,
      customer: "Suresh M",
      address: "12, NSR Street, Coimbatore",
      phone: "+91 98765 43212",
      items: ["Milk 2L", "Curd 1kg"],
      status: "pending",
      eta: "6:45 AM",
      coordinates: { lat: 11.0178, lng: 76.9608 },
    },
    {
      id: 4,
      order: 4,
      customer: "Priya R",
      address: "33, DB Road, Coimbatore",
      phone: "+91 98765 43213",
      items: ["Milk 1L", "Ghee 250g"],
      status: "pending",
      eta: "6:52 AM",
      coordinates: { lat: 11.0228, lng: 76.9628 },
    },
    {
      id: 5,
      order: 5,
      customer: "Anand K",
      address: "99, Race Course, Coimbatore",
      phone: "+91 98765 43214",
      items: ["Milk 1L"],
      status: "pending",
      eta: "7:00 AM",
      coordinates: { lat: 11.0248, lng: 76.9548 },
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "current":
        return "bg-blue-500 animate-pulse";
      case "pending":
        return "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };

  const handleMarkCompleted = async (stopId) => {
    try {
      // Try to update via API
      await api.put(`/deliveries/${stopId}/complete`);
      toast.success("Delivery marked as completed! ✅");
    } catch (error) {
      console.log("API not available, updating locally");
    }

    setStops((prev) => {
      const updated = prev.map((stop, idx) => {
        if (stop.id === stopId) {
          return { ...stop, status: "completed" };
        }
        // Set next stop as current
        if (prev[idx - 1]?.id === stopId && stop.status === "pending") {
          return { ...stop, status: "current" };
        }
        return stop;
      });
      return updated;
    });
  };

  return (
    <div className="space-y-8 relative">
      {/* Animated Background */}
      <AnimatedMeshBackground />

      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />

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
                Route Active
              </span>
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Today's Route</h1>
            <p className="text-white/80 text-lg">
              Optimized delivery route for maximum efficiency
            </p>
          </div>

          {/* Premium View Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-2xl p-1.5"
          >
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                viewMode === "map"
                  ? "bg-white text-purple-600 shadow-lg"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <FiMap className="w-5 h-5" />
              Map View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                viewMode === "list"
                  ? "bg-white text-purple-600 shadow-lg"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <FiList className="w-5 h-5" />
              List View
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Premium Route Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            icon: FiNavigation,
            label: "Total Distance",
            value: routeInfo.totalDistance,
            gradient: "from-blue-500 to-cyan-500",
            bgGlow: "bg-blue-500/10",
          },
          {
            icon: FiClock,
            label: "Est. Time",
            value: routeInfo.estimatedTime,
            gradient: "from-emerald-500 to-teal-500",
            bgGlow: "bg-emerald-500/10",
          },
          {
            icon: FiTarget,
            label: "Total Stops",
            value: stops.length,
            gradient: "from-purple-500 to-pink-500",
            bgGlow: "bg-purple-500/10",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/50 hover:shadow-xl transition-all duration-300 overflow-hidden`}
          >
            {/* Hover glow effect */}
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
                <p className="text-2xl font-bold text-gray-800">
                  {typeof stat.value === "number" ? (
                    <AnimatedCounter value={stat.value} />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map / List View */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {viewMode === "map" ? (
              <motion.div
                key="map"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="relative h-[600px] bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50"
              >
                {/* Premium Map placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="w-28 h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl"
                  >
                    <FiMap className="w-14 h-14 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Google Maps Integration
                  </h3>
                  <p className="text-gray-500 max-w-md mb-8 text-lg">
                    Add your Google Maps API key to enable real-time route
                    visualization with turn-by-turn navigation and live traffic
                    updates.
                  </p>
                  <div className="bg-gray-900 text-white p-6 rounded-2xl text-sm font-mono text-left max-w-md shadow-2xl">
                    <p className="text-gray-400 mb-2">// Add to .env file</p>
                    <p className="text-green-400">
                      VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
                    </p>
                  </div>
                </div>

                {/* Premium Route visualization overlay */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/50"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-500/30"></div>
                        <span className="text-sm font-medium text-gray-700">
                          Start: Dairy Farm
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-gradient-to-r from-rose-400 to-red-500 rounded-full shadow-lg shadow-red-500/30"></div>
                        <span className="text-sm font-medium text-gray-700">
                          End: {stops[stops.length - 1]?.address}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                    >
                      <FiNavigation className="w-5 h-5" />
                      Start Navigation
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FiList className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Delivery Stops
                  </h3>
                </div>
                <div className="relative">
                  {/* Premium Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 opacity-30"></div>

                  <div className="space-y-4">
                    {stops.map((stop, index) => (
                      <motion.div
                        key={stop.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        whileHover={{ x: 4 }}
                        className={`relative pl-16 py-4 rounded-2xl transition-all duration-300 ${
                          stop.status === "current"
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 -mx-4 px-8 shadow-lg shadow-blue-500/10 border border-blue-100"
                            : stop.status === "completed"
                            ? "opacity-60"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Premium Status dot */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: index * 0.08 + 0.1,
                            type: "spring",
                          }}
                          className={`absolute left-4 top-6 w-6 h-6 rounded-full border-4 border-white shadow-lg ${
                            stop.status === "completed"
                              ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/30"
                              : stop.status === "current"
                              ? "bg-gradient-to-br from-blue-400 to-indigo-500 shadow-blue-500/30 animate-pulse"
                              : "bg-gray-200"
                          }`}
                        />

                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-3 py-1 bg-white shadow-sm rounded-lg text-xs font-medium text-gray-600 border border-gray-100">
                                {stop.eta}
                              </span>
                              <h4 className="font-bold text-gray-800 text-lg">
                                {stop.customer}
                              </h4>
                              {stop.status === "current" && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold rounded-full shadow-lg shadow-blue-500/30"
                                >
                                  Current Stop
                                </motion.span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-2 flex items-center gap-2">
                              <FiMapPin className="w-4 h-4 text-gray-400" />
                              {stop.address}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {stop.items.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-gradient-to-r from-cream-100 to-milk-100 text-gray-700 rounded-full text-xs font-medium"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>

                          {stop.status !== "completed" && (
                            <div className="flex gap-2">
                              <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                  stop.address
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                              >
                                <FiNavigation className="w-5 h-5 text-indigo-600" />
                              </motion.a>
                              {stop.status === "current" && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleMarkCompleted(stop.id)}
                                  className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl transition-all duration-300"
                                >
                                  <FiCheck className="w-5 h-5 text-white" />
                                </motion.button>
                              )}
                            </div>
                          )}

                          {stop.status === "completed" && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                              <FiCheck className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-semibold text-green-700">
                                Completed
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Premium Sidebar - Selected Stop Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Current Stop - Premium Card */}
          {stops.find((s) => s.status === "current") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 p-6 overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <FiTarget className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Current Stop
                  </h3>
                </div>

                {(() => {
                  const current = stops.find((s) => s.status === "current");
                  return (
                    <div className="space-y-5">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
                        >
                          <span className="text-xl font-bold text-white">
                            {current.order}
                          </span>
                        </motion.div>
                        <div>
                          <p className="font-bold text-gray-800 text-lg">
                            {current.customer}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <FiPhone className="w-4 h-4" />
                            {current.phone}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">
                          Delivery Address
                        </p>
                        <p className="text-gray-800 font-medium flex items-start gap-2">
                          <FiMapPin className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" />
                          {current.address}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
                          Order Items
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {current.items.map((item, idx) => (
                            <motion.span
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              className="px-4 py-2 bg-gradient-to-r from-cream-100 to-milk-100 text-gray-700 rounded-xl text-sm font-medium border border-cream-200"
                            >
                              {item}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-3">
                        <motion.a
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={`tel:${current.phone}`}
                          className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-center hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <FiPhone className="w-5 h-5" />
                          Call
                        </motion.a>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMarkCompleted(current.id)}
                          className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <FiCheck className="w-5 h-5" />
                          Complete
                        </motion.button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          )}

          {/* Premium Progress Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <FiActivity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Progress</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Completed</span>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
                  {stops.filter((s) => s.status === "completed").length} /{" "}
                  {stops.length}
                </span>
              </div>
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (stops.filter((s) => s.status === "completed").length /
                        stops.length) *
                      100
                    }%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full"
                />
                {/* Shimmer effect */}
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              </div>

              {/* Progress breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">
                    {stops.filter((s) => s.status === "completed").length}
                  </p>
                  <p className="text-xs text-gray-500">Done</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">
                    {stops.filter((s) => s.status === "current").length}
                  </p>
                  <p className="text-xs text-gray-500">Current</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-600">
                    {stops.filter((s) => s.status === "pending").length}
                  </p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Premium Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FiZap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Today's Stats</h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Distance Covered",
                    value: "4.2 km",
                    icon: FiNavigation,
                  },
                  { label: "Time Elapsed", value: "22 mins", icon: FiClock },
                  { label: "Avg. per Stop", value: "3.5 mins", icon: FiTarget },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <stat.icon className="w-5 h-5 text-white/70" />
                      <span className="text-white/80 font-medium">
                        {stat.label}
                      </span>
                    </div>
                    <span className="font-bold text-lg">{stat.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LabourRoute;
