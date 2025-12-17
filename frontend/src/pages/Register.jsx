import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiMapPin,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
  FiAlertCircle,
  FiCheck,
  FiShield,
  FiHome,
  FiX,
} from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import {
  AnimatedMeshBackground,
  FloatingMilkDrops,
} from "../components/ui/AnimatedBackground";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      area: "",
      city: "",
      pincode: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    clearError();
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || formData.password.length < 6) {
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;

    const success = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      address: formData.address,
    });

    if (success) {
      navigate("/dashboard");
    }
  };

  const steps = [
    {
      number: 1,
      title: "Personal Info",
      icon: FiUser,
      description: "Tell us about yourself",
    },
    {
      number: 2,
      title: "Security",
      icon: FiShield,
      description: "Protect your account",
    },
    {
      number: 3,
      title: "Address",
      icon: FiHome,
      description: "Where to deliver",
    },
  ];

  const [focusedField, setFocusedField] = useState(null);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-cream-100 via-milk-warm to-cream-50">
      {/* Premium Animated Background */}
      <AnimatedMeshBackground />
      <FloatingMilkDrops count={6} />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-cream-100/80 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg px-4 py-8">
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
                Create Account
              </h1>
              <p className="text-gray-600">
                Join us for fresh dairy delivered daily
              </p>
            </motion.div>

            {/* Premium Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                {/* Progress line background */}
                <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-gray-200/50 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-nature-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${((step - 1) / (steps.length - 1)) * 100}%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>

                {steps.map((s, index) => (
                  <motion.div
                    key={s.number}
                    className="relative z-10 flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      animate={{
                        scale: step === s.number ? 1.15 : 1,
                        boxShadow:
                          step === s.number
                            ? "0 0 20px rgba(34, 197, 94, 0.4)"
                            : "0 0 0 rgba(34, 197, 94, 0)",
                      }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-medium transition-all duration-300
                        ${
                          step >= s.number
                            ? "bg-gradient-to-br from-primary-500 to-nature-500 text-white shadow-lg"
                            : "bg-white/80 text-gray-400 border-2 border-gray-200"
                        }`}
                    >
                      {step > s.number ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        <s.icon className="w-5 h-5" />
                      )}
                    </motion.div>
                    <span
                      className={`mt-2 text-xs font-medium transition-colors ${
                        step >= s.number ? "text-primary-600" : "text-gray-400"
                      }`}
                    >
                      {s.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-center gap-3 text-red-600"
                >
                  <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div
                      className={`relative group transition-all duration-300 ${
                        focusedField === "name" ? "scale-[1.02]" : ""
                      }`}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div
                        className={`absolute -inset-[1px] bg-gradient-to-r from-primary-400 to-nature-400 rounded-xl opacity-0 ${
                          focusedField === "name"
                            ? "opacity-100"
                            : "group-hover:opacity-50"
                        } transition-opacity duration-300 blur-sm`}
                        style={{ top: "28px" }}
                      />
                      <div className="relative">
                        <FiUser
                          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                            focusedField === "name"
                              ? "text-primary-500"
                              : "text-gray-400"
                          }`}
                        />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div
                      className={`relative group transition-all duration-300 ${
                        focusedField === "email" ? "scale-[1.02]" : ""
                      }`}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div
                        className={`absolute -inset-[1px] bg-gradient-to-r from-primary-400 to-nature-400 rounded-xl opacity-0 ${
                          focusedField === "email"
                            ? "opacity-100"
                            : "group-hover:opacity-50"
                        } transition-opacity duration-300 blur-sm`}
                        style={{ top: "28px" }}
                      />
                      <div className="relative">
                        <FiMail
                          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                            focusedField === "email"
                              ? "text-primary-500"
                              : "text-gray-400"
                          }`}
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div
                      className={`relative group transition-all duration-300 ${
                        focusedField === "phone" ? "scale-[1.02]" : ""
                      }`}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div
                        className={`absolute -inset-[1px] bg-gradient-to-r from-primary-400 to-nature-400 rounded-xl opacity-0 ${
                          focusedField === "phone"
                            ? "opacity-100"
                            : "group-hover:opacity-50"
                        } transition-opacity duration-300 blur-sm`}
                        style={{ top: "28px" }}
                      />
                      <div className="relative">
                        <FiPhone
                          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                            focusedField === "phone"
                              ? "text-primary-500"
                              : "text-gray-400"
                          }`}
                        />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("phone")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateStep1()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative w-full overflow-hidden mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-nature-500 to-primary-500 bg-[length:200%_100%] animate-gradient-x rounded-xl" />
                      <div className="relative flex items-center justify-center gap-2 px-6 py-4 text-white font-semibold rounded-xl">
                        Continue
                        <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 2: Security */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div
                      className={`relative group transition-all duration-300 ${
                        focusedField === "password" ? "scale-[1.02]" : ""
                      }`}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div
                        className={`absolute -inset-[1px] bg-gradient-to-r from-primary-400 to-nature-400 rounded-xl opacity-0 ${
                          focusedField === "password"
                            ? "opacity-100"
                            : "group-hover:opacity-50"
                        } transition-opacity duration-300 blur-sm`}
                        style={{ top: "28px" }}
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
                          minLength={6}
                          className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors"
                        >
                          {showPassword ? (
                            <FiEyeOff className="w-5 h-5" />
                          ) : (
                            <FiEye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Premium Password Strength Indicator */}
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <motion.div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                              formData.password.length >= level * 2
                                ? formData.password.length >= 8
                                  ? "bg-gradient-to-r from-nature-400 to-primary-400"
                                  : "bg-gradient-to-r from-yellow-400 to-orange-400"
                                : "bg-gray-200"
                            }`}
                            initial={{ scaleX: 0 }}
                            animate={{
                              scaleX:
                                formData.password.length >= level * 2 ? 1 : 0.3,
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formData.password.length < 6
                          ? "Password must be at least 6 characters"
                          : formData.password.length < 8
                          ? "Good password strength"
                          : "Excellent password strength!"}
                      </p>
                    </div>

                    <div
                      className={`relative group transition-all duration-300 ${
                        focusedField === "confirmPassword" ? "scale-[1.02]" : ""
                      }`}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div
                        className={`absolute -inset-[1px] bg-gradient-to-r from-primary-400 to-nature-400 rounded-xl opacity-0 ${
                          focusedField === "confirmPassword"
                            ? "opacity-100"
                            : "group-hover:opacity-50"
                        } transition-opacity duration-300 blur-sm`}
                        style={{ top: "28px" }}
                      />
                      <div className="relative">
                        <FiShield
                          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                            focusedField === "confirmPassword"
                              ? "text-primary-500"
                              : "text-gray-400"
                          }`}
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("confirmPassword")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                          placeholder="Confirm your password"
                        />
                        {formData.confirmPassword && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                          >
                            {formData.password === formData.confirmPassword ? (
                              <FiCheck className="w-5 h-5 text-nature-500" />
                            ) : (
                              <FiX className="w-5 h-5 text-red-500" />
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 flex items-center gap-2"
                        >
                          <FiAlertCircle className="w-4 h-4" />
                          Passwords don't match
                        </motion.p>
                      )}

                    <div className="flex gap-3 mt-6">
                      <motion.button
                        type="button"
                        onClick={prevStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-600 transition-all duration-300"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        disabled={!validateStep2()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative flex-1 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-nature-500 to-primary-500 bg-[length:200%_100%] animate-gradient-x rounded-xl" />
                        <div className="relative flex items-center justify-center gap-2 px-6 py-4 text-white font-semibold rounded-xl">
                          Continue
                          <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Address */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div
                      className={`relative group transition-all duration-300 ${
                        focusedField === "street" ? "scale-[1.02]" : ""
                      }`}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Street Address
                      </label>
                      <div
                        className={`absolute -inset-[1px] bg-gradient-to-r from-primary-400 to-nature-400 rounded-xl opacity-0 ${
                          focusedField === "street"
                            ? "opacity-100"
                            : "group-hover:opacity-50"
                        } transition-opacity duration-300 blur-sm`}
                        style={{ top: "28px" }}
                      />
                      <div className="relative">
                        <FiMapPin
                          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                            focusedField === "street"
                              ? "text-primary-500"
                              : "text-gray-400"
                          }`}
                        />
                        <input
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("street")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                          placeholder="House/Flat No, Street Name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className={`relative group transition-all duration-300 ${
                          focusedField === "area" ? "scale-[1.02]" : ""
                        }`}
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Area
                        </label>
                        <div
                          className={`absolute -inset-[1px] bg-gradient-to-r from-primary-400 to-nature-400 rounded-xl opacity-0 ${
                            focusedField === "area"
                              ? "opacity-100"
                              : "group-hover:opacity-50"
                          } transition-opacity duration-300 blur-sm`}
                          style={{ top: "28px" }}
                        />
                        <input
                          type="text"
                          name="address.area"
                          value={formData.address.area}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("area")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="relative w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                          placeholder="Area/Locality"
                        />
                      </div>
                      <div
                        className={`relative group transition-all duration-300 ${
                          focusedField === "city" ? "scale-[1.02]" : ""
                        }`}
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City
                        </label>
                        <div
                          className={`absolute -inset-[1px] bg-gradient-to-r from-primary-400 to-nature-400 rounded-xl opacity-0 ${
                            focusedField === "city"
                              ? "opacity-100"
                              : "group-hover:opacity-50"
                          } transition-opacity duration-300 blur-sm`}
                          style={{ top: "28px" }}
                        />
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("city")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="relative w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                          placeholder="City"
                        />
                      </div>
                    </div>

                    <div
                      className={`relative group transition-all duration-300 ${
                        focusedField === "pincode" ? "scale-[1.02]" : ""
                      }`}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pincode
                      </label>
                      <div
                        className={`absolute -inset-[1px] bg-gradient-to-r from-primary-400 to-nature-400 rounded-xl opacity-0 ${
                          focusedField === "pincode"
                            ? "opacity-100"
                            : "group-hover:opacity-50"
                        } transition-opacity duration-300 blur-sm`}
                        style={{ top: "28px" }}
                      />
                      <input
                        type="text"
                        name="address.pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("pincode")}
                        onBlur={() => setFocusedField(null)}
                        required
                        pattern="[0-9]{6}"
                        className="relative w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                        placeholder="6-digit pincode"
                      />
                    </div>

                    {/* Premium Terms and Conditions Checkbox */}
                    <motion.label
                      whileHover={{ scale: 1.01 }}
                      className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                        agreed
                          ? "border-primary-400 bg-primary-50/50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`relative w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                          agreed
                            ? "border-primary-500 bg-gradient-to-br from-primary-500 to-nature-500"
                            : "border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="sr-only"
                        />
                        {agreed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <FiCheck className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600 leading-relaxed">
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </motion.label>

                    <div className="flex gap-3 mt-6">
                      <motion.button
                        type="button"
                        onClick={prevStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-600 transition-all duration-300"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isLoading || !agreed}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative flex-1 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-nature-500 to-primary-500 bg-[length:200%_100%] animate-gradient-x rounded-xl" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </div>
                        <div className="relative flex items-center justify-center gap-2 px-6 py-4 text-white font-semibold rounded-xl">
                          {isLoading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              />
                              Creating Account...
                            </>
                          ) : (
                            <>
                              Create Account
                              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Sign in link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center text-gray-600"
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold relative group"
              >
                Sign in
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-nature-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
