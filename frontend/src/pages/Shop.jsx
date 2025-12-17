import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiStar,
  FiHeart,
  FiGrid,
  FiList,
  FiChevronDown,
  FiX,
  FiCheck,
  FiClock,
  FiTruck,
} from "react-icons/fi";
import { useCartStore } from "../store/cartStore";
import api from "../utils/api";
import toast from "react-hot-toast";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const {
    addToCart,
    isInCart,
    getItemQuantity,
    incrementQuantity,
    decrementQuantity,
    getCartCount,
  } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products");
      if (response.data.success || response.data.products) {
        const productList = response.data.products || response.data.data || [];
        setProducts(productList);

        // Extract unique categories
        const cats = [
          ...new Set(productList.map((p) => p.category).filter(Boolean)),
        ];
        setCategories(cats);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      // Demo products
      setProducts(getDemoProducts());
      setCategories(["Milk", "Curd", "Ghee", "Paneer", "Buttermilk"]);
    } finally {
      setLoading(false);
    }
  };

  const getDemoProducts = () => [
    {
      id: 1,
      name: "Fresh Cow Milk",
      category: "Milk",
      price: 60,
      unit: "1L",
      rating: 4.8,
      reviews: 234,
      image: "🥛",
      description: "Farm-fresh cow milk, delivered within 6 hours of milking",
      popular: true,
      inStock: true,
    },
    {
      id: 2,
      name: "Buffalo Milk",
      category: "Milk",
      price: 70,
      unit: "1L",
      rating: 4.9,
      reviews: 189,
      image: "🦬",
      description: "Rich & creamy buffalo milk, high in fat content",
      inStock: true,
    },
    {
      id: 3,
      name: "Fresh Curd",
      category: "Curd",
      price: 80,
      unit: "1kg",
      rating: 4.7,
      reviews: 156,
      image: "🥣",
      description: "Thick, creamy curd made from fresh milk",
      inStock: true,
    },
    {
      id: 4,
      name: "Pure Desi Ghee",
      category: "Ghee",
      price: 600,
      unit: "1kg",
      rating: 5.0,
      reviews: 312,
      image: "🧈",
      description: "Traditional ghee made from pure cow milk",
      premium: true,
      inStock: true,
    },
    {
      id: 5,
      name: "Buttermilk",
      category: "Buttermilk",
      price: 30,
      unit: "1L",
      rating: 4.6,
      reviews: 98,
      image: "🥤",
      description: "Refreshing buttermilk with natural spices",
      inStock: true,
    },
    {
      id: 6,
      name: "Fresh Paneer",
      category: "Paneer",
      price: 320,
      unit: "1kg",
      rating: 4.8,
      reviews: 145,
      image: "🧀",
      description: "Soft, fresh paneer made daily",
      inStock: true,
    },
    {
      id: 7,
      name: "A2 Cow Milk",
      category: "Milk",
      price: 80,
      unit: "1L",
      rating: 4.9,
      reviews: 267,
      image: "🐄",
      description: "Premium A2 protein milk from native cows",
      premium: true,
      inStock: true,
    },
    {
      id: 8,
      name: "Greek Yogurt",
      category: "Curd",
      price: 120,
      unit: "500g",
      rating: 4.7,
      reviews: 89,
      image: "🍨",
      description: "Thick, protein-rich Greek style yogurt",
      inStock: true,
    },
    {
      id: 9,
      name: "Flavored Lassi",
      category: "Buttermilk",
      price: 40,
      unit: "500ml",
      rating: 4.5,
      reviews: 76,
      image: "🥛",
      description: "Sweet mango lassi, perfect summer drink",
      inStock: true,
    },
    {
      id: 10,
      name: "Cottage Cheese",
      category: "Paneer",
      price: 280,
      unit: "500g",
      rating: 4.6,
      reviews: 54,
      image: "🧀",
      description: "Low-fat cottage cheese for health-conscious",
      inStock: true,
    },
  ];

  const filteredProducts = products
    .filter((p) => {
      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchesSearch =
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "popular":
          return (b.reviews || 0) - (a.reviews || 0);
        default:
          return 0;
      }
    });

  const ProductCard = ({ product }) => {
    const inCart = isInCart(product._id || product.id);
    const quantity = getItemQuantity(product._id || product.id);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group relative bg-white rounded-3xl shadow-soft hover:shadow-luxury transition-all duration-500 overflow-hidden border border-gray-100"
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.popular && (
            <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
              🔥 Bestseller
            </span>
          )}
          {product.premium && (
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
              ⭐ Premium
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500">
          <FiHeart className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div
          className={`relative h-48 bg-gradient-to-br ${
            product.gradient || "from-gray-50 to-gray-100"
          } flex items-center justify-center`}
        >
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-7xl filter drop-shadow-lg"
          >
            {product.image || "📦"}
          </motion.span>

          {/* Quick Add Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        </div>

        {/* Product Info */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-primary-600 font-semibold uppercase tracking-wide mb-1">
                {product.category}
              </p>
              <h3 className="font-bold text-gray-800 text-lg leading-tight">
                {product.name}
              </h3>
            </div>
          </div>

          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
              <FiStar className="w-4 h-4 text-green-600 fill-green-600" />
              <span className="text-sm font-bold text-green-700">
                {product.rating}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              ({product.reviews} reviews)
            </span>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ₹{product.price}
              </span>
              <span className="text-gray-500 text-sm">/{product.unit}</span>
            </div>

            {inCart ? (
              <div className="flex items-center gap-2 bg-primary-50 rounded-xl p-1">
                <button
                  onClick={() => decrementQuantity(product._id || product.id)}
                  className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary-600 hover:bg-primary-100 transition-colors"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-primary-700">
                  {quantity}
                </span>
                <button
                  onClick={() => incrementQuantity(product._id || product.id)}
                  className="w-9 h-9 rounded-lg bg-primary-500 shadow-sm flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(product)}
                className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-nature-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-primary-600 via-nature-600 to-primary-700 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-nature-400/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Fresh Dairy Products 🥛
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Farm-fresh milk, curd, ghee & more delivered to your doorstep
              daily
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for milk, curd, ghee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-5 py-4 rounded-2xl text-gray-800 shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delivery Info Banner */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <FiTruck className="w-5 h-5 text-primary-500" />
              <span>Free Delivery on ₹200+</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiClock className="w-5 h-5 text-nature-500" />
              <span>Delivery by 6:30 AM</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiCheck className="w-5 h-5 text-green-500" />
              <span>100% Fresh Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    selectedCategory === "all"
                      ? "bg-primary-50 text-primary-700 font-semibold"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      selectedCategory === cat
                        ? "bg-primary-50 text-primary-700 font-semibold"
                        : "hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Delivery Subscription */}
              <div className="mt-8 p-4 bg-gradient-to-br from-primary-50 to-nature-50 rounded-2xl">
                <h4 className="font-bold text-gray-800 mb-2">
                  🥛 Subscribe & Save
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Get 10% off on daily delivery subscription
                </p>
                <Link
                  to="/register"
                  className="block w-full text-center py-2 bg-gradient-to-r from-primary-500 to-nature-500 text-white font-semibold rounded-xl text-sm hover:shadow-lg transition-all"
                >
                  Start Subscription
                </Link>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <p className="text-gray-600">
                  <span className="font-bold text-gray-900">
                    {filteredProducts.length}
                  </span>{" "}
                  products found
                </p>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-soft text-gray-600"
                >
                  <FiFilter className="w-4 h-4" />
                  Filters
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-white rounded-xl shadow-soft text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                {/* View Toggle */}
                <div className="hidden md:flex items-center bg-white rounded-xl shadow-soft p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-primary-500 text-white"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-primary-500 text-white"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Pills - Mobile */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex-shrink-0 px-4 py-2 rounded-full transition-all ${
                  selectedCategory === "all"
                    ? "bg-primary-500 text-white"
                    : "bg-white text-gray-600 shadow-soft"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full transition-all ${
                    selectedCategory === cat
                      ? "bg-primary-500 text-white"
                      : "bg-white text-gray-600 shadow-soft"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl p-5 animate-pulse"
                  >
                    <div className="h-40 bg-gray-100 rounded-2xl mb-4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                    <div className="h-5 bg-gray-100 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gray-100 rounded w-full mb-4" />
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-100 rounded w-20" />
                      <div className="h-10 bg-gray-100 rounded w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                layout
                className={`grid gap-4 md:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-2 md:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      {getCartCount() > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-auto z-50"
        >
          <Link
            to="/cart"
            className="flex items-center justify-between gap-4 bg-gradient-to-r from-primary-600 to-nature-600 text-white px-6 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <FiShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              </div>
              <span className="font-semibold">{getCartCount()} items</span>
            </div>
            <span className="font-bold text-lg">View Cart →</span>
          </Link>
        </motion.div>
      )}

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <FiX className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
              <div className="space-y-2 mb-6">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setShowFilters(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    selectedCategory === "all"
                      ? "bg-primary-50 text-primary-700 font-semibold"
                      : "bg-gray-50 text-gray-600"
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      selectedCategory === cat
                        ? "bg-primary-50 text-primary-700 font-semibold"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-nature-500 text-white font-semibold rounded-xl"
              >
                Apply Filters
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
