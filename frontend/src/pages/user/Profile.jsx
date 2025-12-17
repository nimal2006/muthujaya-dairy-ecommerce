import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
  FiBell,
  FiLock,
  FiCreditCard,
  FiSmartphone,
  FiPlus,
  FiCheck,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { AnimatedMeshBackground } from "../../components/ui/AnimatedBackground";
import api from "../../utils/api";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: { street: "", area: "", city: "", pincode: "" },
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    deliveryAlerts: true,
    billReminders: true,
    promotions: false,
  });
  const [subscription, setSubscription] = useState({
    plan: "daily",
    items: [
      { name: "Fresh Milk", quantity: "1L", enabled: true },
      { name: "Curd", quantity: "500g", enabled: true },
    ],
    preferredTime: "06:30",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || {
          street: "",
          area: "",
          city: "",
          pincode: "",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put(`/users/${user._id || user.id}`, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      if (response.data.success) {
        toast.success("Profile updated successfully! 🎉");
        if (updateUser) updateUser(response.data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    setSaving(true);
    try {
      const response = await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (response.data.success) {
        toast.success("Password changed successfully! 🔐");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Notification settings updated");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "subscription", label: "Subscription", icon: FiCreditCard },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "security", label: "Security", icon: FiLock },
  ];

  return (
    <div className="space-y-8 relative">
      <div className="fixed inset-0 -z-10 opacity-30">
        <AnimatedMeshBackground />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center md:text-left"
      >
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-500">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-nature-500 rounded-3xl p-8 text-white overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl ring-4 ring-white/30 shadow-2xl">
              {user?.name?.charAt(0).toUpperCase() || "👤"}
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <FiCamera className="w-5 h-5 text-primary-600" />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-1">{user?.name || "User"}</h2>
            <p className="text-white/80">{user?.email}</p>
            <p className="text-white/60 text-sm mt-1 flex items-center justify-center md:justify-start gap-1">
              @{user?.username || user?.email?.split("@")[0]}
            </p>
          </div>
          <div className="md:ml-auto">
            <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-lg">
              📦{" "}
              {subscription.plan === "daily"
                ? "Daily Subscription"
                : "Custom Plan"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-primary-500 to-nature-500 text-white shadow-lg"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-nature-500 rounded-xl flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Personal Information
                  </h3>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl font-semibold hover:bg-primary-100 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1 px-4 py-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100"
                    >
                      <FiX className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-nature-500 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50"
                    >
                      {saving ? (
                        "Saving..."
                      ) : (
                        <>
                          <FiSave className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 outline-none transition-all ${
                        !isEditing
                          ? "bg-gray-50 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+91 98765 43210"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 outline-none transition-all ${
                        !isEditing
                          ? "bg-gray-50 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address?.city || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Coimbatore"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 outline-none transition-all ${
                        !isEditing
                          ? "bg-gray-50 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      name="address.street"
                      value={formData.address?.street || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={2}
                      placeholder="Enter your full delivery address"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 outline-none transition-all resize-none ${
                        !isEditing
                          ? "bg-gray-50 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === "subscription" && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-white/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-nature-500 rounded-xl flex items-center justify-center">
                    <FiCreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Current Subscription
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-5 bg-gradient-to-br from-primary-50 to-nature-50 rounded-2xl border border-primary-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Plan Type
                    </p>
                    <p className="text-xl font-bold text-primary-600">
                      Daily Delivery
                    </p>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Preferred Time
                    </p>
                    <select
                      value={subscription.preferredTime}
                      onChange={(e) =>
                        setSubscription((prev) => ({
                          ...prev,
                          preferredTime: e.target.value,
                        }))
                      }
                      className="text-xl font-bold text-gray-700 bg-transparent cursor-pointer focus:outline-none"
                    >
                      <option value="06:00">6:00 AM</option>
                      <option value="06:30">6:30 AM</option>
                      <option value="07:00">7:00 AM</option>
                      <option value="07:30">7:30 AM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-white/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-nature-500 to-primary-500 rounded-xl flex items-center justify-center">
                    <FiCreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Daily Items
                  </h3>
                </div>

                <div className="space-y-4">
                  {subscription.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">
                          {item.name.includes("Milk") ? "🥛" : "🥣"}
                        </span>
                        <div>
                          <p className="font-bold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={() => {
                            const newItems = [...subscription.items];
                            newItems[index].enabled = !newItems[index].enabled;
                            setSubscription((prev) => ({
                              ...prev,
                              items: newItems,
                            }));
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-nature-500"></div>
                      </label>
                    </div>
                  ))}

                  <button className="w-full p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50/50 transition-all flex items-center justify-center gap-2 font-semibold">
                    <FiPlus className="w-5 h-5" />
                    Add More Items
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-nature-500 rounded-xl flex items-center justify-center">
                  <FiBell className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Notification Preferences
                </h3>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <FiSmartphone className="w-4 h-4" />
                    Notification Channels
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        key: "email",
                        label: "Email Notifications",
                        description: "Receive notifications via email",
                      },
                      {
                        key: "sms",
                        label: "SMS Notifications",
                        description: "Receive notifications via SMS",
                      },
                      {
                        key: "push",
                        label: "Push Notifications",
                        description:
                          "Receive push notifications on your device",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key]}
                            onChange={() => handleNotificationChange(item.key)}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-nature-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <FiBell className="w-4 h-4" />
                    Notification Types
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        key: "deliveryAlerts",
                        label: "Delivery Alerts",
                        description: "Get notified about delivery status",
                      },
                      {
                        key: "billReminders",
                        label: "Bill Reminders",
                        description: "Get reminders for pending payments",
                      },
                      {
                        key: "promotions",
                        label: "Promotions & Offers",
                        description: "Receive promotional offers and discounts",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key]}
                            onChange={() => handleNotificationChange(item.key)}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-nature-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-nature-500 rounded-xl flex items-center justify-center">
                  <FiLock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Change Password
                </h3>
              </div>

              <form
                onSubmit={handleChangePassword}
                className="max-w-md space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 outline-none transition-all"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 outline-none transition-all"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 outline-none transition-all"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                  }
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-nature-500 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    "Changing..."
                  ) : (
                    <>
                      <FiLock className="w-4 h-4" />
                      Change Password
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <h4 className="font-bold text-gray-700 mb-4">
                  Account Security
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <FiCheck className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          Email Verified
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
