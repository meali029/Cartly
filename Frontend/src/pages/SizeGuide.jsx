import { 
  BeakerIcon,
  InformationCircleIcon,
  UserIcon,
  ScaleIcon
} from '@heroicons/react/24/outline'

const SizeGuide = () => {
  const sizeCharts = {
    men: {
      clothing: [
        { size: 'XS', chest: '34-36', waist: '28-30', hips: '34-36' },
        { size: 'S', chest: '36-38', waist: '30-32', hips: '36-38' },
        { size: 'M', chest: '38-40', waist: '32-34', hips: '38-40' },
        { size: 'L', chest: '40-42', waist: '34-36', hips: '40-42' },
        { size: 'XL', chest: '42-44', waist: '36-38', hips: '42-44' },
        { size: 'XXL', chest: '44-46', waist: '38-40', hips: '44-46' }
      ],
      shoes: [
        { us: '7', uk: '6', eu: '40', cm: '25.0' },
        { us: '7.5', uk: '6.5', eu: '40.5', cm: '25.4' },
        { us: '8', uk: '7', eu: '41', cm: '25.8' },
        { us: '8.5', uk: '7.5', eu: '42', cm: '26.2' },
        { us: '9', uk: '8', eu: '42.5', cm: '26.6' },
        { us: '9.5', uk: '8.5', eu: '43', cm: '27.0' },
        { us: '10', uk: '9', eu: '44', cm: '27.4' },
        { us: '10.5', uk: '9.5', eu: '44.5', cm: '27.8' },
        { us: '11', uk: '10', eu: '45', cm: '28.2' },
        { us: '12', uk: '11', eu: '46', cm: '29.0' }
      ]
    },
    women: {
      clothing: [
        { size: 'XS', bust: '32-34', waist: '24-26', hips: '34-36' },
        { size: 'S', bust: '34-36', waist: '26-28', hips: '36-38' },
        { size: 'M', bust: '36-38', waist: '28-30', hips: '38-40' },
        { size: 'L', bust: '38-40', waist: '30-32', hips: '40-42' },
        { size: 'XL', bust: '40-42', waist: '32-34', hips: '42-44' },
        { size: 'XXL', bust: '42-44', waist: '34-36', hips: '44-46' }
      ],
      shoes: [
        { us: '5', uk: '2.5', eu: '35', cm: '22.0' },
        { us: '5.5', uk: '3', eu: '35.5', cm: '22.4' },
        { us: '6', uk: '3.5', eu: '36', cm: '22.8' },
        { us: '6.5', uk: '4', eu: '37', cm: '23.2' },
        { us: '7', uk: '4.5', eu: '37.5', cm: '23.6' },
        { us: '7.5', uk: '5', eu: '38', cm: '24.0' },
        { us: '8', uk: '5.5', eu: '38.5', cm: '24.4' },
        { us: '8.5', uk: '6', eu: '39', cm: '24.8' },
        { us: '9', uk: '6.5', eu: '40', cm: '25.2' },
        { us: '9.5', uk: '7', eu: '40.5', cm: '25.6' },
        { us: '10', uk: '7.5', eu: '41', cm: '26.0' }
      ]
    },
    kids: {
      clothing: [
        { age: '2-3 Years', height: '92-98', chest: '52-54', waist: '50-52' },
        { age: '3-4 Years', height: '98-104', chest: '54-56', waist: '52-54' },
        { age: '4-5 Years', height: '104-110', chest: '56-58', waist: '54-56' },
        { age: '5-6 Years', height: '110-116', chest: '58-60', waist: '56-58' },
        { age: '6-7 Years', height: '116-122', chest: '60-62', waist: '58-60' },
        { age: '7-8 Years', height: '122-128', chest: '62-64', waist: '60-62' },
        { age: '8-9 Years', height: '128-134', chest: '64-66', waist: '62-64' },
        { age: '9-10 Years', height: '134-140', chest: '66-68', waist: '64-66' }
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BeakerIcon className="h-12 w-12 mr-3" />
              <h1 className="text-5xl font-bold">Size Guide</h1>
            </div>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Find your perfect fit with our comprehensive sizing charts and measurement guide
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* How to Measure */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <ScaleIcon className="h-8 w-8 text-emerald-500 mr-3" />
            How to Measure
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Chest/Bust</h3>
              <p className="text-gray-600">Measure around the fullest part of your chest/bust, keeping the tape horizontal</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ScaleIcon className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Waist</h3>
              <p className="text-gray-600">Measure around your natural waistline, which is the narrowest part of your torso</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BeakerIcon className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Hips</h3>
              <p className="text-gray-600">Measure around the fullest part of your hips, usually about 8 inches below your waist</p>
            </div>
          </div>
        </div>

        {/* Size Charts */}
        <div className="space-y-8">
          
          {/* Men's Size Chart */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Men's Size Chart</h2>
            
            {/* Men's Clothing */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Clothing (inches)</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Size</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Chest</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Waist</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Hips</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeCharts.men.clothing.map((size, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-3 font-medium text-blue-600">{size.size}</td>
                        <td className="border border-gray-300 px-4 py-3">{size.chest}"</td>
                        <td className="border border-gray-300 px-4 py-3">{size.waist}"</td>
                        <td className="border border-gray-300 px-4 py-3">{size.hips}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Men's Shoes */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Shoes</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">US</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">UK</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">EU</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">CM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeCharts.men.shoes.map((size, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-3 font-medium text-blue-600">{size.us}</td>
                        <td className="border border-gray-300 px-4 py-3">{size.uk}</td>
                        <td className="border border-gray-300 px-4 py-3">{size.eu}</td>
                        <td className="border border-gray-300 px-4 py-3">{size.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Women's Size Chart */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-6">Women's Size Chart</h2>
            
            {/* Women's Clothing */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Clothing (inches)</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-pink-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Size</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Bust</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Waist</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Hips</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeCharts.women.clothing.map((size, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-3 font-medium text-pink-600">{size.size}</td>
                        <td className="border border-gray-300 px-4 py-3">{size.bust}"</td>
                        <td className="border border-gray-300 px-4 py-3">{size.waist}"</td>
                        <td className="border border-gray-300 px-4 py-3">{size.hips}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Women's Shoes */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Shoes</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-pink-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">US</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">UK</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">EU</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">CM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeCharts.women.shoes.map((size, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-3 font-medium text-pink-600">{size.us}</td>
                        <td className="border border-gray-300 px-4 py-3">{size.uk}</td>
                        <td className="border border-gray-300 px-4 py-3">{size.eu}</td>
                        <td className="border border-gray-300 px-4 py-3">{size.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Kids Size Chart */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-green-600 mb-6">Kids Size Chart</h2>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Clothing (cm)</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-green-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Age</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Height (cm)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Chest (cm)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Waist (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeCharts.kids.clothing.map((size, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-3 font-medium text-green-600">{size.age}</td>
                        <td className="border border-gray-300 px-4 py-3">{size.height}</td>
                        <td className="border border-gray-300 px-4 py-3">{size.chest}</td>
                        <td className="border border-gray-300 px-4 py-3">{size.waist}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white mt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <InformationCircleIcon className="h-8 w-8 mr-3" />
            Sizing Tips
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Between Sizes?</h3>
              <p className="text-emerald-100">If you're between sizes, we recommend sizing up for a more comfortable fit, especially for casual wear.</p>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Fabric Matters</h3>
              <p className="text-emerald-100">Consider the fabric type - stretchy materials may allow for a snugger fit, while rigid fabrics need more room.</p>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Check Product Details</h3>
              <p className="text-emerald-100">Always check the specific measurements and fit information provided on each product page.</p>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
              <p className="text-emerald-100">Contact our customer service team if you need personalized sizing assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SizeGuide
