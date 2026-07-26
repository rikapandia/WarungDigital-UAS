import React, { createContext, useState, useContext } from 'react';

// Context = cara "berbagi state" antar screen tanpa oper props manual berkali-kali.
// Di sini dipakai supaya KatalogScreen, DetailProdukScreen, dan KeranjangScreen
// bisa membaca & mengubah keranjang yang sama.
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(produk) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === produk.id);
      if (existing) {
        return prev.map((item) =>
          item.id === produk.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...produk, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
