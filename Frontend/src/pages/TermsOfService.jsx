import { 
  DocumentTextIcon,
  ScaleIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

const TermsOfService = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: DocumentTextIcon,
      content: [
        {
          text: 'By accessing and using the Cartly website and services, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service constitute a legally binding agreement between you and Cartly.'
        },
        {
          text: 'If you do not agree to abide by the above, please do not use our service. We reserve the right to change these terms at any time, and your continued use of the site will signify your acceptance of any adjustment to these terms.'
        }
      ]
    },
    {
      id: 'account-terms',
      title: 'Account Terms',
      icon: UserIcon,
      content: [
        {
          subtitle: 'Account Creation',
          text: 'You must provide accurate, complete, and current information during the registration process and keep your account information updated. You are responsible for safeguarding your password and all activities that occur under your account.'
        },
        {
          subtitle: 'Account Security',
          text: 'You must not share your account credentials with others. Notify us immediately of any unauthorized use of your account. We are not liable for any loss or damage arising from your failure to secure your account information.'
        },
        {
          subtitle: 'Account Suspension',
          text: 'We reserve the right to suspend or terminate your account if you violate these terms, engage in fraudulent activities, or misuse our services.'
        }
      ]
    },
    {
      id: 'orders-payments',
      title: 'Orders and Payments',
      icon: CreditCardIcon,
      content: [
        {
          subtitle: 'Order Placement',
          text: 'By placing an order, you make an offer to purchase products subject to these terms. We reserve the right to accept or decline any order for any reason. Order confirmation does not guarantee product availability.'
        },
        {
          subtitle: 'Pricing',
          text: 'All prices are listed in Pakistani Rupees (PKR) and are subject to change without notice. We strive to display accurate pricing, but errors may occur. In case of pricing errors, we reserve the right to cancel orders.'
        },
        {
          subtitle: 'Payment Processing',
          text: 'Payment must be received before order processing. We accept various payment methods including credit cards, debit cards, and mobile payments. All transactions are processed securely.'
        },
        {
          subtitle: 'Refunds',
          text: 'Refunds are processed according to our Returns & Exchanges policy. Processing time may vary depending on your payment method and financial institution.'
        }
      ]
    },
    {
      id: 'shipping-delivery',
      title: 'Shipping and Delivery',
      icon: ShieldCheckIcon,
      content: [
        {
          subtitle: 'Delivery Areas',
          text: 'We currently deliver within Pakistan only. Delivery times are estimates and may vary based on location, product availability, and external factors beyond our control.'
        },
        {
          subtitle: 'Shipping Costs',
          text: 'Shipping costs are calculated based on delivery location and order value. Free shipping may be available for orders meeting minimum purchase requirements.'
        },
        {
          subtitle: 'Risk of Loss',
          text: 'Risk of loss and title for products purchased pass to you upon delivery to the carrier. We are not responsible for lost or stolen packages after delivery confirmation.'
        }
      ]
    },
    {
      id: 'returns-exchanges',
      title: 'Returns and Exchanges',
      icon: ScaleIcon,
      content: [
        {
          subtitle: 'Return Policy',
          text: 'Returns are accepted within 30 days of purchase for most items. Items must be in original condition with tags attached. Some items may not be returnable due to hygiene or safety reasons.'
        },
        {
          subtitle: 'Exchange Process',
          text: 'Exchanges are subject to product availability. We will arrange pickup of the original item and delivery of the replacement item. Exchange requests must be initiated through your account.'
        },
        {
          subtitle: 'Return Shipping',
          text: 'Return shipping is provided free of charge for defective items or our errors. For other returns, return shipping costs may apply as specified in our return policy.'
        }
      ]
    },
    {
      id: 'prohibited-uses',
      title: 'Prohibited Uses',
      icon: ExclamationTriangleIcon,
      content: [
        {
          text: 'You may not use our services for any unlawful purpose or to solicit others to perform unlawful acts. You may not violate any laws in your jurisdiction including but not limited to copyright laws.'
        },
        {
          text: 'You may not transmit any worms, viruses, or any code of a destructive nature. You may not attempt to interfere with, compromise the system integrity or security, or decipher any transmissions to or from our servers.'
        },
        {
          text: 'You may not use our services to harvest or collect information about users without their consent. Commercial use of our services without written permission is prohibited.'
        }
      ]
    }
  ]

  const quickLinks = [
    { label: 'Acceptance of Terms', href: '#acceptance' },
    { label: 'Account Terms', href: '#account-terms' },
    { label: 'Orders & Payments', href: '#orders-payments' },
    { label: 'Shipping & Delivery', href: '#shipping-delivery' },
    { label: 'Returns & Exchanges', href: '#returns-exchanges' },
    { label: 'Prohibited Uses', href: '#prohibited-uses' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <ScaleIcon className="h-12 w-12 mr-3" />
              <h1 className="text-5xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Please read these terms carefully before using our services
            </p>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 text-center">
          <p className="text-gray-600">
            <strong>Last Updated:</strong> January 15, 2025 | 
            <strong className="ml-2">Effective Date:</strong> January 15, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Quick Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Navigation</h3>
              
              <nav className="space-y-2">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Contact our legal team for questions about these terms.
                </p>
                <a 
                  href="/contact-support" 
                  className="inline-block bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Introduction */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Introduction</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-4">
                  Welcome to Cartly! These Terms of Service ("Terms") govern your use of our website, mobile application, 
                  and services provided by Cartly (collectively, the "Service") operated by Cartly Private Limited.
                </p>
                <p className="mb-4">
                  Our Service provides an online platform for purchasing fashion and lifestyle products. By accessing or 
                  using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, 
                  then you may not access the Service.
                </p>
                <p>
                  These Terms apply to all visitors, users, and others who access or use the Service. We reserve the right 
                  to update and change the Terms of Service by posting updates and changes to the Cartly website.
                </p>
              </div>
            </div>

            {/* Terms Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} id={section.id} className="bg-white rounded-3xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <section.icon className="h-8 w-8 text-gray-600 mr-3" />
                    {section.title}
                  </h2>
                  
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        {item.subtitle && (
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.subtitle}</h3>
                        )}
                        <p className="text-gray-600 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Terms */}
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              
              {/* Intellectual Property */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Intellectual Property</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    The Service and its original content, features, and functionality are and will remain the exclusive 
                    property of Cartly and its licensors.
                  </p>
                  <p>
                    The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress 
                    may not be used in connection with any product or service without our prior written consent.
                  </p>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    In no event shall Cartly, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                    be liable for any indirect, incidental, special, consequential, or punitive damages.
                  </p>
                  <p>
                    Our total liability to you for all damages arising out of or related to your use of the Service 
                    shall not exceed the amount paid by you to us in the 12 months preceding the claim.
                  </p>
                </div>
              </div>

              {/* Governing Law */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    These Terms shall be interpreted and governed in accordance with the laws of Pakistan, 
                    without regard to its conflict of law provisions.
                  </p>
                  <p>
                    Any disputes arising from these Terms or your use of the Service shall be subject to the 
                    exclusive jurisdiction of the courts in Karachi, Pakistan.
                  </p>
                </div>
              </div>

              {/* Termination */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Termination</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    We may terminate or suspend your account and bar access to the Service immediately, without prior 
                    notice or liability, under our sole discretion, for any reason whatsoever.
                  </p>
                  <p>
                    Upon termination, your right to use the Service will cease immediately. If you wish to terminate 
                    your account, you may simply discontinue using the Service.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="prose text-gray-600">
                <p className="mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                      <p className="text-gray-600">cartly.shopi@gmail.com</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
                      <p className="text-gray-600">+92-304-4425653</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                      <p className="text-gray-600">123 Fashion Street<br />Karachi, Pakistan</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Business Hours</h4>
                      <p className="text-gray-600">Monday - Friday<br />9:00 AM - 6:00 PM (PKT)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Agreement */}
            <div className="bg-gradient-to-br from-gray-800 to-slate-800 rounded-3xl p-8 text-white text-center mt-8">
              <DocumentTextIcon className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Agreement</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                By using our services, you acknowledge that you have read and understand these Terms of Service 
                and agree to be bound by them.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                  Print Terms
                </button>
                <button className="bg-gray-700 border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
