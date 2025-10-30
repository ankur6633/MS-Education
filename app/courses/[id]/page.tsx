'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Clock, Users, Play, CheckCircle, Download, Share2, BookOpen, Award, Calendar, Globe, Lock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@/components/providers/UserProvider'

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
  curriculum?: CurriculumItem[];
  requirements?: string[];
  whatYouWillLearn?: string[];
}

interface Video {
  _id: string;
  title: string;
  duration: string;
  description?: string;
  videoUrl?: string;
  isPreview?: boolean;
}

interface CurriculumItem {
  _id: string;
  title: string;
  videos: Video[];
  duration: string;
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user, login } = useUser()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setCourse(data.course)
          if (data.course.videos && data.course.videos.length > 0) {
            setSelectedVideo(data.course.videos[0])
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [params.id])

  const handleEnroll = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    // TODO: Implement enrollment logic
    setIsEnrolled(true)
    alert('Enrollment successful! You now have access to this course.')
  }

  const handleVideoClick = (video: Video) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    
    // Check if user can access this video
    if (!canAccessVideo(video)) {
      alert('You need to enroll in this course to access this video.')
      return
    }
    
    setSelectedVideo(video)
  }

  const canAccessVideo = (video: Video) => {
    if (!user) return false
    
    // If course is free, user can access all videos
    if (!course?.isPaid) return true
    
    // If course is paid, user needs to be enrolled
    if (course?.isPaid && !isEnrolled) return false
    
    // First video is always accessible as preview
    if (course?.videos && course.videos[0]?._id === video._id) return true
    
    // For enrolled users, all videos are accessible
    return isEnrolled
  }

  const getAccessibleVideos = () => {
    if (!course?.videos) return []
    
    if (!user) {
      // Not logged in - show only first video as preview
      return course.videos.slice(0, 1)
    }
    
    if (!course.isPaid) {
      // Free course - show all videos
      return course.videos
    }
    
    if (isEnrolled) {
      // Paid course, enrolled - show all videos
      return course.videos
    }
    
    // Paid course, not enrolled - show only first video
    return course.videos.slice(0, 1)
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
              <div className="aspect-video bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center relative">
                {selectedVideo ? (
                  <div className="text-center">
                    {!user ? (
                      <div className="bg-black bg-opacity-50 absolute inset-0 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 text-center">
                          <Lock className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-neutral-800 mb-2">Login Required</h3>
                          <p className="text-neutral-600 mb-4">Please login to watch this video</p>
                          <Button onClick={() => setShowLoginModal(true)}>
                            Login to Continue
                          </Button>
                        </div>
                      </div>
                    ) : !canAccessVideo(selectedVideo) ? (
                      <div className="bg-black bg-opacity-50 absolute inset-0 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 text-center">
                          <Lock className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-neutral-800 mb-2">Enrollment Required</h3>
                          <p className="text-neutral-600 mb-4">Please enroll in this course to access this video</p>
                          <Button onClick={handleEnroll}>
                            Enroll Now
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-800 mb-2">{selectedVideo.title}</h3>
                        <p className="text-neutral-600">{selectedVideo.duration}</p>
                        {selectedVideo.description && (
                          <p className="text-sm text-neutral-500 mt-2">{selectedVideo.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-2">Course Preview</h3>
                    <p className="text-neutral-600">Click on a video to start learning</p>
                    {!user && (
                      <p className="text-sm text-neutral-500 mt-2">Login required to watch videos</p>
                    )}
                  </div>
                )}
              </div>
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

            {/* Course Curriculum */}
            {course.curriculum && course.curriculum.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-800 mb-4">Course Curriculum</h2>
                <div className="space-y-4">
                  {course.curriculum.map((section, index) => (
                    <div key={section._id} className="border border-neutral-200 rounded-lg overflow-hidden">
                      <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
                        <h3 className="font-semibold text-neutral-800">{section.title}</h3>
                        <p className="text-sm text-neutral-600">{section.duration}</p>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2">
                          {section.videos.map((video, videoIndex) => {
                            const hasAccess = canAccessVideo(video)
                            const isAccessible = getAccessibleVideos().some(v => v._id === video._id)
                            
                            return (
                              <button
                                key={video._id}
                                onClick={() => handleVideoClick(video)}
                                disabled={!isAccessible}
                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                                  selectedVideo?._id === video._id
                                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                                    : isAccessible
                                    ? 'hover:bg-neutral-50 text-neutral-700'
                                    : 'opacity-50 cursor-not-allowed text-neutral-400'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  {hasAccess ? (
                                    <Play className="h-4 w-4" />
                                  ) : (
                                    <Lock className="h-4 w-4" />
                                  )}
                                  <span className="text-sm font-medium">{video.title}</span>
                                  {video.isPreview && (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Preview</span>
                                  )}
                                  {!hasAccess && !video.isPreview && (
                                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                      {!user ? 'Login Required' : 'Enroll Required'}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-neutral-500">{video.duration}</span>
                                  {!hasAccess && (
                                    <Lock className="h-3 w-3 text-neutral-400" />
                                  )}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Materials */}
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
                      {!user ? (
                        <Lock className="h-4 w-4 text-neutral-400" />
                      ) : (
                        <Download className="h-4 w-4 text-primary-500 cursor-pointer hover:text-primary-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                      <span className="text-sm text-neutral-700">Practice Questions</span>
                      {!user ? (
                        <Lock className="h-4 w-4 text-neutral-400" />
                      ) : (
                        <Download className="h-4 w-4 text-primary-500 cursor-pointer hover:text-primary-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                      <span className="text-sm text-neutral-700">Reference Books</span>
                      {!user ? (
                        <Lock className="h-4 w-4 text-neutral-400" />
                      ) : (
                        <Download className="h-4 w-4 text-primary-500 cursor-pointer hover:text-primary-600" />
                      )}
                    </div>
                  </div>
                  {!user && (
                    <p className="text-xs text-neutral-500 mt-2">Login required to download materials</p>
                  )}
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
                        {getAccessibleVideos().length} / {course.videos?.length || 0} available
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                      <span className="text-sm text-neutral-700">Live Sessions</span>
                      {!user ? (
                        <Lock className="h-4 w-4 text-neutral-400" />
                      ) : (
                        <Calendar className="h-4 w-4 text-primary-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                      <span className="text-sm text-neutral-700">Recorded Sessions</span>
                      {!user ? (
                        <Lock className="h-4 w-4 text-neutral-400" />
                      ) : (
                        <Play className="h-4 w-4 text-primary-500" />
                      )}
                    </div>
                  </div>
                  {!user && (
                    <p className="text-xs text-neutral-500 mt-2">Login required to access videos</p>
                  )}
                </div>
              </div>
            </div>

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
              <Button 
                onClick={handleEnroll}
                className="w-full mb-4"
                size="lg"
              >
                {isEnrolled ? 'Enrolled' : 'Enroll Now'}
              </Button>

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
