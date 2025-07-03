import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext } from '../../context/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext)

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
      {/* Image */}
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-64 object-cover rounded-md mb-3"
        />
      </Link>

      {/* Title */}
      <h3 className="text-lg font-semibold truncate">
        {product.title}
      </h3>

      {/* Price */}
      <p className="text-indigo-600 font-bold text-sm mb-3">
        PKR {product.price}
      </p>

      {/* Add to Cart */}
      <button
        onClick={() => addToCart(product)}
        className="w-full py-2 px-4 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
      >
        Add to Cart
      </button>
    </div>
  )
}

export default ProductCard
