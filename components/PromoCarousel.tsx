'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const promoImages = [
  {
    id: 1,
    title: 'DiwaliWithPW',
    subtitle: 'Power Batch',
    description: 'Iss Deepawali Jalao Apne Sapno Ka Deepak!',
    hindi: 'शिक्षा से रोशन Tomorrow',
    cta: 'Enroll Now!',
    discount: '30% OFF',
    theme: 'diwali',
    features: ['Power Batch', 'Special Diwali Offer', 'Limited Time']
  },
  {
    id: 2,
    title: 'CA Wallah',
    subtitle: 'New Batches Available',
    description: 'CA Foundation | Intermediate | Final',
    hindi: 'CA ALL BATCHES',
    cta: 'Explore Here',
    discount: '75% OFF',
    theme: 'ca',
    features: ['Foundation', 'Intermediate', 'Final']
  },
  {
    id: 3,
    title: 'GATE Wallah',
    subtitle: 'ESE & GATE Preparation',
    description: 'For CS & IT | CH | CE | ECE | EE | ME & XE',
    hindi: 'ALL ESE & GATE BATCHES',
    cta: 'Explore Here',
    discount: '72% OFF',
    theme: 'gate',
    features: ['2026', '2027', '2028']
  },
  {
    id: 4,
    title: 'OnlyIAS',
    subtitle: 'by Physics Wallah',
    description: 'NCERT | CSAT | Prelims + Mains | Test-Series',
    hindi: 'EMPOWER YOUR UPSC PREPARATION',
    cta: 'Tap to Explore',
    discount: 'Starting ₹2,999',
    theme: 'upsc',
    features: ['NCERT', 'CSAT', 'Prelims + Mains', 'Test-Series']
  },
  {
    id: 5,
    title: 'Superclass',
    subtitle: 'Offline Coaching',
    description: 'Commerce (11th & 12th) | CA Foundation | CA Intermediate',
    hindi: 'Now in Delhi, Jaipur, and Patna',
    cta: 'Enroll Now!',
    discount: 'Limited Seats',
    theme: 'offline',
    features: ['Delhi', 'Jaipur', 'Patna']
  },
  {
    id: 6,
    title: 'MBA Wallah',
    subtitle: 'CAT & OMETS Preparation',
    description: 'For CAT & OMETS 2025 & 2026 Exam Prep',
    hindi: 'MBA ALL BATCHES',
    cta: 'Explore Here',
    discount: '67% OFF',
    theme: 'mba',
    features: ['CAT', 'OMETS', '2025', '2026']
  }
]

export function PromoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === promoImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? promoImages.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === promoImages.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
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
    <section className="relative w-full h-96 md:h-[500px] overflow-hidden">
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        <div className="relative w-full h-full overflow-hidden">
          <motion.div
            className="flex w-full h-full"
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {promoImages.map((promo, index) => (
              <div
                key={promo.id}
                className={`w-full h-full flex-shrink-0 bg-gradient-to-r ${getThemeColors(promo.theme)}`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
                
                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-4 right-4 w-24 h-24 bg-pink-400/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/10 rounded-full blur-sm animate-bounce" />
                <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-orange-400/20 rounded-full blur-lg animate-pulse" />
                
                {/* Content */}
                <div className="relative z-10 container-custom h-full flex items-center">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
                    {/* Left Content */}
                    <div className="text-center lg:text-left">
                      <div className="mb-6">
                        {/* Logo/Badge */}
                        <div className="flex items-center justify-center lg:justify-start mb-4">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-lg">PW</span>
                          </div>
                          <div className="text-white">
                            <div className="text-sm opacity-80">Physics Wallah</div>
                            <div className="font-semibold">{promo.title}</div>
                          </div>
                        </div>

                        {/* Offer Banner */}
                        <div className="inline-flex items-center bg-yellow-400 text-black font-bold px-4 py-2 rounded-full mb-4 text-sm">
                          Offer is Live
                        </div>

                        {/* Main Title */}
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                          {promo.hindi}
                        </h2>
                        
                        {/* Subtitle */}
                        <p className="text-lg text-white/90 mb-4">
                          {promo.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
                          {promo.features.map((feature, featureIndex) => (
                            <span key={featureIndex} className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-1 rounded-full text-sm">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 py-3 rounded-lg shadow-lg text-lg">
                          {promo.discount}
                        </div>
                        <button className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors shadow-lg">
                          {promo.cta}
                        </button>
                      </div>
                    </div>

                    {/* Right Content - Decorative Circle */}
                    <div className="flex justify-center lg:justify-end">
                      <div className="relative">
                        {/* Large Circle */}
                        <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center relative overflow-hidden">
                          {/* Inner decorative elements */}
                          <div className="absolute inset-4 bg-gradient-to-br from-white/5 to-transparent rounded-full" />
                          <div className="absolute inset-8 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
                          
                          {/* Center content */}
                          <div className="text-center text-white relative z-10">
                            <div className="text-6xl mb-4">🎓</div>
                            <p className="text-lg font-semibold">Educational Excellence</p>
                            <p className="text-sm opacity-80">Powered by Physics Wallah</p>
                          </div>

                          {/* Floating elements */}
                          <div className="absolute top-8 left-8 w-4 h-4 bg-yellow-400/30 rounded-full animate-pulse" />
                          <div className="absolute bottom-8 right-8 w-6 h-6 bg-pink-400/30 rounded-full animate-pulse" />
                          <div className="absolute top-1/2 left-4 w-3 h-3 bg-orange-400/30 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {promoImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

    </section>
  )
}
