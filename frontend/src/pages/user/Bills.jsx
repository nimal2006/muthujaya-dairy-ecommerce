import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiDownload,
  FiEye,
  FiCreditCard,
  FiCalendar,
  FiCheck,
  FiClock,
  FiX,
  FiFileText,
  FiTrendingUp,
  FiArrowRight,
  FiRefreshCw,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useAuthStore } from "../../store/authStore";

// Animated Counter Component
const AnimatedCounter = ({ value, prefix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 50;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
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
    </span>
  );
};

const UserBills = () => {
  const { user } = useAuthStore();
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const response = await api.get("/billing/my-bills");

      if (response.data.success && response.data.data?.length > 0) {
        setBills(response.data.data);
      } else {
        // Fallback to demo data
        setBills(getDemoBills());
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
      // Use demo data on error
      setBills(getDemoBills());
    } finally {
      setLoading(false);
    }
  };

  const getDemoBills = () => [
    {
      id: "BILL-2024-001",
      month: "December 2024",
      period: "01 Dec - 31 Dec 2024",
      totalAmount: 1840,
      paidAmount: 0,
      status: "pending",
      dueDate: "2025-01-05",
      items: [
        { name: "Fresh Milk", quantity: "25L", rate: 60, amount: 1500 },
        { name: "Curd", quantity: "5kg", rate: 80, amount: 400 },
        { name: "Skipped Days", quantity: "2 days", rate: -30, amount: -60 },
      ],
      generatedOn: "2024-12-31",
    },
    {
      id: "BILL-2024-002",
      month: "November 2024",
      period: "01 Nov - 30 Nov 2024",
      totalAmount: 1980,
      paidAmount: 1980,
      status: "paid",
      dueDate: "2024-12-05",
      paidOn: "2024-12-02",
      paymentMethod: "UPI",
      items: [
        { name: "Fresh Milk", quantity: "28L", rate: 60, amount: 1680 },
        { name: "Curd", quantity: "4kg", rate: 80, amount: 320 },
        { name: "Skipped Days", quantity: "1 day", rate: -20, amount: -20 },
      ],
      generatedOn: "2024-11-30",
    },
    {
      id: "BILL-2024-003",
      month: "October 2024",
      period: "01 Oct - 31 Oct 2024",
      totalAmount: 2100,
      paidAmount: 2100,
      status: "paid",
      dueDate: "2024-11-05",
      paidOn: "2024-11-01",
      paymentMethod: "Cash",
      items: [
        { name: "Fresh Milk", quantity: "30L", rate: 60, amount: 1800 },
        { name: "Curd", quantity: "3kg", rate: 80, amount: 240 },
        { name: "Ghee", quantity: "250g", rate: 600, amount: 150 },
        { name: "Skipped Days", quantity: "3 days", rate: -30, amount: -90 },
      ],
      generatedOn: "2024-10-31",
    },
  ];

  const filteredBills = bills.filter((bill) => {
    if (filter === "all") return true;
    return bill.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <span className="px-4 py-1.5 bg-gradient-to-r from-nature-100 to-primary-100 text-nature-700 rounded-full text-sm font-semibold flex items-center gap-1">
            <FiCheck className="w-3.5 h-3.5" /> Paid
          </span>
        );
      case "pending":
        return (
          <span className="px-4 py-1.5 bg-gradient-to-r from-warm-100 to-yellow-100 text-yellow-700 rounded-full text-sm font-semibold flex items-center gap-1">
            <FiClock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case "overdue":
        return (
          <span className="px-4 py-1.5 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 rounded-full text-sm font-semibold flex items-center gap-1">
            <FiX className="w-3.5 h-3.5" /> Overdue
          </span>
        );
      default:
        return null;
    }
  };

  const handlePayment = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const processPayment = async (method) => {
    try {
      // Try to record payment via API
      const response = await api.post(`/payments/record`, {
        billId: selectedBill.id || selectedBill._id,
        amount: selectedBill.totalAmount - (selectedBill.paidAmount || 0),
        paymentMethod: method,
      });

      if (response.data.success) {
        toast.success("Payment recorded successfully! 🎉", { duration: 5000 });
      }
    } catch (error) {
      console.log("Payment API not available, updating locally");
    }

    // Update bill status locally
    setBills((prev) =>
      prev.map((b) =>
        b.id === selectedBill.id || b._id === selectedBill._id
          ? {
              ...b,
              status: "paid",
              paidAmount: b.totalAmount,
              paidOn: new Date().toISOString(),
              paymentMethod: method,
            }
          : b
      )
    );

    setShowPaymentModal(false);
    toast.success(
      "Payment confirmation received! We'll verify and update your bill shortly.",
      { duration: 5000, icon: "✅" }
    );
  };

  const downloadPDF = (bill) => {
    // Generate a simple text-based invoice that can be printed
    const invoiceContent = `
=====================================
    MUTHUJAYA DAIRY FARM
    "Nambi vanga sandhosam ah ponga"
=====================================

BILL INVOICE
------------
Bill ID: ${bill.id}
Period: ${bill.period}
Generated: ${bill.generatedOn}
Status: ${bill.status.toUpperCase()}

CUSTOMER DETAILS
----------------
Bill For: ${bill.month}

ITEMS
-----
${bill.items
  .map(
    (item) =>
      `${item.name.padEnd(20)} ${item.quantity.padEnd(10)} ₹${item.rate
        .toString()
        .padEnd(8)} ₹${item.amount}`
  )
  .join("\n")}

-------------------------------------
TOTAL AMOUNT:                 ₹${bill.totalAmount}
-------------------------------------

${
  bill.status === "paid"
    ? `PAID ON: ${new Date(bill.paidOn).toLocaleDateString()}`
    : `DUE DATE: ${new Date(bill.dueDate).toLocaleDateString()}`
}

PAYMENT INFO
------------
UPI ID: muthujaya@upi
Phone: +91 XXXXX XXXXX

Thank you for choosing Muthujaya Dairy Farm!
=====================================
    `;

    // Create blob and download
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MuthujayaDairy_${bill.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Invoice downloaded successfully!", { icon: "📄" });
  };

  const totalPending = bills
    .filter((b) => b.status === "pending")
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const totalPaid = bills
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);

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
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-primary-600 to-nature-600 p-8"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-float-slow" />
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-nature-400/20 rounded-full blur-3xl animate-float-slow"
            style={{ animationDelay: "-3s" }}
          />
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  My Bills
                </h1>
                <p className="text-white/80">View and pay your monthly bills</p>
              </div>
            </div>
          </div>
          {totalPending > 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl"
            >
              <p className="text-sm text-gray-500 mb-1">Total Pending</p>
              <p className="text-3xl font-bold text-red-500">
                <AnimatedCounter value={totalPending} prefix="₹" />
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Premium Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/50 overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-warm-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-warm-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FiClock className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Pending Amount
              </p>
              <p className="text-2xl font-bold text-gray-800">
                <AnimatedCounter value={totalPending} prefix="₹" />
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/50 overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-nature-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-nature-400 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FiCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Paid</p>
              <p className="text-2xl font-bold text-gray-800">
                <AnimatedCounter value={totalPaid} prefix="₹" />
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/50 overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FiFileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Bills</p>
              <p className="text-2xl font-bold text-gray-800">{bills.length}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Premium Filter Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 p-1.5 bg-white/60 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50 w-fit"
      >
        {["all", "pending", "paid"].map((status) => (
          <motion.button
            key={status}
            onClick={() => setFilter(status)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              filter === status
                ? "bg-gradient-to-r from-primary-500 to-nature-500 text-white shadow-lg"
                : "text-gray-600 hover:bg-white/80"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Premium Bills List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredBills.map((bill, index) => (
          <motion.div
            key={bill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -2 }}
            className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft overflow-hidden border border-white/50 hover:shadow-luxury transition-all duration-500"
          >
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100/0 via-primary-100/20 to-nature-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                      bill.status === "paid"
                        ? "bg-gradient-to-br from-nature-400 to-primary-500"
                        : "bg-gradient-to-br from-warm-400 to-orange-500"
                    }`}
                  >
                    <FiFileText className="w-8 h-8" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-800">
                        {bill.month}
                      </h3>
                      {getStatusBadge(bill.status)}
                    </div>
                    <p className="text-sm text-gray-500">{bill.period}</p>
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      Bill ID: {bill.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium">
                      Total Amount
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-nature-600 bg-clip-text text-transparent">
                      ₹{bill.totalAmount}
                    </p>
                    {bill.status === "pending" && (
                      <p className="text-xs text-red-500 font-medium mt-1">
                        Due: {new Date(bill.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    {bill.status === "paid" && (
                      <p className="text-xs text-nature-600 font-medium mt-1">
                        Paid on {new Date(bill.paidOn).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setSelectedBill(
                          selectedBill?.id === bill.id ? null : bill
                        )
                      }
                      className="p-3 bg-gray-100/80 backdrop-blur-sm rounded-xl hover:bg-primary-100 hover:text-primary-600 transition-all duration-300"
                      title="View Details"
                    >
                      <FiEye className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadPDF(bill)}
                      className="p-3 bg-gray-100/80 backdrop-blur-sm rounded-xl hover:bg-sky-100 hover:text-sky-600 transition-all duration-300"
                      title="Download Invoice"
                    >
                      <FiDownload className="w-5 h-5" />
                    </motion.button>
                    {bill.status === "pending" && (
                      <motion.button
                        onClick={() => handlePayment(bill)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative overflow-hidden rounded-xl"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-nature-500 to-primary-500 bg-[length:200%_100%] animate-gradient-x" />
                        <div className="relative flex items-center gap-2 px-6 py-3 text-white font-semibold">
                          <FiCreditCard className="w-5 h-5" />
                          Pay Now
                        </div>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedBill?.id === bill.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-gray-100"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 overflow-x-auto">
                      <table className="w-full min-w-[400px]">
                        <thead>
                          <tr className="text-left text-sm text-gray-500">
                            <th className="pb-3 font-semibold">Item</th>
                            <th className="pb-3 font-semibold">Quantity</th>
                            <th className="pb-3 text-right font-semibold">
                              Rate
                            </th>
                            <th className="pb-3 text-right font-semibold">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {bill.items.map((item, idx) => (
                            <tr key={idx} className="border-t border-gray-100">
                              <td className="py-3 font-medium text-gray-800">
                                {item.name}
                              </td>
                              <td className="py-3 text-gray-600">
                                {item.quantity}
                              </td>
                              <td className="py-3 text-right text-gray-600">
                                ₹{item.rate}
                              </td>
                              <td
                                className={`py-3 text-right font-semibold ${
                                  item.amount < 0
                                    ? "text-nature-600"
                                    : "text-gray-800"
                                }`}
                              >
                                {item.amount < 0 ? "-" : ""}₹
                                {Math.abs(item.amount)}
                              </td>
                            </tr>
                          ))}
                          <tr className="border-t-2 border-gray-200">
                            <td
                              colSpan={3}
                              className="py-4 text-right font-bold text-gray-800 text-lg"
                            >
                              Total
                            </td>
                            <td className="py-4 text-right text-2xl font-bold bg-gradient-to-r from-primary-600 to-nature-600 bg-clip-text text-transparent">
                              ₹{bill.totalAmount}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {bill.status === "paid" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-gradient-to-r from-nature-50 to-primary-50 rounded-xl border border-nature-200"
                      >
                        <div className="flex items-center gap-3 text-nature-700">
                          <div className="w-8 h-8 bg-nature-500 rounded-full flex items-center justify-center">
                            <FiCheck className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold">
                            Payment received via {bill.paymentMethod}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Premium Payment Modal with UPI/QR */}
      <AnimatePresence>
        {showPaymentModal && selectedBill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-white/50 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>

              {/* Decorative gradient */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-primary-400 to-nature-400 rounded-full blur-3xl opacity-30" />

              <div className="relative text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-20 h-20 bg-gradient-to-br from-primary-500 to-nature-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl"
                >
                  <FiCreditCard className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Pay Your Bill
                </h2>
                <p className="text-gray-500">{selectedBill.month}</p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-primary-50 to-nature-50 rounded-2xl p-4 mb-6 text-center border border-primary-100"
              >
                <p className="text-sm text-gray-500 mb-1">Amount to Pay</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-nature-600 bg-clip-text text-transparent">
                  ₹{selectedBill.totalAmount}
                </p>
              </motion.div>

              {/* QR Code Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 mb-6 border-2 border-dashed border-primary-200 text-center"
              >
                <p className="text-sm font-semibold text-gray-700 mb-4">
                  Scan QR Code to Pay
                </p>
                {/* QR Code - Using a placeholder, replace with actual UPI QR generator */}
                <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-lg border border-gray-100 mb-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=muthujaya@upi%26pn=Muthujaya%20Dairy%26am=${selectedBill.totalAmount}%26cu=INR%26tn=Bill%20Payment%20${selectedBill.id}`}
                    alt="UPI QR Code"
                    className="w-full h-full rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Scan with any UPI app
                </div>
              </motion.div>

              {/* Or Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-gray-500">
                    or pay using UPI ID
                  </span>
                </div>
              </div>

              {/* UPI ID Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-5 mb-6 border border-purple-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-xl">📱</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">UPI ID</p>
                      <p className="font-bold text-gray-800">muthujaya@upi</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      navigator.clipboard.writeText("muthujaya@upi");
                      alert("UPI ID copied!");
                    }}
                    className="px-4 py-2 bg-white text-primary-600 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
                  >
                    Copy
                  </motion.button>
                </div>
                <p className="text-xs text-gray-500">
                  Open any UPI app → Send Money → Enter UPI ID → Pay ₹
                  {selectedBill.totalAmount}
                </p>
              </motion.div>

              {/* Payment Apps */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <p className="text-sm text-gray-500 mb-3 text-center">
                  Pay with your favorite app
                </p>
                <div className="flex justify-center gap-4">
                  {[
                    { name: "GPay", color: "bg-blue-500", icon: "G" },
                    { name: "PhonePe", color: "bg-purple-600", icon: "P" },
                    { name: "Paytm", color: "bg-sky-500", icon: "₹" },
                    { name: "BHIM", color: "bg-green-600", icon: "B" },
                  ].map((app) => (
                    <motion.div
                      key={app.name}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="text-center cursor-pointer"
                    >
                      <div
                        className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg mb-1`}
                      >
                        {app.icon}
                      </div>
                      <span className="text-xs text-gray-500">{app.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Confirm Payment Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => processPayment("UPI")}
                className="w-full relative overflow-hidden rounded-2xl group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-nature-500 to-primary-500 bg-[length:200%_100%] animate-gradient-x" />
                <div className="relative flex items-center justify-center gap-2 px-6 py-4 text-white font-semibold">
                  <FiCheck className="w-5 h-5" />
                  I've Completed the Payment
                </div>
              </motion.button>

              <p className="text-xs text-gray-400 text-center mt-4">
                After payment, click above to confirm. We'll verify and update
                your bill status.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserBills;
