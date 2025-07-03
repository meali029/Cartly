import { useState } from 'react'

const PriceFilter = ({ onChange }) => {
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')

  const handleApply = () => {
    onChange({ min: min || 0, max: max || 999999 })
  }

  const handleReset = () => {
    setMin('')
    setMax('')
    onChange({ min: 0, max: 999999 })
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border w-full md:max-w-xs">
      <h3 className="text-lg font-semibold mb-4">💸 Price Filter</h3>

      <div className="flex gap-2 mb-3">
        <input
          type="number"
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
        <input
          type="number"
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded-md hover:bg-indigo-700"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="flex-1 border text-sm py-2 rounded-md hover:bg-gray-100"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default PriceFilter
