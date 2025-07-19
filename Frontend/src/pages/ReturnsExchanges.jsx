import { 
  ArrowUturnLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

const ReturnsExchanges = () => {
  const returnSteps = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Log into your account and select the item you want to return from your order history.',
      icon: ClockIcon,
      color: 'blue'
    },
    {
      step: 2,
      title: 'Package Item',
      description: 'Pack the item in its original packaging with all tags and accessories included.',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      step: 3,
      title: 'Schedule Pickup',
      description: 'Our courier will collect the item from your address at no additional cost.',
      icon: TruckIcon,
      color: 'purple'
    },
    {
      step: 4,
      title: 'Get Refund',
      description: 'Once we receive and inspect the item, your refund will be processed within 3-5 business days.',
      icon: CurrencyDollarIcon,
      color: 'orange'
    }
  ]

  const returnableItems = [
    { item: 'Clothing', condition: 'Unworn with tags', timeframe: '30 days', returnable: true },
    { item: 'Shoes', condition: 'Unworn in original box', timeframe: '30 days', returnable: true },
    { item: 'Accessories', condition: 'Unused with packaging', timeframe: '30 days', returnable: true },
    { item: 'Sale Items', condition: 'Unworn with tags', timeframe: '14 days', returnable: true },
    { item: 'Custom/Altered Items', condition: 'Any condition', timeframe: 'N/A', returnable: false },
    { item: 'Undergarments', condition: 'Any condition', timeframe: 'N/A', returnable: false },
    { item: 'Damaged Items', condition: 'Report within 48hrs', timeframe: '48 hours', returnable: true },
    { item: 'Gift Cards', condition: 'Any condition', timeframe: 'N/A', returnable: false }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <ArrowUturnLeftIcon className="h-12 w-12 mr-3" />
              <h1 className="text-5xl font-bold">Returns & Exchanges</h1>
            </div>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Easy returns and exchanges within 30 days of purchase
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Return Policy Overview */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Return Policy</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
              <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">30-Day Returns</h3>
              <p className="text-gray-600 text-sm">Return most items within 30 days of purchase</p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
              <TruckIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Pickup</h3>
              <p className="text-gray-600 text-sm">We'll collect returns from your doorstep at no cost</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-200">
              <CurrencyDollarIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Refunds</h3>
              <p className="text-gray-600 text-sm">Refunds processed within 3-5 business days</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Notes:</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Items must be in original condition with all tags attached
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Original packaging and accessories must be included
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Refunds are issued to the original payment method
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Exchange shipping costs are waived for size/color changes
              </li>
            </ul>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">How to Return an Item</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    step.color === 'blue' ? 'bg-blue-500' :
                    step.color === 'green' ? 'bg-green-500' :
                    step.color === 'purple' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold ${
                    step.color === 'blue' ? 'bg-blue-600' :
                    step.color === 'green' ? 'bg-green-600' :
                    step.color === 'purple' ? 'bg-purple-600' :
                    'bg-orange-600'
                  }`}>
                    {step.step}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                
                {/* Arrow */}
                {index < returnSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <div className="w-8 h-0.5 bg-gray-300 mx-auto"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Returnable Items */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Eligibility</h2>
            
            <div className="space-y-3">
              {returnableItems.map((item, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-xl border ${
                  item.returnable 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center">
                    {item.returnable ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                    )}
                    <div>
                      <span className="font-medium text-gray-900">{item.item}</span>
                      <p className="text-xs text-gray-600">{item.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      item.returnable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.timeframe}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exchange Information */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Exchanges</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">Size Exchange</h3>
                <p className="text-gray-600 text-sm">
                  Need a different size? We'll ship the new size and collect the original item at the same time.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-2">Color Exchange</h3>
                <p className="text-gray-600 text-sm">
                  Want a different color? Exchange is subject to availability of the desired color in your size.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-2">Defective Items</h3>
                <p className="text-gray-600 text-sm">
                  Received a defective item? We'll send a replacement immediately and arrange pickup of the defective item.
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <h3 className="font-semibold text-gray-900 mb-2">Wrong Item</h3>
                <p className="text-gray-600 text-sm">
                  If we sent you the wrong item, we'll correct it at no cost to you with express shipping.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">Exchange Timeline</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Exchange requests: Within 30 days of purchase</li>
                <li>• Processing time: 1-2 business days</li>
                <li>• Delivery of new item: 2-4 business days</li>
                <li>• Pickup of original item: Same day as delivery</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl p-8 text-white text-center mt-8">
          <ArrowUturnLeftIcon className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Need Help with Returns?</h2>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            Our customer service team is available 24/7 to help you with returns, exchanges, and any questions you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Start Return
            </button>
            <button className="bg-red-600 border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReturnsExchanges
