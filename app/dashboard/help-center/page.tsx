'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@/components/providers/UserProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { HelpCircle, MessageSquare, Plus, ChevronDown, ChevronUp, Send, Clock, CheckCircle2, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

interface Ticket {
  _id: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category?: string
  createdAt: string
  replyCount: number
}

export default function HelpCenterPage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets' | 'create'>('faq')
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [ticketReplies, setTicketReplies] = useState<any[]>([])
  const [newReply, setNewReply] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Create ticket form
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    priority: 'medium' as const,
    category: ''
  })

  const fetchFAQs = async () => {
    try {
      const res = await fetch('/api/help/faq')
      const data = await res.json()
      if (data.success) {
        setFaqs(data.faqs)
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    }
  }

  const fetchTickets = useCallback(async () => {
    if (!user?.email) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/help/ticket/list?email=${encodeURIComponent(user.email)}`)
      const data = await res.json()
      if (data.success) {
        setTickets(data.tickets)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      toast.error('Error loading tickets')
    } finally {
      setIsLoading(false)
    }
  }, [user?.email])

  const fetchTicketDetails = useCallback(async (ticketId: string) => {
    if (!user?.email) return

    try {
      const res = await fetch(`/api/help/ticket/${ticketId}?email=${encodeURIComponent(user.email)}`, {
        headers: {
          'x-user-email': user.email
        }
      })
      const data = await res.json()
      if (data.success) {
        setTicketReplies(data.replies || [])
      }
    } catch (error) {
      console.error('Error fetching ticket details:', error)
    }
  }, [user?.email])

  useEffect(() => {
    fetchFAQs()
    if (user?.email) {
      fetchTickets()
    }
  }, [user, fetchTickets])

  useEffect(() => {
    if (selectedTicket && user?.email) {
      fetchTicketDetails(selectedTicket._id)
    }
  }, [selectedTicket, user, fetchTicketDetails])

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.email) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/help/ticket/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify(ticketForm)
      })

      const data = await res.json()
      if (data.success) {
        toast.success('Ticket created successfully!')
        setTicketForm({ subject: '', description: '', priority: 'medium', category: '' })
        setActiveTab('tickets')
        fetchTickets()
      } else {
        toast.error(data.error || 'Failed to create ticket')
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast.error('Error creating ticket')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddReply = async () => {
    if (!user?.email || !selectedTicket || !newReply.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/help/ticket/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify({
          ticketId: selectedTicket._id,
          message: newReply
        })
      })

      const data = await res.json()
      if (data.success) {
        toast.success('Reply added successfully!')
        setNewReply('')
        fetchTicketDetails(selectedTicket._id)
        fetchTickets()
      } else {
        toast.error(data.error || 'Failed to add reply')
      }
    } catch (error) {
      console.error('Error adding reply:', error)
      toast.error('Error adding reply')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-neutral-100 text-neutral-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'resolved':
        return CheckCircle2
      case 'closed':
        return XCircle
      default:
        return Clock
    }
  }

  const tabs = [
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'tickets', label: 'My Tickets', icon: MessageSquare },
    { id: 'create', label: 'Create Ticket', icon: Plus },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <HelpCircle className="h-8 w-8 text-primary-500" />
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Help Center</h1>
          <p className="text-neutral-600 mt-1">
            Get help and support
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-1 flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any)
                if (tab.id === 'tickets') {
                  fetchTickets()
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-neutral-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
                    >
                      <span className="font-semibold text-neutral-800 pr-4">
                        {faq.question}
                      </span>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-neutral-500 shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-neutral-500 shrink-0" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedFaq === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 text-neutral-600 border-t border-neutral-200">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {selectedTicket ? (
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTicket(null)
                  setTicketReplies([])
                }}
              >
                ← Back to Tickets
              </Button>

              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedTicket.subject}</CardTitle>
                      <CardDescription className="mt-2">
                        Created on {new Date(selectedTicket.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="font-semibold text-neutral-800 mb-2">Description</h3>
                    <p className="text-neutral-600 whitespace-pre-wrap">{selectedTicket.description}</p>
                  </div>

                  {/* Replies */}
                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold text-neutral-800">Replies</h3>
                    {ticketReplies.length === 0 ? (
                      <p className="text-neutral-500 text-sm">No replies yet</p>
                    ) : (
                      ticketReplies.map((reply) => (
                        <div
                          key={reply._id}
                          className={`p-4 rounded-lg ${
                            reply.isAdmin ? 'bg-primary-50 border border-primary-200' : 'bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-neutral-800">
                              {reply.isAdmin ? 'Support Team' : (reply.userId?.name || 'You')}
                            </span>
                            <span className="text-xs text-neutral-500">
                              {new Date(reply.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-neutral-600 whitespace-pre-wrap">{reply.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Reply */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700">
                      Add Reply
                    </label>
                    <textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full min-h-[100px] rounded-lg border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={4}
                    />
                    <Button
                      onClick={handleAddReply}
                      disabled={!newReply.trim() || isLoading}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {isLoading && tickets.length === 0 ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : tickets.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-800 mb-2">No Tickets Yet</h3>
                    <p className="text-neutral-600 mb-6">
                      Create a ticket to get help from our support team
                    </p>
                    <Button onClick={() => setActiveTab('create')}>
                      Create Ticket
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => {
                    const StatusIcon = getStatusIcon(ticket.status)
                    return (
                      <Card
                        key={ticket._id}
                        className="hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-neutral-800 mb-2">
                                {ticket.subject}
                              </h3>
                              <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                                {ticket.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-neutral-500">
                                <span>
                                  {new Date(ticket.createdAt).toLocaleDateString()}
                                </span>
                                {ticket.replyCount > 0 && (
                                  <span>{ticket.replyCount} reply{ticket.replyCount !== 1 ? 'ies' : ''}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(ticket.status)}`}>
                                <StatusIcon className="h-3 w-3" />
                                <span>{ticket.status}</span>
                              </span>
                              {ticket.priority === 'urgent' && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                                  Urgent
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </motion.div>
      )}

      {/* Create Ticket Tab */}
      {activeTab === 'create' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>Describe your issue and we&apos;ll help you resolve it</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTicket} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Subject *
                  </label>
                  <Input
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                    required
                    maxLength={200}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    placeholder="Provide detailed information about your issue..."
                    className="w-full min-h-[150px] rounded-lg border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    maxLength={5000}
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Priority
                    </label>
                    <Select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value as any })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Category (Optional)
                    </label>
                    <Input
                      type="text"
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      placeholder="e.g., Technical, Billing, Account"
                      maxLength={100}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Creating...' : 'Create Ticket'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

