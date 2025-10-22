'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { BarChart3, Users, TrendingUp, Award } from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Placement Analytics',
    description: 'Real-time dashboards showing placement rates, salary trends, and industry demand patterns'
  },
  {
    icon: Users,
    title: 'Student Readiness',
    description: 'Track individual student progress and identify those who need additional support'
  },
  {
    icon: TrendingUp,
    title: 'NIRF Reports',
    description: 'Automated generation of NIRF-compliant reports for better rankings and accreditation'
  },
  {
    icon: Award,
    title: 'Skill Mapping',
    description: 'Map curriculum to industry requirements and identify skill gaps in your programs'
  }
]


export function ForCampus() {
  return (
    <section id="campus" className="py-10 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 mb-6">
            Boost Placements with
            <span className="gradient-text"> Data</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            mseducation.in&apos;s dashboards give institutions skill-readiness insights, 
            placement analytics, and NIRF-friendly reports to improve student outcomes.
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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


      </div>
    </section>
  )
}
