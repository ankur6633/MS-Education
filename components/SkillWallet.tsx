'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Shield, QrCode, Download, Share2, CheckCircle, Star } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Blockchain Verified',
    description: 'All credentials are stored on blockchain for tamper-proof verification'
  },
  {
    icon: QrCode,
    title: 'Live QR Resume',
    description: 'Share your skills instantly with a scannable QR code that updates in real-time'
  },
  {
    icon: Download,
    title: 'Portable Credentials',
    description: 'Export and import your skill wallet across platforms and institutions'
  },
  {
    icon: Share2,
    title: 'One-Click Sharing',
    description: 'Share your verified skills with recruiters and employers in seconds'
  }
]

const credentials = [
  { name: 'React Development', issuer: 'GyanBatua.ai', verified: true, score: 95 },
  { name: 'Data Science Fundamentals', issuer: 'IIT Delhi', verified: true, score: 88 },
  { name: 'Machine Learning', issuer: 'Coursera', verified: true, score: 92 },
  { name: 'Project Management', issuer: 'PMI', verified: false, score: 0 },
]

export function SkillWallet() {
  return (
    <section id="wallet" className="section-padding gradient-bg">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 mb-6">
            Your Portable, Verifiable
            <span className="gradient-text"> Skill Wallet</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Store all credentials, badges, projects, and quiz results in a tamper-proof digital wallet. 
            Share via Live QR Resume, verified in seconds.
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

          {/* Wallet Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Wallet Header */}
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Skill Wallet</h3>
                      <p className="text-primary-100">John Doe</p>
                    </div>
                    <QrCode className="h-8 w-8" />
                  </div>
                </div>

                {/* Credentials List */}
                <div className="p-6 space-y-4">
                  {credentials.map((credential, index) => (
                    <motion.div
                      key={credential.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {credential.verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 border-2 border-neutral-300 rounded-full" />
                        )}
                        <div>
                          <h4 className="font-semibold text-neutral-800">
                            {credential.name}
                          </h4>
                          <p className="text-sm text-neutral-600">
                            {credential.issuer}
                          </p>
                        </div>
                      </div>
                      {credential.verified && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-semibold text-neutral-700">
                            {credential.score}%
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Wallet Footer */}
                <div className="bg-neutral-50 p-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between text-sm text-neutral-600">
                    <span>Last updated: 2 hours ago</span>
                    <span className="flex items-center space-x-1">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Verified</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold gradient-text mb-2">99.9%</div>
            <div className="text-neutral-600">Verification Accuracy</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold gradient-text mb-2">2.3s</div>
            <div className="text-neutral-600">Average Verification Time</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold gradient-text mb-2">50K+</div>
            <div className="text-neutral-600">Credentials Verified</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
