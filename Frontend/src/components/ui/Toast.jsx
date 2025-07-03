const Toast = ({ message, type = 'success' }) => {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }

  return (
    <div className={`fixed top-5 right-5 z-50 text-white px-4 py-2 rounded-md shadow-md animate-fade-in-up ${bgColor[type]}`}>
      {message}
    </div>
  )
}

export default Toast
