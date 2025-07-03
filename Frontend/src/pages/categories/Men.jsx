import { useState, useEffect } from 'react'
import axios from 'axios'

import ProductGrid from '../../components/product/ProductGrid'
import PriceFilter from '../../components/product/PriceFilter'
import SizeFilter from '../../components/product/SizeFilter'
import SortDropdown from '../../components/product/SortDropdown'
import Pagination from '../../components/product/Pagination'

const Men = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [price, setPrice] = useState({ min: 0, max: 999999 })
  const [size, setSize] = useState(null)
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        const query = new URLSearchParams({
          category: 'men',
          page,
          limit: 6,
          minPrice: price.min,
          maxPrice: price.max,
          ...(size && { size }),
          ...(sort && { sort }),
        })

        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?${query.toString()}`)

        setProducts(res.data.products || res.data)
        setTotalPages(res.data.totalPages || 1)
      } catch (err) {
        console.error('❌ Failed to fetch men products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [price, size, sort, page])

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">👕 Men’s Collection</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="md:col-span-1 space-y-4">
          <PriceFilter onChange={setPrice} />
          <SizeFilter selectedSize={size} onChange={setSize} />
          <SortDropdown sortOption={sort} onChange={setSort} />
        </div>

        {/* Products */}
        <div className="md:col-span-3">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <>
              <ProductGrid products={products} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Men
