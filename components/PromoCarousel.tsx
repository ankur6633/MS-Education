'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Course {
  _id: string
  title: string
  hindiTitle: string
  description: string
  thumbnail: string
  isPaid: boolean
  currentPrice?: number
  originalPrice?: number
  discount?: number
  duration: string
  students: string
  rating: number
  reviews: number
  features: string[]
  badge: string
  badgeColor: string
  image: string
  theme: string
}

export function PromoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCarouselCourses()
  }, [])

  useEffect(() => {
    if (courses.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === courses.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [courses.length])

  const fetchCarouselCourses = async () => {
    try {
      const response = await fetch('/api/courses/carousel')
      const data = await response.json()
      
      if (data.success && data.courses.length > 0) {
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Error fetching carousel courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? courses.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === courses.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (isLoading) {
    return (
      <section className="relative w-full h-[400px] sm:h-96 md:h-[400px] overflow-hidden mt-14">
        <div className="flex items-center justify-center h-full bg-gradient-to-r from-purple-900 via-purple-700 to-pink-600">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      </section>
    )
  }

  if (courses.length === 0) {
    return null
  }

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'diwali':
        return 'from-purple-900 via-purple-700 to-pink-600'
      case 'ca':
        return 'from-blue-900 via-purple-700 to-pink-600'
      case 'gate':
        return 'from-indigo-900 via-purple-700 to-pink-600'
      case 'upsc':
        return 'from-blue-900 via-blue-700 to-orange-600'
      case 'offline':
        return 'from-gray-800 via-orange-700 to-orange-600'
      case 'mba':
        return 'from-purple-900 via-pink-700 to-pink-600'
      default:
        return 'from-purple-900 via-purple-700 to-pink-600'
    }
  }

  return (
    <section className="relative w-full bg-gray-900">
      {/* Carousel Container */}
      <div className="relative w-full h-[450px] sm:h-[480px] md:h-[500px] lg:h-[450px]">
        <div className="relative w-full h-full overflow-hidden">
          <motion.div
            className="flex w-full h-full"
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {courses.map((course, index) => (
              <Link
                href={`/courses/${course._id}`}
                key={course._id}
                className={`w-full h-full flex-shrink-0 bg-gradient-to-r ${getThemeColors(course.theme)} relative block`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
                
                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-8 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-pink-400/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute top-1/2 left-1/4 w-6 h-6 sm:w-10 sm:h-10 bg-white/10 rounded-full blur-sm animate-bounce" />
                <div className="absolute top-1/3 right-1/3 w-8 h-8 sm:w-14 sm:h-14 bg-orange-400/20 rounded-full blur-lg animate-pulse" />
                
                {/* Content Container with proper padding for navigation buttons */}
                <div className="relative z-10 h-full flex items-center px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 py-6 sm:py-8 md:py-10">
                  <div className="w-full max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 items-center">
                      {/* Left Content */}
                      <div className="text-center lg:text-left space-y-2 sm:space-y-3 md:space-y-3.5">
                        {/* Badge */}
                        <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                          <span className={`${course.badgeColor} text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg inline-block`}>
                            {course.badge}
                          </span>
                          {course.isPaid && course.discount && course.discount > 0 && (
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg inline-block animate-pulse">
                              {course.discount}% OFF
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <div className="space-y-1">
                          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                            {course.hindiTitle}
                          </h2>
                          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white/90">
                            {course.title}
                          </h3>
                        </div>
                      
                        {/* Description */}
                        <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed line-clamp-2 max-w-2xl mx-auto lg:mx-0">
                          {course.description}
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-2 justify-center lg:justify-start items-center">
                          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
                            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white font-semibold text-xs sm:text-sm">{course.rating}</span>
                            <span className="text-white/80 text-xs">({course.reviews.toLocaleString()})</span>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
                            <span className="text-white text-xs sm:text-sm font-medium">{course.students} Students</span>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
                            <span className="text-white text-xs sm:text-sm font-medium">{course.duration}</span>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center lg:justify-start">
                          {course.features.slice(0, 3).map((feature, featureIndex) => (
                            <span key={featureIndex} className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                              ✓ {feature}
                            </span>
                          ))}
                        </div>

                        {/* Price & CTA */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                          {course.isPaid ? (
                            <div className="flex items-center gap-2">
                              <span className="text-2xl sm:text-3xl md:text-3xl font-bold text-white">
                                ₹{course.currentPrice?.toLocaleString()}
                              </span>
                              {course.originalPrice && course.originalPrice > (course.currentPrice || 0) && (
                                <span className="text-base sm:text-lg md:text-lg text-white/60 line-through">
                                  ₹{course.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-2xl sm:text-3xl md:text-3xl font-bold text-white">FREE</span>
                          )}
                          <button className="bg-white text-purple-700 font-bold px-5 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-2.5 rounded-lg hover:bg-white/90 transition-all transform hover:scale-105 shadow-xl text-xs sm:text-sm md:text-base whitespace-nowrap">
                            View Course →
                          </button>
                        </div>
                      </div>

                      {/* Right Content - Course Thumbnail */}
                      <div className="hidden lg:flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-sm xl:max-w-md">
                          <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                            <Image
                              src={course.thumbnail}
                              alt={course.title}
                              width={500}
                              height={350}
                              className="w-full h-auto object-cover"
                              unoptimized={true}
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            
                            {/* Course emoji/icon */}
                            <div className="absolute top-3 right-3 text-4xl lg:text-5xl">
                              {course.image}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Navigation Arrows - Outside content area */}
        <button
          onClick={(e) => {
            e.preventDefault()
            goToPrevious()
          }}
          className="absolute left-1 sm:left-2 md:left-3 lg:left-4 top-1/2 transform -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white/30 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all hover:scale-110 shadow-xl"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault()
            goToNext()
          }}
          className="absolute right-1 sm:right-2 md:right-3 lg:right-4 top-1/2 transform -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white/30 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all hover:scale-110 shadow-xl"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 left-1/2 transform -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
          {courses.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                goToSlide(index)
              }}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-6 sm:w-10' 
                  : 'bg-white/50 hover:bg-white/70 w-2 sm:w-2.5'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
