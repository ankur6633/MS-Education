'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Linkedin, Twitter, Youtube, ArrowRight, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const footerLinks = {
  courses: [
    { name: 'CA Foundation', href: '#wallet' },
    { name: 'GATE & ESE', href: '#wallet' },
    { name: 'UPSC Civil Services', href: '#wallet' },
    { name: 'MBA Entrance', href: '#wallet' },
    { name: 'Banking & SSC', href: '#wallet' }
  ],
  company: [
    { name: 'About MS Education', href: '#' },
    { name: 'Our Faculty', href: '#' },
    { name: 'Success Stories', href: '#achievements' },
    { name: 'News & Updates', href: '#' },
    { name: 'Contact Us', href: 'mailto:contact@mseducation.in' }
  ],
  support: [
    { name: 'Student Portal', href: '#' },
    { name: 'Study Material', href: '#' },
    { name: 'Mock Tests', href: '#' },
    { name: 'Doubt Support', href: '#' },
    { name: 'Career Guidance', href: '#' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Refund Policy', href: '#' },
    { name: 'Student Code of Conduct', href: '#' },
    { name: 'Academic Integrity', href: '#' }
  ]
}

const socialLinks = [
  { name: 'LinkedIn', href: 'https://linkedin.com/company/mseducation.in', icon: Linkedin },
  { name: 'Twitter', href: 'https://twitter.com/mseducation.in', icon: Twitter },
  { name: 'YouTube', href: 'https://youtube.com/@mseducation.in', icon: Youtube }
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic client-side validation
    if (!email || email.trim().length === 0) {
      toast.error('Please enter your email address')
      return
    }

    if (email.length < 5) {
      toast.error('Email must be at least 5 characters long')
      return
    }

    if (email.length > 254) {
      toast.error('Email cannot exceed 254 characters')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    setSubscriptionStatus('idle')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          source: 'footer-newsletter'
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubscriptionStatus('success')
        toast.success(data.message || 'Successfully subscribed! Check your email.', {
          duration: 5000,
          icon: '🎉'
        })
        setEmail('') // Clear the input
      } else {
        setSubscriptionStatus('error')
        toast.error(data.message || 'Failed to subscribe. Please try again.', {
          duration: 4000
        })
      }
    } catch (error) {
      console.error('Subscription error:', error)
      setSubscriptionStatus('error')
      toast.error('Network error. Please check your connection and try again.', {
        duration: 4000
      })
    } finally {
      setIsSubmitting(false)
      // Reset status after 3 seconds
      setTimeout(() => setSubscriptionStatus('idle'), 3000)
    }
  }

  return (
    <footer className="bg-neutral-900 text-white">
      <Toaster position="bottom-center" />
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">MS</span>
                  </div>
                  <span className="text-xl font-bold">MS Education</span>
                </div>
                
                <p className="text-neutral-400 mb-6 max-w-md">
                  Transforming futures through quality education. Expert faculty, comprehensive courses, 
                  and 100% placement assistance for your success.
                </p>
                
                <div className="flex items-center space-x-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors duration-200"
                    >
                      <social.icon className="h-5 w-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Courses Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-6">Courses</h3>
                <ul className="space-y-3">
                  {footerLinks.courses.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-neutral-400 hover:text-white transition-colors duration-200 text-left"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Company Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-6">Company</h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-neutral-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Support Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-6">Support</h3>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-neutral-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Legal Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-6">Legal</h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-neutral-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-8 border-t border-neutral-800"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-neutral-400">
                Get the latest updates on new courses, exam notifications, and success stories.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                maxLength={254}
                className="flex-1 md:w-80 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-l-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`
                  px-6 py-3 rounded-r-lg transition-all duration-200 flex items-center space-x-2 text-white
                  ${subscriptionStatus === 'success' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : subscriptionStatus === 'error'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : subscriptionStatus === 'success' ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Subscribed!</span>
                  </>
                ) : subscriptionStatus === 'error' ? (
                  <>
                    <XCircle className="h-4 w-4" />
                    <span>Try Again</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-6 border-t border-neutral-800"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-neutral-400 text-sm">
              © 2025 MS Education. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-neutral-400">
              <span>Established 2010</span>
              <span>•</span>
              <span>UGC Recognized</span>
              <span>•</span>
              <a href="mailto:contact@mseducation.in" className="hover:text-white transition-colors">
                <Mail className="h-4 w-4 inline mr-1" />
                contact@mseducation.in
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
