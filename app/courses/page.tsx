'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Star, Clock, Users, ArrowRight, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
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
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const { user } = useUser();

  // Fetch courses and handle URL search parameter
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses/public');
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses || []);
          setFilteredCourses(data.courses || []);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();

    // Handle search parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, []);

  // Filter courses
  useEffect(() => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.hindiTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter (based on course title/features)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => {
        const title = course.title.toLowerCase();
        const features = course.features?.join(' ').toLowerCase() || '';
        
        switch (selectedCategory) {
          case 'ca':
            return title.includes('ca') || features.includes('ca');
          case 'gate':
            return title.includes('gate') || features.includes('gate');
          case 'upsc':
            return title.includes('upsc') || features.includes('upsc');
          case 'mba':
            return title.includes('mba') || features.includes('mba');
          case 'engineering':
            return title.includes('engineering') || features.includes('engineering');
          default:
            return true;
        }
      });
    }

    // Price filter
    if (selectedPrice !== 'all') {
      filtered = filtered.filter(course => {
        switch (selectedPrice) {
          case 'free':
            return !course.isPaid;
          case 'under-1000':
            return course.isPaid && (course.currentPrice || 0) < 1000;
          case '1000-5000':
            return course.isPaid && (course.currentPrice || 0) >= 1000 && (course.currentPrice || 0) <= 5000;
          case 'above-5000':
            return course.isPaid && (course.currentPrice || 0) > 5000;
          default:
            return true;
        }
      });
    }

    // Rating filter
    if (selectedRating !== 'all') {
      const minRating = parseInt(selectedRating);
      filtered = filtered.filter(course => (course.rating || 0) >= minRating);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedCategory, selectedPrice, selectedRating]);

  // Fetch enrolled courses if user is logged in
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user?.email) {
        setEnrolledCourseIds([]);
        return;
      }

      try {
        const response = await fetch(`/api/users/enrolled-courses?email=${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const data = await response.json();
          const enrolledIds = (data.courses || []).map((course: Course) => course._id);
          setEnrolledCourseIds(enrolledIds);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPrice('all');
    setSelectedRating('all');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container-custom py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="container-custom py-4 md:py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 mb-2 md:mb-3">
              All Courses
            </h1>
            <p className="text-xs md:text-sm lg:text-base text-neutral-600 max-w-2xl mx-auto whitespace-nowrap overflow-hidden text-ellipsis">
              Discover our comprehensive collection of courses designed to transform your career
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-11">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-800">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Search Courses
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search courses..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category
                </label>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="ca">CA Foundation</option>
                  <option value="gate">GATE</option>
                  <option value="upsc">UPSC</option>
                  <option value="mba">MBA</option>
                  <option value="engineering">Engineering</option>
                </Select>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price Range
                </label>
                <Select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="free">Free</option>
                  <option value="under-1000">Under ₹1,000</option>
                  <option value="1000-5000">₹1,000 - ₹5,000</option>
                  <option value="above-5000">Above ₹5,000</option>
                </Select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Minimum Rating
                </label>
                <Select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                >
                  <option value="all">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </Select>
              </div>

              {/* Results Count */}
              <div className="pt-4 border-t border-neutral-200">
                <p className="text-sm text-neutral-600">
                  Showing {filteredCourses.length} of {courses.length} courses
                </p>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="flex-1">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">No courses found</h3>
                <p className="text-neutral-600 mb-4">Try adjusting your search or filters</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
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
                      {/* Enrolled Badge */}
                      {enrolledCourseIds.includes(course._id) && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Enrolled</span>
                        </div>
                      )}
                      {/* Course Badge */}
                      <div className={`absolute top-3 right-3 ${course.badgeColor || 'bg-gray-500'} text-white px-2 py-1 rounded-full text-xs font-bold z-10`}>
                        {course.badge || 'NEW'}
                      </div>
                      
                      {/* Course Thumbnail or Icon */}
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
                      <div className="mb-3 flex-grow">
                        <div className="flex flex-wrap gap-1">
                          {(course.features || []).slice(0, 3).map((feature, featureIndex) => (
                            <span
                              key={featureIndex}
                              className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                          {(course.features || []).length > 3 && (
                            <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs">
                              +{(course.features || []).length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Course Stats */}
                      <div className="flex items-center justify-between mb-3 text-sm text-neutral-500">
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
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            {course.isPaid ? (
                              <>
                                <span className="text-lg font-bold text-neutral-800">₹{course.currentPrice?.toLocaleString()}</span>
                                {course.originalPrice && (
                                  <span className="text-sm text-neutral-500 line-through ml-1">₹{course.originalPrice.toLocaleString()}</span>
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
                      {enrolledCourseIds.includes(course._id) ? (
                        <Link href={`/courses/${course._id}`}>
                          <Button className="w-full bg-green-500 hover:bg-green-600 text-white group">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Enrolled
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/courses/${course._id}`}>
                          <Button className="w-full group">
                            View Course
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
