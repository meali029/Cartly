import { 
  SparklesIcon,
  StarIcon,
  BoltIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

const NewArrivals = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <SparklesIcon className="h-12 w-12 mr-3" />
              <h1 className="text-5xl font-bold">New Arrivals</h1>
            </div>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Stay ahead of the fashion curve with our latest collection. Fresh styles, trending designs!
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* New Collections */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <ArrowTrendingUpIcon className="h-8 w-8 text-purple-500 mr-3" />
                Latest Collections
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Summer Collection 2025</h3>
                  <p className="text-gray-600 mb-4">Light fabrics, vibrant colors, and comfortable designs</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">New This Week</span>
                    </div>
                    <a href="/categories?collection=summer" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      Explore
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Men's Urban Wear</h3>
                  <p className="text-gray-600 mb-4">Contemporary street style for modern men</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BoltIcon className="h-5 w-5 text-orange-400 mr-1" />
                      <span className="text-sm text-gray-600">Just Dropped</span>
                    </div>
                    <a href="/men" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Explore
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Women's Elegance</h3>
                  <p className="text-gray-600 mb-4">Sophisticated and chic designs for every occasion</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <SparklesIcon className="h-5 w-5 text-pink-400 mr-1" />
                      <span className="text-sm text-gray-600">Trending Now</span>
                    </div>
                    <a href="/women" className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                      Explore
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Kids Premium</h3>
                  <p className="text-gray-600 mb-4">Playful yet comfortable clothing for children</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-green-400 mr-1" />
                      <span className="text-sm text-gray-600">Parent's Choice</span>
                    </div>
                    <a href="/kids" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Explore
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Products */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">This Week's Highlights</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SparklesIcon className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Premium Fabrics</h3>
                  <p className="text-gray-600 text-sm">High-quality materials sourced globally</p>
                </div>

                <div className="text-center p-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowTrendingUpIcon className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Trending Styles</h3>
                  <p className="text-gray-600 text-sm">Latest fashion trends from international runways</p>
                </div>

                <div className="text-center p-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <StarIcon className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Limited Edition</h3>
                  <p className="text-gray-600 text-sm">Exclusive pieces with limited availability</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What's New</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
                  <h4 className="font-semibold text-gray-900 mb-1">Daily Updates</h4>
                  <p className="text-gray-600 text-sm">New products added every day</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                  <h4 className="font-semibold text-gray-900 mb-1">Style Guide</h4>
                  <p className="text-gray-600 text-sm">How to style our new arrivals</p>
                </div>

                <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                  <h4 className="font-semibold text-gray-900 mb-1">Size Guide</h4>
                  <p className="text-gray-600 text-sm">Perfect fit for every body type</p>
                </div>

                <div className="p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500">
                  <h4 className="font-semibold text-gray-900 mb-1">Pre-Orders</h4>
                  <p className="text-gray-600 text-sm">Reserve upcoming collections</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white text-center">
              <SparklesIcon className="h-12 w-12 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Style Insider</h4>
              <p className="text-indigo-100 text-sm mb-4">
                Get early access to new arrivals and exclusive member-only collections
              </p>
              <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-full">
                Join Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewArrivals
