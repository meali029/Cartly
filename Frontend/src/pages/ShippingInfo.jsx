import { 
  TruckIcon,
  GlobeAltIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const ShippingInfo = () => {
  const shippingMethods = [
    {
      name: 'Standard Shipping',
      time: '3-5 Business Days',
      cost: 'PKR 200',
      description: 'Regular delivery to your doorstep',
      icon: TruckIcon,
      color: 'blue'
    },
    {
      name: 'Express Shipping',
      time: '1-2 Business Days',
      cost: 'PKR 500',
      description: 'Fast delivery for urgent orders',
      icon: ClockIcon,
      color: 'purple'
    },
    {
      name: 'Free Shipping',
      time: '4-6 Business Days',
      cost: 'Free',
      description: 'On orders over PKR 5,000',
      icon: CurrencyDollarIcon,
      color: 'green'
    }
  ]

  const deliveryAreas = [
    { city: 'Karachi', time: '1-2 days', available: true },
    { city: 'Lahore', time: '1-2 days', available: true },
    { city: 'Islamabad', time: '2-3 days', available: true },
    { city: 'Rawalpindi', time: '2-3 days', available: true },
    { city: 'Faisalabad', time: '2-3 days', available: true },
    { city: 'Multan', time: '3-4 days', available: true },
    { city: 'Peshawar', time: '3-4 days', available: true },
    { city: 'Quetta', time: '4-5 days', available: true },
    { city: 'Sialkot', time: '3-4 days', available: true },
    { city: 'Gujranwala', time: '2-3 days', available: true }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <TruckIcon className="h-12 w-12 mr-3" />
              <h1 className="text-5xl font-bold">Shipping Information</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Fast, reliable, and secure delivery across Pakistan
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Shipping Methods */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <TruckIcon className="h-8 w-8 text-blue-500 mr-3" />
            Shipping Options
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {shippingMethods.map((method, index) => (
              <div key={index} className={`relative overflow-hidden rounded-2xl border-2 ${
                method.color === 'blue' ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100' :
                method.color === 'purple' ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100' :
                'border-green-200 bg-gradient-to-br from-green-50 to-green-100'
              } p-6 hover:shadow-lg transition-shadow`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  method.color === 'blue' ? 'bg-blue-500' :
                  method.color === 'purple' ? 'bg-purple-500' :
                  'bg-green-500'
                }`}>
                  <method.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.name}</h3>
                <div className={`text-2xl font-bold mb-2 ${
                  method.color === 'blue' ? 'text-blue-600' :
                  method.color === 'purple' ? 'text-purple-600' :
                  'text-green-600'
                }`}>
                  {method.cost}
                </div>
                <div className="text-sm text-gray-600 mb-3">{method.time}</div>
                <p className="text-gray-700 text-sm">{method.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Delivery Areas */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPinIcon className="h-6 w-6 text-green-500 mr-3" />
              Delivery Areas
            </h2>
            
            <div className="space-y-3">
              {deliveryAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="font-medium text-gray-900">{area.city}</span>
                  </div>
                  <span className="text-sm text-gray-600">{area.time}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">Not in the list?</h4>
              <p className="text-gray-600 text-sm">Contact us to check delivery availability in your area. We're constantly expanding our delivery network!</p>
            </div>
          </div>

          {/* Shipping Policies */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <GlobeAltIcon className="h-6 w-6 text-purple-500 mr-3" />
              Shipping Policies
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Processing</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Orders are processed within 1-2 business days. You'll receive a confirmation email 
                  with tracking information once your order ships.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tracking</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Track your order in real-time through your account dashboard or using the 
                  tracking number sent to your email.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Issues</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  If you're not available during delivery, our courier will attempt redelivery 
                  the next business day or contact you to arrange a convenient time.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">International Shipping</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Currently, we only ship within Pakistan. International shipping will be 
                  available soon!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping FAQs</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change my delivery address?</h3>
                <p className="text-gray-600 text-sm">Yes, you can change your delivery address before your order ships. Contact customer support as soon as possible.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What if I'm not home during delivery?</h3>
                <p className="text-gray-600 text-sm">Our delivery partner will attempt redelivery or contact you to reschedule at your convenience.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you deliver on weekends?</h3>
                <p className="text-gray-600 text-sm">Yes, we offer weekend delivery in major cities for express shipping orders.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Are there any additional charges?</h3>
                <p className="text-gray-600 text-sm">No hidden charges. The shipping cost shown at checkout is final.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I track multiple orders together?</h3>
                <p className="text-gray-600 text-sm">Each order has its own tracking number. You can view all your orders in your account dashboard.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What about fragile items?</h3>
                <p className="text-gray-600 text-sm">All items are carefully packaged with protective materials to ensure safe delivery.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 text-white text-center mt-8">
          <TruckIcon className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Need Help with Shipping?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our customer support team is here to help you with any shipping-related questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
            <button className="bg-blue-600 border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Track Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingInfo
