import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem('vanexa_cart')) || []; }
  catch { return []; }
};

const loadWishlist = () => {
  try { return JSON.parse(localStorage.getItem('vanexa_wishlist')) || []; }
  catch { return []; }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
    wishlist: loadWishlist(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find(i => i.product.id === product.id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock);
      } else {
        state.items.push({ product, quantity });
      }
      localStorage.setItem('vanexa_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.product.id !== action.payload);
      localStorage.setItem('vanexa_cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      if (quantity < 1) {
        state.items = state.items.filter(i => i.product.id !== productId);
      } else {
        const item = state.items.find(i => i.product.id === productId);
        if (item) item.quantity = quantity;
      }
      localStorage.setItem('vanexa_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('vanexa_cart');
    },
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const idx = state.wishlist.findIndex(p => p.id === product.id);
      if (idx >= 0) {
        state.wishlist.splice(idx, 1);
      } else {
        state.wishlist.push(product);
      }
      localStorage.setItem('vanexa_wishlist', JSON.stringify(state.wishlist));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleWishlist } = cartSlice.actions;

export const selectCartCount = (state) => state.cart.items.reduce((s, i) => s + i.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
export const selectIsWishlisted = (id) => (state) => state.cart.wishlist.some(p => p.id === id);

export default cartSlice.reducer;
