const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700 mt-20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Cartly
                </h3>
                <p className="text-xs text-gray-400">Premium Shopping</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Pakistan's leading online fashion destination. Discover the latest trends in men's, women's, and kids' fashion with premium quality and unmatched style.
            </p>
            
            {/* Social Media */}
            <div className="flex items-center gap-3">
              <h4 className="text-gray-300 text-sm font-medium">Follow Us:</h4>
              <div className="flex gap-2">
                <a href="#" className="w-8 h-8 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300">
                  <span className="text-sm">📘</span>
                </a>
                <a href="#" className="w-8 h-8 bg-slate-700 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all duration-300">
                  <span className="text-sm">📷</span>
                </a>
                <a href="#" className="w-8 h-8 bg-slate-700 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-all duration-300">
                  <span className="text-sm">🐦</span>
                </a>
                <a href="#" className="w-8 h-8 bg-slate-700 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300">
                  <span className="text-sm">📺</span>
                </a>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-lg">🛍️</span>
              Shop Categories
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/men" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Men's Fashion
                </a>
              </li>
              <li>
                <a href="/women" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-pink-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Women's Collection
                </a>
              </li>
              <li>
                <a href="/kids" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Kids Wear
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-amber-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Sale Items
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-violet-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-lg">💬</span>
              Customer Service
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-green-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-red-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="mailto:support@cartly.com" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-purple-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-lg">🏢</span>
              Company
            </h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-rose-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-yellow-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Terms of Service
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h5 className="text-white font-medium mb-2 flex items-center gap-2">
                <span className="text-sm">📧</span>
                Newsletter
              </h5>
              <p className="text-gray-400 text-xs mb-3">Get updates on sales & new arrivals</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter email"
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 bg-slate-900/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="flex items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; {year} <span className="font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Cartly</span>. All rights reserved.
              </p>
              <div className="hidden md:flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span className="text-gray-500 text-xs">Made with ❤️ in Pakistan</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-xs">We Accept:</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-slate-700 rounded border border-slate-600 flex items-center justify-center">
                  <span className="text-xs">💳</span>
                </div>
                <div className="w-8 h-6 bg-slate-700 rounded border border-slate-600 flex items-center justify-center">
                  <span className="text-xs">💰</span>
                </div>
                <div className="w-8 h-6 bg-slate-700 rounded border border-slate-600 flex items-center justify-center">
                  <span className="text-xs">📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
