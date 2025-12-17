import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";

// Cart Components
import { CartDrawer, FloatingCartButton } from "./components/CartDrawer";

// User Pages
import UserDashboard from "./pages/user/Dashboard";
import UserDeliveries from "./pages/user/Deliveries";
import UserBills from "./pages/user/Bills";
import UserProfile from "./pages/user/Profile";
import UserOrders from "./pages/user/Orders";

// Labour Pages
import LabourDashboard from "./pages/labour/Dashboard";
import LabourRoute from "./pages/labour/Route";
import LabourDeliveries from "./pages/labour/Deliveries";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminProducts from "./pages/admin/Products";
import AdminRoutes from "./pages/admin/Routes";
import AdminBilling from "./pages/admin/Billing";
import AdminAnalytics from "./pages/admin/Analytics";

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
    </Router>
  );
}

export default App;
