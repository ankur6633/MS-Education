'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Check, Star, Users, Zap, Crown } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for getting started with skill verification',
    icon: Users,
    features: [
      'Basic learning roadmaps',
      'Skill Wallet creation',
      'Job browsing',
      'Community access',
      'Basic skill assessments',
      'Limited AI mentor queries'
    ],
    cta: 'Get Started Free',
    popular: false,
    color: 'from-neutral-500 to-neutral-600'
  },
  {
    name: 'Premium',
    price: '₹499',
    period: 'month',
    description: 'For professionals serious about career growth',
    icon: Zap,
    features: [
      'Unlimited AI mentor access',
      'Verified certificates',
      'Advanced job matching',
      'Priority support',
      'Skill gap analysis',
      'Interview preparation',
      'Resume optimization',
      'Career guidance'
    ],
    cta: 'Start Premium',
    popular: true,
    color: 'from-primary-500 to-primary-600'
  },
  {
    name: 'Student Premium',
    price: '₹299',
    period: 'month',
    description: 'Special pricing for students and recent graduates',
    icon: Star,
    features: [
      'All Premium features',
      'Student community access',
      'Campus placement support',
      'Mentorship programs',
      'Internship matching',
      'Scholarship opportunities',
      'Academic integration',
      'Career counseling'
    ],
    cta: 'Get Student Access',
    popular: false,
    color: 'from-secondary-500 to-secondary-600'
  }
]

const campusPlans = [
  {
    name: 'Starter',
    price: '₹2L',
    period: 'year',
    description: 'For small institutions up to 500 students',
    features: [
      'Up to 500 students',
      'Basic analytics dashboard',
      'Placement tracking',
      'Email support',
      'Standard reports'
    ]
  },
  {
    name: 'Professional',
    price: '₹3.5L',
    period: 'year',
    description: 'For medium institutions up to 2000 students',
    features: [
      'Up to 2000 students',
      'Advanced analytics',
      'NIRF report generation',
      'Priority support',
      'Custom integrations',
      'API access'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '₹5L',
    period: 'year',
    description: 'For large institutions with unlimited students',
    features: [
      'Unlimited students',
      'Custom dashboard',
      'White-label solution',
      'Dedicated support',
      'Full API access',
      'Custom training'
    ]
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 mb-6">
            Simple, Transparent
            <span className="gradient-text"> Pricing</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include our core features 
            with no hidden fees or long-term contracts.
          </p>
        </motion.div>

        {/* Individual Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-neutral-800 mb-8 text-center">
            Individual Plans
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Crown className="h-4 w-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}
                
                <Card className={`h-full transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? 'border-2 border-primary-500 shadow-lg' : ''
                }`}>
                  <CardHeader className="text-center pb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${plan.color} rounded-lg text-white mb-4`}>
                      <plan.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-neutral-800">
                      {plan.name}
                    </CardTitle>
                    <p className="text-neutral-600">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold gradient-text">
                        {plan.price}
                      </div>
                      <div className="text-neutral-600">per {plan.period}</div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-neutral-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                      }`}
                    >
                      {plan.cta}
                    </motion.button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Campus Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-neutral-800 mb-8 text-center">
            Campus Plans
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {campusPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Recommended
                    </div>
                  </div>
                )}
                
                <Card className={`h-full transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? 'border-2 border-primary-500 shadow-lg' : ''
                }`}>
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-neutral-800">
                      {plan.name}
                    </CardTitle>
                    <p className="text-neutral-600">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold gradient-text">
                        {plan.price}
                      </div>
                      <div className="text-neutral-600">per {plan.period}</div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-neutral-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                      }`}
                    >
                      Contact Sales
                    </motion.button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
              Questions About Pricing?
            </h3>
            <p className="text-lg text-neutral-600 mb-6 max-w-2xl mx-auto">
              We're here to help you choose the right plan for your needs. 
              Contact our team for personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                Contact Sales
              </button>
              <button className="bg-white border border-primary-200 text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-primary-50 transition-all duration-200">
                View FAQ
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
