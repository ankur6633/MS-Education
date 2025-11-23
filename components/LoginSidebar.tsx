'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, Info, ChevronLeft } from 'lucide-react'
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
	const [activeTab, setActiveTab] = useState<'identify' | 'login' | 'register_email' | 'register_otp' | 'register_details' | 'forgot_email' | 'forgot_otp'>('identify')
  const [email, setEmail] = useState('')
  const [identifierInput, setIdentifierInput] = useState('')
	const [loginIdentifier, setLoginIdentifier] = useState<{ type: 'email' | 'mobile'; value: string; name?: string } | null>(null)
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
	type MessageType = 'success' | 'error' | 'info'
	const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null)
  const [isGoogleAvailable, setIsGoogleAvailable] = useState(false)
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmResetPassword, setConfirmResetPassword] = useState('')
  const { login } = useUser()

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const formatMobile = (value: string) => {
    if (!value) return ''
    const digits = value.replace(/\D/g, '')
    if (digits.length !== 10) return value
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email.trim()) return 'Email is required'
    if (email.length > 100) return 'Email must be less than 100 characters'
    if (!emailPattern.test(email.toLowerCase())) return 'Please enter a valid email address'
    return null
  }

  const validateMobile = (mobile: string): string | null => {
    const digits = mobile.replace(/\D/g, '')
    if (!digits) return 'Mobile number is required'
    if (digits.length !== 10) return 'Mobile number must be exactly 10 digits'
    return null
  }

  const validateName = (name: string): string | null => {
    if (!name.trim()) return 'Name is required'
    if (name.trim().length < 2) return 'Name must be at least 2 characters'
    if (name.length > 100) return 'Name must be less than 100 characters'
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) return 'Name can only contain letters, spaces, hyphens, and apostrophes'
    return null
  }

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (password.length > 128) return 'Password must be less than 128 characters'
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter'
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number'
    return null
  }

  const validateIdentifier = (identifier: string): string | null => {
    if (!identifier.trim()) return 'Email or phone number is required'
    if (identifier.length > 100) return 'Input must be less than 100 characters'
    const trimmed = identifier.trim()
    const isEmail = emailPattern.test(trimmed.toLowerCase())
    const digits = trimmed.replace(/\D/g, '')
    const isMobile = digits.length === 10
    if (!isEmail && !isMobile) return 'Enter a valid email or 10-digit phone number'
    return null
  }

  const parseIdentifierInput = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return null
    if (emailPattern.test(trimmed.toLowerCase())) {
      return { type: 'email' as const, normalized: trimmed.toLowerCase() }
    }
    const digits = trimmed.replace(/\D/g, '')
    if (digits.length === 10) {
      return { type: 'mobile' as const, normalized: digits }
    }
    return null
  }

  const handleIdentify = async () => {
    setFieldErrors({})
    const identifierError = validateIdentifier(identifierInput)
    if (identifierError) {
      setFieldErrors({ identifier: identifierError })
      setMessage({ type: 'error', text: identifierError })
      return
    }

    const parsed = parseIdentifierInput(identifierInput)
    if (!parsed) {
      setMessage({ type: 'error', text: 'Enter a valid email or 10-digit phone number' })
      return
    }

    setIsLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/users/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: parsed.normalized }),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to continue')
      }

      const identifierType: 'email' | 'mobile' = data.identifierType === 'mobile' ? 'mobile' : 'email'

      if (data.exists) {
        setLoginIdentifier({ type: identifierType, value: data.identifier, name: data.user?.name })
        setPassword('')
        setActiveTab('login')
        setMessage({
          type: 'success',
          text: `Welcome back${data.user?.name ? `, ${data.user.name}` : ''}! Enter your password to continue.`,
        })
      } else {
        setLoginIdentifier(null)
        if (identifierType === 'email') {
          setEmail(data.identifier)
          setNewUserData(prev => ({ ...prev, email: data.identifier }))
        } else {
          setNewUserData(prev => ({ ...prev, mobile: data.identifier }))
        }
        setActiveTab('register_email')
        setMessage({ type: 'info', text: 'Looks like a new account. Verify your email to create one.' })
      }
      setIdentifierInput('')
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Unable to continue' })
    } finally {
      setIsLoading(false)
    }
  }

  // STEP 1: Send Email OTP
  const sendEmailOTP = async () => {
    setFieldErrors({})
    const emailError = validateEmail(email)
    if (emailError) {
      setFieldErrors({ email: emailError })
      setMessage({ type: 'error', text: emailError })
      return
    }
    setIsLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/users/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to send OTP')
      }
      setNewUserData(prev => ({ ...prev, email }))
      setActiveTab('register_otp')
      setMessage({ type: 'success', text: 'OTP sent to your email' })
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Failed to send OTP' })
    } finally {
    setIsLoading(false)
    }
  }

  // STEP 2: Verify Email OTP
  const verifyEmailOTP = async () => {
    if (!otp || otp.length !== 6) {
      setMessage({ type: 'error', text: 'Enter the 6-digit OTP' })
      return
    }
    setIsLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/users/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newUserData.email || email, otp }),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Invalid OTP')
      }
      setActiveTab('register_details')
      setMessage({ type: 'success', text: 'Email verified. Complete your details.' })
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'OTP verification failed' })
    } finally {
      setIsLoading(false)
    }
  }

  // Login using email or phone + password
  const handleLogin = async () => {
    setFieldErrors({})
    if (!loginIdentifier?.value) {
      setActiveTab('identify')
      return
    }
    if (!password) {
      setFieldErrors({ password: 'Password is required' })
      setMessage({ type: 'error', text: 'Please enter your password' })
      return
    }
    if (password.length > 128) {
      setFieldErrors({ password: 'Password must be less than 128 characters' })
      setMessage({ type: 'error', text: 'Password is too long' })
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
        body: JSON.stringify({ identifier: loginIdentifier.value, password }),
      })

      const data = await response.json()

      if (data.success) {
        login(data.user)
        setMessage({ type: 'success', text: `Welcome, ${data.user.name}!` })
        setTimeout(() => onClose(), 1500)
      } else {
        setMessage({ type: 'error', text: data.error || 'Login failed' })
      }
    } catch (error) {
      console.error('Error during login:', error)
      setMessage({ type: 'error', text: 'Error during login. Please try again.' })
    }

    setIsLoading(false)
  }

  // STEP 3: Create Account after OTP verification
  const handleRegister = async () => {
    setFieldErrors({})
    const errors: Record<string, string> = {}

    const nameError = validateName(newUserData.name)
    if (nameError) errors.name = nameError

    const emailError = validateEmail(newUserData.email)
    if (emailError) errors.email = emailError

    const mobileError = validateMobile(newUserData.mobile)
    if (mobileError) errors.mobile = mobileError

    const passwordError = validatePassword(newUserData.password)
    if (passwordError) errors.password = passwordError

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (confirmPassword !== newUserData.password) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setMessage({ type: 'error', text: 'Please fix the errors below' })
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
        body: JSON.stringify({ step: 'create_account', ...newUserData }),
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

  // Forgot Password - send OTP
  const sendForgotOTP = async () => {
    setFieldErrors({})
    const emailError = validateEmail(resetEmail)
    if (emailError) {
      setFieldErrors({ resetEmail: emailError })
      setMessage({ type: 'error', text: emailError })
      return
    }
    setIsLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/users/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to send OTP')
      }
      setActiveTab('forgot_otp')
      setMessage({ type: 'success', text: 'Reset OTP sent to your email' })
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Failed to send OTP' })
    } finally {
      setIsLoading(false)
    }
  }

  // Forgot Password - reset
  const handleResetPassword = async () => {
    setFieldErrors({})
    const errors: Record<string, string> = {}

    if (!otp || otp.length !== 6) {
      errors.otp = 'Enter the 6-digit OTP'
    }

    const passwordError = validatePassword(newPassword)
    if (passwordError) errors.newPassword = passwordError

    if (!confirmResetPassword) {
      errors.confirmResetPassword = 'Please confirm your password'
    } else if (newPassword !== confirmResetPassword) {
      errors.confirmResetPassword = 'Passwords do not match'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setMessage({ type: 'error', text: 'Please fix the errors below' })
      return
    }
    setIsLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/users/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp, newPassword }),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to reset password')
      }
      setMessage({ type: 'success', text: 'Password reset successful. Please login.' })
      setLoginIdentifier({ type: 'email', value: resetEmail })
      setActiveTab('login')
      setPassword('')
      setOtp('')
      setNewPassword('')
      setConfirmResetPassword('')
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Failed to reset password' })
    } finally {
      setIsLoading(false)
    }
  }

  // Google login - Opens Google OAuth in a popup window
  const handleGoogleLogin = async () => {
    // Don't proceed if Google is not available
    if (!isGoogleAvailable) {
      return
    }

    try {
      // Get client ID
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string
      
      if (!clientId || clientId.trim() === '' || clientId === 'your-google-oauth-client-id') {
        return
      }

      setIsLoading(true)
      setMessage(null)

      // Generate a random state for security
      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('google_oauth_state', state)
      sessionStorage.setItem('google_oauth_redirect', window.location.href)

      // Build Google OAuth URL - using id_token flow for popup
      // Note: id_token response type uses hash fragments (#), not query parameters (?)
      // Hash fragments are only accessible to client-side JavaScript, so the callback route
      // returns an HTML page with JavaScript to read the hash and process the token
      const redirectUri = `${window.location.origin}/api/auth/google/callback`
      const scope = 'openid email profile'
      const responseType = 'id_token'
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=${responseType}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${encodeURIComponent(state)}&` +
        `nonce=${encodeURIComponent(state)}`

      // Open Google OAuth in a popup window
      const width = 500
      const height = 600
      const left = (window.screen.width - width) / 2
      const top = (window.screen.height - height) / 2

      const popup = window.open(
        googleAuthUrl,
        'Google Login',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      )

      if (!popup) {
        setIsLoading(false)
        setMessage({ type: 'error', text: 'Please allow popups to sign in with Google' })
        return
      }

      // Listen for the callback message from the popup
      const messageListener = (event: MessageEvent) => {
        // Log for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('Message received from popup:', {
            origin: event.origin,
            expectedOrigin: window.location.origin,
            type: event.data?.type,
            data: event.data
          });
        }

        // Verify origin for security
        if (event.origin !== window.location.origin) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Message origin mismatch:', event.origin, 'expected:', window.location.origin);
          }
          return
        }

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          window.removeEventListener('message', messageListener)
          if (popup && !popup.closed) {
            popup.close()
          }
          
          const { user, isNewUser } = event.data
          login(user)
          setMessage({ 
            type: 'success', 
            text: isNewUser 
              ? `Welcome to MS Education, ${user.name}! Your account has been created.` 
              : `Welcome back, ${user.name}!` 
          })
          setIsLoading(false)
          setTimeout(() => onClose(), 1500)
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          window.removeEventListener('message', messageListener)
          if (popup && !popup.closed) {
            popup.close()
          }
          const errorMsg = event.data.error || 'Google authentication failed'
          console.error('Google auth error:', errorMsg)
          setMessage({ type: 'error', text: errorMsg })
          setIsLoading(false)
        }
      }

      window.addEventListener('message', messageListener)

      // Check if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          window.removeEventListener('message', messageListener)
          setIsLoading(false)
        }
      }, 500)

    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Failed to open Google login' })
      setIsLoading(false)
    }
  }

  // Check if Google Client ID is available - check on mount and when sidebar opens
  useEffect(() => {
    // Check environment variable - NEXT_PUBLIC_ vars are available at build time
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const isAvailable = !!(
      clientId && 
      typeof clientId === 'string' &&
      clientId.trim() !== '' && 
      clientId !== 'your-google-oauth-client-id' &&
      !clientId.startsWith('your-')
    )
    setIsGoogleAvailable(isAvailable)
  }, [isOpen])

  // Reset form when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setIdentifierInput('')
      setLoginIdentifier(null)
      setOtp('')
      setPassword('')
      setMessage(null)
      setNewUserData({ name: '', email: '', mobile: '', password: '' })
      setResetEmail('')
      setNewPassword('')
      setConfirmPassword('')
      setConfirmResetPassword('')
      setActiveTab('identify')
      setFieldErrors({})
    }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <>
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-96 max-w-[90vw] bg-white shadow-2xl z-[70] overflow-hidden"
          >
            <div className="flex flex-col h-screen">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-neutral-200">
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
              <div className="flex-1 p-5 overflow-hidden">
                {/* Message Display */}
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
                      message.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : message.type === 'error'
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {message.type === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                    ) : message.type === 'error' ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <Info className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">{message.text}</span>
                  </motion.div>
                )}
                {activeTab === 'identify' ? (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-800 mb-2">Login or Sign up</h2>
                      <p className="text-neutral-600">Enter your email or phone number to continue</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email or Phone
                        </label>
                        <Input
                          type="text"
                          value={identifierInput}
                          onChange={(e) => {
                            const value = e.target.value
                            if (value.length <= 100) {
                              setIdentifierInput(value)
                              if (fieldErrors.identifier) {
                                setFieldErrors(prev => {
                                  const newErrors = { ...prev }
                                  delete newErrors.identifier
                                  return newErrors
                                })
                              }
                            }
                          }}
                          placeholder="you@example.com or 9876543210"
                          maxLength={100}
                          className={`w-full ${fieldErrors.identifier ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {fieldErrors.identifier && (
                          <p className="mt-1 text-sm text-red-600">{fieldErrors.identifier}</p>
                        )}
                      </div>
                      <Button
                        onClick={handleIdentify}
                        disabled={isLoading || !identifierInput.trim()}
                        className="w-full"
                      >
                        {isLoading ? 'Checking...' : 'Continue'}
                      </Button>
                    </div>
                    {isGoogleAvailable && (
                      <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-neutral-500">or</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleGoogleLogin}
                      variant="outline"
                      disabled={isLoading}
                          className="w-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Connecting...
                            </span>
                          ) : (
                            <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                            </>
                          )}
                    </Button>
                      </>
                    )}
                    <div className="text-center text-sm text-neutral-500">
                      Don&#39;t share your login details with anyone.
                    </div>
                  </div>
                ) : activeTab === 'login' ? (
                  <div className="space-y-5">
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginIdentifier(null)
                          setPassword('')
                          setActiveTab('identify')
                          setMessage(null)
                        }}
                        className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-600 mb-2"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back
                      </button>
                      <h2 className="text-2xl font-bold text-neutral-800 mb-2">Enter your password</h2>
                      <p className="text-neutral-600">
                        {loginIdentifier?.type === 'mobile'
                          ? 'We found your account using this mobile number.'
                          : 'We found your account using this email.'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email or Phone
                        </label>
                        <Input
                          value={loginIdentifier?.value || ''}
                          readOnly
                          className="w-full bg-neutral-50 text-neutral-700"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setLoginIdentifier(null)
                            setPassword('')
                            setActiveTab('identify')
                            setMessage(null)
                          }}
                          className="mt-2 text-xs text-primary-600 hover:underline"
                        >
                          Use a different email or phone
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 128) {
                                setPassword(value)
                                if (fieldErrors.password) {
                                  setFieldErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.password
                                    return newErrors
                                  })
                                }
                              }
                            }}
                            placeholder="Enter your password"
                            maxLength={128}
                            className={`w-full pr-10 ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {fieldErrors.password && (
                          <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                        )}
                      </div>
                      <Button
                        onClick={handleLogin}
                        disabled={isLoading || !password}
                        className="w-full"
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </Button>
                      <div className="flex items-center justify-between text-sm">
                        <button
                          onClick={() => {
                            if (loginIdentifier?.type === 'email') {
                              setEmail(loginIdentifier.value)
                              setNewUserData(prev => ({ ...prev, email: loginIdentifier.value }))
                            } else if (loginIdentifier?.type === 'mobile') {
                              setNewUserData(prev => ({ ...prev, mobile: loginIdentifier.value }))
                            }
                            setActiveTab('register_email')
                          }}
                          className="text-neutral-600 hover:text-primary-600"
                        >
                          Need an account?
                        </button>
                        <button
                          onClick={() => {
                            if (loginIdentifier?.type === 'email') {
                              setResetEmail(loginIdentifier.value)
                            }
                            setActiveTab('forgot_email')
                          }}
                          className="text-neutral-600 hover:text-primary-600"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'register_details' ? (
                  /* Registration – Details */
                  <div className="space-y-5">
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
                          onChange={(e) => {
                            const value = e.target.value
                            if (value.length <= 100) {
                              setNewUserData(prev => ({ ...prev, name: value }))
                              if (fieldErrors.name) {
                                setFieldErrors(prev => {
                                  const newErrors = { ...prev }
                                  delete newErrors.name
                                  return newErrors
                                })
                              }
                            }
                          }}
                          placeholder="Enter your full name"
                          maxLength={100}
                          className={`w-full ${fieldErrors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {fieldErrors.name && (
                          <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email ID *
                        </label>
                        <Input
                          type="email"
                          value={newUserData.email}
                          disabled
                          placeholder={newUserData.email}
                          maxLength={100}
                          className={`w-full bg-neutral-50 ${fieldErrors.email ? 'border-red-500' : ''}`}
                        />
                        {fieldErrors.email && (
                          <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Mobile Number *
                        </label>
                        <Input
                          type="tel"
                          value={newUserData.mobile}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                            setNewUserData(prev => ({ ...prev, mobile: value }))
                            if (fieldErrors.mobile) {
                              setFieldErrors(prev => {
                                const newErrors = { ...prev }
                                delete newErrors.mobile
                                return newErrors
                              })
                            }
                          }}
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
                          className={`w-full ${fieldErrors.mobile ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {fieldErrors.mobile && (
                          <p className="mt-1 text-sm text-red-600">{fieldErrors.mobile}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Password *
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={newUserData.password}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 128) {
                                setNewUserData(prev => ({ ...prev, password: value }))
                                if (fieldErrors.password) {
                                  setFieldErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.password
                                    return newErrors
                                  })
                                }
                              }
                            }}
                            placeholder="Create a password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)"
                            maxLength={128}
                            className={`w-full pr-10 ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {fieldErrors.password && (
                          <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 128) {
                                setConfirmPassword(value)
                                if (fieldErrors.confirmPassword) {
                                  setFieldErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.confirmPassword
                                    return newErrors
                                  })
                                }
                              }
                            }}
                            placeholder="Confirm password"
                            maxLength={128}
                            className={`w-full pr-10 ${fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {fieldErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                        )}
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
                        onClick={() => setActiveTab('login')}
                        className="w-full text-center text-sm text-neutral-600 hover:text-primary-600"
                      >
                        Back to Login
                      </button>
                    </div>
                  </div>
                ) : activeTab === 'register_email' || activeTab === 'register_otp' ? (
                  /* Registration – Email and OTP */
                  <div className="space-y-5">
                    {activeTab === 'register_email' && (
                        <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('identify')
                            setMessage(null)
                          }}
                          className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-600"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Back
                        </button>
                        <div>
                          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Create your account</h2>
                          <p className="text-neutral-600">Enter your email to receive a verification code</p>
                        </div>
                        {newUserData.mobile && (
                          <div className="text-sm text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                            Mobile number to link: <span className="font-semibold">{formatMobile(newUserData.mobile)}</span>
                          </div>
                        )}
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Email
                            </label>
                            <Input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 100) {
                                setEmail(value)
                                if (fieldErrors.email) {
                                  setFieldErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.email
                                    return newErrors
                                  })
                                }
                              }
                            }}
                            placeholder="you@example.com"
                            maxLength={100}
                              className={`w-full ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {fieldErrors.email && (
                              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                            )}
                          </div>
                        <Button onClick={sendEmailOTP} disabled={isLoading || !email} className="w-full">
                            {isLoading ? 'Sending...' : 'Send OTP'}
                          </Button>
                        <button
                          onClick={() => setActiveTab('login')}
                          className="w-full text-center text-sm text-neutral-600 hover:text-primary-600"
                        >
                          Already have an account? Login
                        </button>
                      </div>
                    )}
                    {activeTab === 'register_otp' && (
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('register_email')
                            setMessage(null)
                          }}
                          className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-600"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Back
                        </button>
                        <div>
                          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Verify your email</h2>
                          <p className="text-neutral-600">Enter the 6-digit code sent to {newUserData.email || email}</p>
                        </div>
                        {newUserData.mobile && (
                          <div className="text-sm text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                            Mobile number to link: <span className="font-semibold">{formatMobile(newUserData.mobile)}</span>
                          </div>
                        )}
                            <Input
                              type="text"
                              value={otp}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                                setOtp(value)
                                if (fieldErrors.otp) {
                                  setFieldErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.otp
                                    return newErrors
                                  })
                                }
                              }}
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                              className={`w-full ${fieldErrors.otp ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {fieldErrors.otp && (
                              <p className="mt-1 text-sm text-red-600">{fieldErrors.otp}</p>
                            )}
                        <div className="flex gap-2">
                          <Button onClick={verifyEmailOTP} disabled={isLoading || otp.length !== 6} className="flex-1">
                              {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </Button>
                          <Button onClick={sendEmailOTP} variant="outline" disabled={isLoading} className="flex-1">
                              Resend
                            </Button>
                          </div>
                        </div>
                      )}
                    {/* Google Login */}
                    {isGoogleAvailable && (
                    <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-neutral-500">or</span>
                      </div>
                    </div>
                      <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                          disabled={isLoading}
                          className="w-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Connecting...
                            </span>
                          ) : (
                            <>
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                            </>
                          )}
                      </Button>
                    </div>
                    )}
                  </div>
                ) : activeTab === 'forgot_email' || activeTab === 'forgot_otp' ? (
                  /* Forgot Password Flow */
                  <div className="space-y-5">
                    {activeTab === 'forgot_email' && (
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('identify')
                            setMessage(null)
                          }}
                          className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-600"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Back
                        </button>
                        <div>
                          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Reset your password</h2>
                          <p className="text-neutral-600">Enter your registered email to receive an OTP</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                          <Input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 100) {
                                setResetEmail(value)
                                if (fieldErrors.resetEmail) {
                                  setFieldErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.resetEmail
                                    return newErrors
                                  })
                                }
                              }
                            }}
                            placeholder="you@example.com"
                            maxLength={100}
                            className={`w-full ${fieldErrors.resetEmail ? 'border-red-500 focus:ring-red-500' : ''}`}
                          />
                          {fieldErrors.resetEmail && (
                            <p className="mt-1 text-sm text-red-600">{fieldErrors.resetEmail}</p>
                          )}
                        </div>
                        <Button onClick={sendForgotOTP} disabled={isLoading || !resetEmail} className="w-full">
                          {isLoading ? 'Sending...' : 'Send OTP'}
                        </Button>
                        <button onClick={() => setActiveTab('login')} className="w-full text-center text-sm text-neutral-600 hover:text-primary-600">
                          Back to Login
                        </button>
                      </div>
                    )}
                    {activeTab === 'forgot_otp' && (
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('forgot_email')
                            setMessage(null)
                          }}
                          className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-600"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Back
                        </button>
                        <div>
                          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Verify OTP</h2>
                          <p className="text-neutral-600">Enter the 6-digit code sent to {resetEmail}</p>
                        </div>
                        <Input
                          type="text"
                          value={otp}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                            setOtp(value)
                            if (fieldErrors.otp) {
                              setFieldErrors(prev => {
                                const newErrors = { ...prev }
                                delete newErrors.otp
                                return newErrors
                              })
                            }
                          }}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className={`w-full ${fieldErrors.otp ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {fieldErrors.otp && (
                          <p className="mt-1 text-sm text-red-600">{fieldErrors.otp}</p>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">New Password</label>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 128) {
                                setNewPassword(value)
                                if (fieldErrors.newPassword) {
                                  setFieldErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.newPassword
                                    return newErrors
                                  })
                                }
                              }
                            }}
                            placeholder="Enter new password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)"
                            maxLength={128}
                            className={`w-full ${fieldErrors.newPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                          />
                          {fieldErrors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{fieldErrors.newPassword}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Confirm Password</label>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmResetPassword}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 128) {
                                setConfirmResetPassword(value)
                                if (fieldErrors.confirmResetPassword) {
                                  setFieldErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.confirmResetPassword
                                    return newErrors
                                  })
                                }
                              }
                            }}
                            placeholder="Confirm new password"
                            maxLength={128}
                            className={`w-full ${fieldErrors.confirmResetPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                          />
                          {fieldErrors.confirmResetPassword && (
                            <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmResetPassword}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleResetPassword} disabled={isLoading || otp.length !== 6 || !newPassword || !confirmResetPassword} className="flex-1">
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                          </Button>
                          <Button onClick={sendForgotOTP} variant="outline" disabled={isLoading} className="flex-1">
                            Resend
                      </Button>
                    </div>
                  </div>
                )}
                  </div>
                ) : null}

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
    </>
  )
}
