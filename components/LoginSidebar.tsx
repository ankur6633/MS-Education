'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Mail, Phone, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useUser } from '@/components/providers/UserProvider'

interface LoginSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface User {
  _id: string
  name: string
  email: string
  mobile: string
  password: string
}

export function LoginSidebar({ isOpen, onClose }: LoginSidebarProps) {
  const [activeTab, setActiveTab] = useState<'mobile' | 'email' | 'google' | 'register'>('mobile')
  const [mobileNumber, setMobileNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  })
  const { login } = useUser()


  // Send OTP
  const sendOTP = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/users/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: mobileNumber }),
      })

      const data = await response.json()

      if (data.success) {
        setIsOtpSent(true)
        setMessage({ type: 'success', text: 'OTP sent successfully!' })
        console.log(`OTP for ${mobileNumber}: ${data.otp || 'Check server logs'}`)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send OTP' })
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      setMessage({ type: 'error', text: 'Error sending OTP. Please try again.' })
    }

    setIsLoading(false)
  }

  // Verify OTP
  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/users/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: mobileNumber, otp }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.user) {
          // User exists, login successful
          login(data.user)
          setMessage({ type: 'success', text: `Welcome, ${data.user.name}!` })
          setTimeout(() => onClose(), 1500)
        } else if (data.needsRegistration) {
          // User doesn't exist, show registration form
          setNewUserData(prev => ({ ...prev, mobile: mobileNumber }))
          setActiveTab('register')
          setMessage({ type: 'success', text: 'OTP verified! Please complete your profile.' })
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'OTP verification failed' })
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      setMessage({ type: 'error', text: 'Error verifying OTP. Please try again.' })
    }

    setIsLoading(false)
  }

  // Email login
  const handleEmailLogin = async () => {
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please enter both email and password' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        login(data.user)
        setMessage({ type: 'success', text: `Welcome, ${data.user.name}!` })
        setTimeout(() => onClose(), 1500)
      } else {
        // User doesn't exist, show registration form
        setNewUserData(prev => ({ ...prev, email }))
        setActiveTab('register')
        setMessage({ type: 'error', text: 'User not found. Please complete registration.' })
      }
    } catch (error) {
      console.error('Error during email login:', error)
      setMessage({ type: 'error', text: 'Error during login. Please try again.' })
    }

    setIsLoading(false)
  }

  // Register new user
  const handleRegister = async () => {
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })

      const data = await response.json()

      if (data.success) {
        login(data.user)
        setMessage({ type: 'success', text: `Welcome, ${data.user.name}!` })
        setTimeout(() => onClose(), 1500)
      } else {
        setMessage({ type: 'error', text: data.error || 'Registration failed. Please try again.' })
      }
    } catch (error) {
      console.error('Error during registration:', error)
      setMessage({ type: 'error', text: 'Error during registration. Please try again.' })
    }

    setIsLoading(false)
  }

  // Google login (placeholder)
  const handleGoogleLogin = () => {
    alert('Google login will be implemented soon!')
  }

  // Reset form when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setMobileNumber('')
      setOtp('')
      setEmail('')
      setPassword('')
      setIsOtpSent(false)
      setMessage(null)
      setNewUserData({ name: '', email: '', mobile: '', password: '' })
      setActiveTab('mobile')
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">MS</span>
                  </div>
                  <span className="text-xl font-bold gradient-text">MS Education</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Message Display */}
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
                      message.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{message.text}</span>
                  </motion.div>
                )}
                {activeTab === 'email' ? (
                  /* Email Login Form */
                  <div className="space-y-6">
                    <div>
                      <button
                        onClick={() => setActiveTab('mobile')}
                        className="flex items-center text-sm text-neutral-600 hover:text-primary-600 mb-4"
                      >
                        <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
                        Back to Login Options
                      </button>
                      <h2 className="text-2xl font-bold text-neutral-800 mb-2">Login with Email</h2>
                      <p className="text-neutral-600">Enter your email and password to continue</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <Button
                        onClick={handleEmailLogin}
                        disabled={isLoading || !email || !password}
                        className="w-full"
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </Button>
                    </div>
                  </div>
                ) : activeTab === 'register' ? (
                  /* Registration Form */
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-800 mb-2">Complete Your Profile</h2>
                      <p className="text-neutral-600">Please provide your details to continue</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          value={newUserData.name}
                          onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email ID *
                        </label>
                        <Input
                          type="email"
                          value={newUserData.email}
                          onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                          className="w-full"
                        />
                      </div>

                      {newUserData.mobile && (
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Mobile Number
                          </label>
                          <Input
                            type="tel"
                            value={newUserData.mobile}
                            disabled
                            className="w-full bg-neutral-50"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Password *
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={newUserData.password}
                            onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Create a password"
                            className="w-full pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleRegister}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                      
                      <button
                        onClick={() => setActiveTab('mobile')}
                        className="w-full text-center text-sm text-neutral-600 hover:text-primary-600"
                      >
                        Back to Login
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Login Options */
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-800 mb-2">Welcome Back!</h2>
                      <p className="text-neutral-600">Choose your preferred login method</p>
                    </div>

                    {/* Mobile Login */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-5 w-5 text-primary-600" />
                        <h3 className="text-lg font-semibold text-neutral-800">Login with Mobile Number</h3>
                      </div>

                      {!isOtpSent ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Mobile Number
                            </label>
                            <Input
                              type="tel"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                              placeholder="Enter 10-digit mobile number"
                              className="w-full"
                            />
                          </div>
                          <Button
                            onClick={sendOTP}
                            disabled={isLoading || mobileNumber.length !== 10}
                            className="w-full"
                          >
                            {isLoading ? 'Sending...' : 'Send OTP'}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Enter OTP
                            </label>
                            <Input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              placeholder="Enter 6-digit OTP"
                              className="w-full"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={verifyOTP}
                              disabled={isLoading || otp.length !== 6}
                              className="flex-1"
                            >
                              {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </Button>
                            <Button
                              onClick={sendOTP}
                              variant="outline"
                              disabled={isLoading}
                              className="flex-1"
                            >
                              Resend
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-neutral-500">or</span>
                      </div>
                    </div>

                    {/* Email Login */}
                    <div className="space-y-4">
                      <Button
                        onClick={() => setActiveTab('email')}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Mail className="h-5 w-5 mr-2" />
                        Continue with Email ID
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-neutral-500">or</span>
                      </div>
                    </div>

                    {/* Google Login */}
                    <div className="space-y-4">
                      <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Login with Google
                      </Button>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500 text-center">
                    By continuing you are accepting our{' '}
                    <a href="#" className="text-primary-600 hover:underline">privacy policy</a>
                    {' '}and{' '}
                    <a href="#" className="text-primary-600 hover:underline">T&C</a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
