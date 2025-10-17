'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { BarChart3, Users, TrendingUp, Award, Target, BookOpen } from 'lucide-react'

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

const dashboardMetrics = [
  { label: 'Overall Placement Rate', value: '87%', change: '+12%', positive: true },
  { label: 'Average Package', value: '₹8.5 LPA', change: '+15%', positive: true },
  { label: 'Students Placed', value: '1,247', change: '+8%', positive: true },
  { label: 'Skill Readiness Score', value: '92%', change: '+5%', positive: true }
]

const benefits = [
  'Increase placement rates by up to 40%',
  'Reduce time-to-placement by 60%',
  'Improve student satisfaction scores',
  'Generate NIRF-compliant reports automatically',
  'Identify skill gaps in curriculum',
  'Track industry partnership effectiveness'
]

export function ForCampus() {
  return (
    <section id="campus" className="section-padding bg-white">
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
            GyanBatua's dashboards give institutions skill-readiness insights, 
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Dashboard Header */}
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
                  <h3 className="text-xl font-bold">Campus Analytics Dashboard</h3>
                  <p className="text-primary-100">Real-time placement insights</p>
                </div>

                {/* Metrics Grid */}
                <div className="p-6 grid grid-cols-2 gap-4">
                  {dashboardMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-neutral-50 rounded-lg p-4"
                    >
                      <div className="text-2xl font-bold text-neutral-800 mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-neutral-600 mb-2">
                        {metric.label}
                      </div>
                      <div className={`text-xs flex items-center ${
                        metric.positive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {metric.change} vs last year
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart Placeholder */}
                <div className="p-6 border-t border-neutral-200">
                  <div className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg p-8 text-center">
                    <BarChart3 className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                    <p className="text-neutral-600">Interactive placement trends chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-neutral-800 mb-6">
              Transform Your Campus Outcomes
            </h3>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <Target className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-neutral-700">{benefit}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="pt-6"
            >
              <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                Schedule Campus Demo
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
              Campus SaaS Pricing
            </h3>
            <p className="text-lg text-neutral-600 mb-6 max-w-2xl mx-auto">
              Flexible pricing plans designed for educational institutions of all sizes
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-neutral-800 mb-2">Starter</h4>
                <div className="text-3xl font-bold gradient-text mb-4">₹2L/year</div>
                <ul className="text-sm text-neutral-600 space-y-2">
                  <li>Up to 500 students</li>
                  <li>Basic analytics</li>
                  <li>Email support</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-primary-500 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Popular
                </div>
                <h4 className="text-lg font-semibold text-neutral-800 mb-2">Professional</h4>
                <div className="text-3xl font-bold gradient-text mb-4">₹3.5L/year</div>
                <ul className="text-sm text-neutral-600 space-y-2">
                  <li>Up to 2000 students</li>
                  <li>Advanced analytics</li>
                  <li>Priority support</li>
                  <li>NIRF reports</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-neutral-800 mb-2">Enterprise</h4>
                <div className="text-3xl font-bold gradient-text mb-4">₹5L/year</div>
                <ul className="text-sm text-neutral-600 space-y-2">
                  <li>Unlimited students</li>
                  <li>Custom integrations</li>
                  <li>Dedicated support</li>
                  <li>API access</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
