import { NextRequest, NextResponse } from 'next/server'
import { waitlistSchema } from '@/lib/validators'
import fs from 'fs'
import path from 'path'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function rateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 5 // 5 requests per window

  const key = ip
  const current = rateLimitStore.get(key)

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (current.count >= maxRequests) {
    return false
  }

  current.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate the form data
    const validatedData = waitlistSchema.parse(body)
    
    // Store the data (in production, use a database)
    const dataPath = path.join(process.cwd(), 'data', 'waitlist.json')
    
    // Ensure data directory exists
    const dataDir = path.dirname(dataPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    // Read existing data
    let existingData = []
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, 'utf8')
      existingData = JSON.parse(fileContent)
    }
    
    // Add new entry with timestamp
    const newEntry = {
      ...validatedData,
      timestamp: new Date().toISOString(),
      ip: ip,
    }
    
    existingData.push(newEntry)
    
    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2))
    
    // In production, you might want to:
    // 1. Send email notification
    // 2. Add to CRM
    // 3. Send welcome email to user
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully joined the waitlist! We\'ll be in touch soon.' 
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Waitlist submission error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data. Please check your inputs.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
