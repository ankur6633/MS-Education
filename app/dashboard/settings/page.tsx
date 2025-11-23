'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@/components/providers/UserProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Settings, User, Lock, Bell, Palette, Globe, Trash2, Unlink } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function SettingsPage() {
  const { user, login } = useUser()
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences' | 'social' | 'danger'>('profile')
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    profileImage: user?.profileImage || ''
  })
  const [isProfileLoading, setIsProfileLoading] = useState(false)

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)

  // Preferences state
  const [preferences, setPreferences] = useState({
    notificationsEnabled: true,
    theme: 'light',
    language: 'en'
  })
  const [isPreferencesLoading, setIsPreferencesLoading] = useState(false)

  // Social state
  const [social, setSocial] = useState({
    googleConnected: false
  })
  const [isSocialLoading, setIsSocialLoading] = useState(false)

  const fetchPreferences = useCallback(async () => {
    try {
      const res = await fetch(`/api/user/settings/preferences?email=${encodeURIComponent(user?.email || '')}`)
      const data = await res.json()
      if (data.success) {
        setPreferences(data.preferences)
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
    }
  }, [user?.email])

  const fetchSocial = useCallback(async () => {
    try {
      const res = await fetch(`/api/user/settings/social?email=${encodeURIComponent(user?.email || '')}`)
      const data = await res.json()
      if (data.success) {
        setSocial(data.social)
      }
    } catch (error) {
      console.error('Error fetching social:', error)
    }
  }, [user?.email])

  // Load preferences and social on mount
  useEffect(() => {
    if (user?.email) {
      fetchPreferences()
      fetchSocial()
    }
  }, [user, fetchPreferences, fetchSocial])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.email) return

    setIsProfileLoading(true)
    try {
      const res = await fetch('/api/user/settings/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify(profileData)
      })

      const data = await res.json()
      if (data.success) {
        toast.success('Profile updated successfully')
        // Update user context
        login({
          _id: user._id,
          name: data.user.name,
          email: data.user.email,
          mobile: data.user.mobile,
          profileImage: data.user.profileImage
        })
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('Error updating profile')
    } finally {
      setIsProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.email) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsPasswordLoading(true)
    try {
      const res = await fetch('/api/user/settings/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await res.json()
      if (data.success) {
        toast.success('Password updated successfully')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        toast.error(data.error || 'Failed to update password')
      }
    } catch (error) {
      toast.error('Error updating password')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handlePreferencesUpdate = async () => {
    if (!user?.email) return

    setIsPreferencesLoading(true)
    try {
      const res = await fetch('/api/user/settings/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify(preferences)
      })

      const data = await res.json()
      if (data.success) {
        toast.success('Preferences updated successfully')
        setPreferences(data.preferences)
      } else {
        toast.error(data.error || 'Failed to update preferences')
      }
    } catch (error) {
      toast.error('Error updating preferences')
    } finally {
      setIsPreferencesLoading(false)
    }
  }

  const handleDisconnectGoogle = async () => {
    if (!user?.email) return

    if (!confirm('Are you sure you want to disconnect your Google account?')) {
      return
    }

    setIsSocialLoading(true)
    try {
      const res = await fetch(`/api/user/settings/social?provider=google&email=${encodeURIComponent(user.email)}`, {
        method: 'DELETE',
        headers: {
          'x-user-email': user.email
        }
      })

      const data = await res.json()
      if (data.success) {
        toast.success('Google account disconnected')
        setSocial({ googleConnected: false })
      } else {
        toast.error(data.error || 'Failed to disconnect')
      }
    } catch (error) {
      toast.error('Error disconnecting account')
    } finally {
      setIsSocialLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user?.email) return

    const password = prompt('Please enter your password to confirm account deletion:')
    if (!password) return

    if (!confirm('Are you absolutely sure? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch('/api/user/settings/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify({
          password,
          confirmDelete: true
        })
      })

      const data = await res.json()
      if (data.success) {
        toast.success('Account deleted successfully')
        // Redirect to home after a delay
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      } else {
        toast.error(data.error || 'Failed to delete account')
      }
    } catch (error) {
      toast.error('Error deleting account')
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'social', label: 'Social', icon: Unlink },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3 mb-8"
      >
        <Settings className="h-8 w-8 text-primary-500" />
        <h1 className="text-3xl font-bold text-neutral-800">Settings</h1>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-1 flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Profile Image */}
                <div className="flex items-center space-x-6">
                  {profileData.profileImage ? (
                    <Image
                      src={profileData.profileImage}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                      {profileData.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Profile Image URL
                    </label>
                    <Input
                      type="url"
                      value={profileData.profileImage}
                      onChange={(e) => setProfileData({ ...profileData, profileImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Mobile Number
                    </label>
                    <Input
                      type="tel"
                      value={profileData.mobile}
                      onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isProfileLoading}>
                  {isProfileLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" disabled={isPasswordLoading}>
                  {isPasswordLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Email Notifications
                    </label>
                    <p className="text-sm text-neutral-500">Receive email notifications about updates and announcements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.notificationsEnabled}
                      onChange={(e) => setPreferences({ ...preferences, notificationsEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Theme
                  </label>
                  <Select
                    value={preferences.theme}
                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Language
                  </label>
                  <Select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </Select>
                </div>

                <Button onClick={handlePreferencesUpdate} disabled={isPreferencesLoading}>
                  {isPreferencesLoading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Social Tab */}
      {activeTab === 'social' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your social account connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      G
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">Google</p>
                      <p className="text-sm text-neutral-500">
                        {social.googleConnected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  {social.googleConnected ? (
                    <Button
                      variant="outline"
                      onClick={handleDisconnectGoogle}
                      disabled={isSocialLoading}
                    >
                      {isSocialLoading ? 'Disconnecting...' : 'Disconnect'}
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Danger Zone Tab */}
      {activeTab === 'danger' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Delete Account</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleDeleteAccount}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete My Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

