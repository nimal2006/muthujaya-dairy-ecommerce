import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiShoppingCart,
  FiX,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiArrowRight,
} from "react-icons/fi";
import { useCartStore } from "../store/cartStore";

const CartDrawer = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    getCartTotal,
    getCartCount,
  } = useCartStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FiShoppingCart className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                  {getCartCount()}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🛒</span>
                  <p className="text-gray-500">Your cart is empty</p>
                  <Link
                    to="/shop"
                    onClick={closeCart}
                    className="mt-4 inline-block text-primary-600 font-semibold hover:underline"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item._id || item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">{item.image || "📦"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {item.name}
                        </h4>
                        <p className="text-primary-600 font-medium">
                          ₹{item.price} × {item.quantity}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              decrementQuantity(item._id || item.id)
                            }
                            className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="font-semibold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              incrementQuantity(item._id || item.id)
                            }
                            className="w-7 h-7 rounded-md bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item._id || item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-gray-800">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-xl font-bold text-gray-800">
                    ₹{getCartTotal()}
                  </span>
                </div>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-nature-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  Checkout
                  <FiArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-center text-xs text-gray-400 mt-3">
                  Free delivery on orders above ₹200
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Floating Cart Button Component
export const FloatingCartButton = () => {
  const { openCart, getCartCount } = useCartStore();
  const count = getCartCount();

  if (count === 0) return null;

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={openCart}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-primary-500 to-nature-500 text-white rounded-full shadow-2xl flex items-center justify-center"
    >
      <FiShoppingCart className="w-7 h-7" />
      <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
        {count}
      </span>
    </motion.button>
  );
};

export { CartDrawer };
export default CartDrawer;
