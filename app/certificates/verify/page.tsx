'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CheckCircle2, XCircle, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface CertificateData {
  certificateUrl: string
  completedAt: string
  user: {
    name: string
    email: string
  }
  course: {
    title: string
    description: string
  }
}

export default function VerifyCertificatePage() {
  const searchParams = useSearchParams()
  const hash = searchParams.get('hash')
  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)

  const verifyCertificate = useCallback(async () => {
    if (!hash) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/certificates/verify?hash=${hash}`)
      const data = await res.json()
      
      if (data.success && data.valid) {
        setCertificate(data.certificate)
        setIsValid(true)
      } else {
        setIsValid(false)
      }
    } catch (error) {
      console.error('Error verifying certificate:', error)
      setIsValid(false)
    } finally {
      setIsLoading(false)
    }
  }, [hash])

  useEffect(() => {
    if (hash) {
      verifyCertificate()
    } else {
      setIsLoading(false)
    }
  }, [hash, verifyCertificate])

  const handleDownload = () => {
    if (certificate) {
      const link = document.createElement('a')
      link.href = certificate.certificateUrl
      link.download = `Certificate_${certificate.course.title.replace(/\s+/g, '_')}.pdf`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = () => {
    if (certificate && navigator.share) {
      navigator.share({
        title: `Certificate: ${certificate.course.title}`,
        text: `Check out this certificate for ${certificate.course.title}!`,
        url: window.location.href
      }).catch(() => {
        // User cancelled or error occurred
      })
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!')
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 pt-24 pb-12">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                {isValid ? (
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              <CardTitle className="text-center text-2xl">
                {isValid ? 'Certificate Verified' : 'Certificate Not Found'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isValid && certificate ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-neutral-600 mb-4">
                      This certificate has been verified and is authentic.
                    </p>
                  </div>

                  <div className="bg-neutral-50 rounded-lg p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-1">Certificate Holder</h3>
                      <p className="text-neutral-600">{certificate.user.name}</p>
                      <p className="text-sm text-neutral-500">{certificate.user.email}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-1">Course</h3>
                      <p className="text-neutral-600">{certificate.course.title}</p>
                      <p className="text-sm text-neutral-500">{certificate.course.description}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-1">Completed On</h3>
                      <p className="text-neutral-600">
                        {new Date(certificate.completedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <Image
                      src={certificate.certificateUrl}
                      alt="Certificate"
                      width={800}
                      height={600}
                      className="w-full h-auto rounded-lg border border-neutral-200"
                      unoptimized
                    />
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <Button variant="outline" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-600 mb-4">
                    The certificate you&apos;re looking for could not be found or verified.
                  </p>
                  <p className="text-sm text-neutral-500">
                    Please check the verification link and try again.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

