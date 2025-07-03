import ProductCard from './ProductCard'

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return <p className="text-gray-500 text-center mt-10">No products found 😕</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
