'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, User, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function AuthPage() {
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [showPwd, setShowPwd]   = useState(false)
    const [error, setError]       = useState('')
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
                setError('Invalid username or password')
            } else if (result?.ok) {
                router.push('/dashboard')
                router.refresh()
            }
        } catch {
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">

            {/* ── Left panel (branding) ── */}
            <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative bg-gradient-to-br from-[#1a3a6e] via-[#2d1b69] to-[#0f1f45] flex-col items-center justify-center overflow-hidden">

                {/* Decorative orbs */}
                <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full bg-blue-400/20 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center px-12">
                    {/* Logo mark */}
                    <div className="w-28 h-28 rounded-3xl bg-white flex items-center justify-center mb-8 shadow-2xl p-2">
                        <Image src="/logo.jpg" alt="Anushtan School" width={96} height={96} className="object-contain" />
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                        Anushtan School
                    </h1>
                    <p className="text-white/60 text-lg mb-12">
                        Admin Management Portal
                    </p>

                    {/* Stat pills */}
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        {[
                            { label: 'Admissions', value: 'Manage' },
                            { label: 'Inquiries', value: 'Track' },
                            { label: 'Campaigns', value: 'Send' },
                        ].map(item => (
                            <div
                                key={item.label}
                                className="flex items-center justify-between px-5 py-3 rounded-xl bg-white/8 border border-white/10 backdrop-blur-sm"
                            >
                                <span className="text-white/70 text-sm">{item.label}</span>
                                <span className="text-white text-sm font-semibold">{item.value} →</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom credit */}
                <p className="absolute bottom-6 text-white/30 text-xs">
                    © 2026 Anushtan School, Siddipet
                </p>
            </div>

            {/* ── Right panel (form) ── */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-md flex items-center justify-center p-1">
                            <Image src="/logo.jpg" alt="Anushtan School" width={40} height={40} className="object-contain" />
                        </div>
                        <span className="font-bold text-gray-900 text-lg">Anushtan School</span>
                    </div>

                    {/* Heading */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
                        <p className="text-gray-500">Sign in to your staff account to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Username */}
                        <div className="group">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                    <User size={18} />
                                </span>
                                <input
                                    id="email"
                                    type="text"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    placeholder="Enter your username"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="group">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input
                                    id="password"
                                    type={showPwd ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    placeholder="Enter your password"
                                    className="w-full pl-11 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-[#1a3a6e] to-[#2d1b69] hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading
                                ? <><Loader2 size={18} className="animate-spin" /> Signing in…</>
                                : <>Sign In <ArrowRight size={18} /></>
                            }
                        </button>
                    </form>

                    {/* Footer note */}
                    <p className="mt-8 text-center text-xs text-gray-400">
                        Forgot your password? Contact your administrator.
                    </p>
                </div>
            </div>
        </div>
    )
}
