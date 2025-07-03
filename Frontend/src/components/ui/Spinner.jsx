const Spinner = ({ size = 'md', color = 'indigo' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-4 border-${color}-500 border-t-transparent ${sizes[size]}`}
      />
    </div>
  )
}

export default Spinner
