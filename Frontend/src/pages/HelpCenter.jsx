import { 
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const faqs = [
    {
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "My Orders" section. You\'ll receive tracking information via email once your order ships.'
    },
    {
      category: 'shipping',
      question: 'What are your shipping options?',
      answer: 'We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Free shipping is available on orders over PKR 5,000.'
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase. Items must be unused, with original tags attached. Return shipping is free for defective items.'
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, mobile wallets, and cash on delivery for eligible orders.'
    },
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click on the "Register" button in the top right corner, fill in your details, and verify your email address to complete the registration process.'
    },
    {
      category: 'sizing',
      question: 'How do I find the right size?',
      answer: 'Use our size guide available on each product page. If you\'re between sizes, we generally recommend sizing up for a more comfortable fit.'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Topics', count: faqs.length },
    { id: 'orders', name: 'Orders', count: faqs.filter(f => f.category === 'orders').length },
    { id: 'shipping', name: 'Shipping', count: faqs.filter(f => f.category === 'shipping').length },
    { id: 'returns', name: 'Returns', count: faqs.filter(f => f.category === 'returns').length },
    { id: 'payment', name: 'Payment', count: faqs.filter(f => f.category === 'payment').length },
    { id: 'account', name: 'Account', count: faqs.filter(f => f.category === 'account').length },
    { id: 'sizing', name: 'Sizing', count: faqs.filter(f => f.category === 'sizing').length }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <QuestionMarkCircleIcon className="h-12 w-12 mr-3" />
              <h1 className="text-5xl font-bold">Help Center</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find answers to your questions or get in touch with our support team
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Categories</h3>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-800 font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Contact Options */}
              <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3">Need More Help?</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Live Chat Support</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2 text-green-500" />
                    <span>+92-300-1234567</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2 text-purple-500" />
                    <span>support@cartly.com</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2 text-orange-500" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
                {searchTerm && (
                  <span className="text-lg font-normal text-gray-600 ml-2">
                    ({filteredFAQs.length} results for "{searchTerm}")
                  </span>
                )}
              </h2>
              
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <QuestionMarkCircleIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your search terms or browse all categories</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredFAQs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mr-3 mt-1 ${
                          faq.category === 'orders' ? 'bg-blue-100 text-blue-800' :
                          faq.category === 'shipping' ? 'bg-green-100 text-green-800' :
                          faq.category === 'returns' ? 'bg-orange-100 text-orange-800' :
                          faq.category === 'payment' ? 'bg-purple-100 text-purple-800' :
                          faq.category === 'account' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {faq.category}
                        </span>
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed ml-16">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white">
                <ChatBubbleLeftRightIcon className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                <p className="text-blue-100 mb-4">Get instant help from our support team</p>
                <p className="text-sm text-blue-200 mb-4">
                  Click the chat icon in the bottom right corner to start a conversation
                </p>
                <div className="bg-white/20 text-blue-100 px-6 py-2 rounded-lg font-semibold inline-block">
                  Chat Available 24/7
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white">
                <PhoneIcon className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Call Support</h3>
                <p className="text-green-100 mb-4">Speak directly with our experts</p>
                <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenter
