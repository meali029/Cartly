const categories = ['All', 'Men', 'Women', 'Kids']

const CategoryFilter = ({ selectedCategory, onChange }) => {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat.toLowerCase())}
          className={`px-4 py-2 rounded-full text-sm border 
            ${selectedCategory === cat.toLowerCase()
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
