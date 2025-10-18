'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { MessageCircle, BookOpen, Users, Brain, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Personalized Study Plans',
    description: 'AI-powered study plans tailored to your learning pace, strengths, and exam requirements'
  },
  {
    icon: MessageCircle,
    title: '24/7 Academic Support',
    description: 'Get instant answers to study questions, exam strategies, and learning guidance anytime'
  },
  {
    icon: BookOpen,
    title: 'Performance Analytics',
    description: 'Track your progress with detailed analytics, identify weak areas, and improve your performance'
  },
  {
    icon: Users,
    title: 'Mock Tests & Practice',
    description: 'Practice with AI-generated mock tests that simulate real exam conditions and provide detailed feedback'
  }
]

const mentorCapabilities = [
  'Exam pattern analysis',
  'Study schedule optimization',
  'Weak area identification',
  'Mock test preparation',
  'Time management strategies',
  'Stress management techniques',
  'Revision planning',
  'Performance tracking'
]

export function AIMentor() {
  return (
    <section id="mentor" className="section-padding gradient-bg">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 mb-6">
            AI-Powered Study Mentor That
            <span className="gradient-text"> Knows Your Goals</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Get personalized study guidance, performance analytics, and exam strategies from our AI mentor. 
            Built with advanced algorithms for accurate academic support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Chat Interface Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Brain className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Study Mentor</h3>
                      <p className="text-xs text-primary-100">Online • Ready to help</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 h-80 overflow-y-auto">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-primary-500 text-white p-3 rounded-lg max-w-xs">
                      <p className="text-sm">I&apos;m preparing for CA Foundation. How should I plan my studies?</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-neutral-100 p-3 rounded-lg max-w-xs">
                      <p className="text-sm text-neutral-800">
                        Great! For CA Foundation, I recommend this study plan:
                        <br /><br />
                        1. <strong>Accounting</strong> - 40% of your time
                        <br />
                        2. <strong>Business Laws</strong> - 25% of your time
                        <br />
                        3. <strong>Economics & Maths</strong> - 35% of your time
                        <br /><br />
                        Would you like a detailed 6-month study schedule?
                      </p>
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-primary-500 text-white p-3 rounded-lg max-w-xs">
                      <p className="text-sm">Yes! And what about mock tests?</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-neutral-100 p-3 rounded-lg max-w-xs">
                      <p className="text-sm text-neutral-800">
                        Perfect! Here&apos;s your mock test schedule:
                        <br /><br />
                        📚 <strong>Monthly Tests</strong> - Track your progress
                        <br />
                        📈 <strong>Weekly Quizzes</strong> - Reinforce learning
                        <br />
                        🎯 <strong>Final Mock Series</strong> - 2 months before exam
                        <br /><br />
                        I&apos;ll create a personalized study plan for you!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-neutral-200">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Ask your AI study mentor anything..."
                      className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button className="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-colors">
                      <Zap className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-neutral-800 mb-8 text-center">
            What Your AI Study Mentor Can Do
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mentorCapabilities.map((capability, index) => (
              <motion.div
                key={capability}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <Shield className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-700">{capability}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold gradient-text mb-2">95%</div>
            <div className="text-neutral-600">Student Success Rate</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-neutral-600">Study Support</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold gradient-text mb-2">50K+</div>
            <div className="text-neutral-600">Study Questions Answered</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
