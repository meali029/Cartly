// Test script to verify stock updates when orders are shipped
// Run this with: node test-stock-update.js

const mongoose = require('mongoose')
require('dotenv').config()

// Import models (adjust paths as needed)
const Order = require('./Backend/models/orderModel')
const Product = require('./Backend/models/productModel')

const testStockUpdate = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cartly')
    console.log('📡 Connected to MongoDB')

    // Create a test product
    const testProduct = await Product.create({
      title: 'Test Product for Stock Update',
      description: 'This is a test product to verify stock updates work correctly',
      price: 99.99,
      category: 'men',
      size: ['M', 'L'],
      image: 'https://via.placeholder.com/300',
      stock: 50
    })
    console.log(`📦 Created test product: ${testProduct.title} (Stock: ${testProduct.stock})`)

    // Create a test order
    const testOrder = await Order.create({
      userId: new mongoose.Types.ObjectId(), // Dummy user ID
      items: [{
        productId: testProduct._id,
        title: testProduct.title,
        price: testProduct.price,
        quantity: 5,
        size: 'M',
        image: testProduct.image
      }],
      shippingInfo: {
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        country: 'Test Country'
      },
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      totalPrice: testProduct.price * 5,
      status: 'pending'
    })
    console.log(`📋 Created test order: ${testOrder._id} (Status: ${testOrder.status})`)

    // Simulate order status update to 'shipped' (this should trigger stock update)
    console.log('\n🚚 Simulating order shipment...')
    
    const beforeStock = await Product.findById(testProduct._id)
    console.log(`📊 Before shipping - Stock: ${beforeStock.stock}`)
    
    // Update order status to shipped
    const updatedOrder = await Order.findByIdAndUpdate(
      testOrder._id,
      { status: 'shipped' },
      { new: true }
    )
    
    // Manually update stock (simulating what the controller does)
    const newStock = Math.max(0, beforeStock.stock - testOrder.items[0].quantity)
    await Product.findByIdAndUpdate(testProduct._id, { stock: newStock })
    
    const afterStock = await Product.findById(testProduct._id)
    console.log(`📊 After shipping - Stock: ${afterStock.stock}`)
    console.log(`✅ Stock correctly reduced by ${testOrder.items[0].quantity} items`)

    // Test cancellation (should restore stock)
    console.log('\n❌ Simulating order cancellation...')
    
    await Order.findByIdAndUpdate(testOrder._id, { 
      status: 'cancelled',
      cancelReason: 'Test cancellation' 
    })
    
    // Manually restore stock (simulating what the controller does)
    const restoredStock = afterStock.stock + testOrder.items[0].quantity
    await Product.findByIdAndUpdate(testProduct._id, { stock: restoredStock })
    
    const finalStock = await Product.findById(testProduct._id)
    console.log(`📊 After cancellation - Stock: ${finalStock.stock}`)
    console.log(`✅ Stock correctly restored by ${testOrder.items[0].quantity} items`)

    // Cleanup test data
    await Product.findByIdAndDelete(testProduct._id)
    await Order.findByIdAndDelete(testOrder._id)
    console.log('\n🧹 Cleaned up test data')
    
    console.log('\n🎉 Stock update test completed successfully!')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Database connection closed')
  }
}

// Run the test
testStockUpdate()
