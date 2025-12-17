import { useState, useEffect } from "react";
import {
  motion,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiTruck,
  FiMapPin,
  FiClock,
  FiCheck,
  FiX,
  FiNavigation,
  FiPhone,
  FiUser,
  FiPackage,
  FiZap,
  FiDollarSign,
  FiSkipForward,
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { AnimatedMeshBackground } from "../../components/ui/AnimatedBackground";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AnimatedCounter = ({ value, duration = 1 }) => {
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (v) => Math.round(v));
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  return <motion.span>{display}</motion.span>;
};

const LabourDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalToday: 0,
    delivered: 0,
    pending: 0,
    skipped: 0,
    earnings: 0,
  });
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipReason, setSkipReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/deliveries/today");
      if (response.data.success) {
        const { stats: apiStats, deliveries } = response.data;
        setStats({
          totalToday: apiStats.total || 0,
          delivered: apiStats.delivered || 0,
          pending: apiStats.pending || 0,
          skipped: apiStats.skipped || 0,
          earnings: apiStats.totalAmount || 0,
        });

        const pendingList = deliveries.filter(
          (d) => d.status === "pending" || d.status === "scheduled"
        );
        if (pendingList.length > 0) {
          const first = pendingList[0];
          setCurrentDelivery({
            id: first._id,
            customer: {
              name: first.user?.name || "Customer",
              phone: first.user?.phone || "+91 98765 43210",
              address:
                typeof first.user?.address === "object"
                  ? `${first.user.address.street || ""}, ${
                      first.user.address.area || ""
                    }, ${first.user.address.city || "Coimbatore"}`
                  : first.user?.address || "Address not available",
            },
            items:
              first.items?.map((item) => ({
                name: item.product?.name || "Product",
                quantity: `${item.quantity}${item.product?.unit || ""}`,
                price: item.pricePerUnit || 60,
              })) || [],
            totalAmount: first.totalAmount || 0,
            estimatedTime: "5 mins",
            distance: "1.2 km",
          });
          setPendingDeliveries(
            pendingList.slice(1).map((d) => ({
              id: d._id,
              customer: {
                name: d.user?.name || "Customer",
                address: d.user?.address?.street || "Address",
              },
              items: d.items?.map(
                (i) =>
                  `${i.product?.name || "Item"} ${i.quantity}${
                    i.product?.unit || ""
                  }`
              ) || ["Items"],
              distance: "1.5 km",
            }))
          );
        } else {
          setCurrentDelivery(null);
          setPendingDeliveries([]);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      // Demo data
      setStats({
        totalToday: 25,
        delivered: 18,
        pending: 5,
        skipped: 2,
        earnings: 4500,
      });
      setCurrentDelivery({
        id: "DEL001",
        customer: {
          name: "Ramesh Kumar",
          phone: "+91 98765 43210",
          address: "45, Gandhi Street, RS Puram, Coimbatore - 641002",
        },
        items: [
          { name: "Fresh Milk", quantity: "1L", price: 60 },
          { name: "Curd", quantity: "500g", price: 40 },
        ],
        totalAmount: 100,
        estimatedTime: "5 mins",
        distance: "0.8 km",
      });
      setPendingDeliveries([
        {
          id: "DEL002",
          customer: { name: "Lakshmi S", address: "78, MG Road" },
          items: ["Milk 1L"],
          distance: "1.2 km",
        },
        {
          id: "DEL003",
          customer: { name: "Suresh M", address: "12, NSR Street" },
          items: ["Milk 2L", "Curd 1kg"],
          distance: "1.5 km",
        },
        {
          id: "DEL004",
          customer: { name: "Priya R", address: "33, DB Road" },
          items: ["Milk 1L", "Ghee 250g"],
          distance: "2.1 km",
        },
        {
          id: "DEL005",
          customer: { name: "Anand K", address: "99, Race Course" },
          items: ["Milk 1L"],
          distance: "2.8 km",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async () => {
    if (!currentDelivery) return;
    setProcessing(true);
    try {
      await api.put(`/deliveries/${currentDelivery.id}/status`, {
        status: "delivered",
      });
      toast.success("Delivery completed! 🎉");

      setStats((prev) => ({
        ...prev,
        delivered: prev.delivered + 1,
        pending: prev.pending - 1,
        earnings: prev.earnings + (currentDelivery.totalAmount || 100),
      }));

      if (pendingDeliveries.length > 0) {
        const next = pendingDeliveries[0];
        setCurrentDelivery({
          id: next.id,
          customer: {
            name: next.customer.name,
            phone: "+91 98765 43210",
            address: next.customer.address + ", Coimbatore",
          },
          items: next.items.map((item) => ({
            name: item,
            quantity: "1",
            price: 60,
          })),
          totalAmount: 100,
          estimatedTime: "5 mins",
          distance: next.distance,
        });
        setPendingDeliveries((prev) => prev.slice(1));
      } else {
        setCurrentDelivery(null);
      }
    } catch (error) {
      console.error("Error marking delivered:", error);
      toast.error("Failed to update delivery");
      // Still update UI for demo
      setStats((prev) => ({
        ...prev,
        delivered: prev.delivered + 1,
        pending: prev.pending - 1,
      }));
      if (pendingDeliveries.length > 0) {
        setCurrentDelivery({
          ...pendingDeliveries[0],
          customer: {
            ...pendingDeliveries[0].customer,
            phone: "+91 98765 43210",
          },
          items: pendingDeliveries[0].items.map((i) => ({
            name: i,
            quantity: "1",
            price: 60,
          })),
          totalAmount: 100,
          estimatedTime: "5 mins",
        });
        setPendingDeliveries((prev) => prev.slice(1));
      } else {
        setCurrentDelivery(null);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleSkipDelivery = async () => {
    if (!currentDelivery) return;
    setProcessing(true);
    try {
      await api.put(`/deliveries/${currentDelivery.id}/status`, {
        status: "skipped",
        skipReason,
      });
      toast.success("Delivery skipped");
      setShowSkipModal(false);
      setSkipReason("");

      setStats((prev) => ({
        ...prev,
        skipped: prev.skipped + 1,
        pending: prev.pending - 1,
      }));

      if (pendingDeliveries.length > 0) {
        const next = pendingDeliveries[0];
        setCurrentDelivery({
          id: next.id,
          customer: {
            name: next.customer.name,
            phone: "+91 98765 43210",
            address: next.customer.address + ", Coimbatore",
          },
          items: next.items.map((item) => ({
            name: item,
            quantity: "1",
            price: 60,
          })),
          totalAmount: 100,
          estimatedTime: "5 mins",
          distance: next.distance,
        });
        setPendingDeliveries((prev) => prev.slice(1));
      } else {
        setCurrentDelivery(null);
      }
    } catch (error) {
      console.error("Error skipping delivery:", error);
      // Still update UI
      setStats((prev) => ({
        ...prev,
        skipped: prev.skipped + 1,
        pending: prev.pending - 1,
      }));
      setShowSkipModal(false);
      if (pendingDeliveries.length > 0) {
        setCurrentDelivery({
          ...pendingDeliveries[0],
          customer: {
            ...pendingDeliveries[0].customer,
            phone: "+91 98765 43210",
          },
          items: pendingDeliveries[0].items.map((i) => ({
            name: i,
            quantity: "1",
            price: 60,
          })),
          totalAmount: 100,
          estimatedTime: "5 mins",
        });
        setPendingDeliveries((prev) => prev.slice(1));
      } else {
        setCurrentDelivery(null);
      }
    } finally {
      setProcessing(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
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
      <div className="fixed inset-0 -z-10 opacity-30">
        <AnimatedMeshBackground />
      </div>

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-sky-600 via-blue-500 to-primary-600 rounded-3xl p-8 text-white overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FiTruck className="w-6 h-6" />
              </div>
              <span className="text-white/80 text-sm font-medium">
                Delivery Dashboard
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {getGreeting()}, {user?.name?.split(" ")[0]}! 🚚
            </h1>
            <p className="text-white/70 text-sm mb-2">@{user?.username}</p>
            <p className="text-white/80 text-lg">
              You have{" "}
              <span className="font-bold text-yellow-300">{stats.pending}</span>{" "}
              deliveries remaining for today
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/labour/route"
              className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-6 py-4 rounded-2xl font-semibold hover:bg-white/30 transition-all shadow-lg border border-white/20"
            >
              <FiNavigation className="w-5 h-5" />
              View Route Map
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        {[
          {
            label: "Total Today",
            value: stats.totalToday,
            icon: FiPackage,
            gradient: "from-sky-400 to-blue-600",
          },
          {
            label: "Delivered",
            value: stats.delivered,
            icon: FiCheck,
            gradient: "from-green-400 to-emerald-600",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: FiClock,
            gradient: "from-yellow-400 to-orange-500",
          },
          {
            label: "Skipped",
            value: stats.skipped,
            icon: FiX,
            gradient: "from-red-400 to-rose-600",
          },
          {
            label: "Earnings",
            value: stats.earnings,
            icon: FiDollarSign,
            gradient: "from-purple-400 to-violet-600",
            prefix: "₹",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/50"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
            >
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-gray-800">
              {stat.prefix || ""}
              <AnimatedCounter value={stat.value} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-soft border border-white/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-nature-500 rounded-xl flex items-center justify-center">
              <FiZap className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-800">Today's Progress</h3>
          </div>
          <span className="text-2xl font-bold text-primary-600">
            {stats.totalToday > 0
              ? Math.round((stats.delivered / stats.totalToday) * 100)
              : 0}
            %
          </span>
        </div>
        <div className="h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${
                stats.totalToday > 0
                  ? (stats.delivered / stats.totalToday) * 100
                  : 0
              }%`,
            }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-primary-500 via-nature-500 to-green-500 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-3 text-sm">
          <span className="text-gray-500">
            <span className="font-bold text-green-600">{stats.delivered}</span>{" "}
            delivered
          </span>
          <span className="text-gray-500">
            <span className="font-bold text-yellow-600">{stats.pending}</span>{" "}
            remaining
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Current Delivery */}
        <div className="lg:col-span-2">
          {currentDelivery ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft overflow-hidden border border-white/50">
              <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-nature-500 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <FiTruck className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">Current Delivery</span>
                  <span className="ml-auto px-3 py-1 bg-green-400/20 rounded-full text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Active
                  </span>
                </div>
                <h2 className="text-3xl font-bold">
                  {currentDelivery.customer.name}
                </h2>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-3 px-4 py-3 bg-sky-50 rounded-xl border border-sky-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                      <FiMapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Distance
                      </p>
                      <p className="font-bold text-gray-800">
                        {currentDelivery.distance}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                      <FiClock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">ETA</p>
                      <p className="font-bold text-gray-800">
                        {currentDelivery.estimatedTime}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${currentDelivery.customer.phone}`}
                    className="flex items-center gap-3 px-4 py-3 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center shadow-md">
                      <FiPhone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Call Customer
                      </p>
                      <p className="font-bold text-gray-800">
                        {currentDelivery.customer.phone}
                      </p>
                    </div>
                  </a>
                </div>

                {/* Address */}
                <div className="p-4 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mt-0.5">
                      <FiMapPin className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Delivery Address
                      </p>
                      <p className="font-semibold text-gray-800">
                        {currentDelivery.customer.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FiPackage className="w-4 h-4" /> Items to Deliver
                  </h4>
                  <div className="space-y-2">
                    {currentDelivery.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {item.name.includes("Milk")
                              ? "🥛"
                              : item.name.includes("Curd")
                              ? "🥣"
                              : item.name.includes("Ghee")
                              ? "🧈"
                              : "📦"}
                          </span>
                          <span className="font-semibold text-gray-800">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-gray-600 bg-white px-3 py-1 rounded-lg">
                            {item.quantity}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-primary-50 rounded-xl border border-primary-100 flex items-center justify-between">
                    <span className="font-semibold text-gray-700">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{currentDelivery.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      currentDelivery.customer.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-700 transition-all"
                  >
                    <FiNavigation className="w-5 h-5" />
                    Navigate
                  </a>
                  <button
                    onClick={() => setShowSkipModal(true)}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-orange-100 hover:bg-orange-200 rounded-xl font-semibold text-orange-700 transition-all"
                  >
                    <FiSkipForward className="w-5 h-5" />
                    Skip
                  </button>
                  <button
                    onClick={handleMarkDelivered}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary-500 to-nature-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {processing ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiCheck className="w-5 h-5" />
                    )}
                    Mark Delivered
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-soft p-12 text-center border border-green-100">
              <div className="text-7xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                All Done!
              </h2>
              <p className="text-gray-500 text-lg">
                You've completed all deliveries for today
              </p>
              <div className="mt-6 p-4 bg-white/60 rounded-2xl inline-block">
                <p className="text-sm text-gray-500">Today's Earnings</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{stats.earnings}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pending Queue */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft overflow-hidden border border-white/50">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-nature-500 rounded-xl flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Next in Queue
                </h2>
                <p className="text-sm text-gray-500">
                  {pendingDeliveries.length} deliveries remaining
                </p>
              </div>
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {pendingDeliveries.map((delivery, index) => (
              <div
                key={delivery.id}
                className="p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        {delivery.customer.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {delivery.customer.address}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <FiPackage className="w-3 h-3" />
                        {delivery.items.join(", ")}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary-600">
                    {delivery.distance}
                  </span>
                </div>
              </div>
            ))}

            {pendingDeliveries.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiCheck className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-gray-500 font-medium">
                  No pending deliveries!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skip Modal */}
      <AnimatePresence>
        {showSkipModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSkipModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <FiSkipForward className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Skip Delivery
                  </h2>
                  <p className="text-sm text-gray-500">
                    Please provide a reason
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <select
                  value={skipReason}
                  onChange={(e) => setSkipReason(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="">Select a reason</option>
                  <option value="customer_not_available">
                    Customer not available
                  </option>
                  <option value="address_not_found">Address not found</option>
                  <option value="customer_request">
                    Customer requested to skip
                  </option>
                  <option value="out_of_stock">Product out of stock</option>
                  <option value="other">Other</option>
                </select>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowSkipModal(false)}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSkipDelivery}
                    disabled={!skipReason || processing}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50"
                  >
                    {processing ? "Processing..." : "Skip Delivery"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LabourDashboard;
