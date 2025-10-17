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
        
        {/* Waitlist Form Section */}
        <section id="waitlist-form" className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                Join thousands of professionals who are already building their verified skill portfolio
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
