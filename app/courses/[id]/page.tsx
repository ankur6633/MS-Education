'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Clock, Users, Play, CheckCircle, Download, Share2, BookOpen, Award, Calendar, Globe, Lock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@/components/providers/UserProvider'
import toast from 'react-hot-toast'

interface Course {
  _id: string;
  title: string;
  hindiTitle: string;
  description: string;
  rating?: number;
  reviews?: number;
  currentPrice?: number;
  originalPrice?: number;
  discount?: number;
  duration?: string;
  students?: string;
  features?: string[];
  badge?: string;
  badgeColor?: string;
  image?: string;
  thumbnail?: string;
  theme?: string;
  isPaid?: boolean;
  instructor?: string;
  language?: string;
  level?: string;
  category?: string;
  videos?: Video[];
  requirements?: string[];
  whatYouWillLearn?: string[];
}

interface Video {
  _id?: string;
  title: string;
  duration: string | number;
  description?: string;
  videoUrl?: string;
  url?: string;
  isPreview?: boolean;
}


export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user, login } = useUser()

  // Format duration from seconds to MM:SS or HH:MM:SS
  const formatDuration = useCallback((duration: string | number): string => {
    if (typeof duration === 'string') {
      // If it's already a string, try to parse it
      const parts = duration.split(':')
      if (parts.length >= 2) {
        return duration // Already formatted
      }
      const seconds = parseInt(duration)
      if (!isNaN(seconds)) {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        if (hours > 0) {
          return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`
      }
      return duration
    }
    // If it's a number (seconds)
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const secs = duration % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Map video data from API to frontend format
  const mapVideoData = useCallback((videos: any[]): Video[] => {
    if (!videos) return []
    // Sort videos by order first
    const sortedVideos = [...videos].sort((a, b) => (a.order || 0) - (b.order || 0))
    return sortedVideos.map((video, index) => ({
      _id: video._id || String(index),
      title: video.title,
      duration: formatDuration(video.duration || 0),
      description: video.description,
      videoUrl: video.url || video.videoUrl, // Map url to videoUrl
      url: video.url || video.videoUrl,
      isPreview: video.isPreview || index === 0
    }))
  }, [formatDuration])

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          const courseData = data.course
          
          // Map videos to frontend format
          if (courseData.videos) {
            courseData.videos = mapVideoData(courseData.videos)
          }
          
          setCourse(courseData)
          
          // Don't set selected video initially - wait for enrollment check
          // Video will be set after enrollment status is verified
        }
      } catch (error) {
        console.error('Error fetching course:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [params.id, mapVideoData])

  // Check enrollment status
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user) {
        setIsEnrolled(false)
        return
      }

      try {
        // Send user email as query parameter
        const response = await fetch(`/api/courses/${params.id}/enroll?email=${encodeURIComponent(user.email)}`)
        if (response.ok) {
          const data = await response.json()
          setIsEnrolled(data.enrolled || false)
        }
      } catch (error) {
        console.error('Error checking enrollment:', error)
      }
    }

    checkEnrollment()
  }, [user, params.id])

  // Set selected video after enrollment status is checked
  useEffect(() => {
    if (course?.videos && course.videos.length > 0 && user && isEnrolled) {
      // Only set video if user is enrolled
      if (!selectedVideo) {
        setSelectedVideo(course.videos[0])
      }
    } else if (!isEnrolled) {
      // Clear selected video if not enrolled
      setSelectedVideo(null)
    }
  }, [course, user, isEnrolled, selectedVideo])

  const handleEnroll = async () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading('Enrolling in course...', {
        position: 'top-center',
        id: 'enroll-loading',
      })

      const response = await fetch(`/api/courses/${params.id}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Dismiss loading toast
        toast.dismiss(loadingToast)
        
        // Update enrollment status
        setIsEnrolled(true)

        // Refresh enrollment status and update UI
        setTimeout(async () => {
          try {
            const checkResponse = await fetch(`/api/courses/${params.id}/enroll?email=${encodeURIComponent(user.email)}`)
            if (checkResponse.ok) {
              const enrollmentData = await checkResponse.json()
              setIsEnrolled(enrollmentData.enrolled || false)
              
              // If enrolled, set first video as selected
              if (enrollmentData.enrolled && course?.videos && course.videos.length > 0) {
                setSelectedVideo(course.videos[0])
              }
            }
          } catch (error) {
            console.error('Error checking enrollment:', error)
          }
        }, 500)

        // Quiet success: no intrusive toast after enrollment
      } else {
        const errorData = await response.json()
        toast.dismiss(loadingToast)
        toast.error(errorData.error || 'Failed to enroll in course. Please try again.', {
          position: 'top-center',
          duration: 5000,
          id: 'enrollment-error',
        })
      }
    } catch (error) {
      console.error('Error enrolling in course:', error)
      toast.error('Failed to enroll in course. Please try again.', {
        position: 'top-center',
        duration: 5000,
        id: 'enrollment-error',
      })
    }
  }

  const handleVideoClick = (video: Video) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    
    // Check if user can access this video
    if (!canAccessVideo(video)) {
      toast.error('Please enroll in this course to access videos', {
        icon: '🔒',
        duration: 4000,
      })
      return
    }
    
    setSelectedVideo(video)
    toast.success(`Playing: ${video.title}`, {
      icon: '▶️',
      duration: 2000,
    })
  }

  const canAccessVideo = (video: Video) => {
    if (!user) return false
    
    // User must be enrolled to access any video (both paid and free courses)
    if (!isEnrolled) {
      return false
    }
    
    // For enrolled users, all videos are accessible
    return true
  }

  const getAccessibleVideos = () => {
    if (!course?.videos) return []
    
    // Only show videos if user is enrolled
    if (!user || !isEnrolled) {
      return []
    }
    
    // For enrolled users, show all videos
    return course.videos
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 pt-16">
        <div className="container-custom py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading course details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 pt-16">
        <div className="container-custom py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-800 mb-4">Course Not Found</h1>
            <p className="text-neutral-600 mb-6">The course you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/courses">
              <Button>Back to Courses</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="container-custom py-4">
          <div className="flex items-center space-x-4">
            <Link href="/courses">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-neutral-800">{course.title}</h1>
              <p className="text-neutral-600">{course.hindiTitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-black relative">
                {selectedVideo ? (
                  <>
                    {!user ? (
                      <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
                        <div className="bg-white rounded-lg p-6 text-center max-w-md mx-4">
                          <Lock className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-neutral-800 mb-2">Login Required</h3>
                          <p className="text-neutral-600 mb-4">Please login to watch this video</p>
                          <Button onClick={() => setShowLoginModal(true)}>
                            Login to Continue
                          </Button>
                        </div>
                      </div>
                    ) : !canAccessVideo(selectedVideo) ? (
                      <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
                        <div className="bg-white rounded-lg p-6 text-center max-w-md mx-4">
                          <Lock className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-neutral-800 mb-2">Enrollment Required</h3>
                          <p className="text-neutral-600 mb-4">
                            Please enroll in this course to access videos and content
                          </p>
                          <Button onClick={handleEnroll}>
                            {course?.isPaid ? 'Enroll Now' : 'Enroll for Free'}
                          </Button>
                        </div>
                      </div>
                    ) : selectedVideo.videoUrl || selectedVideo.url ? (
                      <video
                        key={selectedVideo.videoUrl || selectedVideo.url}
                        className="w-full h-full"
                        controls
                        controlsList="nodownload"
                        preload="metadata"
                        style={{ maxHeight: '100%' }}
                      >
                        <source src={selectedVideo.videoUrl || selectedVideo.url} type="video/mp4" />
                        <source src={selectedVideo.videoUrl || selectedVideo.url} type="video/webm" />
                        <source src={selectedVideo.videoUrl || selectedVideo.url} type="video/ogg" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{selectedVideo.title}</h3>
                          <p className="text-neutral-300">{selectedVideo.duration}</p>
                          {selectedVideo.description && (
                            <p className="text-sm text-neutral-400 mt-2">{selectedVideo.description}</p>
                          )}
                          <p className="text-sm text-neutral-400 mt-4">Video URL not available</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Course Preview</h3>
                      <p className="text-neutral-300">Click on a video to start learning</p>
                      {!user && (
                        <p className="text-sm text-neutral-400 mt-2">Login required to watch videos</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Video Title and Info */}
              {selectedVideo && canAccessVideo(selectedVideo) && (
                <div className="p-4 border-t border-neutral-200">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-1">{selectedVideo.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedVideo.duration}
                    </span>
                    {selectedVideo.description && (
                      <p className="text-neutral-600">{selectedVideo.description}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">About This Course</h2>
              <p className="text-neutral-600 leading-relaxed">{course.description}</p>
            </div>

            {/* What You'll Learn */}
            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-800 mb-4">What You&apos;ll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Videos List */}
            {course.videos && course.videos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-800 mb-4">Course Videos</h2>
                {!user || !isEnrolled ? (
                  <div className="text-center py-8">
                    <Lock className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600 mb-4">
                      {!user 
                        ? 'Please login to view course videos'
                        : 'Please enroll in this course to access videos'}
                    </p>
                    {!user ? (
                      <Button onClick={() => setShowLoginModal(true)}>
                        Login to Continue
                      </Button>
                    ) : (
                      <Button onClick={handleEnroll}>
                        {course.isPaid ? 'Enroll Now' : 'Enroll for Free'}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {course.videos.map((video, index) => {
                      const hasAccess = canAccessVideo(video)
                      
                      return (
                        <button
                          key={video._id || index}
                          onClick={() => handleVideoClick(video)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                            selectedVideo?._id === video._id
                              ? 'bg-primary-50 text-primary-700 border border-primary-200'
                              : 'hover:bg-neutral-50 text-neutral-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Play className="h-4 w-4" />
                            <span className="text-sm font-medium">{video.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-neutral-500">{video.duration}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Course Materials */}
            {(!user || !isEnrolled) ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-800 mb-4">Course Materials</h2>
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-4">
                    {!user 
                      ? 'Please login to view course materials'
                      : 'Please enroll in this course to access materials'}
                  </p>
                  {!user ? (
                    <Button onClick={() => setShowLoginModal(true)}>
                      Login to Continue
                    </Button>
                  ) : (
                    <Button onClick={handleEnroll}>
                      {course.isPaid ? 'Enroll Now' : 'Enroll for Free'}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-800 mb-4">Course Materials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* PDF Materials */}
                  <div className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <FileText className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold text-neutral-800">PDF Materials</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                        <span className="text-sm text-neutral-700">Course Notes</span>
                        <Download className="h-4 w-4 text-primary-500 cursor-pointer hover:text-primary-600" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                        <span className="text-sm text-neutral-700">Practice Questions</span>
                        <Download className="h-4 w-4 text-primary-500 cursor-pointer hover:text-primary-600" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                        <span className="text-sm text-neutral-700">Reference Books</span>
                        <Download className="h-4 w-4 text-primary-500 cursor-pointer hover:text-primary-600" />
                      </div>
                    </div>
                  </div>

                  {/* Video Materials */}
                  <div className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Play className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold text-neutral-800">Video Content</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                        <span className="text-sm text-neutral-700">Lecture Videos</span>
                        <span className="text-xs text-neutral-500">
                          {course.videos?.length || 0} available
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                        <span className="text-sm text-neutral-700">Live Sessions</span>
                        <Calendar className="h-4 w-4 text-primary-500" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                        <span className="text-sm text-neutral-700">Recorded Sessions</span>
                        <Play className="h-4 w-4 text-primary-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-800 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-neutral-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              {/* Course Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg mb-4 overflow-hidden">
                {course.thumbnail ? (
                  <Image 
                    src={course.thumbnail} 
                    alt={course.title}
                    width={800}
                    height={192}
                    className="w-full h-full object-cover"
                    unoptimized={true}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-4xl">{course.image || '📚'}</div>
                  </div>
                )}
                {course.badge && (
                  <div className={`absolute top-3 right-3 ${course.badgeColor || 'bg-gray-500'} text-white px-2 py-1 rounded-full text-xs font-bold`}>
                    {course.badge}
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="mb-6">
                {course.isPaid ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-neutral-800">₹{course.currentPrice?.toLocaleString()}</span>
                    {course.originalPrice && (
                      <span className="text-lg text-neutral-500 line-through">₹{course.originalPrice.toLocaleString()}</span>
                    )}
                    {course.discount && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-bold">
                        {course.discount}% OFF
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-green-600">Free</span>
                )}
              </div>

              {/* Enroll Button */}
              {course.isPaid ? (
                <Button 
                  onClick={handleEnroll}
                  className="w-full mb-4"
                  size="lg"
                  disabled={isEnrolled}
                >
                  {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                </Button>
              ) : (
                <Button 
                  onClick={async () => {
                    if (!user) {
                      setShowLoginModal(true)
                      return
                    }
                    // For free courses, allow enrollment to track in My Purchases
                    if (!isEnrolled) {
                      await handleEnroll()
                    }
                  }}
                  className="w-full mb-4"
                  size="lg"
                  disabled={isEnrolled}
                >
                  {isEnrolled ? 'Enrolled - Start Learning' : user ? 'Enroll for Free' : 'Login to Access'}
                </Button>
              )}

              {/* Course Stats */}
              <div className="space-y-3 border-t border-neutral-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{course.rating || 0}</span>
                    <span className="text-sm text-neutral-500">({course.reviews?.toLocaleString() || 0})</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Duration</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-neutral-500" />
                    <span className="text-sm font-medium">{course.duration || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Students</span>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-neutral-500" />
                    <span className="text-sm font-medium">{course.students || '0'}</span>
                  </div>
                </div>
                {course.language && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Language</span>
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4 text-neutral-500" />
                      <span className="text-sm font-medium">{course.language}</span>
                    </div>
                  </div>
                )}
                {course.level && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Level</span>
                    <span className="text-sm font-medium">{course.level}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Instructor Info */}
            {course.instructor && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-neutral-800 mb-4">Instructor</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {course.instructor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">{course.instructor}</p>
                    <p className="text-sm text-neutral-600">Course Instructor</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <Lock className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Login Required</h3>
              <p className="text-neutral-600 mb-6">
                Please login to access course videos and materials
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    setShowLoginModal(false)
                    // Open login sidebar - you can implement this
                    window.location.href = '/#login'
                  }}
                  className="w-full"
                >
                  Login to Continue
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowLoginModal(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
