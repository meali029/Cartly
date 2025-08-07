import { 
  ShieldCheckIcon,
  EyeIcon,
  KeyIcon,
  DocumentTextIcon,
  UserIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: DocumentTextIcon,
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect information you provide directly, such as your name, email address, phone number, shipping address, and payment information when you create an account, make purchases, or contact us.'
        },
        {
          subtitle: 'Usage Information',
          text: 'We automatically collect information about how you use our website, including your IP address, browser type, pages visited, time spent on pages, and referring website.'
        },
        {
          subtitle: 'Device Information',
          text: 'We may collect information about the device you use to access our services, including device type, operating system, and unique device identifiers.'
        }
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: UserIcon,
      content: [
        {
          subtitle: 'Service Provision',
          text: 'We use your information to provide, maintain, and improve our services, process transactions, and communicate with you about your orders and account.'
        },
        {
          subtitle: 'Personalization',
          text: 'We may use your information to personalize your shopping experience, recommend products, and display relevant content and advertisements.'
        },
        {
          subtitle: 'Communication',
          text: 'We use your contact information to send you order updates, promotional materials (with your consent), and respond to your inquiries.'
        },
        {
          subtitle: 'Analytics',
          text: 'We analyze usage patterns to understand how our services are used and to improve user experience and business operations.'
        }
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: EyeIcon,
      content: [
        {
          subtitle: 'Service Providers',
          text: 'We share information with trusted third-party service providers who help us operate our business, such as payment processors, shipping companies, and marketing platforms.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information when required by law, to protect our rights, or in response to legal requests from government authorities.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.'
        },
        {
          subtitle: 'Consent',
          text: 'We may share information with your explicit consent for specific purposes not covered in this policy.'
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: ShieldCheckIcon,
      content: [
        {
          subtitle: 'Security Measures',
          text: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          subtitle: 'Payment Security',
          text: 'All payment information is encrypted and processed through secure payment gateways. We do not store complete credit card information on our servers.'
        },
        {
          subtitle: 'Data Retention',
          text: 'We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy or as required by law.'
        }
      ]
    },
    {
      id: 'user-rights',
      title: 'Your Rights',
      icon: KeyIcon,
      content: [
        {
          subtitle: 'Access and Update',
          text: 'You have the right to access, update, or correct your personal information through your account settings or by contacting us.'
        },
        {
          subtitle: 'Data Deletion',
          text: 'You may request deletion of your personal information, subject to certain legal and business requirements.'
        },
        {
          subtitle: 'Marketing Opt-out',
          text: 'You can opt out of receiving promotional communications by following the unsubscribe instructions in emails or updating your account preferences.'
        },
        {
          subtitle: 'Account Deactivation',
          text: 'You may deactivate your account at any time through your account settings or by contacting our customer support.'
        }
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      icon: CreditCardIcon,
      content: [
        {
          subtitle: 'Cookies Usage',
          text: 'We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze website traffic.'
        },
        {
          subtitle: 'Cookie Types',
          text: 'We use essential cookies for website functionality, performance cookies for analytics, and marketing cookies for advertising (with your consent).'
        },
        {
          subtitle: 'Cookie Control',
          text: 'You can control cookie settings through your browser preferences. Note that disabling certain cookies may affect website functionality.'
        }
      ]
    }
  ]

  const quickLinks = [
    { label: 'Information Collection', href: '#information-collection' },
    { label: 'How We Use Data', href: '#information-use' },
    { label: 'Information Sharing', href: '#information-sharing' },
    { label: 'Data Security', href: '#data-security' },
    { label: 'Your Rights', href: '#user-rights' },
    { label: 'Cookies & Tracking', href: '#cookies' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <ShieldCheckIcon className="h-12 w-12 mr-3" />
              <h1 className="text-5xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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
                    className="block px-4 py-3 text-gray-600 hover:text-slate-900 hover:bg-gray-50 rounded-xl transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-gray-900 mb-2">Questions?</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Contact our privacy team for any questions about this policy.
                </p>
                <a 
                  href="/contact-support" 
                  className="inline-block bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
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
                  At Cartly, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
                  our website or use our services.
                </p>
                <p className="mb-4">
                  By using our services, you consent to the collection and use of your information in accordance with this 
                  Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
                  new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
              </div>
            </div>

            {/* Policy Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} id={section.id} className="bg-white rounded-3xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <section.icon className="h-8 w-8 text-slate-600 mr-3" />
                    {section.title}
                  </h2>
                  
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.subtitle}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="prose text-gray-600">
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                      <p className="text-gray-600">cartly.shopi@gmail.com</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
                      <p className="text-gray-600">+92-300-1234567</p>
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

            {/* Consent */}
            <div className="bg-gradient-to-br from-slate-800 to-gray-800 rounded-3xl p-8 text-white text-center mt-8">
              <ShieldCheckIcon className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Your Privacy Matters</h2>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                We are committed to maintaining the highest standards of privacy and security. 
                Your trust is important to us, and we work hard to protect your personal information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-slate-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                  Manage Privacy Settings
                </button>
                <button className="bg-slate-700 border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-600 transition-colors">
                  Download Privacy Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
