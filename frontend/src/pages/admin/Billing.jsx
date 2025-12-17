import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  FiSearch,
  FiDownload,
  FiMail,
  FiPhone,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiX,
  FiFilter,
  FiFileText,
  FiDollarSign,
  FiCalendar,
  FiSend,
  FiPrinter,
  FiTrendingUp,
  FiPercent,
} from "react-icons/fi";
import { AnimatedMeshBackground } from "../../components/ui/AnimatedBackground";

// Animated Counter Component
const AnimatedCounter = ({ value, prefix = "", suffix = "" }) => {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(
    spring,
    (val) => prefix + Math.floor(val).toLocaleString() + suffix
  );

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

const AdminBilling = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderBill, setReminderBill] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    setTimeout(() => {
      setBills([
        {
          id: "BILL001",
          invoiceNo: "INV-2024-001",
          customerId: "USR001",
          customerName: "Priya Sharma",
          phone: "9876543210",
          email: "priya@example.com",
          address: "12, Anna Nagar, Chennai",
          month: "January 2024",
          items: [
            {
              name: "Cow Milk",
              quantity: 30,
              unit: "L",
              price: 60,
              total: 1800,
            },
            {
              name: "Fresh Curd",
              quantity: 4,
              unit: "kg",
              price: 80,
              total: 320,
            },
          ],
          subtotal: 2120,
          discount: 0,
          total: 2120,
          paidAmount: 2120,
          dueAmount: 0,
          status: "paid",
          dueDate: "2024-02-05",
          paidDate: "2024-02-03",
          paymentMethod: "UPI",
        },
        {
          id: "BILL002",
          invoiceNo: "INV-2024-002",
          customerId: "USR002",
          customerName: "Rajesh Kumar",
          phone: "9876543211",
          email: "rajesh@example.com",
          address: "45, T. Nagar, Chennai",
          month: "January 2024",
          items: [
            {
              name: "Buffalo Milk",
              quantity: 45,
              unit: "L",
              price: 70,
              total: 3150,
            },
            {
              name: "Pure Ghee",
              quantity: 0.5,
              unit: "kg",
              price: 600,
              total: 300,
            },
          ],
          subtotal: 3450,
          discount: 100,
          total: 3350,
          paidAmount: 2000,
          dueAmount: 1350,
          status: "partial",
          dueDate: "2024-02-05",
          paidDate: "2024-02-01",
          paymentMethod: "Card",
        },
        {
          id: "BILL003",
          invoiceNo: "INV-2024-003",
          customerId: "USR003",
          customerName: "Lakshmi Devi",
          phone: "9876543212",
          email: "lakshmi@example.com",
          address: "78, Velachery, Chennai",
          month: "January 2024",
          items: [
            {
              name: "Cow Milk",
              quantity: 60,
              unit: "L",
              price: 60,
              total: 3600,
            },
            {
              name: "Buttermilk",
              quantity: 10,
              unit: "L",
              price: 30,
              total: 300,
            },
          ],
          subtotal: 3900,
          discount: 200,
          total: 3700,
          paidAmount: 0,
          dueAmount: 3700,
          status: "pending",
          dueDate: "2024-02-05",
          paidDate: null,
          paymentMethod: null,
        },
        {
          id: "BILL004",
          invoiceNo: "INV-2024-004",
          customerId: "USR004",
          customerName: "Suresh M",
          phone: "9876543213",
          email: "suresh@example.com",
          address: "23, Adyar, Chennai",
          month: "January 2024",
          items: [
            {
              name: "Cow Milk",
              quantity: 25,
              unit: "L",
              price: 60,
              total: 1500,
            },
            {
              name: "Fresh Paneer",
              quantity: 1,
              unit: "kg",
              price: 320,
              total: 320,
            },
          ],
          subtotal: 1820,
          discount: 0,
          total: 1820,
          paidAmount: 0,
          dueAmount: 1820,
          status: "overdue",
          dueDate: "2024-01-25",
          paidDate: null,
          paymentMethod: null,
        },
        {
          id: "BILL005",
          invoiceNo: "INV-2024-005",
          customerId: "USR005",
          customerName: "Anitha R",
          phone: "9876543214",
          email: "anitha@example.com",
          address: "56, Porur, Chennai",
          month: "January 2024",
          items: [
            {
              name: "Buffalo Milk",
              quantity: 20,
              unit: "L",
              price: 70,
              total: 1400,
            },
          ],
          subtotal: 1400,
          discount: 50,
          total: 1350,
          paidAmount: 1350,
          dueAmount: 0,
          status: "paid",
          dueDate: "2024-02-05",
          paidDate: "2024-02-02",
          paymentMethod: "Net Banking",
        },
      ]);
      setLoading(false);
    }, 500);
  };

  const statusOptions = ["all", "paid", "pending", "partial", "overdue"];
  const dateOptions = ["all", "today", "week", "month"];

  const filteredBills = bills.filter((b) => {
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    totalBills: bills.length,
    totalRevenue: bills.reduce((sum, b) => sum + b.total, 0),
    collected: bills.reduce((sum, b) => sum + b.paidAmount, 0),
    pending: bills.reduce((sum, b) => sum + b.dueAmount, 0),
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700";
      case "pending":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700";
      case "partial":
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700";
      case "overdue":
        return "bg-gradient-to-r from-rose-100 to-red-100 text-rose-700";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <FiCheckCircle className="w-4 h-4" />;
      case "pending":
        return <FiClock className="w-4 h-4" />;
      case "partial":
        return <FiCreditCard className="w-4 h-4" />;
      case "overdue":
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleSendReminder = (bill) => {
    setReminderBill(bill);
    setShowReminderModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-green-200 border-t-green-600"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Premium Animated Background */}
      <AnimatedMeshBackground />

      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 rounded-3xl p-8 shadow-2xl"
      >
        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium">
                {stats.totalBills} Bills
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Billing Management
            </h1>
            <p className="text-white/80">Generate and manage customer bills</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/30 transition-all"
            >
              <FiDownload className="w-4 h-4" />
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 bg-white text-emerald-600 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <FiFileText className="w-4 h-4" />
              Generate Bills
            </motion.button>
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
            label: "Total Bills",
            value: stats.totalBills,
            icon: FiFileText,
            gradient: "from-blue-500 to-indigo-500",
            bgGlow: "bg-blue-500/10",
          },
          {
            label: "Total Revenue",
            value: stats.totalRevenue,
            icon: FiDollarSign,
            gradient: "from-purple-500 to-pink-500",
            bgGlow: "bg-purple-500/10",
            prefix: "₹",
          },
          {
            label: "Collected",
            value: stats.collected,
            icon: FiCheckCircle,
            gradient: "from-green-500 to-emerald-500",
            bgGlow: "bg-green-500/10",
            prefix: "₹",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: FiAlertCircle,
            gradient: "from-rose-500 to-red-500",
            bgGlow: "bg-rose-500/10",
            prefix: "₹",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ y: -4 }}
            className={`relative bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-soft border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300`}
          >
            <div
              className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${stat.bgGlow} blur-2xl`}
            />
            <div className="relative flex items-center gap-4">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    stat.label === "Pending"
                      ? "text-rose-600"
                      : stat.label === "Collected"
                      ? "text-green-600"
                      : "text-gray-800"
                  }`}
                >
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix || ""}
                  />
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Premium Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-soft border border-white/50"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name or invoice number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {statusOptions.map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-3 rounded-2xl font-medium whitespace-nowrap transition-all capitalize ${
                  statusFilter === status
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Premium Bills Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-5 font-semibold text-gray-600 text-sm uppercase tracking-wider">
                  Invoice
                </th>
                <th className="text-left p-5 font-semibold text-gray-600 text-sm uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left p-5 font-semibold text-gray-600 text-sm uppercase tracking-wider">
                  Month
                </th>
                <th className="text-left p-5 font-semibold text-gray-600 text-sm uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left p-5 font-semibold text-gray-600 text-sm uppercase tracking-wider">
                  Due
                </th>
                <th className="text-left p-5 font-semibold text-gray-600 text-sm uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left p-5 font-semibold text-gray-600 text-sm uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBills.map((bill, index) => (
                <motion.tr
                  key={bill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.03)" }}
                  className="transition-colors group"
                >
                  <td className="p-5">
                    <div>
                      <p className="font-bold text-gray-800">
                        {bill.invoiceNo}
                      </p>
                      <p className="text-sm text-gray-500">
                        Due: {bill.dueDate}
                      </p>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="text-white font-bold">
                          {bill.customerName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {bill.customerName}
                        </p>
                        <p className="text-sm text-gray-500">{bill.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-gray-700 font-medium">
                      {bill.month}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="font-bold text-gray-800 text-lg">
                      ₹{bill.total.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-5">
                    <span
                      className={`font-bold text-lg ${
                        bill.dueAmount > 0 ? "text-rose-600" : "text-green-600"
                      }`}
                    >
                      ₹{bill.dueAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-5">
                    <span
                      className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 capitalize ${getStatusColor(
                        bill.status
                      )}`}
                    >
                      {getStatusIcon(bill.status)}
                      {bill.status}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedBill(bill)}
                        className="p-2.5 bg-gray-100 rounded-xl hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                        title="View Details"
                      >
                        <FiFileText className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 bg-gray-100 rounded-xl hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        title="Print"
                      >
                        <FiPrinter className="w-4 h-4" />
                      </motion.button>
                      {bill.status !== "paid" && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSendReminder(bill)}
                          className="p-2.5 bg-amber-100 rounded-xl hover:bg-amber-200 text-amber-600 transition-colors"
                          title="Send Reminder"
                        >
                          <FiSend className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBills.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-16 text-center"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6">
              <FiFileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No bills found
            </h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </motion.div>
        )}
      </motion.div>

      {/* Premium Bill Details Modal */}
      <AnimatePresence>
        {selectedBill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBill(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Premium Modal Header */}
              <div className="relative bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <FiFileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {selectedBill.invoiceNo}
                      </h2>
                      <p className="text-white/80">{selectedBill.month}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedBill(null)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <FiX className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Customer Info */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 mb-6 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {selectedBill.customerName.charAt(0)}
                      </span>
                    </div>
                    Customer Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Name</p>
                      <p className="font-semibold text-gray-800">
                        {selectedBill.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Phone</p>
                      <p className="font-semibold text-gray-800">
                        {selectedBill.phone}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 font-medium">Address</p>
                      <p className="font-semibold text-gray-800">
                        {selectedBill.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-4">Items</h3>
                  <div className="bg-gray-50 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-200 bg-gray-100">
                          <th className="p-4 font-semibold">Item</th>
                          <th className="p-4 font-semibold">Qty</th>
                          <th className="p-4 font-semibold">Price</th>
                          <th className="p-4 text-right font-semibold">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBill.items.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="p-4 font-semibold text-gray-800">
                              {item.name}
                            </td>
                            <td className="p-4 text-gray-600">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="p-4 text-gray-600">
                              ₹{item.price}/{item.unit}
                            </td>
                            <td className="p-4 text-right font-bold text-gray-800">
                              ₹{item.total}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ₹{selectedBill.subtotal.toLocaleString()}
                    </span>
                  </div>
                  {selectedBill.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">
                        -₹{selectedBill.discount}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{selectedBill.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Paid</span>
                    <span className="text-green-600 font-semibold">
                      ₹{selectedBill.paidAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                    <span>Due Amount</span>
                    <span
                      className={`text-lg ${
                        selectedBill.dueAmount > 0
                          ? "text-rose-600"
                          : "text-green-600"
                      }`}
                    >
                      ₹{selectedBill.dueAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Status & Payment */}
                <div className="mt-6 flex items-center justify-between">
                  <span
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 capitalize ${getStatusColor(
                      selectedBill.status
                    )}`}
                  >
                    {getStatusIcon(selectedBill.status)}
                    {selectedBill.status}
                  </span>
                  {selectedBill.paymentMethod && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-xl">
                      Paid via{" "}
                      <span className="font-semibold">
                        {selectedBill.paymentMethod}
                      </span>{" "}
                      on {selectedBill.paidDate}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    <FiPrinter className="w-4 h-4" />
                    Print Invoice
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    Download PDF
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Send Reminder Modal */}
      <AnimatePresence>
        {showReminderModal && reminderBill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowReminderModal(false);
              setReminderBill(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Premium Modal Header */}
              <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <FiSend className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Send Payment Reminder
                      </h2>
                      <p className="text-white/80 text-sm">
                        Notify customer about pending payment
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowReminderModal(false);
                      setReminderBill(null);
                    }}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <FiX className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 mb-6 border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                    Customer
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">
                        {reminderBill.customerName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        {reminderBill.customerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {reminderBill.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-rose-50 to-red-50 rounded-2xl border border-rose-100 mb-6"
                >
                  <span className="text-gray-700 font-medium">Due Amount</span>
                  <span className="text-2xl font-bold text-rose-600">
                    ₹{reminderBill.dueAmount.toLocaleString()}
                  </span>
                </motion.div>

                <div className="space-y-3 mb-6">
                  <label className="text-sm font-semibold text-gray-700">
                    Send reminder via:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-5 border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex flex-col items-center justify-center gap-2 text-amber-700 font-semibold shadow-lg shadow-amber-500/10"
                    >
                      <FiPhone className="w-6 h-6" />
                      SMS
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-5 border-2 border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-600 hover:border-amber-500 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 hover:text-amber-700 transition-all"
                    >
                      <FiMail className="w-6 h-6" />
                      Email
                    </motion.button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowReminderModal(false);
                      setReminderBill(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <FiSend className="w-4 h-4" />
                    Send Reminder
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBilling;
