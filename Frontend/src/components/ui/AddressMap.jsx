import { useState } from 'react'

const AddressMap = ({ onLocationSelect, selectedCity }) => {
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Pakistani coordinates bounds
  const pakistanBounds = {
    north: 37.097,
    south: 23.690,
    east: 77.837,
    west: 60.872
  }

  // Check if coordinates are within Pakistan
  const isInPakistan = (lat, lng) => {
    return (
      lat >= pakistanBounds.south &&
      lat <= pakistanBounds.north &&
      lng >= pakistanBounds.west &&
      lng <= pakistanBounds.east
    )
  }

  const getCurrentLocation = () => {
    setIsLoading(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        if (!isInPakistan(latitude, longitude)) {
          setLocationError('Location is outside Pakistan. We only deliver within Pakistan.')
          setIsLoading(false)
          return
        }

        setUserLocation({ lat: latitude, lng: longitude })
        onLocationSelect({ lat: latitude, lng: longitude })
        setIsLoading(false)
      },
      (error) => {
        let errorMessage = 'Unable to get your location.'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
          default:
            errorMessage = 'An unknown error occurred while getting location.'
            break
        }
        setLocationError(errorMessage)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Location Verification</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Pakistan Only</span>
        </div>
      </div>

      {/* Location Status */}
      <div className="mb-4">
        {userLocation ? (
          <div className="flex items-center gap-2 text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium">Location verified within Pakistan</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">Location not verified</span>
          </div>
        )}
      </div>

      {/* Get Location Button */}
      <button
        onClick={getCurrentLocation}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform ${
          isLoading
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Getting Your Location...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>📍 Use My Current Location</span>
          </div>
        )}
      </button>

      {/* Error Message */}
      {locationError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm text-red-700">{locationError}</span>
          </div>
        </div>
      )}

      {/* Selected City Info */}
      {selectedCity && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm text-blue-700">Selected City: <strong>{selectedCity}</strong></span>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-800">🛡️ Secure Pakistan-Only Delivery</p>
            <p className="text-xs text-blue-700">We only deliver within Pakistan for security and quality assurance.</p>
            <p className="text-xs text-blue-700">📍 Location verification helps ensure accurate delivery to your doorstep.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressMap
