'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { X, Shield, Cookie } from 'lucide-react'

export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasConsented, setHasConsented] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('gyanbatua-consent')
    if (consent === null) {
      setIsVisible(true)
    } else {
      setHasConsented(consent === 'true')
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('gyanbatua-consent', 'true')
    setHasConsented(true)
    setIsVisible(false)
    
    // Enable analytics here
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    }
  }

  const handleDecline = () => {
    localStorage.setItem('gyanbatua-consent', 'false')
    setHasConsented(false)
    setIsVisible(false)
    
    // Keep analytics disabled
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      })
    }
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  Privacy & Cookie Consent
                </h3>
                <p className="text-neutral-600 text-sm mb-4">
                  We use cookies and analytics to improve your experience on GyanBatua.ai. 
                  Your data is protected under DPDP (Digital Personal Data Protection) Act. 
                  You can change your preferences anytime.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Button
                    onClick={handleAccept}
                    size="sm"
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    size="sm"
                  >
                    Decline Analytics
                  </Button>
                  <a
                    href="#"
                    className="text-sm text-primary-600 hover:text-primary-700 underline"
                  >
                    Learn More
                  </a>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-neutral-500" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
