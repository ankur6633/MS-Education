'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/components/providers/UserProvider'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Trophy, Download, Share2, Eye, CheckCircle2, ExternalLink, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Certificate {
  _id: string
  userId: string
  courseId: {
    _id: string
    title: string
    thumbnail?: string
    description?: string
  }
  certificateUrl: string
  verificationHash: string
  completedAt: string
  createdAt: string
}

export default function AccomplishmentsPage() {
  const { user } = useUser()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (user?.email) {
      fetchCertificates()
    }
  }, [user, page])

  const fetchCertificates = async () => {
    if (!user?.email) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/certificates/list?email=${encodeURIComponent(user.email)}&page=${page}&limit=20`)
      const data = await res.json()
      
      if (data.success) {
        if (page === 1) {
          setCertificates(data.certificates)
        } else {
          setCertificates(prev => [...prev, ...data.certificates])
        }
        setHasMore(data.pagination.page < data.pagination.pages)
      } else {
        toast.error(data.error || 'Failed to load certificates')
      }
    } catch (error) {
      console.error('Error fetching certificates:', error)
      toast.error('Error loading certificates')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (certificate: Certificate) => {
    try {
      const link = document.createElement('a')
      link.href = certificate.certificateUrl
      link.download = `${certificate.courseId.title.replace(/\s+/g, '_')}_Certificate.pdf`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Certificate download started')
    } catch (error) {
      console.error('Error downloading certificate:', error)
      toast.error('Error downloading certificate')
    }
  }

  const handleShare = async (certificate: Certificate) => {
    const verificationUrl = `${window.location.origin}/certificates/verify?hash=${certificate.verificationHash}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificate: ${certificate.courseId.title}`,
          text: `Check out my certificate for completing ${certificate.courseId.title}!`,
          url: verificationUrl
        })
        toast.success('Certificate shared!')
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(verificationUrl)
        }
      }
    } else {
      copyToClipboard(verificationUrl)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Verification link copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy link')
    })
  }

  const openVerificationPage = (certificate: Certificate) => {
    const verificationUrl = `${window.location.origin}/certificates/verify?hash=${certificate.verificationHash}`
    window.open(verificationUrl, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <Trophy className="h-8 w-8 text-primary-500" />
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Accomplishments</h1>
          <p className="text-neutral-600 mt-1">
            Your certificates and achievements
          </p>
        </div>
      </motion.div>

      {/* Certificates Grid */}
      {isLoading && certificates.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-neutral-200 rounded mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">No Certificates Yet</h3>
            <p className="text-neutral-600 mb-6">
              Complete courses to earn certificates and showcase your achievements!
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate, index) => {
              const completedDate = new Date(certificate.completedAt)
              const formattedDate = completedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })

              return (
                <motion.div
                  key={certificate._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-xl transition-all cursor-pointer group"
                    onClick={() => setSelectedCertificate(certificate)}
                  >
                    <CardContent className="p-6">
                      {/* Certificate Preview */}
                      <div className="relative mb-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6 border-2 border-primary-200">
                        {certificate.courseId.thumbnail ? (
                          <Image
                            src={certificate.courseId.thumbnail}
                            alt={certificate.courseId.title}
                            width={200}
                            height={120}
                            className="w-full h-32 object-cover rounded mb-3"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-32 flex items-center justify-center">
                            <Trophy className="h-16 w-16 text-primary-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="h-6 w-6 text-green-500 bg-white rounded-full" />
                        </div>
                      </div>

                      {/* Course Title */}
                      <h3 className="font-bold text-neutral-800 mb-2 line-clamp-2">
                        {certificate.courseId.title}
                      </h3>

                      {/* Completion Date */}
                      <p className="text-sm text-neutral-500 mb-4">
                        Completed on {formattedDate}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(certificate)
                          }}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleShare(certificate)
                          }}
                          className="flex-1"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            openVerificationPage(certificate)
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => setPage(prev => prev + 1)}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Certificate Viewer Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setSelectedCertificate(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedCertificate(null)}
            >
              <div
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-neutral-800">
                      {selectedCertificate.courseId.title}
                    </h2>
                    <button
                      onClick={() => setSelectedCertificate(null)}
                      className="text-neutral-500 hover:text-neutral-800"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <Image
                      src={selectedCertificate.certificateUrl}
                      alt="Certificate"
                      width={800}
                      height={600}
                      className="w-full h-auto rounded-lg border border-neutral-200"
                      unoptimized
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">
                        Completed on {new Date(selectedCertificate.completedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Verification Hash: {selectedCertificate.verificationHash}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(selectedCertificate)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleShare(selectedCertificate)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => openVerificationPage(selectedCertificate)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

