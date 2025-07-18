import { 
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'

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
              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Cartly
                </h3>
                <p className="text-xs text-slate-400">Premium Shopping</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Pakistan's leading online fashion destination. Discover the latest trends in men's, women's, and kids' fashion with premium quality and unmatched style.
            </p>
            
            {/* Social Media */}
            <div className="flex items-center gap-3">
              <h4 className="text-slate-300 text-sm font-medium">Follow Us:</h4>
              <div className="flex gap-2">
                <a href="#" className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                  <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.74.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                  <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <ShoppingBagIcon className="h-5 w-5 text-slate-300" />
              Shop Categories
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/men" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Men's Fashion
                </a>
              </li>
              <li>
                <a href="/women" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Women's Collection
                </a>
              </li>
              <li>
                <a href="/kids" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Kids Wear
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-amber-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Sale Items
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-300 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-slate-300" />
              Customer Service
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-amber-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-red-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="mailto:support@cartly.com" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BuildingOfficeIcon className="h-5 w-5 text-slate-300" />
              Company
            </h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-600 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-amber-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Terms of Service
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 hover:border-slate-600 transition-all duration-300">
              <h5 className="text-white font-medium mb-2 flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4 text-slate-300" />
                Newsletter
              </h5>
              <p className="text-slate-400 text-xs mb-3">Get updates on sales & new arrivals</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter email"
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300"
                />
                <button className="px-3 py-2 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-xl text-xs font-medium hover:from-slate-700 hover:to-slate-900 hover:shadow-lg transition-all duration-300 hover:scale-105">
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
              <p className="text-slate-400 text-sm">
                &copy; {year} <span className="font-semibold bg-gradient-to-r from-slate-300 to-slate-500 bg-clip-text text-transparent">Cartly</span>. All rights reserved.
              </p>
              <div className="hidden md:flex items-center gap-2">
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                <span className="text-slate-500 text-xs">Developed BY  <a href="https://mehboobali.netlify.app" target="blank" className="text-slate-400 hover:text-slate-300 hover:underline font-semibold transition-colors duration-300">Mehboob Ali</a></span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-xs">We Accept:</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center hover:bg-slate-600 transition-colors duration-300">
                  <CurrencyDollarIcon className="h-3 w-3 text-slate-300" />
                </div>
                <div className="w-8 h-6 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center hover:bg-slate-600 transition-colors duration-300">
                  <DevicePhoneMobileIcon className="h-3 w-3 text-slate-300" />
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
