'use client'

import { useState, FormEvent } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [empNo, setEmpNo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        empNo,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials. Please check your Employee No / Domain ID and password.')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-900 px-8 py-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg">
                K
              </div>
              <div>
                <h1 className="text-xl font-bold">Karyadwar</h1>
                <p className="text-blue-300 text-xs">Manufacturing Intranet Portal</p>
              </div>
            </div>
            <h2 className="text-lg font-semibold">Welcome back</h2>
            <p className="text-blue-300 text-sm mt-0.5">Sign in to access your portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Employee No / Domain ID / Email
              </label>
              <input
                type="text"
                value={empNo}
                onChange={(e) => setEmpNo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., EMP10001 or rk.sharma"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-800 hover:bg-blue-900 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Demo credentials */}
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
              <p className="font-semibold text-gray-700 mb-1">Demo Credentials:</p>
              <p>Admin: <code className="bg-gray-200 px-1 rounded">admin@karyadwar.example.com</code> / <code className="bg-gray-200 px-1 rounded">Admin@1234</code></p>
              <p className="mt-0.5">User: <code className="bg-gray-200 px-1 rounded">rk.sharma</code> / <code className="bg-gray-200 px-1 rounded">User@1234</code></p>
            </div>
          </form>
        </div>

        <p className="text-center text-blue-300 text-xs mt-4">
          © 2026 Karyadwar — Manufacturing Intranet Portal
        </p>
      </div>
    </div>
  )
}
