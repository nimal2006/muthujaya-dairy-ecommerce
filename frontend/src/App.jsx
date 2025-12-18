import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

// Layouts (loaded immediately)
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Critical Pages (loaded immediately)
import Home from "./pages/Home";
import Login from "./pages/Login";

// Cart Components (loaded immediately for UX)
import { CartDrawer, FloatingCartButton } from "./components/CartDrawer";

// Lazy-loaded Pages (code splitting for performance)
const Register = lazy(() => import("./pages/Register"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));

// User Pages
const UserDashboard = lazy(() => import("./pages/user/Dashboard"));
const UserDeliveries = lazy(() => import("./pages/user/Deliveries"));
const UserBills = lazy(() => import("./pages/user/Bills"));
const UserProfile = lazy(() => import("./pages/user/Profile"));
const UserOrders = lazy(() => import("./pages/user/Orders"));

// Labour Pages
const LabourDashboard = lazy(() => import("./pages/labour/Dashboard"));
const LabourRoute = lazy(() => import("./pages/labour/Route"));
const LabourDeliveries = lazy(() => import("./pages/labour/Deliveries"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminRoutes = lazy(() => import("./pages/admin/Routes"));
const AdminBilling = lazy(() => import("./pages/admin/Billing"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { user, isAuthenticated } = useAuthStore();

  // Redirect authenticated users to their dashboard
  const getDashboardRoute = () => {
    if (!isAuthenticated) return "/";
    switch (user?.role) {
      case "admin":
        return "/admin";
      case "labour":
        return "/labour";
      default:
        return "/dashboard";
    }
  };

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "12px",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Cart Drawer - Available globally */}
      <CartDrawer />

      {/* Floating Cart Button - Available globally */}
      <FloatingCartButton />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to={getDashboardRoute()} replace />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to={getDashboardRoute()} replace />
                ) : (
                  <Register />
                )
              }
            />
          </Route>

          {/* User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="deliveries" element={<UserDeliveries />} />
            <Route path="bills" element={<UserBills />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* Labour Routes */}
          <Route
            path="/labour"
            element={
              <ProtectedRoute allowedRoles={["labour"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<LabourDashboard />} />
            <Route path="route" element={<LabourRoute />} />
            <Route path="deliveries" element={<LabourDeliveries />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="routes" element={<AdminRoutes />} />
            <Route path="billing" element={<AdminBilling />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
