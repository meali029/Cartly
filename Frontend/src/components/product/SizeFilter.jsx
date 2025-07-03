const sizes = ['S', 'M', 'L', 'XL']

const SizeFilter = ({ selectedSize, onChange }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">🧤 Size</h3>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={`px-4 py-1 rounded-full text-sm border ${
              selectedSize === size
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {size}
          </button>
        ))}

        {/* Reset */}
        {selectedSize && (
          <button
            onClick={() => onChange(null)}
            className="text-sm text-red-500 underline ml-2"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

export default SizeFilter
