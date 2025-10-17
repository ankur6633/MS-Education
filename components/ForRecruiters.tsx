'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Search, Filter, Clock, Users, CheckCircle, Star, Award, Zap } from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Verified Talent Pool',
    description: 'Access pre-verified candidates with blockchain-backed credentials and skill assessments'
  },
  {
    icon: Filter,
    title: 'Smart Filtering',
    description: 'Filter candidates by verified skills, experience level, and job readiness scores'
  },
  {
    icon: Clock,
    title: 'Faster Hiring',
    description: 'Reduce screening time by 70% with AI-powered candidate matching and verification'
  },
  {
    icon: Users,
    title: 'Quality Candidates',
    description: 'Higher quality hires with verified skills and proven project portfolios'
  }
]

const candidateProfiles = [
  {
    name: 'Priya Sharma',
    role: 'Full Stack Developer',
    experience: '3 years',
    skills: ['React', 'Node.js', 'Python', 'AWS'],
    verified: true,
    score: 94,
    location: 'Bangalore',
    availability: 'Immediate'
  },
  {
    name: 'Rajesh Kumar',
    role: 'Data Scientist',
    experience: '5 years',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    verified: true,
    score: 91,
    location: 'Mumbai',
    availability: '2 weeks'
  },
  {
    name: 'Anita Patel',
    role: 'Product Manager',
    experience: '4 years',
    skills: ['Product Strategy', 'Agile', 'Analytics', 'Figma'],
    verified: true,
    score: 89,
    location: 'Delhi',
    availability: '1 month'
  }
]

const benefits = [
  '70% reduction in screening time',
  '95% accuracy in skill verification',
  '50% faster time-to-hire',
  'Access to 10,000+ verified candidates',
  'Real-time skill updates',
  'Direct candidate communication'
]

export function ForRecruiters() {
  return (
    <section id="recruiters" className="section-padding gradient-bg">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 mb-6">
            Hire Verified Talent
            <span className="gradient-text"> Faster</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Recruiters can filter by verified badges, projects, and certifications — 
            reducing screening time and improving hiring accuracy.
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

        {/* Candidate Profiles Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-neutral-800 mb-8 text-center">
            Verified Candidate Profiles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidateProfiles.map((candidate, index) => (
              <motion.div
                key={candidate.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-800">{candidate.name}</h4>
                          <p className="text-sm text-neutral-600">{candidate.role}</p>
                        </div>
                      </div>
                      {candidate.verified && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    {/* Score */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-neutral-700">
                          {candidate.score}% Match
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500">
                        {candidate.experience} exp
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {candidate.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Location & Availability */}
                    <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
                      <span>{candidate.location}</span>
                      <span className="text-green-600 font-medium">
                        {candidate.availability}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-primary-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                        View Profile
                      </button>
                      <button className="flex-1 bg-white border border-primary-200 text-primary-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors">
                        Contact
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-neutral-800 mb-6">
              Why Recruiters Choose mseducation.in
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
                    <Award className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-neutral-700">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recruiter Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Dashboard Header */}
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
                  <h3 className="text-xl font-bold">Recruiter Dashboard</h3>
                  <p className="text-primary-100">Manage your hiring pipeline</p>
                </div>

                {/* Stats */}
                <div className="p-6 grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-neutral-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-neutral-800">247</div>
                    <div className="text-sm text-neutral-600">Active Candidates</div>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-neutral-800">89%</div>
                    <div className="text-sm text-neutral-600">Match Accuracy</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="p-6 border-t border-neutral-200">
                  <h4 className="font-semibold text-neutral-800 mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-neutral-600">New candidate: Priya Sharma (94% match)</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-neutral-600">Interview scheduled: Rajesh Kumar</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-neutral-600">Skill verification: 5 candidates</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
              Start Hiring Better Talent Today
            </h3>
            <p className="text-lg text-neutral-600 mb-6 max-w-2xl mx-auto">
              Join leading companies who trust mseducation.in for verified talent acquisition
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                Get Recruiter Access
              </button>
              <button className="bg-white border border-primary-200 text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-primary-50 transition-all duration-200">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
