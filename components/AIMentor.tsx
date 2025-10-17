'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { MessageCircle, BookOpen, Users, Brain, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Personalized Learning',
    description: 'AI mentor analyzes your skill gaps and creates custom learning paths tailored to your career goals'
  },
  {
    icon: MessageCircle,
    title: '24/7 Career Guidance',
    description: 'Get instant answers to career questions, interview tips, and learning recommendations anytime'
  },
  {
    icon: BookOpen,
    title: 'Portfolio Reviews',
    description: 'AI-powered feedback on your projects, resume, and skill demonstrations to improve your profile'
  },
  {
    icon: Users,
    title: 'Mock Interviews',
    description: 'Practice interviews with AI that simulates real hiring scenarios and provides detailed feedback'
  }
]

const mentorCapabilities = [
  'Real-time job market analysis',
  'Skill gap identification',
  'Learning path optimization',
  'Interview preparation',
  'Resume optimization',
  'Career transition guidance',
  'Salary negotiation tips',
  'Industry trend insights'
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
            LLM-Powered Mentor That
            <span className="gradient-text"> Knows Your Career</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Chat with your AI Mentor for learning advice, portfolio reviews, and mock interviews. 
            Built with RAG + guardrails for trust and accuracy.
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
                      <h3 className="font-semibold">AI Career Mentor</h3>
                      <p className="text-xs text-primary-100">Online • Ready to help</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 h-80 overflow-y-auto">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-primary-500 text-white p-3 rounded-lg max-w-xs">
                      <p className="text-sm">I want to transition from marketing to data science. What should I learn first?</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-neutral-100 p-3 rounded-lg max-w-xs">
                      <p className="text-sm text-neutral-800">
                        Great question! Based on your marketing background, I recommend starting with:
                        <br /><br />
                        1. <strong>Python fundamentals</strong> - Essential for data analysis
                        <br />
                        2. <strong>SQL</strong> - For database querying
                        <br />
                        3. <strong>Statistics & Excel</strong> - Build on your analytical skills
                        <br /><br />
                        Would you like a detailed learning roadmap?
                      </p>
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-primary-500 text-white p-3 rounded-lg max-w-xs">
                      <p className="text-sm">Yes, please! And what about projects I can work on?</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-neutral-100 p-3 rounded-lg max-w-xs">
                      <p className="text-sm text-neutral-800">
                        Perfect! Here are some beginner-friendly projects:
                        <br /><br />
                        📊 <strong>Marketing Campaign Analysis</strong> - Use your domain knowledge
                        <br />
                        📈 <strong>Sales Data Visualization</strong> - Practice with real datasets
                        <br />
                        🎯 <strong>Customer Segmentation</strong> - Apply clustering techniques
                        <br /><br />
                        I'll create a personalized 12-week roadmap for you!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-neutral-200">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Ask your AI mentor anything..."
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
            What Your AI Mentor Can Do
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
            <div className="text-3xl font-bold gradient-text mb-2">99.2%</div>
            <div className="text-neutral-600">Accuracy Rate</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-neutral-600">Available Support</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold gradient-text mb-2">10K+</div>
            <div className="text-neutral-600">Career Questions Answered</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
