'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'What is GyanBatua.ai?',
    answer: 'GyanBatua.ai is an AI-powered upskilling and job-readiness platform that helps you learn, verify, and showcase your skills in a blockchain-backed Skill Wallet.'
  },
  {
    question: 'How is it different from other edtech platforms?',
    answer: 'GyanBatua combines personalized learning, verifiable credentials, and direct job routing — all in one place.'
  },
  {
    question: 'What is a Skill Wallet?',
    answer: 'It\'s your digital portfolio containing verified certificates, projects, and scores — shareable via a live QR resume.'
  },
  {
    question: 'How does the AI Mentor help?',
    answer: 'The mentor uses real job data to recommend what to learn next, guide your interview prep, and improve your career readiness.'
  },
  {
    question: 'Can I use GyanBatua for free?',
    answer: 'Yes. The free plan includes roadmap access, a Skill Wallet, and job browsing. Premium unlocks mentor and certifications.'
  },
  {
    question: 'When is GyanBatua launching?',
    answer: 'November 1, 2025 — with early pilots starting before launch.'
  },
  {
    question: 'Are my data and credentials secure?',
    answer: 'Yes. GyanBatua is DPDP-compliant, data encrypted, consent-driven, and supports export/delete requests.'
  },
  {
    question: 'Can universities integrate with GyanBatua?',
    answer: 'Yes. Institutions can access placement analytics and skill-readiness dashboards.'
  },
  {
    question: 'Do recruiters get verified access?',
    answer: 'Yes. Recruiters can view verified skills via the QR Resume API and filter talent by readiness.'
  },
  {
    question: 'What technologies power GyanBatua?',
    answer: 'Built with LLMs, blockchain credentials, and advanced analytics — designed for scalability and trust.'
  },
  {
    question: 'Does GyanBatua support government or skill missions?',
    answer: 'It aligns with India\'s Skill Development and Digital India missions through verified, portable credentials.'
  },
  {
    question: 'How do I join the waitlist?',
    answer: 'Just fill out the form above; you\'ll receive launch updates and early access details via email.'
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 mb-6">
            Frequently Asked
            <span className="gradient-text"> Questions</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Everything you need to know about GyanBatua.ai. Can't find the answer you're looking for? 
            Please contact our support team.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors duration-200 rounded-xl"
                >
                  <h3 className="text-lg font-semibold text-neutral-800 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="h-5 w-5 text-primary-500" />
                    ) : (
                      <Plus className="h-5 w-5 text-neutral-500" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-neutral-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-lg text-neutral-600 mb-6 max-w-2xl mx-auto">
              Our support team is here to help. Get in touch and we'll respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:contact@gyanbatua.ai"
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Contact Support
              </a>
              <button
                onClick={() => {
                  const element = document.querySelector('#cta')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="bg-white border border-primary-200 text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-primary-50 transition-all duration-200"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
