import { Navbar } from '@/components/Navbar'
import { PromoCarousel } from '@/components/PromoCarousel'
import { Hero } from '@/components/Hero'
import { HowItWorks } from '@/components/HowItWorks'
import { SkillWallet } from '@/components/SkillWallet'
import { JobsRouter } from '@/components/JobsRouter'
import { AIMentor } from '@/components/AIMentor'
import { ForCampus } from '@/components/ForCampus'
import { ForRecruiters } from '@/components/ForRecruiters'
import { Pricing } from '@/components/Pricing'
import { CTA } from '@/components/CTA'
import { WaitlistForm } from '@/components/WaitlistForm'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'
import { organizationSchema, websiteSchema, productSchema, howToSchema, faqSchema } from '@/lib/seo'

export default function HomePage() {
  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />

      {/* Main Content */}
      <Navbar />
      <main>
        <PromoCarousel />
        <Hero />
        <HowItWorks />
        <SkillWallet />
        <JobsRouter />
        <AIMentor />
        <ForCampus />
        <ForRecruiters />
        <Pricing />
        <CTA />
        
        {/* Our Achievements Section */}
        <section id="achievements" className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                Our Achievements & Success Stories
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                Celebrating 15+ years of excellence in education with proven results and student success
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">50K+</div>
                <div className="text-neutral-600 font-semibold">Students Trained</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">95%</div>
                <div className="text-neutral-600 font-semibold">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">500+</div>
                <div className="text-neutral-600 font-semibold">Partner Companies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">15+</div>
                <div className="text-neutral-600 font-semibold">Years Experience</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-neutral-800 mb-4">CA Foundation Success</h3>
                <p className="text-neutral-600 mb-4">Over 12,500 students have successfully cleared CA Foundation with our comprehensive program.</p>
                <div className="text-2xl font-bold gradient-text">98% Pass Rate</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-neutral-800 mb-4">GATE & ESE Excellence</h3>
                <p className="text-neutral-600 mb-4">18,000+ engineering students placed in top PSUs and government organizations.</p>
                <div className="text-2xl font-bold gradient-text">92% Selection Rate</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-neutral-800 mb-4">UPSC Civil Services</h3>
                <p className="text-neutral-600 mb-4">9,500+ aspirants have achieved their dream of serving the nation through civil services.</p>
                <div className="text-2xl font-bold gradient-text">89% Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Enrollment Form Section */}
        <section id="enrollment-form" className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                Ready to Start Your Success Journey?
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                Join thousands of successful students who have achieved their career goals with MS Education
              </p>
            </div>
            <WaitlistForm />
          </div>
        </section>
        
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
