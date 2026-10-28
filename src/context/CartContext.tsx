import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem, Product } from "../types";

interface CartContextType {
  items: CartItem[];
  addToCart: (producto: Product, cantidad: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, cantidad: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addToCart(producto: Product, cantidad: number) {
    setItems((prev) => {
      const existe = prev.find((item) => item.producto.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { producto, cantidad }];
    });
  }

  function removeFromCart(productId: number) {
    setItems((prev) => prev.filter((item) => item.producto.id !== productId));
  }

  function updateQuantity(productId: number, cantidad: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.producto.id === productId ? { ...item, cantidad } : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.producto.precio * item.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}