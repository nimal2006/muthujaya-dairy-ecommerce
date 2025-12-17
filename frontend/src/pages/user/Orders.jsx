import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiTruck,
  FiCheck,
  FiClock,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiShoppingBag,
  FiArrowRight,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiStar,
  FiDownload,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../utils/api";

// Demo orders data
const getDemoOrders = () => [
  {
    _id: "1",
    orderNumber: "ORD-2024-001",
    status: "delivered",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        productId: { name: "Fresh Cow Milk", image: "🥛" },
        quantity: 2,
        price: 60,
        unit: "L",
      },
      {
        productId: { name: "Fresh Curd", image: "🥣" },
        quantity: 1,
        price: 80,
        unit: "kg",
      },
    ],
    subtotal: 200,
    deliveryFee: 0,
    discount: 20,
    total: 180,
    deliveryAddress: {
      line1: "123 Main Street",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001",
    },
    paymentMethod: "online",
    paymentStatus: "paid",
    deliveryType: "one-time",
  },
  {
    _id: "2",
    orderNumber: "ORD-2024-002",
    status: "out_for_delivery",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        productId: { name: "Buffalo Milk", image: "🦬" },
        quantity: 1,
        price: 70,
        unit: "L",
      },
      {
        productId: { name: "Pure Ghee", image: "🧈" },
        quantity: 0.5,
        price: 600,
        unit: "kg",
      },
    ],
    subtotal: 370,
    deliveryFee: 0,
    discount: 0,
    total: 370,
    deliveryAddress: {
      line1: "456 Park Avenue",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600002",
    },
    paymentMethod: "cod",
    paymentStatus: "pending",
    deliveryType: "one-time",
    deliveryPerson: {
      name: "Ravi Kumar",
      phone: "+91 9876543210",
    },
  },
  {
    _id: "3",
    orderNumber: "ORD-2024-003",
    status: "confirmed",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        productId: { name: "Fresh Cow Milk", image: "🥛" },
        quantity: 1,
        price: 60,
        unit: "L",
      },
    ],
    subtotal: 60,
    deliveryFee: 30,
    discount: 0,
    total: 90,
    deliveryAddress: {
      line1: "789 Lake Road",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600003",
    },
    paymentMethod: "online",
    paymentStatus: "paid",
    deliveryType: "subscription",
    subscriptionDays: ["Mon", "Wed", "Fri"],
  },
  {
    _id: "4",
    orderNumber: "ORD-2024-004",
    status: "cancelled",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    cancelledAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    cancellationReason: "Changed my mind",
    items: [
      {
        productId: { name: "Paneer", image: "🧀" },
        quantity: 1,
        price: 320,
        unit: "kg",
      },
    ],
    subtotal: 320,
    deliveryFee: 30,
    discount: 0,
    total: 350,
    deliveryAddress: {
      line1: "123 Main Street",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001",
    },
    paymentMethod: "online",
    paymentStatus: "refunded",
    deliveryType: "one-time",
  },
];

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: FiClock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
    icon: FiCheck,
  },
  processing: {
    label: "Processing",
    color: "bg-purple-100 text-purple-700",
    icon: FiPackage,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-orange-100 text-orange-700",
    icon: FiTruck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    icon: FiCheck,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: FiX,
  },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders");
      setOrders(response.data.orders || response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders(getDemoOrders());
      toast.success("Showing demo orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "active")
      return [
        "pending",
        "confirmed",
        "processing",
        "out_for_delivery",
      ].includes(order.status);
    if (filter === "completed") return order.status === "delivered";
    if (filter === "cancelled") return order.status === "cancelled";
    return true;
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const OrderCard = ({ order }) => {
    const isExpanded = expandedOrder === order._id;
    const status = statusConfig[order.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Order Header */}
        <div
          onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
          className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-gray-900">
                  {order.orderNumber}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
              </div>

              {/* Order Items Preview */}
              <div className="flex items-center gap-2 mb-2">
                {order.items.slice(0, 3).map((item, idx) => (
                  <span key={idx} className="text-2xl">
                    {item.productId?.image || "📦"}
                  </span>
                ))}
                {order.items.length > 3 && (
                  <span className="text-sm text-gray-500">
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500">
                <FiCalendar className="inline w-4 h-4 mr-1" />
                Ordered on {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">₹{order.total}</p>
              <p className="text-sm text-gray-500">
                {order.items.length} items
              </p>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                className="mt-2"
              >
                <FiChevronDown className="w-5 h-5 text-gray-400 mx-auto" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100"
            >
              <div className="p-4 sm:p-6 space-y-6">
                {/* Order Progress (for active orders) */}
                {order.status !== "cancelled" &&
                  order.status !== "delivered" && (
                    <div className="bg-gradient-to-r from-primary-50 to-nature-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Order Progress
                      </h4>
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        {[
                          "confirmed",
                          "processing",
                          "out_for_delivery",
                          "delivered",
                        ].map((step, idx) => {
                          const stepConfig = statusConfig[step];
                          const StepIcon = stepConfig.icon;
                          const isCompleted =
                            [
                              "pending",
                              "confirmed",
                              "processing",
                              "out_for_delivery",
                              "delivered",
                            ].indexOf(order.status) >=
                            [
                              "pending",
                              "confirmed",
                              "processing",
                              "out_for_delivery",
                              "delivered",
                            ].indexOf(step);
                          const isCurrent = order.status === step;

                          return (
                            <div
                              key={step}
                              className="relative flex items-center gap-4 pb-4"
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                                  isCompleted
                                    ? "bg-gradient-to-r from-primary-500 to-nature-500 text-white"
                                    : "bg-gray-200 text-gray-400"
                                } ${
                                  isCurrent ? "ring-4 ring-primary-100" : ""
                                }`}
                              >
                                <StepIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <p
                                  className={`font-medium ${
                                    isCompleted
                                      ? "text-gray-900"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {stepConfig.label}
                                </p>
                                {isCurrent &&
                                  order.status === "out_for_delivery" &&
                                  order.estimatedDelivery && (
                                    <p className="text-sm text-primary-600">
                                      Expected by{" "}
                                      {new Date(
                                        order.estimatedDelivery
                                      ).toLocaleTimeString("en-IN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* Delivery Person Info */}
                {order.deliveryPerson &&
                  order.status === "out_for_delivery" && (
                    <div className="bg-orange-50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <FiTruck className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.deliveryPerson.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Delivery Partner
                          </p>
                        </div>
                      </div>
                      <a
                        href={`tel:${order.deliveryPerson.phone}`}
                        className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium flex items-center gap-2 hover:bg-orange-200 transition-colors"
                      >
                        <FiPhone className="w-4 h-4" />
                        Call
                      </a>
                    </div>
                  )}

                {/* Items List */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Order Items
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">
                            {item.productId?.image || "📦"}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.productId?.name || "Product"}
                            </p>
                            <p className="text-sm text-gray-500">
                              ₹{item.price}/{item.unit} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>
                        {order.deliveryFee === 0
                          ? "FREE"
                          : `₹${order.deliveryFee}`}
                      </span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{order.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" />
                    Delivery Address
                  </h4>
                  <p className="text-gray-600">
                    {order.deliveryAddress?.line1},{" "}
                    {order.deliveryAddress?.city},{" "}
                    {order.deliveryAddress?.state} -{" "}
                    {order.deliveryAddress?.pincode}
                  </p>
                </div>

                {/* Subscription Info */}
                {order.deliveryType === "subscription" &&
                  order.subscriptionDays && (
                    <div className="bg-primary-50 rounded-xl p-4">
                      <h4 className="font-semibold text-primary-900 mb-2">
                        📅 Subscription Schedule
                      </h4>
                      <div className="flex gap-2">
                        {order.subscriptionDays.map((day) => (
                          <span
                            key={day}
                            className="px-3 py-1 bg-white text-primary-700 rounded-lg text-sm font-medium"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {order.status === "delivered" && (
                    <>
                      <button className="flex-1 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-100 transition-colors">
                        <FiRefreshCw className="w-4 h-4" />
                        Reorder
                      </button>
                      <button className="flex-1 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-yellow-100 transition-colors">
                        <FiStar className="w-4 h-4" />
                        Rate Order
                      </button>
                    </>
                  )}
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                    <FiDownload className="w-4 h-4" />
                    Download Invoice
                  </button>
                </div>

                {/* Cancellation Info */}
                {order.status === "cancelled" && (
                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-red-800">
                      <span className="font-semibold">Cancelled on:</span>{" "}
                      {formatDate(order.cancelledAt)}
                    </p>
                    {order.cancellationReason && (
                      <p className="text-red-600 mt-1">
                        <span className="font-semibold">Reason:</span>{" "}
                        {order.cancellationReason}
                      </p>
                    )}
                    {order.paymentStatus === "refunded" && (
                      <p className="text-green-600 mt-2 font-medium">
                        ✓ Refund processed to original payment method
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
        >
          {[
            { value: "all", label: "All Orders" },
            { value: "active", label: "Active" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                filter === tab.value
                  ? "bg-gradient-to-r from-primary-500 to-nature-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="flex justify-between">
                  <div className="space-y-3">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-2xl"
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === "all"
                ? "You haven't placed any orders yet"
                : `No ${filter} orders to show`}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-nature-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <FiShoppingBag className="w-5 h-5" />
              Start Shopping
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Orders;
