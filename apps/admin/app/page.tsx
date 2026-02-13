'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Invalid email or password')
            } else if (result?.ok) {
                router.push('/dashboard')
                router.refresh()
            }
        } catch (error) {
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-anushtan-parchment via-white to-anushtan-parchment flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <h1 className="font-heading text-3xl font-bold text-anushtan-terracotta mb-2">
                        Anushtan School
                    </h1>
                    <p className="text-anushtan-charcoal/60">Staff Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-anushtan-border p-8">
                    <h2 className="text-2xl font-bold text-anushtan-charcoal mb-6 text-center">
                        Sign In
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                Username
                            </label>
                            <input
                                id="email"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent transition-all"
                                placeholder="raju"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent transition-all"
                                placeholder="Enter your password"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-anushtan-terracotta text-white font-semibold py-3 px-4 rounded-lg hover:bg-anushtan-terracotta/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Help Text */}
                    <div className="mt-6 text-center text-sm text-anushtan-charcoal/60">
                        <p>Forgot your password? Contact your administrator.</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-anushtan-charcoal/50">
                    <p>© 2026 Anushtan School. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}
