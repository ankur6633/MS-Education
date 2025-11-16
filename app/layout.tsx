import type { Metadata } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import './globals.css'
import { ConsentBanner } from '@/components/ConsentBanner'
import { Analytics } from '@/components/Analytics'
import SessionProvider from '@/components/providers/SessionProvider'
import { UserProvider } from '@/components/providers/UserProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://mseducation.in'),
  title: 'mseducation.in - Make Verified Skills Your Career Currency',
  description: 'mseducation.in is your AI-powered career co-pilot — personalize your learning path, verify your skills, and land the right job faster. Built in India • DPDP Compliant • Launching Nov 1, 2025',
  keywords: 'AI career, skill verification, blockchain credentials, job matching, upskilling, India, DPDP compliant',
  authors: [{ name: 'mseducation.in Team' }],
  creator: 'mseducation.in',
  publisher: 'MS Sahil',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://mseducation.in',
    siteName: 'mseducation.in',
    title: 'mseducation.in - Make Verified Skills Your Career Currency',
    description: 'AI-powered career co-pilot for personalized learning, skill verification, and job matching. Built in India • DPDP Compliant • Launching Nov 1, 2025',
    images: [
      {
        url: 'https://mseducation.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'mseducation.in - AI Career Co-Pilot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mseducation.in - Make Verified Skills Your Career Currency',
    description: 'AI-powered career co-pilot for personalized learning, skill verification, and job matching. Built in India • DPDP Compliant • Launching Nov 1, 2025',
    images: ['https://mseducation.in/og-image.jpg'],
    creator: '@mseducation.in',
  },
  alternates: {
    canonical: 'https://mseducation.in',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${dmSans.variable}`}>
      <head>
        <link rel="canonical" href="https://mseducation.in" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3C2CF2" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">
        <SessionProvider>
          <UserProvider>
            {children}
            <ConsentBanner />
            <Analytics />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '16px',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
