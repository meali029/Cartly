const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        
        {/* Left */}
        <div className="mb-2 md:mb-0">
          &copy; {year} <span className="font-semibold text-indigo-600">Cratly</span>. All rights reserved.
        </div>

        {/* Right */}
        <div className="space-x-4">
          <a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600 transition">Terms</a>
          <a href="mailto:support@cratly.com" className="hover:text-indigo-600 transition">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
