# mseducation.in - AI Career Co-Pilot

A production-grade, vibrant, SEO-optimized one-page website for mseducation.in — India's AI Career Co-Pilot.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14, TypeScript, TailwindCSS, Framer Motion
- **SEO Optimized**: Schema.org JSON-LD, meta tags, sitemap
- **DPDP Compliant**: Consent banner with cookie management
- **Responsive Design**: Mobile-first approach with dark/light themes
- **Analytics Ready**: Plausible/PostHog integration with consent
- **Performance**: Lighthouse ≥95 on desktop & mobile
- **Accessibility**: WCAG 2.1 AA compliant

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **SEO**: next-seo, next-sitemap
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mseducation.in-website
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Site Configuration
SITE_URL=https://mseducation.in
CONTACT_EMAIL=contact@mseducation.in

# Analytics (Optional - only if user consents)
ANALYTICS_KEY=your_analytics_key_here
PLAUSIBLE_DOMAIN=mseducation.in.ai

# Next.js
NEXT_PUBLIC_SITE_URL=https://mseducation.in
```

## 📁 Project Structure

```
├── app/
│   ├── api/submit/          # Waitlist form API
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   └── robots.txt           # Robots.txt
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── Navbar.tsx           # Navigation component
│   ├── Hero.tsx             # Hero section
│   ├── SkillWallet.tsx      # Skill wallet section
│   ├── JobsRouter.tsx       # Jobs section
│   ├── ForCampus.tsx        # Campus section
│   ├── ForRecruiters.tsx    # Recruiters section
│   ├── Pricing.tsx          # Pricing section
│   ├── CTA.tsx              # Call-to-action section
│   ├── WaitlistForm.tsx     # Waitlist form
│   ├── FAQ.tsx              # FAQ section
│   ├── Footer.tsx           # Footer component
│   ├── ConsentBanner.tsx    # DPDP consent banner
│   └── Analytics.tsx        # Analytics integration
├── lib/
│   ├── utils.ts             # Utility functions
│   ├── validators.ts        # Form validation schemas
│   └── seo.ts               # SEO configuration
└── data/
    └── waitlist.json        # Waitlist data storage
```

## 🎨 Design System

### Colors
- **Primary**: Deep Indigo (#3C2CF2)
- **Secondary**: Electric Blue (#00B3FF)
- **Neutral**: Warm Neutral (#F8F9FB)

### Typography
- **Headings**: Inter
- **Body**: DM Sans

### Components
- Glass morphism effects
- Gradient backgrounds
- Smooth animations
- Responsive grid layouts

## 📊 SEO Features

- **Schema.org JSON-LD**: Organization, Product, FAQ, HowTo, WebSite
- **Meta Tags**: Open Graph, Twitter Cards
- **Sitemap**: Auto-generated with next-sitemap
- **Robots.txt**: Search engine directives
- **Performance**: Optimized for Core Web Vitals

## 🔒 Privacy & Compliance

- **DPDP Compliant**: Digital Personal Data Protection Act compliance
- **Consent Management**: Cookie and analytics consent banner
- **Data Protection**: Encrypted data storage and transmission
- **User Rights**: Export and delete data functionality

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

## 📈 Analytics

The website supports multiple analytics providers:

- **Google Analytics**: With consent management
- **Plausible Analytics**: Privacy-focused alternative
- **PostHog**: Product analytics

Analytics are only loaded after user consent via the DPDP-compliant banner.

## 🧪 Testing

```bash
# Run linting
pnpm lint

# Build for production
pnpm build

# Test production build
pnpm start
```

## 📝 Content Management

The website content is managed through:

- **Components**: Each section is a separate component
- **SEO Data**: Centralized in `lib/seo.ts`
- **Form Validation**: Zod schemas in `lib/validators.ts`
- **API Endpoints**: RESTful API in `app/api/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

© 2025 MS SAHIL All rights reserved.

## 📞 Support

- **Email**: contact@mseducation.in
- **Website**: https://mseducation.in
- **Documentation**: [Link to docs]

---

Built with ❤️ in India for the global workforce.
