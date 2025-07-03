import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
      <h1 className="text-6xl font-bold text-indigo-600 mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">Oops! The page you're looking for doesn't exist.</p>

      <Link
        to="/"
        className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  )
}

export default NotFound
