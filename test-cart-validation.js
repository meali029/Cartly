// Test the cart stock validation functionality
// This would typically be run as a unit test

const testCartStockValidation = () => {
  console.log('🧪 Testing Cart Stock Validation...\n')

  // Mock product with limited stock
  const mockProduct = {
    _id: 'test-product-1',
    title: 'Test Product',
    price: 99.99,
    stock: 5, // Only 5 items in stock
    image: 'https://via.placeholder.com/300'
  }

  // Mock cart items
  let mockCartItems = []

  // Mock functions (simplified versions)
  const mockAddToCart = (product, size = null, quantity = 1) => {
    // Check if product is out of stock
    if (product.stock === 0) {
      return { success: false, message: 'Product is out of stock' }
    }

    const exists = mockCartItems.find(
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
      mockCartItems = mockCartItems.map((item) =>
        item.product._id === product._id && item.size === size
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      mockCartItems.push({ product, quantity, size })
    }

    return { success: true, message: 'Item added to cart successfully' }
  }

  // Test Case 1: Adding within stock limit
  console.log('📝 Test 1: Adding items within stock limit')
  let result = mockAddToCart(mockProduct, null, 3)
  console.log(`Result: ${result.success ? '✅' : '❌'} ${result.message}`)
  console.log(`Cart items: ${mockCartItems.length}, Quantity: ${mockCartItems[0]?.quantity || 0}\n`)

  // Test Case 2: Adding more items (should still be within limit)
  console.log('📝 Test 2: Adding 1 more item (total 4, within limit of 5)')
  result = mockAddToCart(mockProduct, null, 1)
  console.log(`Result: ${result.success ? '✅' : '❌'} ${result.message}`)
  console.log(`Cart quantity: ${mockCartItems[0]?.quantity || 0}\n`)

  // Test Case 3: Trying to add more than available stock
  console.log('📝 Test 3: Trying to add 2 more items (would exceed stock of 5)')
  result = mockAddToCart(mockProduct, null, 2)
  console.log(`Result: ${result.success ? '✅' : '❌'} ${result.message}`)
  console.log(`Cart quantity remains: ${mockCartItems[0]?.quantity || 0}\n`)

  // Test Case 4: Adding exactly the remaining stock
  console.log('📝 Test 4: Adding exactly 1 more item (reaches stock limit)')
  result = mockAddToCart(mockProduct, null, 1)
  console.log(`Result: ${result.success ? '✅' : '❌'} ${result.message}`)
  console.log(`Cart quantity: ${mockCartItems[0]?.quantity || 0}\n`)

  // Test Case 5: Trying to add when cart is at stock limit
  console.log('📝 Test 5: Trying to add when cart is at stock limit')
  result = mockAddToCart(mockProduct, null, 1)
  console.log(`Result: ${result.success ? '✅' : '❌'} ${result.message}`)
  console.log(`Cart quantity remains: ${mockCartItems[0]?.quantity || 0}\n`)

  // Test Case 6: Out of stock product
  console.log('📝 Test 6: Adding out-of-stock product')
  const outOfStockProduct = { ...mockProduct, _id: 'out-of-stock', stock: 0 }
  result = mockAddToCart(outOfStockProduct, null, 1)
  console.log(`Result: ${result.success ? '✅' : '❌'} ${result.message}\n`)

  console.log('🎉 Stock validation tests completed!')
}

// Run the test
testCartStockValidation()
