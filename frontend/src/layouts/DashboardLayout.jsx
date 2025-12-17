import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiTruck,
  FiFileText,
  FiUser,
  FiMap,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiMenu,
  FiX,
  FiLogOut,
  FiBell,
  FiDollarSign,
} from "react-icons/fi";
import { useAuthStore } from "../store/authStore";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Navigation items based on role
  const getNavItems = () => {
    switch (user?.role) {
      case "admin":
        return [
          { path: "/admin", icon: FiHome, label: "Dashboard", exact: true },
          { path: "/admin/users", icon: FiUsers, label: "Users" },
          { path: "/admin/products", icon: FiPackage, label: "Products" },
          { path: "/admin/routes", icon: FiMap, label: "Routes" },
          { path: "/admin/billing", icon: FiFileText, label: "Billing" },
          { path: "/admin/analytics", icon: FiBarChart2, label: "Analytics" },
        ];
      case "labour":
        return [
          { path: "/labour", icon: FiHome, label: "Dashboard", exact: true },
          { path: "/labour/route", icon: FiMap, label: "My Route" },
          { path: "/labour/deliveries", icon: FiTruck, label: "Deliveries" },
        ];
      default:
        return [
          { path: "/dashboard", icon: FiHome, label: "Dashboard", exact: true },
          { path: "/dashboard/orders", icon: FiPackage, label: "My Orders" },
          { path: "/dashboard/deliveries", icon: FiTruck, label: "Deliveries" },
          { path: "/dashboard/bills", icon: FiFileText, label: "Bills" },
          { path: "/dashboard/profile", icon: FiUser, label: "Profile" },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🥛</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-800">Muthujaya</h1>
                <p className="text-xs text-gray-500">Dairy Farm</p>
              </div>
            </div>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex-none">
              <h2 className="text-lg font-semibold text-gray-800 lg:hidden">
                Muthujaya Dairy
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <FiBell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Hi,</span>
                <span className="text-sm font-semibold text-gray-800">
                  {user?.name?.split(" ")[0]}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
