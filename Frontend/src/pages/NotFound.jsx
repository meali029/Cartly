import { Link } from 'react-router-dom'
import { ShoppingBagIcon, HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center items-center px-4">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Number with animation */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-bounce">
            404
          </h1>
          <div className="absolute inset-0 text-8xl md:text-9xl font-black text-indigo-200 opacity-30 transform translate-x-2 translate-y-2 -z-10">
            404
          </div>
        </div>

        {/* Shopping bag icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <ShoppingBagIcon className="w-24 h-24 text-indigo-400 animate-pulse" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">?</span>
            </div>
          </div>
        </div>

        {/* Heading and description */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-2 leading-relaxed">
          Looks like this page went shopping and never came back!
        </p>
        <p className="text-base text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <HomeIcon className="w-5 h-5 group-hover:animate-pulse" />
            Back to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 transform hover:scale-105 transition-all duration-300"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:animate-pulse" />
            Go Back
          </button>
        </div>

        {/* Popular links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Or explore these popular sections:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/men"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200"
            >
              Men's Collection
            </Link>
            <Link
              to="/women"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200"
            >
              Women's Collection
            </Link>
            <Link
              to="/kids"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200"
            >
              Kids' Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-10 left-10 animate-bounce delay-300">
        <div className="w-4 h-4 bg-indigo-400 rounded-full opacity-60"></div>
      </div>
      <div className="absolute top-10 right-10 animate-bounce delay-700">
        <div className="w-3 h-3 bg-purple-400 rounded-full opacity-60"></div>
      </div>
    </div>
  )
}

export default NotFound
