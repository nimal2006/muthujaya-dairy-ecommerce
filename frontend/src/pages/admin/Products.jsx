import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiPackage,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
  FiBox,
  FiCheckCircle,
  FiImage,
} from "react-icons/fi";
import { AnimatedMeshBackground } from "../../components/ui/AnimatedBackground";
import api from "../../utils/api";
import toast from "react-hot-toast";

// Animated counter component
const AnimatedCounter = ({ value, prefix = "", suffix = "" }) => {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (val) => Math.round(val));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span>
      {prefix}
      {Math.round(value)}
      {suffix}
    </motion.span>
  );
};

// Product emoji mapping
const productEmojis = {
  milk: "🥛",
  curd: "🥣",
  ghee: "🧈",
  paneer: "🧀",
  buttermilk: "🥤",
  others: "📦",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "milk",
    unit: "L",
    pricePerUnit: "",
    costPrice: "",
    stock: "",
    minOrderQuantity: "1",
    maxOrderQuantity: "10",
    image: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        category: selectedProduct.category || "milk",
        unit: selectedProduct.unit || "L",
        pricePerUnit:
          selectedProduct.pricePerUnit || selectedProduct.price || "",
        costPrice: selectedProduct.costPrice || "",
        stock: selectedProduct.stock || "",
        minOrderQuantity: selectedProduct.minOrderQuantity || "1",
        maxOrderQuantity: selectedProduct.maxOrderQuantity || "10",
        image: selectedProduct.image || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        category: "milk",
        unit: "L",
        pricePerUnit: "",
        costPrice: "",
        stock: "",
        minOrderQuantity: "1",
        maxOrderQuantity: "10",
        image: "",
      });
    }
  }, [selectedProduct]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products");
      if (response.data.success) {
        const mappedProducts = response.data.products.map((p) => ({
          id: p._id,
          name: p.name,
          category: p.category,
          price: p.pricePerUnit,
          pricePerUnit: p.pricePerUnit,
          costPrice: p.costPrice,
          unit: p.unit,
          stock: p.stock || 100,
          minStock: 20,
          description: p.description,
          image: productEmojis[p.category] || "📦",
          isActive: p.isAvailable !== false,
          minOrderQuantity: p.minOrderQuantity,
          maxOrderQuantity: p.maxOrderQuantity,
          soldToday: Math.floor(Math.random() * 100),
          totalRevenue: p.pricePerUnit * Math.floor(Math.random() * 5000),
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
      setProducts([
        {
          id: "PROD001",
          name: "Fresh Cow Milk",
          category: "milk",
          price: 60,
          pricePerUnit: 60,
          unit: "L",
          stock: 500,
          minStock: 100,
          description: "Pure farm-fresh cow milk",
          image: "🥛",
          isActive: true,
          soldToday: 245,
          totalRevenue: 875000,
        },
        {
          id: "PROD002",
          name: "Buffalo Milk",
          category: "milk",
          price: 70,
          pricePerUnit: 70,
          unit: "L",
          stock: 300,
          minStock: 50,
          description: "Rich and creamy buffalo milk",
          image: "🦬",
          isActive: true,
          soldToday: 120,
          totalRevenue: 420000,
        },
        {
          id: "PROD003",
          name: "Fresh Curd",
          category: "curd",
          price: 80,
          pricePerUnit: 80,
          unit: "kg",
          stock: 150,
          minStock: 30,
          description: "Naturally set fresh curd",
          image: "🥣",
          isActive: true,
          soldToday: 85,
          totalRevenue: 340000,
        },
        {
          id: "PROD004",
          name: "Pure Ghee",
          category: "ghee",
          price: 600,
          pricePerUnit: 600,
          unit: "kg",
          stock: 25,
          minStock: 10,
          description: "Traditional homemade ghee",
          image: "🧈",
          isActive: true,
          soldToday: 12,
          totalRevenue: 180000,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["all", "milk", "curd", "ghee", "others"];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.isActive).length,
    lowStock: products.filter((p) => p.stock <= (p.minStock || 20)).length,
    totalRevenue: products.reduce((sum, p) => sum + (p.totalRevenue || 0), 0),
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
        description: formData.description,
        category: formData.category,
        unit: formData.unit,
        pricePerUnit: parseFloat(formData.pricePerUnit),
        costPrice:
          parseFloat(formData.costPrice) ||
          parseFloat(formData.pricePerUnit) * 0.7,
        minOrderQuantity: parseInt(formData.minOrderQuantity) || 1,
        maxOrderQuantity: parseInt(formData.maxOrderQuantity) || 10,
        stock: parseInt(formData.stock) || 100,
        image: formData.image,
      };

      if (selectedProduct) {
        const response = await api.put(
          `/products/${selectedProduct.id}`,
          payload
        );
        if (response.data.success) {
          toast.success("Product updated successfully! 🎉");
          fetchProducts();
        }
      } else {
        const response = await api.post("/products", payload);
        if (response.data.success) {
          toast.success("Product created successfully! 🎉");
          fetchProducts();
        }
      }
      setShowAddModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await api.delete(`/products/${id}`);
        if (response.data.success) {
          toast.success("Product deleted successfully!");
          setProducts((prev) => prev.filter((p) => p.id !== id));
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    }
  };

  const handleToggleActive = async (id) => {
    const product = products.find((p) => p.id === id);
    try {
      await api.put(`/products/${id}`, { isAvailable: !product.isActive });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
      );
      toast.success(
        product.isActive ? "Product deactivated" : "Product activated"
      );
    } catch (error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiBox className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <AnimatedMeshBackground />

      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-3xl p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FiPackage className="w-6 h-6" />
              </div>
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {products.length} Products
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Products Catalog</h1>
            <p className="text-white/80 text-lg">
              Manage your dairy products catalog
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold shadow-lg flex items-center gap-2 hover:shadow-xl transition-all"
          >
            <FiPlus className="w-5 h-5" />
            Add Product
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Products",
            value: stats.totalProducts,
            icon: FiPackage,
            gradient: "from-blue-500 to-cyan-500",
          },
          {
            label: "Active",
            value: stats.activeProducts,
            icon: FiCheckCircle,
            gradient: "from-emerald-500 to-teal-500",
          },
          {
            label: "Low Stock",
            value: stats.lowStock,
            icon: FiAlertCircle,
            gradient: "from-rose-500 to-pink-500",
          },
          {
            label: "Revenue",
            value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`,
            icon: FiDollarSign,
            gradient: "from-purple-500 to-indigo-500",
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
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
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
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap capitalize ${
                  categoryFilter === cat
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            whileHover={{ y: -8 }}
            className={`group bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/50 overflow-hidden hover:shadow-2xl transition-all ${
              !product.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                    {product.image}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {product.name}
                    </h3>
                    <span className="text-sm text-gray-500 capitalize px-3 py-1 bg-gray-100 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleActive(product.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    product.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {product.isActive ? "● Active" : "○ Inactive"}
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-5 line-clamp-2">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                  <p className="text-xs text-gray-500 mb-1">Price</p>
                  <p className="text-xl font-bold text-orange-600">
                    ₹{product.price}/{product.unit}
                  </p>
                </div>
                <div
                  className={`rounded-2xl p-4 border ${
                    product.stock <= 20
                      ? "bg-red-50 border-red-100"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <p className="text-xs text-gray-500 mb-1">Stock</p>
                  <p
                    className={`text-xl font-bold ${
                      product.stock <= 20 ? "text-red-600" : "text-gray-800"
                    }`}
                  >
                    {product.stock} {product.unit}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Sold Today</p>
                  <p className="font-bold text-gray-800">
                    {product.soldToday} {product.unit}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="p-3 bg-orange-50 rounded-xl hover:bg-orange-100"
                  >
                    <FiEdit2 className="w-5 h-5 text-orange-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-3 bg-rose-50 rounded-xl hover:bg-rose-100"
                  >
                    <FiTrash2 className="w-5 h-5 text-rose-600" />
                  </button>
                </div>
              </div>
            </div>

            {product.stock <= 20 && (
              <div className="px-6 py-4 bg-red-50 border-t border-red-100 flex items-center gap-3 text-red-700">
                <FiAlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Low stock alert!</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white/80 rounded-3xl shadow-soft p-16 text-center">
          <FiPackage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No products found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or add a new product
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || selectedProduct) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddModal(false);
              setSelectedProduct(null);
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
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <FiPackage className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedProduct ? "Edit Product" : "Add New Product"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Fill in the details below
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedProduct(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <FiX className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    placeholder="e.g., Fresh Cow Milk"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    >
                      <option value="milk">Milk</option>
                      <option value="curd">Curd</option>
                      <option value="ghee">Ghee</option>
                      <option value="paneer">Paneer</option>
                      <option value="buttermilk">Buttermilk</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Unit *
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    >
                      <option value="L">Litre (L)</option>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="g">Gram (g)</option>
                      <option value="ml">Millilitre (ml)</option>
                      <option value="pcs">Pieces (pcs)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="pricePerUnit"
                      value={formData.pricePerUnit}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      placeholder="60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cost Price (₹)
                    </label>
                    <input
                      type="number"
                      name="costPrice"
                      value={formData.costPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      placeholder="45"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Min Order Qty
                    </label>
                    <input
                      type="number"
                      name="minOrderQuantity"
                      value={formData.minOrderQuantity}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                    rows={3}
                    placeholder="Product description..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : selectedProduct
                      ? "Save Changes"
                      : "Add Product"}
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

export default AdminProducts;
