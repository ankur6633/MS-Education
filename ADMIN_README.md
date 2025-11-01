# Course Management Admin Panel

A complete admin panel for managing courses, videos, and PDFs built with Next.js 14, MongoDB, and Cloudinary.

## Features

### 🔐 Authentication
- Secure admin login with NextAuth.js
- JWT-based session management
- Protected admin routes with middleware
- Demo credentials: `admin` / `admin123`

### 📚 Course Management
- Create, read, update, and delete courses
- Course thumbnail upload to Cloudinary
- Course type selection (Free/Paid)
- Course description and metadata management

### 🎥 Video Management
- Drag & drop video upload interface
- Support for multiple video formats (MP4, AVI, MOV, WMV, FLV, WebM)
- Video duration tracking
- Video ordering and organization
- Cloudinary integration for video storage

### 📄 PDF Management
- Drag & drop PDF upload interface
- PDF title and metadata management
- PDF ordering and organization
- Cloudinary integration for PDF storage

### 🎨 UI/UX Features
- Modern, responsive design with Tailwind CSS
- shadcn/ui components for consistent styling
- Toast notifications for user feedback
- Loading states and progress indicators
- Search and pagination for course listing
- Dark/light mode support (via shadcn/ui)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js with JWT
- **Database**: MongoDB with Mongoose ODM
- **File Storage**: Cloudinary
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast
- **File Upload**: React Dropzone

## Project Structure

```
MS-Education/
├── app/
│   ├── admin/                    # Admin panel routes
│   │   ├── layout.tsx           # Admin layout with SessionProvider
│   │   ├── login/               # Admin login page
│   │   ├── page.tsx             # Admin dashboard
│   │   └── courses/             # Course management pages
│   │       ├── new/             # Create new course
│   │       └── [id]/            # Course detail and edit pages
│   ├── api/                     # API routes
│   │   ├── auth/                # NextAuth configuration
│   │   └── courses/             # Course CRUD operations
│   └── layout.tsx               # Root layout with SessionProvider
├── components/
│   └── admin/                   # Admin-specific components
│       ├── VideoUploader.tsx    # Video upload component
│       └── PDFUploader.tsx      # PDF upload component
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   ├── cloudinary.ts            # Cloudinary setup and helpers
│   ├── db.ts                    # MongoDB connection
│   └── models/
│       └── Course.ts            # Course schema and model
├── types/
│   └── next-auth.d.ts           # NextAuth type definitions
└── middleware.ts                # Route protection middleware
```

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://msenglish:ankur@msenglish.ugt6lgz.mongodb.net/mseducation

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Credentials (for demo purposes)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas:

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string in MONGODB_URI
```

### 4. Set up Cloudinary

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from the dashboard
3. Add them to your `.env.local` file

### 5. Run the Development Server

```bash
npm run dev
```

The admin panel will be available at `http://localhost:3000/admin`

## Usage Guide

### Admin Login
1. Navigate to `/admin/login`
2. Use demo credentials: `admin` / `admin123`
3. You'll be redirected to the dashboard upon successful login

### Creating a Course
1. Click "Add Course" on the dashboard
2. Fill in the course title and description
3. Select course type (Free/Paid)
4. Upload a thumbnail image
5. Click "Create Course"

### Managing Videos
1. Go to a course detail page
2. Click "Add Video" in the Videos tab
3. Drag & drop or select a video file
4. Enter video title and duration
5. Click "Upload Video"

### Managing PDFs
1. Go to a course detail page
2. Click "Add PDF" in the PDFs tab
3. Drag & drop or select a PDF file
4. Enter PDF title
5. Click "Upload PDF"

### Editing Courses
1. Click "Edit" on any course card
2. Modify the course information
3. Upload a new thumbnail if needed
4. Click "Update Course"

### Deleting Content
- Use the "Delete" buttons to remove courses, videos, or PDFs
- Confirm the deletion in the popup dialog

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Admin login
- `POST /api/auth/signout` - Admin logout

### Courses
- `GET /api/courses` - Get all courses (with pagination and search)
- `POST /api/courses` - Create a new course
- `GET /api/courses/[id]` - Get a specific course
- `PUT /api/courses/[id]` - Update a course
- `DELETE /api/courses/[id]` - Delete a course

### Videos
- `POST /api/courses/[id]/videos` - Upload a video to a course
- `DELETE /api/courses/[id]/videos/[videoIndex]` - Delete a video

### PDFs
- `POST /api/courses/[id]/pdfs` - Upload a PDF to a course
- `DELETE /api/courses/[id]/pdfs/[pdfIndex]` - Delete a PDF

## Database Schema

### Course Model
```typescript
{
  title: string;
  description: string;
  thumbnail: string;
  isPaid: boolean;
  videos: Array<{
    title: string;
    url: string;
    duration: number;
    order: number;
  }>;
  pdfs: Array<{
    title: string;
    url: string;
    order: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

## Security Features

- **Route Protection**: Middleware protects all `/admin` routes
- **Authentication**: NextAuth.js handles secure authentication
- **File Upload Security**: File type and size validation
- **Input Validation**: Zod schemas validate all form inputs
- **CSRF Protection**: Built-in NextAuth.js CSRF protection

## Customization

### Adding New File Types
1. Update the `accept` prop in the dropzone components
2. Modify the file validation in the API routes
3. Update the UI to reflect the new file types

### Styling Changes
- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for global styles
- Use shadcn/ui components for consistent design

### Adding New Fields
1. Update the Course model in `lib/models/Course.ts`
2. Modify the form components
3. Update the API routes to handle new fields

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in your environment variables

2. **Cloudinary Upload Fails**
   - Verify your Cloudinary credentials
   - Check file size limits (500MB for videos, 50MB for PDFs)

3. **Authentication Issues**
   - Clear browser cookies and localStorage
   - Check NEXTAUTH_SECRET is set
   - Verify admin credentials in environment variables

4. **File Upload Issues**
   - Check file size and type restrictions
   - Ensure Cloudinary is properly configured
   - Verify network connectivity

## Production Deployment

### Environment Variables for Production
```env
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secure-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
ADMIN_USERNAME=your-secure-username
ADMIN_PASSWORD=your-secure-password
```

### Security Considerations
- Use strong, unique passwords for admin accounts
- Enable HTTPS in production
- Set up proper CORS policies
- Implement rate limiting for API routes
- Regular security updates for dependencies

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the console for error messages
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed

## License

This admin panel is part of the MS Education project and follows the same licensing terms.
