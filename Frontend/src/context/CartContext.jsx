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

  // ➕ Add item with stock validation
  const addToCart = (product, size = null, quantity = 1) => {
    // Check if product is out of stock
    if (product.stock === 0) {
      return { success: false, message: 'Product is out of stock' }
    }

    const exists = cartItems.find(
      (item) => item.product._id === product._id && item.size === size
    )

    const currentCartQuantity = exists ? exists.quantity : 0
    const newTotalQuantity = currentCartQuantity + quantity

    // Check if adding this quantity would exceed stock
    if (newTotalQuantity > product.stock) {
      const availableToAdd = product.stock - currentCartQuantity
      if (availableToAdd <= 0) {
        return { 
          success: false, 
          message: `Maximum ${product.stock} items available. You already have ${currentCartQuantity} in your cart.`
        }
      } else {
        return { 
          success: false, 
          message: `Only ${availableToAdd} more items can be added. ${product.stock} total available, ${currentCartQuantity} already in cart.`
        }
      }
    }

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

    return { success: true, message: 'Item added to cart successfully' }
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

  // 🔄 Update quantity with stock validation
  const updateQuantity = (productId, size = null, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, size)
      return { success: true, message: 'Item removed from cart' }
    }

    const cartItem = cartItems.find(
      (item) => item.product._id === productId && item.size === size
    )

    if (!cartItem) {
      return { success: false, message: 'Item not found in cart' }
    }

    // Check if new quantity exceeds stock
    if (newQuantity > cartItem.product.stock) {
      return { 
        success: false, 
        message: `Only ${cartItem.product.stock} items available in stock`
      }
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    )

    return { success: true, message: 'Quantity updated successfully' }
  }

  // 🔍 Get current cart quantity for a product
  const getCartQuantity = (productId, size = null) => {
    const cartItem = cartItems.find(
      (item) => item.product._id === productId && item.size === size
    )
    return cartItem ? cartItem.quantity : 0
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        getCartQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
