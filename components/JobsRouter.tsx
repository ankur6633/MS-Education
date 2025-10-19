'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Search, Target, TrendingUp, Clock, MapPin, Building, DollarSign } from 'lucide-react'

const features = [
  {
    icon: Search,
    title: '100% Placement Assistance',
    description: 'Our dedicated placement cell ensures every student gets placed in top companies with competitive packages'
  },
  {
    icon: Target,
    title: 'Industry Partnerships',
    description: 'Strong partnerships with 500+ companies across various sectors for guaranteed placement opportunities'
  },
  {
    icon: TrendingUp,
    title: 'Career Growth Support',
    description: 'Continuous career guidance and support even after placement to ensure long-term success'
  }
]

const placementOpportunities = [
  {
    title: 'CA - Chartered Accountant',
    company: 'Big 4 Accounting Firms',
    location: 'Pan India',
    salary: '₹8-15 LPA',
    type: 'Full-time',
    skills: ['CA Final', 'Audit', 'Taxation'],
    successRate: 95,
    posted: 'Recent Placements'
  },
  {
    title: 'GATE - PSU Engineer',
    company: 'ONGC, IOCL, BHEL',
    location: 'Pan India',
    salary: '₹12-20 LPA',
    type: 'Government Job',
    skills: ['GATE Qualified', 'Engineering', 'Technical'],
    successRate: 88,
    posted: 'Recent Placements'
  },
  {
    title: 'UPSC - Civil Services',
    company: 'Government of India',
    location: 'Pan India',
    salary: '₹8-12 LPA',
    type: 'Government Job',
    skills: ['UPSC Qualified', 'Administration', 'Policy'],
    successRate: 92,
    posted: 'Recent Placements'
  }
]

export function JobsRouter() {
  return (
    <section id="jobs" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 mb-6">
            From Learning to Placement —
            <span className="gradient-text"> Guaranteed</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Our comprehensive placement assistance ensures every student gets placed in top companies 
            with competitive packages and long-term career growth.
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg text-white mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Job Listings Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-neutral-800 mb-8 text-center">
            Recent Placement Success Stories
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placementOpportunities.map((job, index) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    {/* Success Rate */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-600">
                          {job.successRate}% Success Rate
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {job.posted}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h4 className="text-lg font-semibold text-neutral-800 mb-2">
                      {job.title}
                    </h4>

                    {/* Company & Location */}
                    <div className="flex items-center space-x-4 mb-4 text-sm text-neutral-600">
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center space-x-1 mb-4 text-sm text-neutral-600">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary}</span>
                      <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                        {job.type}
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Learn More Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      Learn More
                    </motion.button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
              Ready to Start Your Success Journey?
            </h3>
            <p className="text-lg text-neutral-600 mb-6 max-w-2xl mx-auto">
              Join thousands of successful students who have achieved their career goals with our comprehensive courses and placement assistance.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.querySelector('#wallet')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Explore Our Courses
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
