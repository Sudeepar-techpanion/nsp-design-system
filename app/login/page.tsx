"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    router.push("/sop/inbox")
  }

  const handleMicrosoftLogin = () => {
    // Handle Microsoft SSO login
    console.log("Microsoft login")
  }

  const handleEmailLogin = () => {
    setShowEmailForm(true)
  }

  const handleBackToMethods = () => {
    setShowEmailForm(false)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Brand & Value Proposition */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#3B2D7B] via-[#3B2D7B] to-[#4a3680] text-white p-16 flex-col justify-center overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        
        {/* Decorative geometric patterns */}
        <div className="absolute top-8 right-16 grid grid-cols-3 gap-2 opacity-30">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-2.5 w-2.5 rounded-sm bg-white/40" />
          ))}
        </div>

        <div className="absolute bottom-20 right-16 opacity-40">
          <div className="flex gap-4">
            <div className="h-8 w-8 rotate-45 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-sm" />
            <div className="h-6 w-6 rotate-45 bg-gradient-to-br from-green-400 to-emerald-400 rounded-sm mt-2" />
          </div>
        </div>

        <div className="absolute top-1/3 -left-8 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-8 h-40 w-40 rounded-full bg-purple-400/10 blur-3xl" />

        {/* Logo */}
        <div className="absolute top-12 left-16 flex gap-2 z-10">
          <div className="h-3 w-3 rotate-45 bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/50" />
          <div className="h-3 w-3 rotate-45 bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/50" />
          <div className="h-3 w-3 rotate-45 bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/50" />
        </div>

        {/* Value Proposition - Centered */}
        <div className="z-10 max-w-xl mx-auto">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="text-sm font-semibold text-white/90">Enterprise Shared Services Center</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 leading-tight tracking-tight">
              Standardize.<br />
              Automate.<br />
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Operate.
              </span>
            </h1>
          </div>
          
          <p className="text-xl text-white/90 leading-relaxed mb-10 font-light">
            Automation, compliance, and intelligent workflows—built for shared services.
          </p>
          
          <div className="space-y-5">
            <div className="flex items-start gap-4 group">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Invoice Processing</h3>
                <p className="text-white/70 text-sm">Automated invoice capture, validation, and approval workflows</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Compliance & Risk</h3>
                <p className="text-white/70 text-sm">Built-in controls and real-time monitoring for regulatory compliance</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Unified Platform</h3>
                <p className="text-white/70 text-sm">Single source of truth for all stakeholders across the organization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-16 flex items-center gap-3 z-10">
          <div className="h-3 w-3 rotate-45 bg-gradient-to-br from-green-400 to-emerald-500" />
          <span className="text-sm text-white/70 font-medium">© 2026 NimbleS2P</span>
        </div>
      </div>

      {/* Right Side - Secure Authentication */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/images/nimble-logo.png" 
              alt="Nimble S2P" 
              className="h-12 w-auto"
            />
          </div>

          {!showEmailForm ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose login method</h1>
                <p className="text-sm text-gray-600">Secure access to your shared services center</p>
              </div>

              {/* Login Methods */}
              <div className="space-y-3" role="group" aria-label="Login methods">
                {/* Microsoft SSO (Primary) */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleMicrosoftLogin}
                  className="w-full h-12 border-2 border-gray-300 hover:border-[#3B2D7B] hover:bg-[#3B2D7B]/5 bg-transparent justify-start px-4 transition-colors"
                  aria-label="Sign in with Microsoft"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center" aria-hidden="true">
                      <svg viewBox="0 0 23 23" className="h-5 w-5">
                        <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
                        <rect x="12" y="1" width="10" height="10" fill="#7fba00"/>
                        <rect x="1" y="12" width="10" height="10" fill="#00a4ef"/>
                        <rect x="12" y="12" width="10" height="10" fill="#ffb900"/>
                      </svg>
                    </div>
                    <span className="text-base font-semibold text-gray-900">Sign in with Microsoft</span>
                  </div>
                </Button>

                {/* Google SSO */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleMicrosoftLogin}
                  className="w-full h-12 border-2 border-gray-300 hover:border-[#3B2D7B] hover:bg-[#3B2D7B]/5 bg-transparent justify-start px-4 transition-colors"
                  aria-label="Sign in with Google"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="h-5 w-5">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <span className="text-base font-semibold text-gray-900">Sign in with Google</span>
                  </div>
                </Button>

                {/* Email Authentication */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleEmailLogin}
                  className="w-full h-12 border-2 border-gray-300 hover:border-[#3B2D7B] hover:bg-[#3B2D7B]/5 bg-transparent justify-start px-4 transition-colors"
                  aria-label="Continue with email"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center" aria-hidden="true">
                      <Mail className="h-5 w-5 text-gray-700" />
                    </div>
                    <span className="text-base font-semibold text-gray-900">Continue with email</span>
                  </div>
                </Button>
              </div>

              {/* Security Notice */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your credentials are encrypted and secured using enterprise-grade protocols. By signing in, you agree to our security and access policies.
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 font-medium">Powered by NimbleS2P</p>
              </div>
            </>
          ) : (
            <>
              {/* Back Button */}
              <button
                onClick={handleBackToMethods}
                className="flex items-center gap-2 text-[#3B2D7B] hover:text-[#2d2259] font-semibold mb-8 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>

              {/* Email Login Form */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Enter your email address and password to access your portal
                </h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-base font-medium text-gray-900">
                    <span className="text-red-500">*</span> Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="admin@techpanion.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 border-2 border-gray-300 bg-blue-50/30 focus-visible:ring-0 focus-visible:border-[#3B2D7B] text-base"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-medium text-gray-900">
                    <span className="text-red-500">*</span> Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-14 border-2 border-gray-300 bg-blue-50/30 focus-visible:ring-0 focus-visible:border-[#3B2D7B] text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full h-14 bg-[#3B2D7B] hover:bg-[#2d2259] text-white font-semibold text-base flex items-center justify-center gap-2"
                >
                  <ArrowRight className="h-5 w-5" />
                  Login
                </Button>

                {/* Forgot Password Link */}
                <div className="text-center">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 font-medium text-base"
                  >
                    Forgot Password
                  </button>
                </div>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 font-medium">Powered by NimbleS2P</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
