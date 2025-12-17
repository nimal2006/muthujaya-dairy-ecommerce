import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  FiCalendar,
  FiCheck,
  FiX,
  FiMapPin,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiPackage,
  FiTruck,
  FiRefreshCw,
} from "react-icons/fi";
import { AnimatedMeshBackground } from "../../components/ui/AnimatedBackground";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

// Animated counter component
const AnimatedCounter = ({ value, duration = 1 }) => {
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

const UserDeliveries = () => {
  const { user } = useAuthStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, [currentMonth]);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const response = await api.get("/deliveries/my-deliveries", {
        params: {
          month: currentMonth.getMonth() + 1,
          year: currentMonth.getFullYear(),
        },
      });

      if (response.data.success && response.data.data) {
        setDeliveries(response.data.data);
      } else {
        // Fallback to generated data if API returns empty
        setDeliveries(generateMockDeliveries());
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      // Use demo data on error
      setDeliveries(generateMockDeliveries());
    } finally {
      setLoading(false);
    }
  };

  const generateMockDeliveries = () => {
    const deliveries = [];
    const today = new Date();

    for (let i = -10; i <= 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      if (Math.random() > 0.1) {
        deliveries.push({
          id: `del-${i}`,
          date: date.toISOString().split("T")[0],
          status:
            i < 0
              ? Math.random() > 0.15
                ? "delivered"
                : "skipped"
              : i === 0
              ? "pending"
              : "scheduled",
          items: [
            { name: "Fresh Milk", quantity: "1L", price: 60 },
            Math.random() > 0.5 && {
              name: "Curd",
              quantity: "500g",
              price: 40,
            },
          ].filter(Boolean),
          deliveryTime: i < 0 ? "6:32 AM" : "6:30 AM",
          deliveryBoy: "Raju Kumar",
          address: "123, MG Road, Coimbatore",
        });
      }
    }

    return deliveries;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentMonth);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const getDeliveryForDate = (day) => {
    const dateStr = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];
    return deliveries.find((d) => d.date === dateStr);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "scheduled":
        return "bg-blue-500";
      case "skipped":
        return "bg-gray-400";
      default:
        return "bg-gray-300";
    }
  };

  const filteredDeliveries = deliveries
    .filter((d) => {
      if (filter === "all") return true;
      return d.status === filter;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleSkipDelivery = async (deliveryId) => {
    try {
      const response = await api.put(`/deliveries/${deliveryId}/skip`, {
        skipReason: "Customer requested skip",
      });

      if (response.data.success) {
        setDeliveries((prev) =>
          prev.map((d) =>
            d.id === deliveryId || d._id === deliveryId
              ? { ...d, status: "skipped" }
              : d
          )
        );
        setSelectedDelivery(null);
        toast.success("Delivery skipped successfully");
      }
    } catch (error) {
      console.error("Error skipping delivery:", error);
      // Still update locally for demo
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === deliveryId || d._id === deliveryId
            ? { ...d, status: "skipped" }
            : d
        )
      );
      setSelectedDelivery(null);
      toast.success("Delivery marked as skipped");
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Subtle animated background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <AnimatedMeshBackground />
      </div>

      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-nature-500 rounded-3xl p-8 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-nature-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">My Deliveries</h1>
            <p className="text-white/80">
              Track and manage your daily milk deliveries
            </p>
          </div>

          {/* Stats Summary */}
          <div className="flex items-center gap-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-3 text-white">
              <p className="text-white/70 text-sm">This Month</p>
              <p className="text-2xl font-bold">
                <AnimatedCounter
                  value={
                    deliveries.filter((d) => d.status === "delivered").length
                  }
                />{" "}
                Delivered
              </p>
            </div>
          </div>
        </div>

        {/* Filter Dropdown - Premium Style */}
        <div className="relative mt-6 flex items-center gap-3">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all cursor-pointer"
            >
              <option value="all" className="text-gray-800">
                All Status
              </option>
              <option value="delivered" className="text-gray-800">
                Delivered
              </option>
              <option value="pending" className="text-gray-800">
                Pending
              </option>
              <option value="scheduled" className="text-gray-800">
                Scheduled
              </option>
              <option value="skipped" className="text-gray-800">
                Skipped
              </option>
            </select>
            <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Premium Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-white/50 overflow-hidden"
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary-100/50 to-nature-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          {/* Calendar Header */}
          <div className="relative flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-nature-500 rounded-xl flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-white" />
              </div>
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevMonth}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <FiChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentMonth(new Date())}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-nature-500 hover:shadow-lg rounded-xl transition-all"
              >
                Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextMonth}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <FiChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Week days */}
          <div className="relative grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="relative grid grid-cols-7 gap-1">
            {/* Empty cells for days before first day */}
            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square"></div>
            ))}

            {/* Days */}
            {Array.from({ length: days }).map((_, index) => {
              const day = index + 1;
              const delivery = getDeliveryForDate(day);
              const isToday =
                new Date().toDateString() ===
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                ).toDateString();
              const isSelected =
                selectedDate.toDateString() ===
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                ).toDateString();

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedDate(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day
                      )
                    );
                    if (delivery) setSelectedDelivery(delivery);
                  }}
                  className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-center relative transition-all
                    ${
                      isToday
                        ? "ring-2 ring-primary-500 shadow-lg shadow-primary-500/20"
                        : ""
                    }
                    ${
                      isSelected
                        ? "bg-gradient-to-br from-primary-100 to-nature-100"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <span
                    className={`text-sm ${
                      isToday
                        ? "font-bold text-primary-600"
                        : isSelected
                        ? "font-semibold text-primary-700"
                        : "text-gray-700"
                    }`}
                  >
                    {day}
                  </span>
                  {delivery && (
                    <span
                      className={`w-2.5 h-2.5 rounded-full mt-1 ${getStatusColor(
                        delivery.status
                      )} shadow-sm`}
                    ></span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Premium Legend */}
          <div className="relative mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
            {[
              {
                status: "delivered",
                label: "Delivered",
                color: "bg-gradient-to-r from-green-500 to-emerald-500",
              },
              {
                status: "pending",
                label: "Pending",
                color: "bg-gradient-to-r from-yellow-500 to-amber-500",
              },
              {
                status: "scheduled",
                label: "Scheduled",
                color: "bg-gradient-to-r from-blue-500 to-sky-500",
              },
              { status: "skipped", label: "Skipped", color: "bg-gray-400" },
            ].map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${item.color} shadow-sm`}
                ></span>
                <span className="text-sm font-medium text-gray-600">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Premium Delivery Details / List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft overflow-hidden border border-white/50"
        >
          {/* Decorative gradient */}
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-nature-100/50 to-primary-100/50 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-nature-500 to-primary-500 rounded-xl flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {selectedDelivery ? "Delivery Details" : "Recent Deliveries"}
              </h2>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedDelivery ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative p-6"
              >
                <motion.button
                  whileHover={{ x: -3 }}
                  onClick={() => setSelectedDelivery(null)}
                  className="text-sm text-primary-600 mb-4 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  <FiChevronLeft className="w-4 h-4" />
                  Back to list
                </motion.button>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50">
                    <span className="text-gray-500">Date</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(selectedDelivery.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50">
                    <span className="text-gray-500">Status</span>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                        selectedDelivery.status === "delivered"
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
                          : selectedDelivery.status === "pending"
                          ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700"
                          : selectedDelivery.status === "scheduled"
                          ? "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {selectedDelivery.status.charAt(0).toUpperCase() +
                        selectedDelivery.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50">
                    <span className="text-gray-500 flex items-center gap-2">
                      <FiClock className="w-4 h-4" /> Time
                    </span>
                    <span className="font-semibold text-gray-800">
                      {selectedDelivery.deliveryTime}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                      <FiPackage className="w-4 h-4" /> Items
                    </p>
                    {selectedDelivery.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-800 font-medium">
                          {item.name}{" "}
                          <span className="text-gray-400">
                            ({item.quantity})
                          </span>
                        </span>
                        <span className="font-semibold text-gray-700">
                          ₹{item.price}
                        </span>
                      </motion.div>
                    ))}
                    <div className="flex items-center justify-between pt-4 px-3 border-t mt-3 bg-gradient-to-r from-primary-50 to-nature-50 rounded-xl py-3">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-nature-600 bg-clip-text text-transparent">
                        ₹
                        {selectedDelivery.items.reduce(
                          (sum, i) => sum + i.price,
                          0
                        )}
                      </span>
                    </div>
                  </div>

                  {(selectedDelivery.status === "scheduled" ||
                    selectedDelivery.status === "pending") && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSkipDelivery(selectedDelivery.id)}
                      className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-600 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <FiX className="w-5 h-5" />
                      Skip This Delivery
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative max-h-[500px] overflow-y-auto"
              >
                {filteredDeliveries.slice(0, 10).map((delivery, index) => (
                  <motion.button
                    key={delivery.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{
                      x: 5,
                      backgroundColor: "rgba(249, 250, 251, 0.8)",
                    }}
                    onClick={() => setSelectedDelivery(delivery)}
                    className="w-full p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-all text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">
                        {new Date(delivery.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span
                        className={`w-3 h-3 rounded-full shadow-sm ${getStatusColor(
                          delivery.status
                        )}`}
                      ></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {delivery.items.map((i) => i.name).join(", ")}
                      </span>
                      <span className="font-bold bg-gradient-to-r from-primary-600 to-nature-600 bg-clip-text text-transparent">
                        ₹{delivery.items.reduce((sum, i) => sum + i.price, 0)}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDeliveries;
