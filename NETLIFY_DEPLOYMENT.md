# Netlify Deployment Guide

## ⚠️ Important Note

Netlify has limitations with Next.js API routes. Your admin panel will work as a **static site** but with limited functionality:

- ✅ **Frontend**: All UI components will work
- ❌ **Authentication**: NextAuth won't work (no server-side sessions)
- ❌ **Database**: MongoDB connections won't work
- ❌ **File Uploads**: Cloudinary uploads won't work

## Alternative Solutions

### Option 1: Use Netlify for Frontend + External Backend
- Deploy frontend to Netlify
- Use a separate backend service (Railway, Render, etc.) for API routes

### Option 2: Switch to Vercel (Recommended)
- Full Next.js support
- All features work perfectly
- Better performance

### Option 3: Use Netlify Functions (Complex)
- Requires rewriting API routes as Netlify Functions
- Limited Next.js compatibility

## If You Still Want to Deploy to Netlify

### Step 1: Build Static Version
```bash
npm run build
```

### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `out` folder
3. Or connect your GitHub repository

### Step 3: Configure Environment Variables
Add these in Netlify dashboard:
```
NEXTAUTH_URL=https://your-site.netlify.app
NEXTAUTH_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=drzbeglpo
CLOUDINARY_API_KEY=444348525411693
CLOUDINARY_API_SECRET=gYAEgghJEuMe-0Ro0wDA2XGiQO4
```

## Limitations on Netlify

- **No Authentication**: Login won't work
- **No Database**: Can't create/edit courses
- **No File Uploads**: Can't upload videos/PDFs
- **Static Only**: Just displays the UI

## Recommended: Deploy to Vercel Instead

Vercel offers:
- ✅ Full Next.js support
- ✅ Working authentication
- ✅ Database connections
- ✅ File uploads
- ✅ Better performance

Would you like me to help you deploy to Vercel instead?
