import { Navbar } from '@/components/Navbar'
import { PromoCarousel } from '@/components/PromoCarousel'
import { SkillWallet } from '@/components/SkillWallet'
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
        <SkillWallet />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
