import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

// SAFE DEFAULT VALUE (never null)
export const CartContext = createContext({
  cartItem: [],
  setCartItem: () => {},
  addToCart: () => {},
  updateQuantity: () => {},
  deleteItem: () => {}
});

export const CartProvider = ({ children }) => {
  const [cartItem, setCartItem] = useState([]);

  const addToCart = (product) => {
    const itemInCart = cartItem.find((item) => item.id === product.id);

    if (itemInCart) {
      const updatedCart = cartItem.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItem(updatedCart);
      toast.success("Product quantity increased!");
    } else {
      setCartItem([...cartItem, { ...product, quantity: 1 }]);
      toast.success("Product added to cart!");
    }
  };

  const updateQuantity = (items, productId, action) => {
    setCartItem(
      items
        .map((item) => {
          if (item.id === productId) {
            let newQty = item.quantity;

            if (action === "increase") {
              newQty++;
              toast.success("Quantity increased!");
            } else if (action === "decrease") {
              newQty--;
              toast.success("Quantity decreased!");
            }

            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const deleteItem = (productId) => {
    setCartItem(cartItem.filter((item) => item.id !== productId));
    toast.success("Product removed from cart!");
  };

  return (
    <CartContext.Provider
      value={{
        cartItem,
        setCartItem,
        addToCart,
        updateQuantity,
        deleteItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// SAFETY WRAPPER (prevents crashes)
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    console.error("❌ useCart() used outside <CartProvider>");
    return {
      cartItem: [],
      setCartItem: () => {},
      addToCart: () => {},
      updateQuantity: () => {},
      deleteItem: () => {},
    };
  }
  return ctx;
};
