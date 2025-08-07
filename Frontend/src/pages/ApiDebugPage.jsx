import { useState } from 'react'
import { config, createApiUrl } from '../config/api'
import { Link } from 'react-router-dom'

const ApiDebugPage = () => {
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

  const testHealthAPI = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const url = createApiUrl('health')
      console.log('🏥 Testing Health API with URL:', url)
      
      const response = await fetch(url)

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
        url: createApiUrl('health')
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">API Debug Console</h1>
            <Link 
              to="/" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
          <p className="text-gray-600">
            This page helps debug API connection issues between the frontend and backend.
          </p>
        </div>

        {/* Current Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Current Configuration</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-gray-700">Environment Info</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(config, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-700">Generated URLs</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <strong>Newsletter URL:</strong><br />
                  <code className="text-blue-700">{createApiUrl('newsletter/subscribe')}</code>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <strong>Health URL:</strong><br />
                  <code className="text-green-700">{createApiUrl('health')}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Tests */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">API Tests</h2>
          <div className="flex gap-4 mb-6">
            <button
              onClick={testHealthAPI}
              disabled={isLoading}
              className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '🔄 Testing...' : '🏥 Test Health API'}
            </button>
            
            <button
              onClick={testNewsletterAPI}
              disabled={isLoading}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '🔄 Testing...' : '📧 Test Newsletter API'}
            </button>
          </div>

          {/* Test Results */}
          {testResult && (
            <div>
              <h3 className="font-semibold mb-3 text-gray-700">Test Results</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    testResult.success 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {testResult.success ? '✅ Success' : '❌ Failed'}
                  </span>
                  {testResult.status && (
                    <span className="ml-2 text-gray-600">
                      Status: {testResult.status} {testResult.statusText}
                    </span>
                  )}
                </div>
                
                <pre className="bg-white p-4 rounded border text-sm overflow-auto max-h-96">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Troubleshooting Guide */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Troubleshooting Guide</h2>
          <div className="space-y-4 text-sm">
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-red-700">❌ 405 Method Not Allowed</h3>
              <p className="text-gray-600">
                This means the request is going to the wrong server (Vercel instead of Railway). 
                Check if the environment variable <code>VITE_API_BASE_URL</code> is set correctly in Vercel.
              </p>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold text-yellow-700">⚠️ CORS Error</h3>
              <p className="text-gray-600">
                The backend is not allowing requests from your frontend domain. 
                Check the CORS configuration in your Railway backend.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-blue-700">ℹ️ Expected Behavior</h3>
              <p className="text-gray-600">
                On localhost: URLs should start with <code>/api</code><br />
                On Vercel: URLs should start with <code>https://cartly-production.up.railway.app/api</code>
              </p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-green-700">✅ Success</h3>
              <p className="text-gray-600">
                If you see status 200 and JSON response, the API is working correctly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiDebugPage
