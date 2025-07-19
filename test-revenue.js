// Simple test script to check revenue calculation
const mongoose = require('mongoose');

// Connect to MongoDB (update with your connection string)
const MONGODB_URI = 'mongodb://localhost:27017/cartly'; // Update this

// Order model (simplified)
const orderSchema = new mongoose.Schema({
  totalPrice: Number,
  status: String,
  createdAt: Date
});

const Order = mongoose.model('Order', orderSchema);

async function testRevenue() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get all orders
    const allOrders = await Order.find({});
    console.log(`📊 Total orders in database: ${allOrders.length}`);
    
    // Get non-cancelled orders
    const validOrders = await Order.find({ status: { $ne: 'cancelled' } });
    console.log(`📊 Non-cancelled orders: ${validOrders.length}`);
    
    // Calculate revenue
    let totalRevenue = 0;
    let validOrderCount = 0;
    
    console.log('\n📝 Order details:');
    validOrders.forEach((order, index) => {
      const amount = order.totalPrice || 0;
      totalRevenue += amount;
      if (amount > 0) {
        validOrderCount++;
        if (index < 5) { // Show first 5 orders
          console.log(`Order ${index + 1}: PKR ${amount} (Status: ${order.status})`);
        }
      }
    });
    
    console.log(`\n💰 TOTAL REVENUE: PKR ${totalRevenue}`);
    console.log(`📊 Orders with revenue: ${validOrderCount}/${validOrders.length}`);
    console.log(`💳 Average order value: PKR ${validOrderCount > 0 ? (totalRevenue / validOrderCount).toFixed(2) : 0}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the test
testRevenue();
