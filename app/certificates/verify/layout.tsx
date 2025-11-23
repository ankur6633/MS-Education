import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function CertificateVerifyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

