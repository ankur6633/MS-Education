'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Settings, 
  Bell, 
  Trophy, 
  HelpCircle, 
  User, 
  ShoppingBag,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'

const dashboardNavItems = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'My Purchases', href: '/my-purchases', icon: ShoppingBag },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Updates', href: '/dashboard/updates', icon: Bell },
  { name: 'Accomplishments', href: '/dashboard/accomplishments', icon: Trophy },
  { name: 'Help Center', href: '/dashboard/help-center', icon: HelpCircle },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-xl shadow-lg p-4 sticky top-24">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden w-full flex items-center justify-between p-3 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors mb-4"
        >
          <span className="font-semibold">Dashboard Menu</span>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Navigation */}
        <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
          <ul className="space-y-2">
            {dashboardNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href === '/profile' && pathname?.startsWith('/profile')) ||
                (item.href === '/my-purchases' && pathname?.startsWith('/my-purchases')) ||
                (item.href === '/dashboard/settings' && pathname?.startsWith('/dashboard/settings')) ||
                (item.href === '/dashboard/updates' && pathname?.startsWith('/dashboard/updates')) ||
                (item.href === '/dashboard/accomplishments' && pathname?.startsWith('/dashboard/accomplishments')) ||
                (item.href === '/dashboard/help-center' && pathname?.startsWith('/dashboard/help-center'))
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                    <span className="font-medium">{item.name}</span>
                    {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

