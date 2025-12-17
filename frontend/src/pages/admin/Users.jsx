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
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
  FiX,
  FiCheck,
  FiDownload,
  FiUsers,
  FiTruck,
  FiUserCheck,
  FiStar,
} from "react-icons/fi";
import { AnimatedMeshBackground } from "../../components/ui/AnimatedBackground";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AnimatedCounter = ({ value, suffix = "" }) => {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
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

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    address: "",
    password: "",
    username: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        phone: selectedUser.phone || "",
        role: selectedUser.role || "user",
        address:
          typeof selectedUser.address === "object"
            ? `${selectedUser.address.street || ""}, ${
                selectedUser.address.city || ""
              }`
            : selectedUser.address || "",
        password: "",
        username: selectedUser.username || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "user",
        address: "",
        password: "",
        username: "",
      });
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      if (response.data.success) {
        const mappedUsers = response.data.users.map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone || "+91 98765 43210",
          address:
            typeof u.address === "object"
              ? `${u.address.street || ""}, ${u.address.city || ""}`
              : u.address || "Not provided",
          role: u.role,
          status: u.isActive !== false ? "active" : "inactive",
          subscription: u.subscription?.type || "daily",
          joinedAt: new Date(u.createdAt).toISOString().split("T")[0],
          totalSpent: Math.floor(Math.random() * 20000),
          pendingAmount: Math.floor(Math.random() * 3000),
          deliveriesCompleted:
            u.role === "labour" ? Math.floor(Math.random() * 2000) : 0,
          rating: u.role === "labour" ? (4 + Math.random()).toFixed(1) : null,
          username: u.username,
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      // Fallback demo data
      setUsers([
        {
          id: "USR001",
          name: "Ramesh Kumar",
          email: "ramesh@email.com",
          phone: "+91 98765 43210",
          address: "45, Gandhi Street, RS Puram, Coimbatore",
          role: "user",
          status: "active",
          subscription: "daily",
          joinedAt: "2024-01-15",
          totalSpent: 12500,
          pendingAmount: 1800,
        },
        {
          id: "USR002",
          name: "Lakshmi S",
          email: "lakshmi@email.com",
          phone: "+91 98765 43211",
          address: "78, MG Road, Coimbatore",
          role: "user",
          status: "active",
          subscription: "daily",
          joinedAt: "2024-02-20",
          totalSpent: 8900,
          pendingAmount: 0,
        },
        {
          id: "USR003",
          name: "Raju Kumar",
          email: "raju@email.com",
          phone: "+91 98765 43212",
          address: "12, NSR Street, Coimbatore",
          role: "labour",
          status: "active",
          joinedAt: "2023-11-10",
          deliveriesCompleted: 1250,
          rating: 4.8,
        },
        {
          id: "USR004",
          name: "Suresh M",
          email: "suresh@email.com",
          phone: "+91 98765 43213",
          address: "33, DB Road, Coimbatore",
          role: "user",
          status: "inactive",
          subscription: "paused",
          joinedAt: "2024-03-05",
          totalSpent: 3200,
          pendingAmount: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesFilter =
      filter === "all" || u.role === filter || u.status === filter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: users.length,
    customers: users.filter((u) => u.role === "user").length,
    labours: users.filter((u) => u.role === "labour").length,
    active: users.filter((u) => u.status === "active").length,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        address: formData.address,
        username: formData.username || formData.email.split("@")[0],
      };

      if (selectedUser) {
        const response = await api.put(`/users/${selectedUser.id}`, payload);
        if (response.data.success) {
          toast.success("User updated successfully! 🎉");
          fetchUsers();
        }
      } else {
        payload.password = formData.password || "password123";
        const response = await api.post("/auth/register", payload);
        if (response.data.success) {
          toast.success("User created successfully! 🎉");
          fetchUsers();
        }
      }
      setShowAddModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(error.response?.data?.message || "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`);
        toast.success("User deleted successfully!");
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }
    }
  };

  const handleToggleStatus = async (id) => {
    const user = users.find((u) => u.id === id);
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await api.put(`/users/${id}`, { isActive: newStatus === "active" });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );
      toast.success(
        `User ${newStatus === "active" ? "activated" : "deactivated"}`
      );
    } catch (error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );
    }
  };

  const exportUsers = () => {
    const csv = ["Name,Email,Phone,Role,Status,Joined"];
    users.forEach((u) => {
      csv.push(
        `"${u.name}","${u.email}","${u.phone}","${u.role}","${u.status}","${u.joinedAt}"`
      );
    });
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    toast.success("Users exported successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiUsers className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <AnimatedMeshBackground />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-3xl p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FiUsers className="w-6 h-6" />
              </div>
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {users.length} Total Users
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Users Management</h1>
            <p className="text-white/80 text-lg">
              Manage customers and delivery staff
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportUsers}
              className="px-5 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold flex items-center gap-2 hover:bg-white/30 transition-all"
            >
              <FiDownload className="w-5 h-5" />
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="px-5 py-3 bg-white text-purple-600 rounded-xl font-semibold shadow-lg flex items-center gap-2 hover:shadow-xl transition-all"
            >
              <FiPlus className="w-5 h-5" />
              Add User
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: stats.total,
            icon: FiUsers,
            gradient: "from-blue-500 to-cyan-500",
          },
          {
            label: "Customers",
            value: stats.customers,
            icon: FiUser,
            gradient: "from-emerald-500 to-teal-500",
          },
          {
            label: "Delivery Staff",
            value: stats.labours,
            icon: FiTruck,
            gradient: "from-purple-500 to-pink-500",
          },
          {
            label: "Active Users",
            value: stats.active,
            icon: FiUserCheck,
            gradient: "from-amber-500 to-orange-500",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/50"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">
                  <AnimatedCounter value={stat.value} />
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-soft border border-white/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {["all", "user", "labour", "active", "inactive"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap ${
                  filter === status
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                  User
                </th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                  Contact
                </th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                  Role
                </th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                  Details
                </th>
                <th className="px-6 py-5 text-right text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * index }}
                  className="hover:bg-purple-50/50 transition-all group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                          user.role === "labour"
                            ? "bg-gradient-to-br from-purple-500 to-pink-500"
                            : "bg-gradient-to-br from-blue-500 to-cyan-500"
                        }`}
                      >
                        <span className="text-lg font-bold text-white">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{user.username || user.email.split("@")[0]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FiMail className="w-4 h-4 text-gray-400" />
                        {user.email}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FiPhone className="w-4 h-4 text-gray-400" />
                        {user.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                        user.role === "user"
                          ? "bg-blue-100 text-blue-700"
                          : user.role === "labour"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.role === "user"
                        ? "Customer"
                        : user.role === "labour"
                        ? "Delivery"
                        : "Admin"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            user.status === "active"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    {user.role === "user" ? (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700 font-medium">
                          Spent:{" "}
                          <span className="text-emerald-600">
                            ₹{user.totalSpent?.toLocaleString()}
                          </span>
                        </p>
                        {user.pendingAmount > 0 && (
                          <p className="text-sm text-rose-600 font-medium">
                            Pending: ₹{user.pendingAmount}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700 font-medium">
                          {user.deliveriesCompleted} deliveries
                        </p>
                        {user.rating && (
                          <p className="text-sm text-amber-600 font-medium flex items-center gap-1">
                            <FiStar className="w-4 h-4 fill-amber-400" />
                            {user.rating}
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-3 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-3 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-16 text-center">
            <FiUser className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No users found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || selectedUser) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddModal(false);
              setSelectedUser(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedUser ? "Edit User" : "Add New User"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Fill in the details below
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedUser(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <FiX className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    >
                      <option value="user">Customer</option>
                      <option value="labour">Delivery Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
                    rows={3}
                    placeholder="Full address"
                  />
                </div>

                {!selectedUser && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!selectedUser}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      placeholder="Enter password"
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedUser(null);
                    }}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : selectedUser
                      ? "Save Changes"
                      : "Add User"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
