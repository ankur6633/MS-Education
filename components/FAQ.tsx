'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'What courses does MS Education offer?',
    answer: 'MS Education offers comprehensive courses in CA Foundation, GATE & ESE, UPSC Civil Services, MBA Entrance, Banking & SSC, and Railway & Defense exams with expert faculty and 100% placement assistance.'
  },
  {
    question: 'How is MS Education different from other coaching institutes?',
    answer: 'MS Education combines expert faculty, comprehensive study material, AI-powered study guidance, and guaranteed placement assistance — all in one platform with proven results.'
  },
  {
    question: 'What is the success rate of MS Education?',
    answer: 'MS Education has a 95% success rate with over 50,000+ successful students placed in top companies and government jobs across India.'
  },
  {
    question: 'How does the AI Study Mentor help students?',
    answer: 'The AI Study Mentor provides personalized study plans, performance analytics, mock test preparation, and 24/7 academic support to help students achieve their goals.'
  },
  {
    question: 'Are there any free trial classes available?',
    answer: 'Yes. We offer free demo classes, career counseling sessions, and sample study material to help you make an informed decision.'
  },
  {
    question: 'What is the fee structure for different courses?',
    answer: 'Course fees vary by program. CA Foundation starts at ₹15,999, GATE preparation at ₹12,999, UPSC at ₹24,999, and MBA at ₹18,999 with flexible payment options.'
  },
  {
    question: 'Is the study material provided comprehensive?',
    answer: 'Yes. We provide complete study material including books, video lectures, practice tests, previous year papers, and mock tests for all courses.'
  },
  {
    question: 'Do you provide placement assistance?',
    answer: 'Yes. We have a dedicated placement cell with partnerships with 500+ companies and government organizations to ensure 100% placement assistance.'
  },
  {
    question: 'Can I access classes online?',
    answer: 'Yes. We offer both online and offline classes with live interactive sessions, recorded lectures, and mobile app access for flexible learning.'
  },
  {
    question: 'What support is available for doubt clearing?',
    answer: 'We provide 24/7 doubt clearing support through our AI mentor, dedicated faculty, and student community forums.'
  },
  {
    question: 'Are there any scholarship programs available?',
    answer: 'Yes. We offer merit-based scholarships, early bird discounts, and special programs for economically weaker students.'
  },
  {
    question: 'How do I enroll in a course?',
    answer: 'You can enroll online through our website, visit our centers, or call our admission helpline. We also provide free career counseling to help you choose the right course.'
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
            Everything you need to know about MS Education. Can&apos;t find the answer you&apos;re looking for? 
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
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors duration-200 rounded-xl"
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

      </div>
    </section>
  )
}
