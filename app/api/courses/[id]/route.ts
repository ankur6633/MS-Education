import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db'
import Course from '@/lib/models/Course'

// GET /api/courses/[id] - Get a single course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const course = await Course.findById(params.id)
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      course
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/courses/[id] - Update a course
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { 
      title, 
      hindiTitle, 
      description, 
      thumbnail, 
      isPaid, 
      currentPrice, 
      originalPrice, 
      duration, 
      students, 
      rating, 
      reviews, 
      features, 
      badge, 
      badgeColor, 
      image, 
      theme,
      showInCarousel,
      discount
    } = body

    // Find the course
    const course = await Course.findById(params.id)
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Update course fields
    course.title = title || course.title
    course.hindiTitle = hindiTitle || course.hindiTitle
    course.description = description || course.description
    course.thumbnail = thumbnail || course.thumbnail
    course.isPaid = isPaid !== undefined ? isPaid : course.isPaid
    course.currentPrice = currentPrice !== undefined ? currentPrice : course.currentPrice
    course.originalPrice = originalPrice !== undefined ? originalPrice : course.originalPrice
    course.discount = discount !== undefined ? discount : course.discount
    course.duration = duration || course.duration
    course.students = students || course.students
    course.rating = rating !== undefined ? rating : course.rating
    course.reviews = reviews !== undefined ? reviews : course.reviews
    course.features = features || course.features
    course.badge = badge || course.badge
    course.badgeColor = badgeColor || course.badgeColor
    course.image = image || course.image
    course.theme = theme || course.theme
    course.showInCarousel = showInCarousel !== undefined ? showInCarousel : course.showInCarousel

    await course.save()

    return NextResponse.json({
      success: true,
      course
    })
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/courses/[id] - Delete a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const course = await Course.findByIdAndDelete(params.id)
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}