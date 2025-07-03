import { Link } from 'react-router-dom'
import ProductGrid from '../components/product/ProductGrid'
import { useEffect, useState } from 'react'
import axios from 'axios'


const Home = () => {
  const [menProducts, setMenProducts] = useState([])
  const [womenProducts, setWomenProducts] = useState([])
  const [kidsProducts, setKidsProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resMen = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?category=men&limit=3`)
        const resWomen = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?category=women&limit=3`)
        const resKids = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?category=kids&limit=3`)

        setMenProducts(resMen.data.products || resMen.data)
        setWomenProducts(resWomen.data.products || resWomen.data)
        setKidsProducts(resKids.data.products || resKids.data)
      } catch (err) {
        console.error('Home product fetch failed:', err)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="px-4 py-6">
      {/* Hero */}
      <div className="bg-indigo-50 rounded-xl p-6 text-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-700 mb-2">Welcome to Cratly 🛍️</h1>
        <p className="text-gray-600">Pakistan’s Next Gen Online Store for Men, Women & Kids</p>
      </div>

      {/* Men */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">👔 Men’s Collection</h2>
          <Link to="/men" className="text-indigo-600 text-sm hover:underline">View All</Link>
        </div>
        <ProductGrid products={menProducts} />
      </section>

      {/* Women */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">👗 Women’s Collection</h2>
          <Link to="/women" className="text-indigo-600 text-sm hover:underline">View All</Link>
        </div>
        <ProductGrid products={womenProducts} />
      </section>

      {/* Kids */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">🧒 Kids Collection</h2>
          <Link to="/kids" className="text-indigo-600 text-sm hover:underline">View All</Link>
        </div>
        <ProductGrid products={kidsProducts} />
      </section>
    </div>
  )
}

export default Home
