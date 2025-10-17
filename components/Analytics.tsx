'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    plausible: (...args: any[]) => void
  }
}

export function Analytics() {
  useEffect(() => {
    // Check if user has consented to analytics
    const consent = localStorage.getItem('mseducation.in-consent')
    const hasConsented = consent === 'true'

    if (hasConsented) {
      // Initialize Google Analytics (if configured)
      if (process.env.NEXT_PUBLIC_GA_ID) {
        const script = document.createElement('script')
        script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
        script.async = true
        document.head.appendChild(script)

        window.gtag = window.gtag || function() {
          (window.gtag as any).q = (window.gtag as any).q || []
          ;(window.gtag as any).q.push(arguments)
        }

        window.gtag('js', new Date())
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
          consent: 'granted'
        })
      }

      // Initialize Plausible Analytics (if configured)
      if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
        const script = document.createElement('script')
        script.src = 'https://plausible.io/js/script.js'
        script.setAttribute('data-domain', process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN)
        script.defer = true
        document.head.appendChild(script)
      }
    } else {
      // Initialize with consent denied
      if (process.env.NEXT_PUBLIC_GA_ID) {
        window.gtag = window.gtag || function() {
          (window.gtag as any).q = (window.gtag as any).q || []
          ;(window.gtag as any).q.push(arguments)
        }

        window.gtag('consent', 'default', {
          analytics_storage: 'denied'
        })
      }
    }
  }, [])

  return null
}
