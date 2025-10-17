'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { FileText, BookOpen, Award, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Diagnose',
    description: 'Import LinkedIn/Resume and take a 10-min skill diagnostic.',
    icon: FileText,
    details: [
      'Upload your LinkedIn profile or resume',
      'Complete AI-powered skill assessment',
      'Get personalized skill gap analysis',
      'Receive detailed career readiness report'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    number: '02',
    title: 'Learn',
    description: 'Follow weekly AI roadmaps with courses, projects, and quizzes.',
    icon: BookOpen,
    details: [
      'Get personalized learning roadmaps',
      'Access curated courses and resources',
      'Complete hands-on projects',
      'Take skill verification quizzes'
    ],
    color: 'from-purple-500 to-purple-600'
  },
  {
    number: '03',
    title: 'Verify & Apply',
    description: 'Earn blockchain-verified badges and a shareable QR Resume.',
    icon: Award,
    details: [
      'Earn verifiable skill badges',
      'Create blockchain-backed credentials',
      'Generate shareable QR Resume',
      'Apply to matched job opportunities'
    ],
    color: 'from-green-500 to-green-600'
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Transform your career in three simple steps with AI-powered guidance and blockchain-verified credentials.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-neutral-200 to-transparent z-0" />
              )}

              <Card className="relative z-10 h-full hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-bold text-xl mb-6">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${step.color} rounded-lg text-white mb-4`}>
                    <step.icon className="h-6 w-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-neutral-800 mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-600 mb-6">
                    {step.description}
                  </p>

                  {/* Details */}
                  <ul className="text-left space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start space-x-2 text-sm text-neutral-600">
                        <ArrowRight className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-lg text-neutral-600 mb-6 max-w-2xl mx-auto">
              Join thousands of professionals who are already building their verified skill portfolio with GyanBatua.ai
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.querySelector('#cta')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Join the Waitlist
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
