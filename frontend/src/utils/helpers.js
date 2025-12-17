import {
  format,
  formatDistance,
  formatRelative,
  isToday,
  isYesterday,
  isTomorrow,
} from "date-fns";

export const formatDate = (date) => {
  return format(new Date(date), "dd MMM yyyy");
};

export const formatDateTime = (date) => {
  return format(new Date(date), "dd MMM yyyy, hh:mm a");
};

export const formatTime = (date) => {
  return format(new Date(date), "hh:mm a");
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat("en-IN").format(num);
};

export const getRelativeDate = (date) => {
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  if (isTomorrow(d)) return "Tomorrow";
  return formatDate(date);
};

export const getTimeAgo = (date) => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const getStatusColor = (status) => {
  const colors = {
    delivered: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    scheduled: "bg-blue-100 text-blue-700",
    skipped: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
    paid: "bg-green-100 text-green-700",
    partial: "bg-orange-100 text-orange-700",
    overdue: "bg-red-100 text-red-700",
    generated: "bg-blue-100 text-blue-700",
    sent: "bg-purple-100 text-purple-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

export const getStatusIcon = (status) => {
  const icons = {
    delivered: "✅",
    pending: "⏳",
    scheduled: "📅",
    skipped: "❌",
    cancelled: "🚫",
    paid: "✅",
    partial: "🔄",
    overdue: "⚠️",
  };
  return icons[status] || "📋";
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getMonthName = (monthNum) => {
  return months[monthNum - 1] || "";
};
