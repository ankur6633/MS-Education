export const siteConfig = {
  name: 'mseducation.in',
  description: 'AI-powered career co-pilot for personalized learning, skill verification, and job matching. Built in India • DPDP Compliant • Launching Nov 1, 2025',
  url: 'https://mseducation.in',
  ogImage: 'https://mseducation.in/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/mseducation',
    linkedin: 'https://linkedin.com/company/mseducation',
    youtube: 'https://youtube.com/@mseducation',
  },
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "mseducation.in",
  "alternateName": "mseducation",
  "url": "https://mseducation.in",
  "logo": "https://mseducation.in/logo.png",
  "description": "AI-powered career co-pilot for personalized learning, skill verification, and job matching",
  "foundingDate": "2024",
  "founder": {
    "@type": "Organization",
    "name": "MS Sahil"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-XXXXXXXXXX",
    "contactType": "customer service",
    "email": "contact@mseducation.in",
    "availableLanguage": ["English", "Hindi"]
  },
  "sameAs": [
    "https://twitter.com/mseducation",
    "https://linkedin.com/company/mseducation",
    "https://youtube.com/@mseducation"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN",
    "addressLocality": "New Delhi",
    "addressRegion": "Delhi"
  },
  "inLanguage": "en-IN",
  "mainEntityOfPage": "https://mseducation.in"
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "mseducation.in",
  "url": "https://mseducation.in",
  "description": "AI-powered career co-pilot for personalized learning, skill verification, and job matching",
  "publisher": {
    "@type": "Organization",
    "name": "mseducation.in"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://mseducation.in/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "en-IN",
  "mainEntityOfPage": "https://mseducation.in"
}

export const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "mseducation.in Platform",
  "description": "AI-powered career co-pilot that helps users learn, verify, and showcase their skills in a blockchain-backed Skill Wallet",
  "brand": {
    "@type": "Brand",
    "name": "mseducation.in"
  },
  "category": "Education Technology",
  "offers": [
    {
      "@type": "Offer",
      "name": "Free Plan",
      "price": "0",
      "priceCurrency": "INR",
      "description": "Basic roadmap, wallet, and job browsing"
    },
    {
      "@type": "Offer",
      "name": "Premium Plan",
      "price": "499",
      "priceCurrency": "INR",
      "description": "AI Mentor, verified certificates, and job matching"
    },
    {
      "@type": "Offer",
      "name": "Student Premium",
      "price": "299",
      "priceCurrency": "INR",
      "description": "Discounted premium plan for students"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "150"
  },
  "inLanguage": "en-IN",
  "mainEntityOfPage": "https://mseducation.in"
}

export const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Use mseducation.in for Career Growth",
  "description": "Learn how to use mseducation.in to diagnose skills, follow AI roadmaps, and verify credentials for career advancement",
  "image": "https://mseducation.in/how-to-image.jpg",
  "totalTime": "PT30M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "INR",
    "value": "0"
  },
  "step": [
    {
      "@type": "HowToStep",
      "name": "Diagnose Your Skills",
      "text": "Import your LinkedIn profile or resume and take a 10-minute skill diagnostic to identify your current strengths and gaps",
      "image": "https://mseducation.in/step1.jpg",
      "url": "https://mseducation.in#how-it-works"
    },
    {
      "@type": "HowToStep",
      "name": "Follow AI Roadmaps",
      "text": "Get personalized weekly learning roadmaps with courses, projects, and quizzes tailored to your career goals",
      "image": "https://mseducation.in/step2.jpg",
      "url": "https://mseducation.in#how-it-works"
    },
    {
      "@type": "HowToStep",
      "name": "Verify & Apply",
      "text": "Earn blockchain-verified badges and create a shareable QR Resume to showcase your verified skills to employers",
      "image": "https://mseducation.in/step3.jpg",
      "url": "https://mseducation.in#how-it-works"
    }
  ],
  "inLanguage": "en-IN",
  "mainEntityOfPage": "https://mseducation.in"
}

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is mseducation.in?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "mseducation.in is an AI-powered upskilling and job-readiness platform that helps you learn, verify, and showcase your skills in a blockchain-backed Skill Wallet."
      }
    },
    {
      "@type": "Question",
      "name": "How is it different from other edtech platforms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "mseducation combines personalized learning, verifiable credentials, and direct job routing — all in one place."
      }
    },
    {
      "@type": "Question",
      "name": "What is a Skill Wallet?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It's your digital portfolio containing verified certificates, projects, and scores — shareable via a live QR resume."
      }
    },
    {
      "@type": "Question",
      "name": "How does the AI Mentor help?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The mentor uses real job data to recommend what to learn next, guide your interview prep, and improve your career readiness."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use mseducation for free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The free plan includes roadmap access, a Skill Wallet, and job browsing. Premium unlocks mentor and certifications."
      }
    },
    {
      "@type": "Question",
      "name": "When is mseducation launching?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "November 1, 2025 — with early pilots starting before launch."
      }
    },
    {
      "@type": "Question",
      "name": "Are my data and credentials secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. mseducation is DPDP-compliant, data encrypted, consent-driven, and supports export/delete requests."
      }
    },
    {
      "@type": "Question",
      "name": "Can universities integrate with mseducation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Institutions can access placement analytics and skill-readiness dashboards."
      }
    },
    {
      "@type": "Question",
      "name": "Do recruiters get verified access?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Recruiters can view verified skills via the QR Resume API and filter talent by readiness."
      }
    },
    {
      "@type": "Question",
      "name": "What technologies power mseducation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Built with LLMs, blockchain credentials, and advanced analytics — designed for scalability and trust."
      }
    },
    {
      "@type": "Question",
      "name": "Does mseducation support government or skill missions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It aligns with India's Skill Development and Digital India missions through verified, portable credentials."
      }
    },
    {
      "@type": "Question",
      "name": "How do I join the waitlist?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Just fill out the form above; you'll receive launch updates and early access details via email."
      }
    }
  ],
  "inLanguage": "en-IN",
  "mainEntityOfPage": "https://mseducation.in"
}
