'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useUser } from '@/components/providers/UserProvider'

interface LoginSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginSidebar({ isOpen, onClose }: LoginSidebarProps) {
  // UI & panel state
  const [activeTab, setActiveTab] = useState<
    | 'identify'
    | 'login'
    | 'register_email'
    | 'register_otp'
    | 'register_details'
    | 'forgot_email'
    | 'forgot_otp'
  >('identify')
  const [isMobile, setIsMobile] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)

  // Form state (kept consistent with your original)
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
    password: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmResetPassword, setConfirmResetPassword] = useState('')
  const { login } = useUser()
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Validation patterns & helpers
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const formatMobile = (value: string) => {
    if (!value) return ''
    const digits = value.replace(/\D/g, '')
    if (digits.length !== 10) return value
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }

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

  // --- Helper to interpret server errors and map them to fieldErrors (inline)
  const mapServerErrorToField = (errText?: string | null) => {
    if (!errText) return null
    const low = errText.toLowerCase()
    // Common patterns — extend as you see errors from backend
    if (low.includes('mobile') && low.includes('already')) {
      return { field: 'mobile', message: 'A user with this mobile number already exists' }
    }
    if ((low.includes('email') || low.includes('e-mail')) && low.includes('already')) {
      return { field: 'email', message: 'A user with this email already exists' }
    }
    if (low.includes('password') && (low.includes('match') || low.includes('confirm'))) {
      return { field: 'confirmPassword', message: 'Passwords do not match' }
    }
    // generic fallback to non-field banner
    return null
  }

  // --- API handlers (kept original behavior but improved error mapping & inline display)
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
        // try to map inline
        const mapped = mapServerErrorToField(data?.error || data?.message || null)
        if (mapped) {
          setFieldErrors({ [mapped.field]: mapped.message })
          setMessage(null)
        } else {
          throw new Error(data?.error || 'Unable to continue')
        }
        setIsLoading(false)
        return
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
      const text = e?.message || String(e)
      const mapped = mapServerErrorToField(text)
      if (mapped) {
        setFieldErrors({ [mapped.field]: mapped.message })
        setMessage(null)
      } else {
        setMessage({ type: 'error', text: text || 'Unable to continue' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Send email OTP for registration
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
        // inline mapping
        const mapped = mapServerErrorToField(data?.error || data?.message || null)
        if (mapped) {
          setFieldErrors({ [mapped.field]: mapped.message })
          setMessage(null)
          setIsLoading(false)
          return
        }
        throw new Error(data?.error || 'Failed to send OTP')
      }
      setNewUserData(prev => ({ ...prev, email }))
      setActiveTab('register_otp')
      setMessage({ type: 'success', text: 'OTP sent to your email' })
    } catch (e: any) {
      const text = e?.message || String(e)
      const mapped = mapServerErrorToField(text)
      if (mapped) {
        setFieldErrors({ [mapped.field]: mapped.message })
        setMessage(null)
      } else {
        setMessage({ type: 'error', text: text || 'Failed to send OTP' })
      }
    } finally {
      setIsLoading(false)
    }
  }

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
        const mapped = mapServerErrorToField(data?.error || data?.message || null)
        if (mapped) {
          setFieldErrors({ [mapped.field]: mapped.message })
          setMessage(null)
          setIsLoading(false)
          return
        }
        throw new Error(data?.error || 'Invalid OTP')
      }
      setActiveTab('register_details')
      setMessage({ type: 'success', text: 'Email verified. Complete your details.' })
    } catch (e: any) {
      const text = e?.message || String(e)
      const mapped = mapServerErrorToField(text)
      if (mapped) {
        setFieldErrors({ [mapped.field]: mapped.message })
        setMessage(null)
      } else {
        setMessage({ type: 'error', text: text || 'OTP verification failed' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Login
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
        // server may return field-specific errors
        const mapped = mapServerErrorToField(data?.error || data?.message || null)
        if (mapped) {
          setFieldErrors({ [mapped.field]: mapped.message })
          setMessage(null)
        } else {
          setMessage({ type: 'error', text: data.error || 'Login failed' })
        }
      }
    } catch (error: any) {
      console.error('Error during login:', error)
      const mapped = mapServerErrorToField(error?.message || String(error))
      if (mapped) {
        setFieldErrors({ [mapped.field]: mapped.message })
        setMessage(null)
      } else {
        setMessage({ type: 'error', text: 'Error during login. Please try again.' })
      }
    }

    setIsLoading(false)
  }

  // Register (create account)
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
        const mapped = mapServerErrorToField(data?.error || data?.message || null)
        if (mapped) {
          setFieldErrors({ [mapped.field]: mapped.message })
          setMessage(null)
          // keep user on register_details so they can fix field
        } else {
          setMessage({ type: 'error', text: data.error || 'Registration failed. Please try again.' })
        }
      }
    } catch (error: any) {
      console.error('Error during registration:', error)
      const mapped = mapServerErrorToField(error?.message || String(error))
      if (mapped) {
        setFieldErrors({ [mapped.field]: mapped.message })
        setMessage(null)
      } else {
        setMessage({ type: 'error', text: 'Error during registration. Please try again.' })
      }
    }

    setIsLoading(false)
  }

  // Forgot password - request OTP
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
        const mapped = mapServerErrorToField(data?.error || data?.message || null)
        if (mapped) {
          setFieldErrors({ [mapped.field]: mapped.message })
          setMessage(null)
          setIsLoading(false)
          return
        }
        throw new Error(data?.error || 'Failed to send OTP')
      }
      setActiveTab('forgot_otp')
      setMessage({ type: 'success', text: 'Reset OTP sent to your email' })
    } catch (e: any) {
      const text = e?.message || String(e)
      const mapped = mapServerErrorToField(text)
      if (mapped) {
        setFieldErrors({ [mapped.field]: mapped.message })
        setMessage(null)
      } else {
        setMessage({ type: 'error', text: text || 'Failed to send OTP' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Forgot password - reset
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
        const mapped = mapServerErrorToField(data?.error || data?.message || null)
        if (mapped) {
          setFieldErrors({ [mapped.field]: mapped.message })
          setMessage(null)
          setIsLoading(false)
          return
        }
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
      const text = e?.message || String(e)
      const mapped = mapServerErrorToField(text)
      if (mapped) {
        setFieldErrors({ [mapped.field]: mapped.message })
        setMessage(null)
      } else {
        setMessage({ type: 'error', text: text || 'Failed to reset password' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Google login: unchanged behavior (keeps original popup flow)
  const handleGoogleLogin = async () => {
    if (!isGoogleAvailable) {
      return
    }

    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string

      if (!clientId || clientId.trim() === '' || clientId === 'your-google-oauth-client-id') {
        return
      }

      setIsLoading(true)
      setMessage(null)

      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('google_oauth_state', state)
      sessionStorage.setItem('google_oauth_redirect', window.location.href)

      const redirectUri = `${window.location.origin}/api/auth/google/callback`
      const scope = 'openid email profile'
      const responseType = 'id_token'
      const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=${responseType}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${encodeURIComponent(state)}&` +
        `nonce=${encodeURIComponent(state)}`

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

      const messageListener = (event: MessageEvent) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Message received from popup:', {
            origin: event.origin,
            expectedOrigin: window.location.origin,
            type: event.data?.type,
            data: event.data,
          })
        }

        if (event.origin !== window.location.origin) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Message origin mismatch:', event.origin, 'expected:', window.location.origin)
          }
          return
        }

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          window.removeEventListener('message', messageListener)
          if (popup && !popup.closed) popup.close()
          const { user, isNewUser } = event.data
          login(user)
          setMessage({
            type: 'success',
            text: isNewUser ? `Welcome to MS Education, ${user.name}! Your account has been created.` : `Welcome back, ${user.name}!`,
          })
          setIsLoading(false)
          setTimeout(() => onClose(), 1500)
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          window.removeEventListener('message', messageListener)
          if (popup && !popup.closed) popup.close()
          const errorMsg = event.data.error || 'Google authentication failed'
          console.error('Google auth error:', errorMsg)
          setMessage({ type: 'error', text: errorMsg })
          setIsLoading(false)
        }
      }

      window.addEventListener('message', messageListener)

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

  // Environment feature detection
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const isAvailable = !!(clientId && typeof clientId === 'string' && clientId.trim() !== '' && clientId !== 'your-google-oauth-client-id' && !clientId.startsWith('your-'))
    setIsGoogleAvailable(isAvailable)
  }, [isOpen])

  // Reset when closed
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

  // Responsive detection for animation/layout selection
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Focus trap minimal: focus first focusable element on open, restore on close
  useEffect(() => {
    if (!isOpen) return
    const prevFocused = document.activeElement as HTMLElement | null
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>('button, a, input, [tabindex]:not([tabindex="-1"])')
    firstFocusable?.focus()
    return () => prevFocused?.focus()
  }, [isOpen])

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Motion variants: right drawer on desktop, bottom sheet on mobile
  const panelVariants = {
    hidden: isMobile ? { y: '100%' } : { x: '100%' },
    visible: { x: 0, y: 0 },
    exit: isMobile ? { y: '100%' } : { x: '100%' },
  }

  const inputClass = (hasError?: boolean) => `w-full min-w-0 ${hasError ? 'border-red-500 focus:ring-red-500' : ''}`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black z-[60] backdrop-blur-sm"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            role="dialog"
            aria-modal="true"
            aria-label="Login and registration"
            className={`
              fixed z-[70] bg-white shadow-2xl
              ${isMobile ? 'left-0 right-0 bottom-0 rounded-t-2xl' : 'right-0 top-0 h-screen rounded-l-2xl'}
              ${isMobile ? 'h-[72vh] max-h-[90vh]' : 'w-96 max-w-[92vw]'}
              flex flex-col
              focus:outline-none
            `}
            style={{ transform: 'translateZ(0)' }}
          >
            {/* Header */}
            <header className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-neutral-200 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center" aria-hidden="true">
                  <span className="text-white font-semibold text-sm select-none">MS</span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-neutral-800 truncate">MS Education</div>
                  <div className="text-xs text-neutral-500 truncate">Sign in or create an account</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  aria-label="Close panel"
                  className="p-2 rounded-md hover:bg-neutral-100 focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            {/* Body */}
            <div className="flex-1 overflow-auto min-h-0 px-4 sm:px-5 py-5">
              {/* Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}
                >
                  <span className="mt-0.5">
                    {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : message.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                  </span>
                  <p className="text-sm leading-tight">{message.text}</p>
                </motion.div>
              )}

              <div className="space-y-6">
                {/* IDENTIFY */}
                {activeTab === 'identify' && (
                  <section aria-labelledby="identify-heading" className="space-y-4">
                    <div>
                      <h2 id="identify-heading" className="text-2xl font-bold text-neutral-800 break-words">Login or Sign up</h2>
                      <p className="text-sm text-neutral-600">Enter your email or phone number to continue</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Email or Phone</label>
                        <Input
                          aria-label="Email or phone"
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
                          className={inputClass(!!fieldErrors.identifier)}
                        />
                        {fieldErrors.identifier && <p className="mt-1 text-sm text-red-600">{fieldErrors.identifier}</p>}
                      </div>

                      <Button onClick={handleIdentify} disabled={isLoading || !identifierInput.trim()} className="w-full" aria-disabled={isLoading || !identifierInput.trim()}>
                        {isLoading ? 'Checking...' : 'Continue'}
                      </Button>
                    </div>

                    {isGoogleAvailable && (
                      <div className="pt-1">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-neutral-200" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-neutral-500">or</span>
                          </div>
                        </div>

                        <Button onClick={handleGoogleLogin} variant="outline" disabled={isLoading} className="w-full mt-3 disabled:opacity-60 disabled:cursor-not-allowed" aria-disabled={isLoading}>
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
                              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
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

                    <div className="mt-2 text-center text-sm text-neutral-500">Don&apos;t share your login details with anyone.</div>
                  </section>
                )}

                {/* LOGIN */}
                {activeTab === 'login' && (
                  <section aria-labelledby="login-heading" className="space-y-4">
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
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back
                      </button>

                      <h2 id="login-heading" className="text-2xl font-bold text-neutral-800 break-words">Enter your password</h2>
                      <p className="text-sm text-neutral-600">
                        {loginIdentifier?.type === 'mobile' ? 'We found your account using this mobile number.' : 'We found your account using this email.'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Email or Phone</label>
                        <Input value={loginIdentifier?.value || ''} readOnly className="w-full min-w-0 bg-neutral-50 text-neutral-700" aria-readonly />
                        <button type="button" onClick={() => { setLoginIdentifier(null); setPassword(''); setActiveTab('identify'); setMessage(null) }} className="mt-2 text-xs text-primary-600 hover:underline">
                          Use a different email or phone
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
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
                          <button type="button" onClick={() => setShowPassword(!showPassword)} aria-pressed={showPassword} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded focus:ring-2 focus:ring-offset-2 focus:ring-primary-400">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {fieldErrors.password && <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>}
                      </div>

                      <Button onClick={handleLogin} disabled={isLoading || !password} className="w-full" aria-disabled={isLoading || !password}>
                        {isLoading ? 'Logging in...' : 'Login'}
                      </Button>

                      <div className="flex items-center justify-between text-sm">
                        <button onClick={() => { if (loginIdentifier?.type === 'email') { setEmail(loginIdentifier.value); setNewUserData(prev => ({ ...prev, email: loginIdentifier.value })) } else if (loginIdentifier?.type === 'mobile') { setNewUserData(prev => ({ ...prev, mobile: loginIdentifier.value })) } setActiveTab('register_email') }} className="text-neutral-600 hover:text-primary-600">
                          Need an account?
                        </button>

                        <button onClick={() => { if (loginIdentifier?.type === 'email') { setResetEmail(loginIdentifier.value) } setActiveTab('forgot_email') }} className="text-neutral-600 hover:text-primary-600">
                          Forgot password?
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {/* REGISTER DETAILS */}
                {activeTab === 'register_details' && (
                  <section aria-labelledby="register-details-heading" className="space-y-4">
                    <div>
                      <h2 id="register-details-heading" className="text-2xl font-bold text-neutral-800 break-words">Complete Your Profile</h2>
                      <p className="text-sm text-neutral-600">Please provide your details to continue</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name *</label>
                        <Input type="text" value={newUserData.name} onChange={(e) => {
                          const value = e.target.value
                          if (value.length <= 100) {
                            setNewUserData(prev => ({ ...prev, name: value }))
                            if (fieldErrors.name) {
                              setFieldErrors(prev => { const n = { ...prev }; delete n.name; return n })
                            }
                          }
                        }} placeholder="Enter your full name" maxLength={100} className={inputClass(!!fieldErrors.name)} />
                        {fieldErrors.name && <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Email ID *</label>
                        <Input type="email" value={newUserData.email} disabled placeholder={newUserData.email} maxLength={100} className={`w-full min-w-0 bg-neutral-50 ${fieldErrors.email ? 'border-red-500' : ''}`} />
                        {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Mobile Number *</label>
                        <Input type="tel" value={newUserData.mobile} onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                          setNewUserData(prev => ({ ...prev, mobile: value }))
                          if (fieldErrors.mobile) {
                            setFieldErrors(prev => { const n = { ...prev }; delete n.mobile; return n })
                          }
                        }} placeholder="Enter 10-digit mobile number" maxLength={10} className={inputClass(!!fieldErrors.mobile)} />
                        {fieldErrors.mobile && <p className="mt-1 text-sm text-red-600">{fieldErrors.mobile}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Password *</label>
                        <div className="relative">
                          <Input type={showPassword ? 'text' : 'password'} value={newUserData.password} onChange={(e) => {
                            const value = e.target.value
                            if (value.length <= 128) {
                              setNewUserData(prev => ({ ...prev, password: value }))
                              if (fieldErrors.password) {
                                setFieldErrors(prev => { const n = { ...prev }; delete n.password; return n })
                              }
                            }
                          }} placeholder="Create a password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)" maxLength={128} className={`w-full pr-10 ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded focus:ring-2 focus:ring-offset-2 focus:ring-primary-400" aria-pressed={showPassword}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {fieldErrors.password && <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Confirm Password *</label>
                        <div className="relative">
                          <Input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => {
                            const value = e.target.value
                            if (value.length <= 128) {
                              setConfirmPassword(value)
                              if (fieldErrors.confirmPassword) {
                                setFieldErrors(prev => { const n = { ...prev }; delete n.confirmPassword; return n })
                              }
                            }
                          }} placeholder="Confirm password" maxLength={128} className={`w-full pr-10 ${fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded focus:ring-2 focus:ring-offset-2 focus:ring-primary-400" aria-pressed={showPassword}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {fieldErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button onClick={handleRegister} disabled={isLoading} className="w-full" aria-disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>

                      <button onClick={() => setActiveTab('login')} className="w-full text-center text-sm text-neutral-600 hover:text-primary-600">Back to Login</button>
                    </div>
                  </section>
                )}

                {/* REGISTER EMAIL / OTP */}
                {(activeTab === 'register_email' || activeTab === 'register_otp') && (
                  <section aria-labelledby="register-email-heading" className="space-y-4">
                    {activeTab === 'register_email' && (
                      <>
                        <button type="button" onClick={() => { setActiveTab('identify'); setMessage(null) }} className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-600">
                          <ChevronLeft className="h-4 w-4 mr-1" /> Back
                        </button>

                        <div>
                          <h2 id="register-email-heading" className="text-2xl font-bold text-neutral-800 break-words">Create your account</h2>
                          <p className="text-sm text-neutral-600">Enter your email to receive a verification code</p>
                        </div>

                        {newUserData.mobile && (
                          <div className="text-sm text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                            Mobile number to link: <span className="font-semibold">{formatMobile(newUserData.mobile)}</span>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                          <Input type="email" value={email} onChange={(e) => {
                            const value = e.target.value
                            if (value.length <= 100) {
                              setEmail(value)
                              if (fieldErrors.email) {
                                setFieldErrors(prev => { const n = { ...prev }; delete n.email; return n })
                              }
                            }
                          }} placeholder="you@example.com" maxLength={100} className={inputClass(!!fieldErrors.email)} />
                          {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
                        </div>

                        <Button onClick={sendEmailOTP} disabled={isLoading || !email} className="w-full" aria-disabled={isLoading || !email}>
                          {isLoading ? 'Sending...' : 'Send OTP'}
                        </Button>

                        <button onClick={() => setActiveTab('login')} className="w-full text-center text-sm text-neutral-600 hover:text-primary-600">Already have an account? Login</button>
                      </>
                    )}

                    {activeTab === 'register_otp' && (
                      <>
                        <button type="button" onClick={() => { setActiveTab('register_email'); setMessage(null) }} className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-600">
                          <ChevronLeft className="h-4 w-4 mr-1" /> Back
                        </button>

                        <div>
                          <h2 className="text-2xl font-bold text-neutral-800 break-words">Verify your email</h2>
                          <p className="text-sm text-neutral-600">Enter the 6-digit code sent to {newUserData.email || email}</p>
                        </div>

                        {newUserData.mobile && (
                          <div className="text-sm text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                            Mobile number to link: <span className="font-semibold">{formatMobile(newUserData.mobile)}</span>
                          </div>
                        )}

                        <Input type="text" value={otp} onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                          setOtp(value)
                          if (fieldErrors.otp) {
                            setFieldErrors(prev => { const n = { ...prev }; delete n.otp; return n })
                          }
                        }} placeholder="Enter 6-digit OTP" maxLength={6} className={inputClass(!!fieldErrors.otp)} />
                        {fieldErrors.otp && <p className="mt-1 text-sm text-red-600">{fieldErrors.otp}</p>}

                        <div className="flex gap-2">
                          <Button onClick={verifyEmailOTP} disabled={isLoading || otp.length !== 6} className="flex-1" aria-disabled={isLoading || otp.length !== 6}>
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                          </Button>
                          <Button onClick={sendEmailOTP} variant="outline" disabled={isLoading} className="flex-1" aria-disabled={isLoading}>
                            Resend
                          </Button>
                        </div>
                      </>
                    )}

                    {isGoogleAvailable && (
                      <div className="pt-2">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-neutral-200" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-neutral-500">or</span>
                          </div>
                        </div>

                        <Button onClick={handleGoogleLogin} variant="outline" disabled={isLoading} className="w-full mt-3 disabled:opacity-60 disabled:cursor-not-allowed" aria-disabled={isLoading}>
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
                              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
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
                  </section>
                )}

                {/* FORGOT */}
                {(activeTab === 'forgot_email' || activeTab === 'forgot_otp') && (
                  <section aria-labelledby="forgot-heading" className="space-y-4">
                    {activeTab === 'forgot_email' && (
                      <>
                        <button type="button" onClick={() => { setActiveTab('identify'); setMessage(null) }} className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-600">
                          <ChevronLeft className="h-4 w-4 mr-1" /> Back
                        </button>

                        <div>
                          <h2 id="forgot-heading" className="text-2xl font-bold text-neutral-800 break-words">Reset your password</h2>
                          <p className="text-sm text-neutral-600">Enter your registered email to receive an OTP</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                          <Input type="email" value={resetEmail} onChange={(e) => {
                            const value = e.target.value
                            if (value.length <= 100) {
                              setResetEmail(value)
                              if (fieldErrors.resetEmail) {
                                setFieldErrors(prev => { const n = { ...prev }; delete n.resetEmail; return n })
                              }
                            }
                          }} placeholder="you@example.com" maxLength={100} className={inputClass(!!fieldErrors.resetEmail)} />
                          {fieldErrors.resetEmail && <p className="mt-1 text-sm text-red-600">{fieldErrors.resetEmail}</p>}
                        </div>

                        <Button onClick={sendForgotOTP} disabled={isLoading || !resetEmail} className="w-full" aria-disabled={isLoading || !resetEmail}>
                          {isLoading ? 'Sending...' : 'Send OTP'}
                        </Button>

                        <button onClick={() => setActiveTab('login')} className="w-full text-center text-sm text-neutral-600 hover:text-primary-600">Back to Login</button>
                      </>
                    )}

                    {activeTab === 'forgot_otp' && (
                      <>
                        <button type="button" onClick={() => { setActiveTab('forgot_email'); setMessage(null) }} className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-600">
                          <ChevronLeft className="h-4 w-4 mr-1" /> Back
                        </button>

                        <div>
                          <h2 className="text-2xl font-bold text-neutral-800 break-words">Verify OTP</h2>
                          <p className="text-sm text-neutral-600">Enter the 6-digit code sent to {resetEmail}</p>
                        </div>

                        <Input type="text" value={otp} onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                          setOtp(value)
                          if (fieldErrors.otp) {
                            setFieldErrors(prev => { const n = { ...prev }; delete n.otp; return n })
                          }
                        }} placeholder="Enter 6-digit OTP" maxLength={6} className={inputClass(!!fieldErrors.otp)} />
                        {fieldErrors.otp && <p className="mt-1 text-sm text-red-600">{fieldErrors.otp}</p>}

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">New Password</label>
                          <Input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => {
                            const value = e.target.value
                            if (value.length <= 128) {
                              setNewPassword(value)
                              if (fieldErrors.newPassword) {
                                setFieldErrors(prev => { const n = { ...prev }; delete n.newPassword; return n })
                              }
                            }
                          }} placeholder="Enter new password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)" maxLength={128} className={inputClass(!!fieldErrors.newPassword)} />
                          {fieldErrors.newPassword && <p className="mt-1 text-sm text-red-600">{fieldErrors.newPassword}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Confirm Password</label>
                          <Input type={showPassword ? 'text' : 'password'} value={confirmResetPassword} onChange={(e) => {
                            const value = e.target.value
                            if (value.length <= 128) {
                              setConfirmResetPassword(value)
                              if (fieldErrors.confirmResetPassword) {
                                setFieldErrors(prev => { const n = { ...prev }; delete n.confirmResetPassword; return n })
                              }
                            }
                          }} placeholder="Confirm new password" maxLength={128} className={inputClass(!!fieldErrors.confirmResetPassword)} />
                          {fieldErrors.confirmResetPassword && <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmResetPassword}</p>}
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={handleResetPassword} disabled={isLoading || otp.length !== 6 || !newPassword || !confirmResetPassword} className="flex-1" aria-disabled={isLoading || otp.length !== 6 || !newPassword || !confirmResetPassword}>
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                          </Button>
                          <Button onClick={sendForgotOTP} variant="outline" disabled={isLoading} className="flex-1" aria-disabled={isLoading}>
                            Resend
                          </Button>
                        </div>
                      </>
                    )}
                  </section>
                )}
              </div>
            </div>

            {/* Footer */}
            <footer className="shrink-0 border-t border-neutral-200 px-4 sm:px-5 py-3">
              <p className="text-xs text-neutral-500 text-center">
                By continuing you are accepting our{' '}
                <a href="#" className="text-primary-600 hover:underline">privacy policy</a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:underline">T&C</a>
              </p>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
