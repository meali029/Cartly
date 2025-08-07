// Test script to check if your backend is accessible
// Run this in browser console on your live website

const testBackend = async () => {
  const backendUrl = 'https://cartly-production.up.railway.app'
  
  console.log('🔍 Testing backend accessibility...')
  
  try {
    // Test 1: Basic health check
    console.log('📡 Testing basic connectivity...')
    const healthResponse = await fetch(`${backendUrl}/api/health`)
    console.log('Health check status:', healthResponse.status)
    
    // Test 2: Newsletter endpoint
    console.log('📧 Testing newsletter endpoint...')
    const newsletterResponse = await fetch(`${backendUrl}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com' }),
    })
    
    console.log('Newsletter endpoint status:', newsletterResponse.status)
    
    if (newsletterResponse.ok) {
      const data = await newsletterResponse.json()
      console.log('✅ Newsletter API working:', data)
    } else {
      const errorText = await newsletterResponse.text()
      console.log('❌ Newsletter API error:', errorText)
    }
    
  } catch (error) {
    console.error('❌ Backend test failed:', error)
  }
}

// Run the test
testBackend()
