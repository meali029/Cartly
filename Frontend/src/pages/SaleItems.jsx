import { 
  TagIcon,
  SparklesIcon,
  FireIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const SaleItems = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <TagIcon className="h-12 w-12 mr-3" />
              <h1 className="text-5xl font-bold">Sale Items</h1>
            </div>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Discover amazing deals and discounts on our premium fashion collection. Limited time offers!
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Sale Categories */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <FireIcon className="h-8 w-8 text-red-500 mr-3" />
                Hot Deals
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Men's Fashion</h3>
                  <p className="text-gray-600 mb-4">Up to 60% off on shirts, pants, and accessories</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-600">60% OFF</span>
                    <a href="/men" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Shop Now
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Women's Collection</h3>
                  <p className="text-gray-600 mb-4">Exclusive discounts on dresses, tops, and more</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-pink-600">50% OFF</span>
                    <a href="/women" className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                      Shop Now
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Kids Wear</h3>
                  <p className="text-gray-600 mb-4">Special prices on children's clothing</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">40% OFF</span>
                    <a href="/kids" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Shop Now
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Seasonal Sale</h3>
                  <p className="text-gray-600 mb-4">End of season clearance items</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">70% OFF</span>
                    <a href="#" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sale Timeline */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ClockIcon className="h-6 w-6 text-blue-500 mr-3" />
                Sale Timeline
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Flash Sale</h3>
                    <p className="text-gray-600 text-sm">24-hour mega discount event</p>
                  </div>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Active Now
                  </span>
                </div>

                <div className="flex items-center p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Weekend Sale</h3>
                    <p className="text-gray-600 text-sm">Special weekend offers</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    Coming Soon
                  </span>
                </div>

                <div className="flex items-center p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Monthly Clearance</h3>
                    <p className="text-gray-600 text-sm">End of month stock clearance</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Scheduled
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sale Tips</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Sign Up for Alerts</h4>
                  <p className="text-gray-600 text-sm">Get notified about flash sales and exclusive offers</p>
                </div>

                <div className="p-4 bg-green-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Free Shipping</h4>
                  <p className="text-gray-600 text-sm">Orders over PKR 5,000 get free shipping</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Best Deals</h4>
                  <p className="text-gray-600 text-sm">Check back daily for new deals and offers</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white text-center">
                <h4 className="font-bold mb-2">Limited Time!</h4>
                <p className="text-sm mb-3">Extra 20% off on already discounted items</p>
                <button className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaleItems
