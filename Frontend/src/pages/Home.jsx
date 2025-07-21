import { Link } from 'react-router-dom'
import ProductGrid from '../components/product/ProductGrid'
import { useEffect, useState } from 'react'
import { useSocket } from '../hooks/useSocket'
import axios from 'axios'
import { 
  ArrowRightIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  UserIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import Toast from '../components/ui/Toast'


const Home = () => {
  const [menProducts, setMenProducts] = useState([])
  const [womenProducts, setWomenProducts] = useState([])
  const [kidsProducts, setKidsProducts] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)

  // Modern hero carousel images with professional themes
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Premium Fashion',
      subtitle: 'Discover timeless elegance',
      cta: 'Explore Collection',
      link: '/men'
    },
    {
      url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      title: 'Style Redefined',
      subtitle: 'For every member of your family',
      cta: 'Shop Now',
      link: '/women'
    },
    {
      url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Express Delivery',
      subtitle: 'Fast & reliable shipping',
      cta: 'Learn More',
      link: '/men'
    }
  ]

  // Auto-slide carousel with smooth transitions
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(slideInterval)
  }, [heroImages.length])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch 4 products for each category
        const resMen = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?category=men&limit=4`)
        const resWomen = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?category=women&limit=4`)
        const resKids = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?category=kids&limit=4`)

        setMenProducts(resMen.data.products || resMen.data)
        setWomenProducts(resWomen.data.products || resWomen.data)
        setKidsProducts(resKids.data.products || resKids.data)
      } catch (err) {
        Toast('Failed to load products', err)  
      }
    }

    fetchProducts()
  }, [])

  // Socket listener for real-time stock updates
  useSocket({
    'stock:update': (data) => {
    
      
      // Update stock in all product categories
      const updateProductStock = (products) => 
        products.map(product => 
          product._id === data.productId 
            ? { ...product, stock: data.newStock }
            : product
        )
      
      setMenProducts(prevProducts => updateProductStock(prevProducts))
      setWomenProducts(prevProducts => updateProductStock(prevProducts))
      setKidsProducts(prevProducts => updateProductStock(prevProducts))
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Modern Hero Carousel */}
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <div 
          className="flex transition-all duration-1000 ease-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroImages.map((image, index) => (
            <div
              key={index}
              className="min-w-full h-full relative group"
            >
              {/* Background Image with Parallax Effect */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-3000 group-hover:scale-105"
                style={{ backgroundImage: `url(${image.url})` }}
              />
              
              {/* Modern Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-800/50 to-transparent"></div>
              
              {/* Content with Advanced Animations */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 lg:px-12">
                  <div className="max-w-2xl">
                    <div className={`transform transition-all duration-1000 delay-300 ${
                      index === currentSlide 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-8 opacity-0'
                    }`}>
                      <h1 className="text-5xl md:text-7xl font-bold text-white mb-10 md:mb-14 sm:mb-16 leading-tight">
                        {image.title}
                      </h1>
                      <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed ml-9 sm:ml-11 sm:mb-4 md:pt-5 pt-4">
                        {image.subtitle}
                      </p>
                      <Link 
                        to={image.link}
                        className="group inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                      >
                        {image.cta}
                        <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modern Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-12 h-3 bg-white rounded-full' 
                  : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Modern Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all duration-300 flex items-center justify-center group"
        >
          <ArrowRightIcon className="w-6 h-6 rotate-180 transition-transform group-hover:-translate-x-1" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all duration-300 flex items-center justify-center group"
        >
          <ArrowRightIcon className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Modern Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <CurrencyDollarIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Cash on Delivery</h3>
            <p className="text-slate-600 leading-relaxed">Pay when you receive your order. Shop with complete confidence and zero risk.</p>
          </div>
          
          <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <TruckIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Express Delivery</h3>
            <p className="text-slate-600 leading-relaxed">Lightning-fast delivery across Pakistan. Get your orders within 2-3 business days.</p>
          </div>
          
          <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheckIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Premium Quality</h3>
            <p className="text-slate-600 leading-relaxed">Carefully curated collection of authentic, high-quality fashion items.</p>
          </div>
        </div>

        {/* Modern Product Sections */}
        <div className="space-y-20">
          {/* Men's Collection */}
          <section className="group">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">Men's Collection</h2>
                  <p className="text-slate-600">Discover sophisticated style for the modern gentleman</p>
                </div>
              </div>
              <Link 
                to="/men" 
                className="group inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View All
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-500">
              <ProductGrid products={menProducts} />
            </div>
          </section>

          {/* Women's Collection */}
          <section className="group">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                  <HeartIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">Women's Collection</h2>
                  <p className="text-slate-600">Elegant fashion for the confident woman</p>
                </div>
              </div>
              <Link 
                to="/women" 
                className="group inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View All
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-500">
              <ProductGrid products={womenProducts} />
            </div>
          </section>

          {/* Kids Collection */}
          <section className="group">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">Kids Collection</h2>
                  <p className="text-slate-600">Comfortable and playful styles for little ones</p>
                </div>
              </div>
              <Link 
                to="/kids" 
                className="group inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View All
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-500">
              <ProductGrid products={kidsProducts} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Home
