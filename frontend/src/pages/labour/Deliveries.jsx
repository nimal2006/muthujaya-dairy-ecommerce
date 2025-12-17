import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiCheck,
  FiX,
  FiClock,
  FiMapPin,
  FiPhone,
  FiPackage,
  FiTruck,
  FiRefreshCw,
} from "react-icons/fi";
import { AnimatedMeshBackground } from "../../components/ui/AnimatedBackground";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

// Animated counter component
const AnimatedCounter = ({ value }) => {
  const spring = useSpring(0, { duration: 1000 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

const LabourDeliveries = () => {
  const { user } = useAuthStore();
  const [deliveries, setDeliveries] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const response = await api.get("/deliveries/my-assignments");

      if (response.data.success && response.data.data?.length > 0) {
        setDeliveries(response.data.data);
      } else {
        setDeliveries(getDemoDeliveries());
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setDeliveries(getDemoDeliveries());
    } finally {
      setLoading(false);
    }
  };

  const getDemoDeliveries = () => [
    {
      id: "DEL001",
      customer: {
        name: "Ramesh Kumar",
        phone: "+91 98765 43210",
        address: "45, Gandhi Street, RS Puram, Coimbatore",
      },
      items: [
        { name: "Fresh Milk", quantity: "1L" },
        { name: "Curd", quantity: "500g" },
      ],
      status: "delivered",
      deliveredAt: "6:32 AM",
      paymentStatus: "pending",
    },
    {
      id: "DEL002",
      customer: {
        name: "Lakshmi S",
        phone: "+91 98765 43211",
        address: "78, MG Road, Coimbatore",
      },
      items: [{ name: "Fresh Milk", quantity: "1L" }],
      status: "delivered",
      deliveredAt: "6:40 AM",
      paymentStatus: "paid",
    },
    {
      id: "DEL003",
      customer: {
        name: "Suresh M",
        phone: "+91 98765 43212",
        address: "12, NSR Street, Coimbatore",
      },
      items: [
        { name: "Fresh Milk", quantity: "2L" },
        { name: "Curd", quantity: "1kg" },
      ],
      status: "pending",
      eta: "6:55 AM",
      paymentStatus: "pending",
    },
    {
      id: "DEL004",
      customer: {
        name: "Priya R",
        phone: "+91 98765 43213",
        address: "33, DB Road, Coimbatore",
      },
      items: [
        { name: "Fresh Milk", quantity: "1L" },
        { name: "Ghee", quantity: "250g" },
      ],
      status: "pending",
      eta: "7:05 AM",
      paymentStatus: "pending",
    },
    {
      id: "DEL005",
      customer: {
        name: "Anand K",
        phone: "+91 98765 43214",
        address: "99, Race Course, Coimbatore",
      },
      items: [{ name: "Fresh Milk", quantity: "1L" }],
      status: "skipped",
      reason: "Customer not available",
      paymentStatus: "n/a",
    },
    {
      id: "DEL006",
      customer: {
        name: "Meena V",
        phone: "+91 98765 43215",
        address: "56, Sathy Road, Coimbatore",
      },
      items: [
        { name: "Fresh Milk", quantity: "1L" },
        { name: "Paneer", quantity: "500g" },
      ],
      status: "pending",
      eta: "7:20 AM",
      paymentStatus: "pending",
    },
  ];

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesFilter = filter === "all" || d.status === filter;
    const matchesSearch =
      d.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.customer.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
            <FiCheck className="w-3 h-3" /> Delivered
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-1">
            <FiClock className="w-3 h-3" /> Pending
          </span>
        );
      case "skipped":
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-1">
            <FiX className="w-3 h-3" /> Skipped
          </span>
        );
      default:
        return null;
    }
  };

  const handleMarkDelivered = (id) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "delivered",
              deliveredAt: new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              }),
            }
          : d
      )
    );
    setSelectedDelivery(null);
  };

  const handleMarkSkipped = (id, reason) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "skipped", reason } : d))
    );
    setSelectedDelivery(null);
  };

  const handleCollectPayment = (id) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, paymentStatus: "paid" } : d))
    );
  };

  const stats = {
    total: deliveries.length,
    delivered: deliveries.filter((d) => d.status === "delivered").length,
    pending: deliveries.filter((d) => d.status === "pending").length,
    skipped: deliveries.filter((d) => d.status === "skipped").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary-200 border-t-primary-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiTruck className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>
    );
  }

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
        className="relative bg-gradient-to-br from-sky-600 via-blue-500 to-primary-600 rounded-3xl p-8 text-white overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FiTruck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Today's Deliveries</h1>
              <p className="text-white/80">
                Manage and track all your deliveries
              </p>
            </div>
          </div>
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
            label: "Total",
            value: stats.total,
            gradient: "from-sky-400 to-blue-600",
          },
          {
            label: "Delivered",
            value: stats.delivered,
            gradient: "from-green-400 to-emerald-600",
          },
          {
            label: "Pending",
            value: stats.pending,
            gradient: "from-yellow-400 to-orange-500",
          },
          {
            label: "Skipped",
            value: stats.skipped,
            gradient: "from-gray-400 to-gray-600",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02, y: -3 }}
            className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-soft border border-white/50 overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full bg-gradient-to-r ${stat.gradient} shadow-md`}
              ></div>
              <span className="text-sm font-medium text-gray-500">
                {stat.label}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              <AnimatedCounter value={stat.value} />
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Premium Search and Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all shadow-soft"
          />
        </div>
        <div className="flex gap-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-xl shadow-soft border border-white/50">
          {["all", "pending", "delivered", "skipped"].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                filter === status
                  ? "bg-gradient-to-r from-primary-500 to-nature-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Premium Deliveries List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredDeliveries.map((delivery, index) => (
          <motion.div
            key={delivery.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            whileHover={{ y: -2 }}
            className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft overflow-hidden border transition-all ${
              delivery.status === "pending"
                ? "border-yellow-200 ring-2 ring-yellow-100"
                : "border-white/50 hover:shadow-lg"
            }`}
          >
            {/* Status indicator bar */}
            <div
              className={`absolute top-0 left-0 w-1.5 h-full ${
                delivery.status === "delivered"
                  ? "bg-gradient-to-b from-green-400 to-emerald-500"
                  : delivery.status === "pending"
                  ? "bg-gradient-to-b from-yellow-400 to-orange-500"
                  : "bg-gradient-to-b from-gray-400 to-gray-500"
              }`}
            />

            <div className="p-6 pl-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Customer Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-lg font-bold text-white">
                        {delivery.customer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {delivery.customer.name}
                      </h3>
                      <p className="text-sm text-gray-500">{delivery.id}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <FiMapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate max-w-[200px]">
                        {delivery.customer.address}
                      </span>
                    </div>
                    <a
                      href={`tel:${delivery.customer.phone}`}
                      className="flex items-center gap-2 text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <FiPhone className="w-4 h-4" />
                      {delivery.customer.phone}
                    </a>
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-2">
                  {delivery.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700"
                    >
                      {item.name} ({item.quantity})
                    </span>
                  ))}
                </div>

                {/* Status and Time */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {delivery.status === "delivered" && (
                      <p className="text-sm text-gray-500">
                        Delivered at{" "}
                        <span className="font-semibold">
                          {delivery.deliveredAt}
                        </span>
                      </p>
                    )}
                    {delivery.status === "pending" && (
                      <p className="text-sm text-gray-500">
                        ETA:{" "}
                        <span className="font-semibold text-yellow-600">
                          {delivery.eta}
                        </span>
                      </p>
                    )}
                    {delivery.status === "skipped" && (
                      <p className="text-sm text-gray-500">{delivery.reason}</p>
                    )}
                  </div>
                  {getStatusBadge(delivery.status)}
                </div>

                {/* Actions */}
                {delivery.status === "pending" && (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMarkDelivered(delivery.id)}
                      className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-md hover:shadow-lg transition-all"
                      title="Mark as Delivered"
                    >
                      <FiCheck className="w-5 h-5 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedDelivery(delivery)}
                      className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                      title="Skip Delivery"
                    >
                      <FiX className="w-5 h-5 text-gray-600" />
                    </motion.button>
                  </div>
                )}

                {delivery.status === "delivered" &&
                  delivery.paymentStatus === "pending" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCollectPayment(delivery.id)}
                      className="px-5 py-2.5 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all text-sm font-semibold"
                    >
                      Collect Cash
                    </motion.button>
                  )}

                {delivery.status === "delivered" &&
                  delivery.paymentStatus === "paid" && (
                    <span className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-semibold flex items-center gap-1">
                      <FiCheck className="w-4 h-4" /> Paid
                    </span>
                  )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredDeliveries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-12 text-center border border-white/50"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No deliveries found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search query
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Premium Skip Delivery Modal */}
      <AnimatePresence>
        {selectedDelivery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDelivery(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-red-100/50 to-orange-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <FiX className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Skip Delivery?
                </h2>
                <p className="text-gray-500 mb-6">
                  Why are you skipping delivery for{" "}
                  <span className="font-semibold text-gray-700">
                    {selectedDelivery.customer.name}
                  </span>
                  ?
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    "Customer not available",
                    "Wrong address",
                    "Customer requested skip",
                    "Product not available",
                    "Other",
                  ].map((reason, idx) => (
                    <motion.button
                      key={reason}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 5, backgroundColor: "#f3f4f6" }}
                      onClick={() =>
                        handleMarkSkipped(selectedDelivery.id, reason)
                      }
                      className="w-full p-4 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-all font-medium text-gray-700"
                    >
                      {reason}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDelivery(null)}
                  className="w-full p-3 text-gray-500 hover:text-gray-700 transition-colors font-semibold"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LabourDeliveries;
