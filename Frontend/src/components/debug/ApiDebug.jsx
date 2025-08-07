import { useState } from 'react'
import { config, createApiUrl } from '../../config/api'

const ApiDebug = () => {
  const [testResult, setTestResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const testNewsletterAPI = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const testEmail = `test-${Date.now()}@example.com`
      const url = createApiUrl('newsletter/subscribe')
      
      console.log('🧪 Testing Newsletter API with URL:', url)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      })

      const result = {
        url,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        contentType: response.headers.get('content-type'),
        isJson: response.headers.get('content-type')?.includes('application/json'),
        success: response.ok
      }

      if (result.isJson) {
        try {
          result.data = await response.json()
        } catch (e) {
          result.jsonError = e.message
        }
      } else {
        result.text = await response.text()
      }

      setTestResult(result)
    } catch (error) {
      setTestResult({
        error: error.message,
        url: createApiUrl('newsletter/subscribe')
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-md">
      <h3 className="text-lg font-bold mb-3">API Debug Info</h3>
      
      {/* Environment Info */}
      <div className="mb-4 text-sm">
        <h4 className="font-semibold mb-2">Environment:</h4>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>

      {/* URL Test */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">URL Test:</h4>
        <p className="text-xs bg-yellow-100 p-2 rounded">
          <strong>Newsletter URL:</strong><br />
          {createApiUrl('newsletter/subscribe')}
        </p>
      </div>

      {/* API Test Button */}
      <button
        onClick={testNewsletterAPI}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-3"
      >
        {isLoading ? 'Testing...' : 'Test Newsletter API'}
      </button>

      {/* Test Results */}
      {testResult && (
        <div className="text-sm">
          <h4 className="font-semibold mb-2">Test Result:</h4>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default ApiDebug
