import { 
  BuildingOfficeIcon,
  HeartIcon,
  StarIcon,
  UsersIcon,
  GlobeAltIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

const AboutUs = () => {
  const stats = [
    { number: '50,000+', label: 'Happy Customers', icon: UsersIcon },
    { number: '10,000+', label: 'Products', icon: StarIcon },
    { number: '5+', label: 'Years Experience', icon: TrophyIcon },
    { number: '100+', label: 'Cities Covered', icon: GlobeAltIcon }
  ]

  const team = [
    {
      name: 'Mehboob Ali',
      role: 'Founder & CEO',
      image: '/Mehboobali.jpg',
      description: 'Visionary leader with 10+ years in fashion retail'
    },
    {
      name: 'Sarah Khan',
      role: 'Head of Design',
      image: '/women.avif',
      description: 'Creative director with international fashion experience'
    },
    {
      name: 'Ahmed Hassan',
      role: 'Operations Manager',
      image: '/man.avif',
      description: 'Expert in logistics and supply chain management'
    },
    {
      name: 'Fatima Anwar',
      role: 'Customer Experience',
      image: '/women.avif',
      description: 'Passionate about creating exceptional customer journeys'
    }
  ]

  const values = [
    {
      icon: StarIcon,
      title: 'Quality First',
      description: 'We source only the finest materials and work with trusted manufacturers to ensure every product meets our high standards.',
      color: 'yellow'
    },
    {
      icon: HeartIcon,
      title: 'Customer Love',
      description: 'Our customers are at the heart of everything we do. We listen, we care, and we continuously improve based on your feedback.',
      color: 'red'
    },
    {
      icon: GlobeAltIcon,
      title: 'Sustainability',
      description: 'We\'re committed to sustainable fashion practices and reducing our environmental impact for future generations.',
      color: 'green'
    },
    {
      icon: UsersIcon,
      title: 'Inclusivity',
      description: 'Fashion is for everyone. We celebrate diversity and offer styles that make everyone feel confident and beautiful.',
      color: 'purple'
    }
  ]

  // Animation state for team reveal
  const [visibleIndex, setVisibleIndex] = useState(-1)
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setVisibleIndex(i)
      i++
      if (i >= team.length) clearInterval(interval)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BuildingOfficeIcon className="h-12 w-12 mr-3" />
              <h1 className="text-5xl font-bold">About Cartly</h1>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Pakistan's premier online fashion destination, bringing you style, quality, and convenience since 2019
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-xl p-6 text-center hover:shadow-2xl transition-shadow">
              <stat.icon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Founded in 2019 with a simple mission: to make high-quality fashion accessible to everyone across Pakistan. 
                  What started as a small online boutique has grown into the country's leading fashion e-commerce platform.
                </p>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  We believe that great style shouldn't be limited by geography or budget. That's why we've built a platform 
                  that brings international fashion trends to your doorstep, with prices that won't break the bank.
                </p>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  Today, we're proud to serve over 50,000 customers across 100+ cities in Pakistan, offering everything from 
                  casual wear to formal attire, all backed by our commitment to quality and customer satisfaction.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-4xl"><img src="/Cartly-logo.png" alt="Cartly Logo" /></span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Cartly</h3>
                <p className="text-slate-600">Redefining Fashion Retail in Pakistan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  value.color === 'yellow' ? 'bg-yellow-500' :
                  value.color === 'red' ? 'bg-red-500' :
                  value.color === 'green' ? 'bg-green-500' :
                  'bg-purple-500'
                }`}>
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className={`relative text-center group transition-all duration-700 ease-in-out
                  ${index <= visibleIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                `}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Profile Picture */}
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg transition-all duration-500 group-hover:scale-90 group-hover:-translate-y-8 z-10 bg-white">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Details Card on Hover */}
                <div className="absolute left-1/2 top-1/2 w-72 max-w-[90vw] -translate-x-1/2 translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
                    <p className="text-gray-500 text-sm">{member.description}</p>
                  </div>
                </div>
                {/* Basic Info (hidden on hover) */}
                <div className="transition-opacity duration-300 group-hover:opacity-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-slate-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-500 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-blue-100 leading-relaxed">
              To democratize fashion by making high-quality, stylish clothing accessible to everyone across Pakistan. 
              We strive to provide an exceptional shopping experience that combines convenience, affordability, and style, 
              while supporting local communities and sustainable practices.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-purple-100 leading-relaxed">
              To become the most loved and trusted fashion platform in Pakistan, known for our commitment to quality, 
              innovation, and customer satisfaction. We envision a future where everyone has access to fashion that 
              makes them feel confident, comfortable, and stylish.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white text-center mt-12">
          <HeartIcon className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Join the Cartly Family</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Be part of our journey as we continue to revolutionize fashion retail in Pakistan. 
            Follow us on social media and stay updated with our latest collections and offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Shop Our Collection
            </button>
            <button className="bg-slate-700 border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-600 transition-colors">
              Follow Us
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
