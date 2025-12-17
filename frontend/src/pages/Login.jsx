import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import {
  AnimatedMeshBackground,
  FloatingMilkDrops,
} from "../components/ui/AnimatedBackground";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    clearError();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.identifier, formData.password);
    if (success) {
      const user = useAuthStore.getState().user;
      if (user?.role === "admin") {
        navigate("/admin");
      } else if (user?.role === "labour") {
        navigate("/labour");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-cream-100 via-milk-warm to-cream-50">
      {/* Premium Animated Background */}
      <AnimatedMeshBackground />
      <FloatingMilkDrops count={6} />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-cream-100/80 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4 py-8">
        {/* Main Card - Premium Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Animated border gradient */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-primary-400 via-nature-400 to-sky-400 rounded-[28px] opacity-50 blur-sm animate-gradient-x" />

          <div className="relative glass-premium rounded-[28px] p-8 shadow-luxury border border-white/30">
            {/* Logo and title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-8"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-3 mb-6 group"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 bg-gradient-to-br from-primary-400 via-primary-500 to-nature-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300"
                >
                  <span className="text-3xl filter drop-shadow-md">🥛</span>
                </motion.div>
                <div className="text-left">
                  <span className="block text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Muthujaya
                  </span>
                  <span className="text-xs text-gray-500 tracking-wider">
                    DAIRY FARM
                  </span>
                </div>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back!
              </h1>
              <p className="text-gray-600">Sign in to continue your journey</p>
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-center gap-3 text-red-600"
              >
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </motion.div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username/Email field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username or Email
                </label>
                <div
                  className={`relative group transition-all duration-300 ${
                    focusedField === "identifier" ? "scale-[1.02]" : ""
                  }`}
                >
                  <div
                    className={`absolute -inset-[1px] bg-gradient-to-r from-primary-400 to-nature-400 rounded-xl opacity-0 ${
                      focusedField === "identifier"
                        ? "opacity-100"
                        : "group-hover:opacity-50"
                    } transition-opacity duration-300 blur-sm`}
                  />
                  <div className="relative">
                    <FiUser
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                        focusedField === "identifier"
                          ? "text-primary-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("identifier")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                      placeholder="Enter username or email"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Password field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div
                  className={`relative group transition-all duration-300 ${
                    focusedField === "password" ? "scale-[1.02]" : ""
                  }`}
                >
                  <div
                    className={`absolute -inset-[1px] bg-gradient-to-r from-primary-400 to-nature-400 rounded-xl opacity-0 ${
                      focusedField === "password"
                        ? "opacity-100"
                        : "group-hover:opacity-50"
                    } transition-opacity duration-300 blur-sm`}
                  />
                  <div className="relative">
                    <FiLock
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                        focusedField === "password"
                          ? "text-primary-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Remember me and forgot password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:border-primary-500 peer-checked:bg-primary-500 transition-all duration-200 group-hover:border-primary-400">
                      <svg
                        className={`w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                          rememberMe ? "opacity-100" : "opacity-0"
                        } transition-opacity`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Submit button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-nature-500 to-primary-500 bg-[length:200%_100%] animate-gradient-x rounded-xl" />
                  <div className="relative flex items-center justify-center gap-2 px-6 py-4 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/30">
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </motion.div>
            </form>

            {/* Sign up link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 text-center text-gray-600"
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all"
              >
                Sign up for free
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
