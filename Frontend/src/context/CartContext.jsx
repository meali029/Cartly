import { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // ⏪ Load from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cratlyCart'))
    if (stored) setCartItems(stored)
  }, [])

  // 💾 Save to localStorage when cart updates
  useEffect(() => {
    localStorage.setItem('cratlyCart', JSON.stringify(cartItems))
  }, [cartItems])

  // ➕ Add item
  const addToCart = (product, size = null, quantity = 1) => {
    const exists = cartItems.find(
      (item) => item.product._id === product._id && item.size === size
    )

    if (exists) {
      // Update quantity
      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === product._id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      )
    } else {
      setCartItems((prev) => [...prev, { product, quantity, size }])
    }
  }

  // ➖ Remove item
  const removeFromCart = (productId, size = null) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.product._id === productId && item.size === size)
      )
    )
  }

  // 🧼 Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  // 🔄 Update quantity
  const updateQuantity = (productId, size = null, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, size)
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === productId && item.size === size
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
