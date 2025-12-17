import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { FiMenu, FiX, FiArrowRight, FiShoppingCart } from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { getCartCount, toggleCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = getCartCount();

  const { scrollY } = useScroll();
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 253, 248, 0)", "rgba(255, 253, 248, 0.95)"]
  );
  const navBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(20px)"]);
  const navShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 rgba(0,0,0,0)", "0 4px 30px rgba(0, 0, 0, 0.08)"]
  );
  const navBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.8)"]
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!isAuthenticated) return "/login";
    switch (user?.role) {
      case "admin":
        return "/admin";
      case "labour":
        return "/labour";
      default:
        return "/dashboard";
    }
  };

  const navLinks = [
    { name: "Home", href: "/", type: "link" },
    { name: "Shop", href: "/shop", type: "link" },
    { name: "Features", href: "#features", type: "anchor" },
    { name: "About", href: "#about", type: "anchor" },
  ];

  const NavLink = ({ link, index }) => {
    const isActive = location.pathname === link.href;
    const Component = link.type === "link" ? Link : "a";

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="relative"
      >
        <Component
          to={link.type === "link" ? link.href : undefined}
          href={link.type === "anchor" ? link.href : undefined}
          className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
            isActive
              ? "text-primary-600"
              : "text-gray-700 hover:text-primary-600"
          }`}
        >
          {link.name}
          {/* Hover underline effect */}
          <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-400 via-primary-500 to-nature-400 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full" />
          {/* Active glow */}
          {isActive && (
            <motion.span
              layoutId="activeNav"
              className="absolute inset-0 bg-primary-50 rounded-xl -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </Component>
      </motion.div>
    );
  };

  return (
    <>
      <motion.nav
        style={{
          background: navBackground,
          backdropFilter: navBlur,
          WebkitBackdropFilter: navBlur,
          boxShadow: navShadow,
          borderBottom: `1px solid`,
          borderColor: navBorder,
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Premium Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 via-primary-500 to-nature-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300">
                  <span className="text-2xl filter drop-shadow-md">🥛</span>
                </div>
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-nature-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
              </motion.div>
              <div className="hidden sm:block">
                <motion.h1
                  className="font-bold text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                >
                  Muthujaya
                </motion.h1>
                <p className="text-xs text-gray-500 tracking-wider">
                  DAIRY FARM
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link, index) => (
                <NavLink key={link.name} link={link} index={index} />
              ))}
            </div>

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className="hidden md:flex relative p-3 bg-cream-100/80 hover:bg-primary-100 rounded-xl transition-colors mr-2"
            >
              <FiShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary-500 to-nature-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {/* User info */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-xl border border-primary-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-nature-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.name?.split(" ")[0]}
                      </p>
                      <p className="text-xs text-primary-600">
                        @{user?.username || user?.email?.split("@")[0]}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => navigate(getDashboardLink())}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative px-6 py-2.5 bg-gradient-to-r from-primary-500 to-nature-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Dashboard
                      <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-nature-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 hover:bg-primary-50 rounded-xl"
                  >
                    Sign In
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/register"
                      className="relative px-6 py-2.5 bg-gradient-to-r from-primary-500 to-nature-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 overflow-hidden group inline-flex items-center gap-2"
                    >
                      <span className="relative z-10">Get Started</span>
                      <FiArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-r from-nature-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Cart & Menu buttons */}
            <div className="flex md:hidden items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative p-3 rounded-xl bg-cream-100/80 hover:bg-cream-200/80 transition-colors"
              >
                <FiShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary-500 to-nature-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-cream-100/80 hover:bg-cream-200/80 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiX className="w-6 h-6 text-gray-700" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiMenu className="w-6 h-6 text-gray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu - Full Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 h-full w-80 bg-gradient-to-b from-cream-50 to-white shadow-2xl"
            >
              <div className="p-6 pt-24 space-y-2">
                {navLinks.map((link, index) => {
                  const Component = link.type === "link" ? Link : "a";
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Component
                        to={link.type === "link" ? link.href : undefined}
                        href={link.type === "anchor" ? link.href : undefined}
                        className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Component>
                    </motion.div>
                  );
                })}

                <div className="pt-6 mt-6 border-t border-gray-100 space-y-3">
                  {isAuthenticated ? (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      onClick={() => {
                        navigate(getDashboardLink());
                        setIsOpen(false);
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-nature-500 text-white font-semibold rounded-xl shadow-lg"
                    >
                      Go to Dashboard
                    </motion.button>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Link
                          to="/login"
                          className="block w-full px-6 py-3 text-center text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Sign In
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Link
                          to="/register"
                          className="block w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-nature-500 text-white font-semibold rounded-xl shadow-lg text-center"
                          onClick={() => setIsOpen(false)}
                        >
                          Get Started
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
