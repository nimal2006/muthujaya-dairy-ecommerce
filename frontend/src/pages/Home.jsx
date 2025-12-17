import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiTruck,
  FiClock,
  FiMapPin,
  FiSmartphone,
  FiBarChart2,
  FiShield,
  FiArrowRight,
  FiCheck,
  FiPlay,
  FiStar,
  FiHeart,
} from "react-icons/fi";
import {
  AnimatedMeshBackground,
  FloatingMilkDrops,
  GlowCard,
  AnimatedCounter,
  StaggeredReveal,
  StaggeredItem,
} from "../components/ui/AnimatedBackground";

const Home = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const features = [
    {
      icon: FiTruck,
      title: "Daily Fresh Delivery",
      description:
        "Farm-fresh milk delivered to your doorstep every morning before sunrise. Never run out again.",
      color: "from-nature-400 to-nature-600",
      glow: "nature",
    },
    {
      icon: FiClock,
      title: "Flexible Schedule",
      description:
        "Going on vacation? Skip delivery for any day with one tap. No questions, no extra charges.",
      color: "from-sky-400 to-sky-600",
      glow: "sky",
    },
    {
      icon: FiMapPin,
      title: "Live GPS Tracking",
      description:
        "Track your delivery in real-time. Know exactly when your fresh milk will arrive.",
      color: "from-purple-400 to-indigo-600",
      glow: "purple",
    },
    {
      icon: FiSmartphone,
      title: "Smart Notifications",
      description:
        "Get instant SMS & email alerts for deliveries, bills, and payment reminders.",
      color: "from-warm-400 to-orange-500",
      glow: "warm",
    },
    {
      icon: FiBarChart2,
      title: "Consumption Analytics",
      description:
        "Track your usage patterns, monthly spending, and discover insights about your consumption.",
      color: "from-teal-400 to-cyan-600",
      glow: "sky",
    },
    {
      icon: FiShield,
      title: "Secure & Flexible Payments",
      description:
        "Pay online via UPI, cards, or pay in cash. Multiple options for your convenience.",
      color: "from-rose-400 to-red-500",
      glow: "warm",
    },
  ];

  const stats = [
    { number: 10000, suffix: "+", label: "Happy Families", icon: FiHeart },
    { number: 50000, suffix: "+", label: "Deliveries Made", icon: FiTruck },
    { number: 99, suffix: "%", label: "On-time Rate", icon: FiClock },
    { number: 4.9, suffix: "", label: "Customer Rating", icon: FiStar },
  ];

  const products = [
    {
      name: "Fresh Cow Milk",
      price: "₹60",
      unit: "/L",
      image: "🥛",
      popular: true,
      gradient: "from-cream-200 to-cream-100",
    },
    {
      name: "Buffalo Milk",
      price: "₹70",
      unit: "/L",
      image: "🦬",
      gradient: "from-sky-100 to-sky-50",
    },
    {
      name: "Fresh Curd",
      price: "₹80",
      unit: "/kg",
      image: "🥣",
      gradient: "from-nature-100 to-nature-50",
    },
    {
      name: "Pure Ghee",
      price: "₹600",
      unit: "/kg",
      image: "🧈",
      premium: true,
      gradient: "from-warm-200 to-warm-100",
    },
    {
      name: "Buttermilk",
      price: "₹30",
      unit: "/L",
      image: "🥤",
      gradient: "from-cream-100 to-white",
    },
    {
      name: "Fresh Paneer",
      price: "₹320",
      unit: "/kg",
      image: "🧀",
      gradient: "from-cream-200 to-cream-100",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Homemaker",
      text: "The quality of milk is exceptional. My kids love it!",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Business Owner",
      text: "Never missed a single delivery in 2 years. Highly reliable!",
      rating: 5,
    },
    {
      name: "Anita Devi",
      role: "Teacher",
      text: "Fresh, pure, and affordable. Best dairy service in town.",
      rating: 5,
    },
  ];

  return (
    <div className="overflow-hidden bg-gradient-to-b from-cream-100 via-milk-warm to-cream-50">
      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION - Cinematic & Premium
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      >
        {/* Animated Background */}
        <AnimatedMeshBackground />
        <FloatingMilkDrops count={8} />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream-50/80 z-10 pointer-events-none" />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content - Headlines */}
            <div className="text-center lg:text-left">
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-3 px-5 py-2.5 glass-card rounded-full mb-8"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nature-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-nature-500"></span>
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  Trusted by 10,000+ families in Tamil Nadu
                </span>
              </motion.div>

              {/* Main Headline - Cinematic Typography */}
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8"
              >
                <span className="text-gray-900">Farm Fresh</span>
                <br />
                <span className="gradient-text-premium">Pure Goodness</span>
                <br />
                <span className="text-gray-900">Daily.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-xl text-gray-600 mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Experience the purity of farm-fresh milk, delivered to your
                doorstep every morning. Smart billing, flexible schedules,
                real-time tracking.
              </motion.p>

              {/* Tamil Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-lg text-primary-600 font-semibold mb-10 italic flex items-center gap-2 justify-center lg:justify-start"
              >
                <span className="text-2xl">🥰</span>
                "Nambi vanga sandhosam ah ponga"
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              >
                <Link to="/shop" className="group relative inline-flex">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-nature-500 to-sky-500 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-all duration-500 animate-gradient-x"></div>
                  <button className="relative px-8 py-4 bg-gradient-to-r from-primary-500 to-nature-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-3 hover:shadow-xl transition-all duration-300">
                    🛒 Shop Now
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-4 glass-card text-gray-700 font-semibold rounded-xl hover:bg-white/80 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiPlay className="w-5 h-5" />
                  Subscribe & Save
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-wrap gap-6 justify-center lg:justify-start"
              >
                {[
                  "100% Pure & Natural",
                  "No Preservatives",
                  "Farm to Home in 6hrs",
                ].map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <div className="w-5 h-5 rounded-full bg-nature-100 flex items-center justify-center">
                      <FiCheck className="w-3 h-3 text-nature-600" />
                    </div>
                    {badge}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Content - Premium Hero Card */}
            <motion.div
              initial={{ opacity: 0, x: 100, rotateY: -15 }}
              animate={isHeroInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
              transition={{
                duration: 1.2,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative perspective-1000"
            >
              {/* Main Floating Card */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <div className="glass-premium rounded-3xl p-8 shadow-luxury">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Today's Delivery</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Good Morning! ☀️
                      </h3>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nature-400 to-nature-600 flex items-center justify-center shadow-lg animate-pulse-glow">
                      <span className="text-3xl">🥛</span>
                    </div>
                  </div>

                  {/* Delivery Items */}
                  <div className="space-y-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-nature-50 to-nature-100/50 rounded-2xl border border-nature-200/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
                          <span className="text-2xl">🥛</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            Fresh Cow Milk
                          </p>
                          <p className="text-sm text-gray-500">
                            1 Litre • Premium Quality
                          </p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-nature-600">
                        ₹60
                      </span>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-50 to-sky-100/50 rounded-2xl border border-sky-200/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
                          <span className="text-2xl">🥣</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            Fresh Curd
                          </p>
                          <p className="text-sm text-gray-500">
                            500g • Homemade Style
                          </p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-sky-600">
                        ₹40
                      </span>
                    </motion.div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Today's Total</span>
                      <span className="text-3xl font-bold gradient-text">
                        ₹100
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Status Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, y: [0, -10, 0] }}
                transition={{
                  delay: 1,
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 z-20"
              >
                <div className="px-4 py-2 bg-gradient-to-r from-nature-400 to-nature-600 text-white rounded-full font-semibold shadow-lg shadow-nature-500/40 flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  On the way!
                </div>
              </motion.div>

              {/* Floating ETA Card */}
              <motion.div
                animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-6 -left-6 z-20"
              >
                <div className="glass-card rounded-2xl px-5 py-4 shadow-soft-xl flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FiTruck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Arriving in
                    </p>
                    <p className="text-xl font-bold text-gray-800">2 mins</p>
                  </div>
                </div>
              </motion.div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-nature-400/20 rounded-3xl blur-3xl -z-10 animate-pulse-slow" />
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STATS SECTION - Premium Animated Counters
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream-50 to-white" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-100 to-nature-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <div className="absolute inset-0 bg-primary-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">
                  <AnimatedCounter target={stat.number} duration={2} />
                  {stat.suffix}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURES SECTION - Premium Glass Cards
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={featuresRef}
        id="features"
        className="py-24 relative overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-cream-50/50 to-cream-100" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6"
            >
              Why Choose Us
            </motion.span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need,
              <span className="block gradient-text-premium">
                Nothing You Don't
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our smart dairy management system makes your daily milk delivery
              completely hassle-free
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <GlowCard className="h-full p-8 group" glowColor={feature.glow}>
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRODUCTS SECTION - Premium Product Cards
      ═══════════════════════════════════════════════════════════════ */}
      <section id="products" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cream-100 via-white to-cream-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-warm-100 text-warm-700 rounded-full text-sm font-semibold mb-6">
              Our Products
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Premium Dairy,
              <span className="block gradient-text">Farm Fresh Quality</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From our farm to your table – pure, fresh, and delicious dairy
              products
            </p>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div
                  className={`glass-card rounded-3xl p-6 text-center h-full bg-gradient-to-br ${product.gradient} border border-white/60 group-hover:shadow-soft-xl transition-all duration-300`}
                >
                  {product.popular && (
                    <span className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-primary-500 to-nature-500 text-white text-xs font-bold rounded-full shadow-lg">
                      Popular
                    </span>
                  )}
                  {product.premium && (
                    <span className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-warm-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                      Premium
                    </span>
                  )}
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {product.image}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    {product.name}
                  </h3>
                  <p className="text-primary-600 font-bold text-lg">
                    {product.price}
                    <span className="text-gray-500 text-sm font-normal">
                      {product.unit}
                    </span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Products CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-nature-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300"
            >
              Shop All Products
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TESTIMONIALS SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-nature-700" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-nature-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
              Customer Stories
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Loved by Families
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join thousands of happy customers who trust us every morning
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="w-5 h-5 fill-warm-400 text-warm-400"
                    />
                  ))}
                </div>
                <p className="text-white/90 text-lg mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-primary-200 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ABOUT SECTION - Premium Story
      ═══════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cream-50 via-white to-cream-100" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 bg-nature-100 text-nature-700 rounded-full text-sm font-semibold mb-6">
                Our Story
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                About
                <span className="block gradient-text">
                  Muthujaya Dairy Farm
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                For over two decades, Muthujaya Dairy Farm has been serving
                families with the purest, freshest dairy products. Our
                commitment to quality and customer satisfaction has made us a
                trusted name in the community.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We believe in transparent pricing, reliable delivery, and
                building lasting relationships with our customers. Every drop of
                milk we deliver carries our promise of purity.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { number: "20+", label: "Years of Service" },
                  { number: "500+", label: "Healthy Cows" },
                  { number: "50+", label: "Delivery Staff" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-4 glass-card rounded-2xl"
                  >
                    <div className="text-3xl font-bold gradient-text">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Premium Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-premium rounded-3xl p-10 text-center shadow-luxury">
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-[120px] mb-6"
                >
                  🐄
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Farm Fresh Quality
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our cows are fed with natural fodder and cared for with love.
                  The result? Milk that's pure, nutritious, and delicious.
                </p>

                {/* Quality Badges */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  {["FSSAI Certified", "ISO 9001", "Organic"].map(
                    (badge, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-nature-100 text-nature-700 rounded-full text-sm font-medium"
                      >
                        {badge}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Floating decorations */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-nature-200 to-nature-300 rounded-full blur-2xl opacity-50" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-sky-200 to-sky-300 rounded-full blur-2xl opacity-50" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA SECTION - Premium Call to Action
      ═══════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-50 to-white" />

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200/40 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-nature-200/40 rounded-full blur-3xl animate-float-delayed" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6"
            >
              Start Today
            </motion.span>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Ready to Experience
              <span className="block gradient-text-premium">
                Pure Freshness?
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join thousands of happy families who trust Muthujaya Dairy Farm
              for their daily dairy needs. Sign up now and get your first week
              free!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="group relative inline-flex">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-nature-500 to-sky-500 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-all duration-500 animate-gradient-x"></div>
                <button className="relative px-10 py-5 bg-gradient-to-r from-primary-500 to-nature-500 text-white font-bold text-lg rounded-xl shadow-lg flex items-center gap-3 hover:shadow-xl transition-all duration-300">
                  <FiPlay className="w-5 h-5" />
                  Start Free Trial
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <a
                href="tel:+919876543210"
                className="px-10 py-5 glass-card text-gray-700 font-semibold text-lg rounded-xl hover:bg-white/80 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FiPhone className="w-5 h-5" />
                Call Us Now
              </a>
            </div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap gap-8 justify-center text-gray-500 text-sm"
            >
              <span className="flex items-center gap-2">
                <FiCheck className="w-4 h-4 text-nature-500" /> No credit card
                required
              </span>
              <span className="flex items-center gap-2">
                <FiCheck className="w-4 h-4 text-nature-500" /> Cancel anytime
              </span>
              <span className="flex items-center gap-2">
                <FiCheck className="w-4 h-4 text-nature-500" /> 7-day free trial
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const FiPhone = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

export default Home;
