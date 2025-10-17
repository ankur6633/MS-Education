'use client'

import { motion } from 'framer-motion'
import { Star, Clock, Users, Award, CheckCircle } from 'lucide-react'

const courses = [
  {
    id: 1,
    title: 'Complete CA Foundation Course Kit',
    subtitle: 'All Books + Video Classes + Practice Tests',
    description: 'CA Foundation | Intermediate | Final - Complete Study Material with Expert Guidance',
    hindi: 'CA फाउंडेशन कंप्लीट कोर्स',
    rating: 4.4,
    reviews: 1250,
    currentPrice: '₹2,999',
    originalPrice: '₹4,999',
    discount: '40% OFF',
    duration: '6 Months',
    students: '10,000+',
    features: ['Live Classes', 'Recorded Videos', 'Study Material', 'Mock Tests', 'Doubt Support'],
    badge: 'BESTSELLER',
    badgeColor: 'bg-green-500',
    image: '📚',
    theme: 'ca'
  },
  {
    id: 2,
    title: 'GATE & ESE Complete Preparation',
    subtitle: 'All Engineering Streams Covered',
    description: 'CS & IT | CH | CE | ECE | EE | ME & XE - Comprehensive GATE & ESE Preparation',
    hindi: 'GATE & ESE कंप्लीट प्रिपरेशन',
    rating: 4.5,
    reviews: 2100,
    currentPrice: '₹1,999',
    originalPrice: '₹3,499',
    discount: '43% OFF',
    duration: '8 Months',
    students: '15,000+',
    features: ['All Streams', 'Previous Year Papers', 'Test Series', 'Video Lectures', 'Study Notes'],
    badge: 'RECOMMENDED',
    badgeColor: 'bg-blue-500',
    image: '🎓',
    theme: 'gate'
  },
  {
    id: 3,
    title: 'UPSC Civil Services Complete Kit',
    subtitle: 'NCERT + CSAT + Prelims + Mains + Interview',
    description: 'Complete UPSC Preparation with NCERT, CSAT, Prelims, Mains & Interview Guidance',
    hindi: 'UPSC सिविल सर्विसेज कंप्लीट किट',
    rating: 4.3,
    reviews: 1800,
    currentPrice: '₹3,499',
    originalPrice: '₹5,999',
    discount: '42% OFF',
    duration: '12 Months',
    students: '8,500+',
    features: ['NCERT Books', 'CSAT Material', 'Current Affairs', 'Test Series', 'Interview Prep'],
    badge: 'POPULAR',
    badgeColor: 'bg-orange-500',
    image: '📖',
    theme: 'upsc'
  }
]

export function SkillWallet() {
  return (
    <section className="relative w-full py-16 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">MS</span>
            </div>
            <span className="text-2xl font-bold gradient-text">MS Education Courses</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4"
          >
            Your Portable, Verifiable Skill Wallet
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-neutral-600 max-w-2xl mx-auto"
          >
            Master your skills with our comprehensive course packages. Get certified, get hired, get ahead.
          </motion.p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Course Image/Icon */}
              <div className="relative h-48 bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
                {/* Badge */}
                <div className={`absolute top-4 right-4 ${course.badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                  {course.badge}
                </div>
                
                {/* Course Icon */}
                <div className="text-6xl mb-4">{course.image}</div>
                
                {/* MS Education Logo */}
                <div className="absolute bottom-4 left-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-sm">MS</span>
                  </div>
                  <span className="text-sm font-semibold text-neutral-700">MS Education</span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(course.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-neutral-600">
                    {course.rating} ({course.reviews.toLocaleString()})
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-neutral-800 mb-2 line-clamp-2">
                  {course.title}
                </h3>

                {/* Hindi Title */}
                <p className="text-sm text-primary-600 font-medium mb-3">
                  {course.hindi}
                </p>

                {/* Description */}
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Features */}
                <div className="mb-4">
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

                {/* Course Stats */}
                <div className="flex items-center justify-between mb-4 text-xs text-neutral-500">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {course.students} students
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-neutral-800">{course.currentPrice}</span>
                      <span className="text-sm text-neutral-500 line-through ml-2">{course.originalPrice}</span>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                      {course.discount}
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 transform group-hover:scale-105">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-neutral-600 mb-4">
            Join over 50,000+ students who have transformed their careers with MS Education
          </p>
          <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold px-8 py-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300">
            Explore All Courses
          </button>
        </motion.div>
      </div>
    </section>
  )
}