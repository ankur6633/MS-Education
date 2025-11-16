'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Menu, X, ArrowRight, LogOut, User, Search, Settings, ShoppingBag, Bell, Trophy, HelpCircle, Crown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LoginSidebar } from '@/components/LoginSidebar'
import { useUser } from '@/components/providers/UserProvider'
import Link from 'next/link'

const navItems = [
  { name: 'Courses', href: '/courses' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginSidebarOpen, setIsLoginSidebarOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useUser()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        const target = event.target as Element
        if (!target.closest('[data-user-menu]')) {
          setShowUserMenu(false)
        }
      }
      if (isMobileMenuOpen) {
        const target = event.target as Element
        if (!target.closest('[data-mobile-menu]')) {
          setIsMobileMenuOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu, isMobileMenuOpen])

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to page
      window.location.href = href
    }
    setIsMobileMenuOpen(false)
  }

  const handleGetStarted = () => {
    setIsLoginSidebarOpen(true)
  }

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    logout()
    setShowUserMenu(false)
    setShowLogoutModal(false)
    // Redirect to home after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  const cancelLogout = () => {
    setShowLogoutModal(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to courses page with search query
      window.location.href = `/courses?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <>
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-neutral-200' 
          : 'bg-white'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Desktop Search */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MS</span>
                </div>
                <span className="text-xl font-bold gradient-text whitespace-nowrap">MS Education</span>
              </motion.div>
            </Link>
            
            {/* Desktop Search Bar - Only visible on large screens */}
            <form onSubmit={handleSearch} className="hidden md:flex">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What do you want to learn?"
                  className="w-64 px-4 py-2 pr-12 text-sm border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation (visible from md and up) */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* CTA Button or User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    {user.name || 'Account'}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50"
                    >
                      {/* User Info hidden per privacy request */}
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <Link href="/my-purchases" className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                          <ShoppingBag className="h-4 w-4" />
                          <span>My Purchases</span>
                        </Link>
                        <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                          <Bell className="h-4 w-4" />
                          <span>Updates</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                          <Trophy className="h-4 w-4" />
                          <span>Accomplishments</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                          <HelpCircle className="h-4 w-4" />
                          <span>Help Center</span>
                        </button>
                      </div>
                      
                      {/* Separator */}
                      <div className="border-t border-neutral-100 my-1"></div>
                      
                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                onClick={handleGetStarted}
                className="group"
              >
                Get Started 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </div>

          {/* Mobile Menu Button (hidden from md and up) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            data-mobile-menu
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (hidden from md and up) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-neutral-200 shadow-lg"
            data-mobile-menu
          >
            <div className="container-custom py-4 space-y-4">
              {/* Mobile Search Bar */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What do you want to learn?"
                    className="w-full px-4 py-3 pr-12 text-sm border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>
              
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left text-neutral-700 hover:text-primary-600 font-medium py-2 transition-colors"
                >
                  {item.name}
                </button>
              ))}
              {user ? (
                <div className="space-y-3">
                  {/* User Info hidden per privacy request */}
                  
                  {/* Menu Items */}
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link href="/my-purchases" className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                      <ShoppingBag className="h-4 w-4" />
                      <span>My Purchases</span>
                    </Link>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                      <Bell className="h-4 w-4" />
                      <span>Updates</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                      <Trophy className="h-4 w-4" />
                      <span>Accomplishments</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                      <HelpCircle className="h-4 w-4" />
                      <span>Help Center</span>
                    </button>
                  </div>
                  
                  {/* Premium Section removed */}
                  
                  {/* Logout */}
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleGetStarted}
                  className="w-full group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Sidebar */}
      <LoginSidebar 
        isOpen={isLoginSidebarOpen} 
        onClose={() => setIsLoginSidebarOpen(false)} 
      />
    </motion.nav>
    {/* Logout Confirmation Modal */}
    {showLogoutModal && (
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
      >
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4">
          <div className="px-6 py-5">
            <h3 id="logout-title" className="text-lg font-semibold text-neutral-900">
              Are you sure you want to log out?
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              You will be signed out of your current session.
            </p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-sm rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    {/* Persistent Get Started Floating Button */}
    <button
      onClick={() => setIsLoginSidebarOpen(true)}
      className="fixed bottom-6 right-6 z-[60] shadow-lg rounded-full px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
      aria-label="Get Started"
    >
      Get Started
    </button>
    </>
  )
}
