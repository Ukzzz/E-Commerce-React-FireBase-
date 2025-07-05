import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const cartDoc = await getDoc(doc(db, 'carts', currentUser.uid));
        if (cartDoc.exists()) {
          setCart(cartDoc.data().items || []);
        }
      } else {
        setCart([]);
      }
    });
    return unsubscribe;
  },[]);

  const saveCart = async (updatedCart) => {
    if (user) {
      await setDoc(doc(db, 'carts', user.uid), { items: updatedCart });
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      } else {
        updatedCart = [...prevCart, { ...item, quantity: 1 }];
      }
      saveCart(updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      saveCart(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== itemId);
      saveCart(updatedCart);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    saveCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);