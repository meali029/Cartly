import { 
  BriefcaseIcon,
  UserGroupIcon,
  StarIcon,
  TrophyIcon,
  HeartIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const Careers = () => {
  const openPositions = [
    {
      title: 'Senior Frontend Developer',
      department: 'Technology',
      type: 'Full-time',
      location: 'Karachi',
      description: 'Build amazing user experiences with React and modern web technologies',
      requirements: ['3+ years React experience', 'TypeScript proficiency', 'UI/UX understanding'],
      color: 'blue'
    },
    {
      title: 'Digital Marketing Manager',
      department: 'Marketing',
      type: 'Full-time',
      location: 'Lahore',
      description: 'Lead our digital marketing strategy and grow our online presence',
      requirements: ['Digital marketing experience', 'Social media expertise', 'Analytics skills'],
      color: 'purple'
    },
    {
      title: 'Customer Success Specialist',
      department: 'Customer Service',
      type: 'Full-time',
      location: 'Remote',
      description: 'Help our customers have the best possible experience with Cartly',
      requirements: ['Excellent communication', 'Problem-solving skills', 'Customer-first mindset'],
      color: 'green'
    },
    {
      title: 'Fashion Buyer',
      department: 'Merchandising',
      type: 'Full-time',
      location: 'Karachi',
      description: 'Source and select the latest fashion trends for our platform',
      requirements: ['Fashion industry experience', 'Trend forecasting', 'Vendor relationships'],
      color: 'pink'
    },
    {
      title: 'Data Analyst',
      department: 'Analytics',
      type: 'Full-time',
      location: 'Remote',
      description: 'Turn data into insights that drive business decisions',
      requirements: ['SQL proficiency', 'Python/R skills', 'Business intelligence tools'],
      color: 'orange'
    },
    {
      title: 'UX/UI Designer',
      department: 'Design',
      type: 'Contract',
      location: 'Islamabad',
      description: 'Design beautiful and intuitive user experiences',
      requirements: ['Design portfolio', 'Figma/Sketch skills', 'User research experience'],
      color: 'indigo'
    }
  ]

  const benefits = [
    {
      icon: StarIcon,
      title: 'Competitive Salary',
      description: 'Above-market compensation packages with performance bonuses'
    },
    {
      icon: HeartIcon,
      title: 'Health Insurance',
      description: 'Comprehensive health coverage for you and your family'
    },
    {
      icon: AcademicCapIcon,
      title: 'Learning & Development',
      description: 'Continuous learning opportunities and skill development programs'
    },
    {
      icon: UserGroupIcon,
      title: 'Team Culture',
      description: 'Collaborative, inclusive, and fun work environment'
    },
    {
      icon: TrophyIcon,
      title: 'Career Growth',
      description: 'Clear career progression paths and leadership opportunities'
    },
    {
      icon: BriefcaseIcon,
      title: 'Flexible Work',
      description: 'Remote work options and flexible working hours'
    }
  ]

  const departments = [
    { name: 'Technology', positions: 8, description: 'Building the future of fashion e-commerce' },
    { name: 'Marketing', positions: 4, description: 'Growing our brand and customer base' },
    { name: 'Operations', positions: 6, description: 'Ensuring smooth business operations' },
    { name: 'Customer Service', positions: 12, description: 'Delivering exceptional customer experiences' },
    { name: 'Design', positions: 3, description: 'Creating beautiful and functional designs' },
    { name: 'Analytics', positions: 2, description: 'Data-driven insights and decisions' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BriefcaseIcon className="h-12 w-12 mr-3" />
              <h1 className="text-5xl font-bold">Careers at Cartly</h1>
            </div>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Join our team and help shape the future of fashion e-commerce in Pakistan
            </p>
          </div>
        </div>
      </div>

      {/* Why Work With Us */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Work With Us?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation First</h3>
              <p className="text-gray-600">Be part of a team that's constantly pushing boundaries and embracing new technologies to revolutionize fashion retail.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Amazing Team</h3>
              <p className="text-gray-600">Work alongside talented, passionate individuals who share your commitment to excellence and customer satisfaction.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Impact & Growth</h3>
              <p className="text-gray-600">Make a real difference in how millions of people shop for fashion while growing your own skills and career.</p>
            </div>
          </div>
        </div>

        {/* Departments */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Departments</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full">
                    {dept.positions} positions
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{dept.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Open Positions</h2>
          
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className={`border-l-4 bg-gray-50 rounded-r-2xl p-6 hover:shadow-md transition-shadow ${
                position.color === 'blue' ? 'border-blue-500' :
                position.color === 'purple' ? 'border-purple-500' :
                position.color === 'green' ? 'border-green-500' :
                position.color === 'pink' ? 'border-pink-500' :
                position.color === 'orange' ? 'border-orange-500' :
                'border-indigo-500'
              }`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center flex-wrap gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{position.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        position.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                        position.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                        position.color === 'green' ? 'bg-green-100 text-green-800' :
                        position.color === 'pink' ? 'bg-pink-100 text-pink-800' :
                        position.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {position.department}
                      </span>
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        {position.type}
                      </span>
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        📍 {position.location}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{position.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {position.requirements.map((req, reqIndex) => (
                        <span key={reqIndex} className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="lg:ml-6">
                    <button className={`w-full lg:w-auto px-6 py-2 rounded-xl text-white font-semibold hover:shadow-lg transition-all ${
                      position.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                      position.color === 'purple' ? 'bg-purple-500 hover:bg-purple-600' :
                      position.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                      position.color === 'pink' ? 'bg-pink-500 hover:bg-pink-600' :
                      position.color === 'orange' ? 'bg-orange-500 hover:bg-orange-600' :
                      'bg-indigo-500 hover:bg-indigo-600'
                    }`}>
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Benefits & Perks</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Application Process */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white text-center">
          <BriefcaseIcon className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Ready to Join Us?</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Don't see a position that fits? We're always looking for talented individuals. 
            Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Submit Application
            </button>
            <button className="bg-indigo-600 border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
              Contact HR Team
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-indigo-200 text-sm">
              Questions about careers? Email us at <a href="mailto:careers@cartly.com" className="text-white hover:underline">careers@cartly.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Careers
