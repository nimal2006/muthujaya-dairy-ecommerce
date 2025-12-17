import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      // Add item to cart
      addToCart: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item._id === product._id || item.id === product.id
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item._id === product._id || item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
          toast.success(`Added more ${product.name} to cart! 🛒`);
        } else {
          set({
            items: [...items, { ...product, quantity }],
          });
          toast.success(`${product.name} added to cart! 🛒`);
        }
      },

      // Remove item from cart
      removeFromCart: (productId) => {
        set({
          items: get().items.filter(
            (item) => item._id !== productId && item.id !== productId
          ),
        });
        toast.success("Item removed from cart");
      },

      // Update quantity
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item._id === productId || item.id === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      // Increment quantity
      incrementQuantity: (productId) => {
        const item = get().items.find(
          (i) => i._id === productId || i.id === productId
        );
        if (item) {
          get().updateQuantity(productId, item.quantity + 1);
        }
      },

      // Decrement quantity
      decrementQuantity: (productId) => {
        const item = get().items.find(
          (i) => i._id === productId || i.id === productId
        );
        if (item && item.quantity > 1) {
          get().updateQuantity(productId, item.quantity - 1);
        } else {
          get().removeFromCart(productId);
        }
      },

      // Clear cart
      clearCart: () => {
        set({ items: [] });
        toast.success("Cart cleared");
      },

      // Toggle cart drawer
      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      // Get cart totals
      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.price || 0;
          return total + price * item.quantity;
        }, 0);
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      // Check if item is in cart
      isInCart: (productId) => {
        return get().items.some(
          (item) => item._id === productId || item.id === productId
        );
      },

      // Get item quantity in cart
      getItemQuantity: (productId) => {
        const item = get().items.find(
          (i) => i._id === productId || i.id === productId
        );
        return item?.quantity || 0;
      },
    }),
    {
      name: "dairy-cart",
    }
  )
);
