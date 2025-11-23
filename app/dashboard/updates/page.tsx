'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/components/providers/UserProvider'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Bell, BookOpen, GraduationCap, Award, Megaphone, CheckCircle2, Circle, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface Update {
  _id: string
  title: string
  description: string
  type: 'course_added' | 'course_updated' | 'lesson_added' | 'certificate_unlocked' | 'announcement'
  createdBy?: {
    name: string
    email: string
  }
  courseId?: {
    _id: string
    title: string
    thumbnail?: string
  }
  image?: string
  redirectUrl?: string
  createdAt: string
  isRead: boolean
}

const getUpdateIcon = (type: Update['type']) => {
  switch (type) {
    case 'course_added':
      return BookOpen
    case 'course_updated':
      return BookOpen
    case 'lesson_added':
      return GraduationCap
    case 'certificate_unlocked':
      return Award
    case 'announcement':
      return Megaphone
    default:
      return Bell
  }
}

const getUpdateColor = (type: Update['type']) => {
  switch (type) {
    case 'course_added':
      return 'bg-blue-500'
    case 'course_updated':
      return 'bg-purple-500'
    case 'lesson_added':
      return 'bg-green-500'
    case 'certificate_unlocked':
      return 'bg-yellow-500'
    case 'announcement':
      return 'bg-orange-500'
    default:
      return 'bg-neutral-500'
  }
}

export default function UpdatesPage() {
  const { user } = useUser()
  const [updates, setUpdates] = useState<Update[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)

  useEffect(() => {
    if (user?.email) {
      fetchUpdates()
    }
  }, [user, page])

  const fetchUpdates = async () => {
    if (!user?.email) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/updates/list?email=${encodeURIComponent(user.email)}&page=${page}&limit=20`)
      const data = await res.json()
      
      if (data.success) {
        if (page === 1) {
          setUpdates(data.updates)
        } else {
          setUpdates(prev => [...prev, ...data.updates])
        }
        setHasMore(data.pagination.page < data.pagination.pages)
      } else {
        toast.error(data.error || 'Failed to load updates')
      }
    } catch (error) {
      console.error('Error fetching updates:', error)
      toast.error('Error loading updates')
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (updateId: string) => {
    if (!user?.email) return

    try {
      const res = await fetch('/api/updates/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify({ updateId })
      })

      const data = await res.json()
      if (data.success) {
        setUpdates(prev =>
          prev.map(update =>
            update._id === updateId ? { ...update, isRead: true } : update
          )
        )
      }
    } catch (error) {
      console.error('Error marking update as read:', error)
    }
  }

  const markAllAsRead = async () => {
    if (!user?.email) return

    setIsMarkingAllRead(true)
    try {
      const res = await fetch('/api/updates/mark-all-read', {
        method: 'POST',
        headers: {
          'x-user-email': user.email
        }
      })

      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        setUpdates(prev => prev.map(update => ({ ...update, isRead: true })))
      } else {
        toast.error(data.error || 'Failed to mark all as read')
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Error marking all as read')
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  const unreadCount = updates.filter(u => !u.isRead).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <Bell className="h-8 w-8 text-primary-500" />
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Updates</h1>
            <p className="text-neutral-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread update${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={isMarkingAllRead}
          >
            {isMarkingAllRead ? 'Marking...' : 'Mark All as Read'}
          </Button>
        )}
      </motion.div>

      {/* Updates List */}
      {isLoading && updates.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : updates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">No Updates Yet</h3>
            <p className="text-neutral-600">
              You're all caught up! Check back later for new updates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {updates.map((update, index) => {
              const Icon = getUpdateIcon(update.type)
              const iconColor = getUpdateColor(update.type)
              const updateDate = new Date(update.createdAt)
              const timeAgo = getTimeAgo(updateDate)

              return (
                <motion.div
                  key={update._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`hover:shadow-lg transition-all ${!update.isRead ? 'border-l-4 border-l-primary-500' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Icon */}
                        <div className={`${iconColor} p-3 rounded-full text-white shrink-0`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className={`font-semibold text-neutral-800 ${!update.isRead ? 'font-bold' : ''}`}>
                                  {update.title}
                                </h3>
                                {!update.isRead && (
                                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-sm text-neutral-600 mb-2">{update.description}</p>
                              <p className="text-xs text-neutral-500">{timeAgo}</p>
                            </div>
                            <button
                              onClick={() => markAsRead(update._id)}
                              className="ml-4 shrink-0"
                              title={update.isRead ? 'Mark as unread' : 'Mark as read'}
                            >
                              {update.isRead ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-neutral-300 hover:text-primary-500" />
                              )}
                            </button>
                          </div>

                          {/* Course Image */}
                          {update.courseId?.thumbnail && (
                            <div className="mt-3 flex items-center space-x-3">
                              <Image
                                src={update.courseId.thumbnail}
                                alt={update.courseId.title}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover"
                                unoptimized
                              />
                              <div>
                                <p className="text-sm font-medium text-neutral-800">
                                  {update.courseId.title}
                                </p>
                                {update.redirectUrl && (
                                  <Link
                                    href={update.redirectUrl}
                                    className="text-xs text-primary-600 hover:underline flex items-center space-x-1 mt-1"
                                  >
                                    <span>View</span>
                                    <ChevronRight className="h-3 w-3" />
                                  </Link>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Custom Image */}
                          {update.image && !update.courseId?.thumbnail && (
                            <div className="mt-3">
                              <Image
                                src={update.image}
                                alt={update.title}
                                width={400}
                                height={200}
                                className="rounded-lg object-cover w-full"
                                unoptimized
                              />
                            </div>
                          )}

                          {/* Redirect Link */}
                          {update.redirectUrl && !update.courseId && (
                            <Link
                              href={update.redirectUrl}
                              className="mt-3 inline-flex items-center text-sm text-primary-600 hover:underline"
                            >
                              <span>Learn more</span>
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => setPage(prev => prev + 1)}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return date.toLocaleDateString()
}

