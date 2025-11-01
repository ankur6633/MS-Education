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
    <section className="relative w-full h-[450px] sm:h-[500px] md:h-[500px] overflow-hidden mt-14 bg-gray-900">
      {/* Carousel Container */}
      <div className="relative w-full h-full">
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
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-8 h-8 sm:w-20 sm:h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-12 h-12 sm:w-32 sm:h-32 bg-pink-400/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute top-1/2 left-1/4 w-4 h-4 sm:w-10 sm:h-10 bg-white/10 rounded-full blur-sm animate-bounce" />
                <div className="absolute top-1/3 right-1/3 w-6 h-6 sm:w-16 sm:h-16 bg-orange-400/20 rounded-full blur-lg animate-pulse" />
                
                {/* Content */}
                <div className="relative z-10 container mx-auto h-full flex items-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-center w-full">
                    {/* Left Content */}
                    <div className="text-center lg:text-left space-y-4 sm:space-y-6">
                      {/* Badge */}
                      <div className="flex items-center justify-center lg:justify-start gap-3">
                        <span className={`${course.badgeColor} text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg`}>
                          {course.badge}
                        </span>
                        {course.isPaid && course.discount && course.discount > 0 && (
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg">
                            {course.discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <div>
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                          {course.hindiTitle}
                        </h2>
                        <h3 className="text-lg sm:text-2xl md:text-3xl font-semibold text-white/90 mb-2 sm:mb-3">
                          {course.title}
                        </h3>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed line-clamp-2">
                        {course.description}
                      </p>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start items-center">
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                          <span className="text-white font-semibold text-sm sm:text-base">{course.rating}</span>
                          <span className="text-white/80 text-xs sm:text-sm">({course.reviews.toLocaleString()})</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <span className="text-white text-xs sm:text-sm font-medium">{course.students} Students</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <span className="text-white text-xs sm:text-sm font-medium">{course.duration}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {course.features.slice(0, 3).map((feature, featureIndex) => (
                          <span key={featureIndex} className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                            ✓ {feature}
                          </span>
                        ))}
                      </div>

                      {/* Price & CTA */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2">
                        {course.isPaid ? (
                          <div className="flex items-center gap-2">
                            <span className="text-3xl sm:text-4xl font-bold text-white">
                              ₹{course.currentPrice?.toLocaleString()}
                            </span>
                            {course.originalPrice && course.originalPrice > (course.currentPrice || 0) && (
                              <span className="text-lg sm:text-xl text-white/60 line-through">
                                ₹{course.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-3xl sm:text-4xl font-bold text-white">FREE</span>
                        )}
                        <button className="bg-white text-purple-700 font-bold px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg hover:bg-white/90 transition-all transform hover:scale-105 shadow-xl text-sm sm:text-base">
                          View Course →
                        </button>
                      </div>
                    </div>

                    {/* Right Content - Course Thumbnail */}
                    <div className="flex justify-center lg:justify-end">
                      <div className="relative w-full max-w-md lg:max-w-lg">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            width={600}
                            height={400}
                            className="w-full h-auto object-cover"
                            unoptimized={true}
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          
                          {/* Course emoji/icon */}
                          <div className="absolute top-4 right-4 text-4xl sm:text-6xl">
                            {course.image}
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

        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.preventDefault()
            goToPrevious()
          }}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all hover:scale-110"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault()
            goToNext()
          }}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all hover:scale-110"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {courses.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                goToSlide(index)
              }}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-8 sm:w-12' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

    </section>
  )
}
