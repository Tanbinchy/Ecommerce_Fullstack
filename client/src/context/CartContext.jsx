/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "mystore-cart";

const readStoredCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

const persistCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readStoredCart);

  const commit = (nextItems) => {
    setItems(nextItems);
    persistCart(nextItems);
  };

  const addItem = (product, quantity = 1) => {
    const productKey = product._id || product.slug;
    const normalizedQuantity = Math.max(1, Number(quantity) || 1);
    const nextItems = [...items];
    const existingIndex = nextItems.findIndex(
      (item) => (item._id || item.slug) === productKey,
    );

    if (existingIndex >= 0) {
      nextItems[existingIndex] = {
        ...nextItems[existingIndex],
        quantity: nextItems[existingIndex].quantity + normalizedQuantity,
      };
    } else {
      nextItems.push({
        _id: product._id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price: Number(product.price),
        stock: Number(product.quantity),
        quantity: normalizedQuantity,
      });
    }

    commit(nextItems);
  };

  const updateQuantity = (productKey, quantity) => {
    const normalizedQuantity = Math.max(1, Number(quantity) || 1);
    commit(
      items.map((item) =>
        (item._id || item.slug) === productKey
          ? { ...item, quantity: normalizedQuantity }
          : item,
      ),
    );
  };

  const removeItem = (productKey) => {
    commit(items.filter((item) => (item._id || item.slug) !== productKey));
  };

  const clearCart = () => commit([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );
    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 12;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = Number((subtotal + shipping + tax).toFixed(2));
    const count = items.reduce((sum, item) => sum + Number(item.quantity), 0);

    return { subtotal, shipping, tax, total, count };
  }, [items]);

  const value = {
    items,
    totals,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
