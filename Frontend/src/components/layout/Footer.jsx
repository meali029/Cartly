
import { 
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'



const Footer = () => {
  const year = new Date().getFullYear()
 const letters = 'CARTLY'.split('');
  

  return (
    <>
    <footer className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700 mt-20 border-b-0 ">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
                <img
                  src='https://www.logoground.com/uploads/2018191292018-07-284631561C-Cart-logo.jpg'
                  alt='Cartly Logo'
                  className="w-10 h-10 object-contain"
                />
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
                <Link to="/men" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link to="/women" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/kids" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Kids Wear
                </Link>
              </li>
              <li>
                <Link to="/sale-items" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-amber-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Sale Items
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-300 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  New Arrivals
                </Link>
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
                <Link to="/help-center" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-amber-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns-exchanges" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-red-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/contact-support" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Contact Support
                </Link>
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
                <Link to="/about-us" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  About Us
                </Link>
              </li>
              {/* <li>
                <a href="/careers" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Careers
                </a>
              </li> */}
              <li>
                <Link to="/privacy-policy" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-slate-600 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:scale-105 transform">
                  <span className="w-1 h-1 bg-amber-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Terms of Service
                </Link>
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
      <div className="border-t border-b-0 border-slate-700 bg-slate-900/50">
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
            <div className="flex items-center gap-4 mr-24">
              <span className="text-slate-400 text-xs">We Accept:</span>
              <div className="flex items-center gap-2">
                {/* Cash Payment */}
                <div className="w-8 h-6 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center hover:bg-green-600 transition-all duration-300 group relative overflow-hidden">
                  <CurrencyDollarIcon className="h-3 w-3 text-slate-300 group-hover:text-white transition-all duration-300 group-hover:scale-125" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Mobile Payment */}
                <div className="w-8 h-6 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group relative overflow-hidden">
                  <DevicePhoneMobileIcon className="h-3 w-3 text-slate-300 group-hover:text-white transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                  </div>
                </div>

                {/* Credit Card */}
                <div className="w-8 h-6 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center hover:bg-purple-600 transition-all duration-300 group relative overflow-hidden">
                  <svg className="h-3 w-3 text-slate-300 group-hover:text-white transition-all duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm2 2v2h16V6H4zm0 4v8h16v-8H4zm4 4h4v2H8v-2z"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    <div className="w-3 h-0.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Bank Transfer */}
                <div className="w-8 h-6 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center hover:bg-indigo-600 transition-all duration-300 group relative overflow-hidden">
                  <svg className="h-3 w-3 text-slate-300 group-hover:text-white transition-all duration-300 group-hover:scale-105" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 7.5C2 6.67157 2.67157 6 3.5 6H20.5C21.3284 6 22 6.67157 22 7.5V8.5C22 9.32843 21.3284 10 20.5 10H3.5C2.67157 10 2 9.32843 2 8.5V7.5Z"/>
                    <path d="M2 12.5C2 11.6716 2.67157 11 3.5 11H20.5C21.3284 11 22 11.6716 22 12.5V16.5C22 17.3284 21.3284 18 20.5 18H3.5C2.67157 18 2 17.3284 2 16.5V12.5Z"/>
                    <path d="M6 13H8V15H6V13Z"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                    <svg className="h-4 w-4 text-white animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                </div>

                {/* PayPal Style */}
                <div className="w-8 h-6 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center hover:bg-yellow-600 transition-all duration-300 group relative overflow-hidden">
                  <svg className="h-3 w-3 text-slate-300 group-hover:text-white transition-all duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106h4.608a.64.64 0 0 0 .633-.74l.118-.746.946-5.985a.64.64 0 0 1 .633-.74h.4c3.773 0 6.724-1.533 7.583-5.967.358-1.85.025-3.4-.866-4.344z"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                    <div className="flex space-x-0.5">
                      <div className="w-0.5 h-2 bg-white animate-pulse" style={{animationDelay: '0s'}}></div>
                      <div className="w-0.5 h-2 bg-white animate-pulse" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-0.5 h-2 bg-white animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/* Large CARTLY branding moved outside footer */}
      {/* Large CARTLY branding at the end */}
        </div>
      </div>
    </footer>
    <div
      className="relative w-full flex justify-center items-end select-none overflow-hidden px-4 md:px-8"
      style={{ 
        backgroundColor: 'rgb(16 24 42)',
        height: 'clamp(110px, 12vh, 250px)', // Reduced min height for mobile
        paddingTop: '0.5rem', // Less top space on mobile
      }}
    >
        {/* Fog effect overlay */}
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
        
        <div
          className="absolute bottom-0 left-0 right-0 w-full flex justify-center text-[21vw] sm:text-[17vw] md:text-[14vw] lg:text-[11vw] xl:text-[9vw] 2xl:text-[8vw] font-extrabold tracking-widest px-0"
          style={{
            lineHeight: 0.7, // Brings text closer to bottom
            opacity: 0.9,
          }}
        >
          {letters.map((letter, index) => (
            <span
              key={index}
              
              className={`
                text-transparent 
                bg-clip-text 
                bg-gradient-to-r 
                from-slate-200 via-white to-slate-300 
                bg-[length:200%_100%] 
                bg-[position:center] 
                transition-all 
                duration-1000 
                ease-[cubic-bezier(0.65,0.05,0.36,1)]
                relative
                
              `}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
     
    </>

  )
}

export default Footer
