import { 
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import Toast from '../components/ui/Toast'

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setToastMsg('Your message has been sent! Our support team will contact you soon.')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)

    setFormData({
      name: '',
      email: '',
      subject: '',
      category: 'general',
      message: ''
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactMethods = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      availability: 'Available 24/7',
      action: 'Start Chat',
      color: 'green'
    },
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      description: '+92-304-4425653',
      availability: 'Mon-Fri: 9AM-6PM',
      action: 'Call Now',
      color: 'blue'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      description: 'cartly.shopi@gmail.com',
      availability: 'Response within 24 hours',
      action: 'Send Email',
      color: 'purple'
    }
  ]

  const faqs = [
    {
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "My Orders" section.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer 30-day returns on most items. Items must be in original condition with tags attached.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we only ship within Pakistan. International shipping will be available soon.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {showToast && (
        <Toast message={toastMsg} type="success" />
      )}
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-3xl h-100vh">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <ChatBubbleLeftRightIcon className="h-12 w-12 mr-3" />
              <h1 className="text-5xl font-bold">Contact Support</h1>
            </div>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              We're here to help! Get in touch with our customer support team
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className={`bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow border-t-4 ${
              method.color === 'blue' ? 'border-blue-500' :
              method.color === 'green' ? 'border-green-500' :
              'border-purple-500'
            }`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                method.color === 'blue' ? 'bg-blue-500' :
                method.color === 'green' ? 'bg-green-500' :
                'bg-purple-500'
              }`}>
                <method.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-gray-600 mb-2">{method.description}</p>
              <p className="text-sm text-gray-500 mb-4">{method.availability}</p>
              
              <button className={`px-6 py-2 rounded-xl text-white font-semibold hover:shadow-lg transition-all ${
                method.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                method.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                'bg-purple-500 hover:bg-purple-600'
              }`}>
                {method.action}
              </button>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <EnvelopeIcon className="h-6 w-6 text-indigo-500 mr-3" />
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="shipping">Shipping Question</option>
                    <option value="return">Returns & Exchanges</option>
                    <option value="technical">Technical Issue</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief subject line"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  placeholder="Please describe your inquiry in detail..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Info & FAQ */}
          <div className="space-y-8">
            
            {/* Contact Info */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPinIcon className="h-6 w-6 text-purple-500 mr-3" />
                Get in Touch
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600 text-sm">123 Fashion Street, Karachi, Pakistan</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600 text-sm">+92-304-4425653</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600 text-sm">cartly.shopi@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Hours</h3>
                    <p className="text-gray-600 text-sm">24/7 Customer Support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQ */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Help</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="p-3 text-gray-600 text-sm">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <a 
                  href="/help-center" 
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:underline"
                >
                  View All FAQs →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Response Time Info */}
        <div className="bg-gradient-to-br  from-slate-400 to-gray-600 rounded-3xl p-8 text-white text-center mt-12">
          <UserIcon className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">We're Here to Help!</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-indigo-100 text-sm">Instant response during business hours</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="text-indigo-100 text-sm">Response within 24 hours</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
              <p className="text-indigo-100 text-sm">Immediate assistance for urgent issues</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactSupport
