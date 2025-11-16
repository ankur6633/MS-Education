'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Star, Clock, Users, Play, ArrowRight, BookOpen, Search, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
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
  videos?: any[];
  createdAt?: string;
}

export default function MyPurchasesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useUser();

  // Fetch enrolled courses function
  const fetchEnrolledCourses = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Send user email as query parameter
      const response = await fetch(`/api/users/enrolled-courses?email=${encodeURIComponent(user.email)}`);
      if (response.ok) {
        const data = await response.json();
        const enrolledCourses = data.courses || [];
        setCourses(enrolledCourses);
        setFilteredCourses(enrolledCourses);
        
        // Show success toast if courses were loaded and we came from enrollment
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('enrolled') === 'true' && enrolledCourses.length > 0) {
          toast.success(`Successfully enrolled! You now have ${enrolledCourses.length} course${enrolledCourses.length > 1 ? 's' : ''} in your purchases.`, {
            icon: '🎉',
            duration: 4000,
          });
          // Remove query parameter
          window.history.replaceState({}, '', window.location.pathname);
        }
      } else if (response.status === 401) {
        // User not authenticated
        setCourses([]);
        setFilteredCourses([]);
        toast.error('Please login to view your enrolled courses', {
          icon: '🔒',
          duration: 4000,
        });
      } else {
        toast.error('Failed to load enrolled courses', {
          icon: '❌',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      toast.error('Error loading enrolled courses. Please try again.', {
        icon: '❌',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  // Refresh courses manually
  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    fetchEnrolledCourses().then(() => {
    }).catch(() => {
    });
  };

  // Listen for page visibility to refresh when user returns to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        // Page became visible, refresh courses in case user enrolled elsewhere
        fetchEnrolledCourses();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, fetchEnrolledCourses]);

  // Listen for focus events to refresh when user returns to the tab
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        // Window gained focus, refresh courses
        fetchEnrolledCourses();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, fetchEnrolledCourses]);

  // Filter courses based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.hindiTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 pt-32">
        <div className="container-custom py-20">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-neutral-800 mb-2">Login Required</h1>
            <p className="text-neutral-600 mb-6">Please login to view your purchased courses</p>
            <Link href="/#login">
              <Button>Login to Continue</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 pt-32">
        <div className="container-custom py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading your courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 pt-32">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="container-custom py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-primary-500 mr-3" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800">
                My Purchases
              </h1>
            </div>
            <p className="text-sm md:text-base text-neutral-600 max-w-2xl mx-auto">
              All your enrolled courses in one place
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Search Bar and Refresh Button */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your courses..."
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
              <ShoppingBag className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                {courses.length === 0 ? 'No Courses Yet' : 'No Courses Found'}
              </h3>
              <p className="text-neutral-600 mb-6">
                {courses.length === 0
                  ? "You haven't enrolled in any courses yet. Start learning today!"
                  : 'Try adjusting your search terms'}
              </p>
              {courses.length === 0 && (
                <Link href="/courses">
                  <Button>
                    Browse Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Course Count */}
            <div className="mb-6">
              <p className="text-sm text-neutral-600">
                Showing {filteredCourses.length} of {courses.length} course{courses.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full"
                >
                  {/* Course Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center overflow-hidden">
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
                      <div className="text-4xl">{course.image || '📚'}</div>
                    )}
                    
                    {/* Badge */}
                    {course.badge && (
                      <div className={`absolute top-3 right-3 ${course.badgeColor || 'bg-gray-500'} text-white px-2 py-1 rounded-full text-xs font-bold z-10`}>
                        {course.badge}
                      </div>
                    )}
                    
                    {/* MS Education Logo */}
                    <div className="absolute bottom-3 left-3 flex items-center z-10">
                      <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white font-bold text-xs">MS</span>
                      </div>
                      <span className="text-xs font-semibold text-white bg-black bg-opacity-50 px-2 py-1 rounded">MS Education</span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(course.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-neutral-600">
                        {course.rating || 0} ({course.reviews?.toLocaleString() || 0})
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-neutral-800 mb-1 line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Hindi Title */}
                    <p className="text-sm text-primary-600 font-medium mb-2">
                      {course.hindiTitle || course.title}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Features */}
                    {course.features && course.features.length > 0 && (
                      <div className="mb-3 flex-grow">
                        <div className="flex flex-wrap gap-1">
                          {course.features.slice(0, 3).map((feature, featureIndex) => (
                            <span
                              key={featureIndex}
                              className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                          {course.features.length > 3 && (
                            <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs">
                              +{course.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Course Stats */}
                    <div className="flex items-center justify-between mb-3 text-sm text-neutral-500">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {course.duration || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {course.videos?.length || 0} videos
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href={`/courses/${course._id}`}>
                      <Button className="w-full group">
                        Continue Learning
                        <Play className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

