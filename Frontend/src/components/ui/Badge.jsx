const Badge = ({ text, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-800',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    indigo: 'bg-indigo-100 text-indigo-700',
  }

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${colors[color] || colors.gray}`}
    >
      {text}
    </span>
  )
}

export default Badge
