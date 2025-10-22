'use client'

import { motion } from 'framer-motion'
import { Star, Clock, Users, Award, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

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
  theme?: string;
  isPaid?: boolean;
}

export function SkillWallet() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses/public');
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses || []);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <section id="courses" className="relative w-full py-10 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container-custom">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="courses" className="relative w-full py-10 bg-gradient-to-br from-neutral-50 to-neutral-100">
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
            Our Comprehensive Course Catalog
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-neutral-600 max-w-2xl mx-auto"
          >
            Choose from our wide range of courses designed by experts. Get certified, get placed, get ahead in your career.
          </motion.p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full"
            >
              {/* Course Image/Icon */}
              <div className="relative h-36 bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
                {/* Badge */}
                <div className={`absolute top-3 right-3 ${course.badgeColor || 'bg-gray-500'} text-white px-2 py-1 rounded-full text-xs font-bold`}>
                  {course.badge || 'NEW'}
                </div>
                
                {/* Course Icon */}
                <div className="text-4xl">{course.image || '📚'}</div>
                
                {/* MS Education Logo */}
                <div className="absolute bottom-3 left-3 flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-xs">MS</span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-700">MS Education</span>
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
                <h3 className="text-sm font-bold text-neutral-800 mb-1 line-clamp-2">
                  {course.title}
                </h3>

                {/* Hindi Title */}
                <p className="text-xs text-primary-600 font-medium mb-2">
                  {course.hindiTitle || course.title}
                </p>

                {/* Description */}
                <p className="text-xs text-neutral-600 mb-3 line-clamp-2">
                  {course.description}
                </p>

                {/* Features */}
                <div className="mb-3 flex-grow">
                  <div className="flex flex-wrap gap-1">
                    {(course.features || []).slice(0, 3).map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded-full text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                    {(course.features || []).length > 3 && (
                      <span className="bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded-full text-xs">
                        +{(course.features || []).length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between mb-3 text-xs text-neutral-500">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {course.duration || 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {course.students || '0'} students
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      {course.isPaid ? (
                        <>
                          <span className="text-lg font-bold text-neutral-800">₹{course.currentPrice?.toLocaleString()}</span>
                          {course.originalPrice && (
                            <span className="text-xs text-neutral-500 line-through ml-1">₹{course.originalPrice.toLocaleString()}</span>
                          )}
                        </>
                      ) : (
                        <span className="text-lg font-bold text-neutral-800">Free</span>
                      )}
                    </div>
                    {course.isPaid && course.discount && (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                        {course.discount}% OFF
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-2.5 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 transform group-hover:scale-105 mt-auto">
                  Enroll Now
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
            Join over 50,000+ successful students who have achieved their career goals with MS Education
          </p>
          <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold px-8 py-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300">
            View All Courses
          </button>
        </motion.div>
      </div>
    </section>
  )
}