import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vanexa_cart')) || []; }
    catch { return []; }
  });

  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vanexa_wishlist')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('vanexa_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vanexa_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) { removeFromCart(productId); return; }
    setCart(prev =>
      prev.map(i => i.product.id === productId ? { ...i, quantity } : i)
    );
  };

  const clearCart = () => setCart([]);

  const cartCount   = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal   = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const toggleWishlist = (product) => {
    setWishlist(prev =>
      prev.find(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  const isWishlisted = (productId) => wishlist.some(p => p.id === productId);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, cartTotal,
      wishlist, toggleWishlist, isWishlisted,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
