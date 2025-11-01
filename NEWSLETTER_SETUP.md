# Newsletter Subscription Setup Guide

This guide will help you set up the newsletter subscription feature with email notifications.

## 📋 Overview

The newsletter subscription system includes:
- ✅ Email validation (format, length: 5-254 characters)
- ✅ MongoDB storage for subscribers
- ✅ Beautiful welcome email using Nodemailer
- ✅ Duplicate email prevention
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback
- ✅ Professional email template with MS Education branding

## 🚀 Setup Instructions

### Step 1: Create Environment File

Copy the example environment file and add your credentials:

```bash
cd MS-Education
cp env.example .env.local
```

### Step 2: Configure Email Credentials

Open `.env.local` and configure the email settings. Below are instructions for common email providers:

#### Option A: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
3. **Update .env.local:**

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=noreply@mseducation.in
EMAIL_FROM_NAME=MS Education
```

#### Option B: Outlook/Office365

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@mseducation.in
EMAIL_FROM_NAME=MS Education
```

#### Option C: SendGrid (Recommended for Production)

1. Sign up at https://sendgrid.com/
2. Create an API key
3. Update .env.local:

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@mseducation.in
EMAIL_FROM_NAME=MS Education
```

#### Option D: AWS SES (Production)

```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-ses-smtp-username
EMAIL_PASSWORD=your-ses-smtp-password
EMAIL_FROM=noreply@mseducation.in
EMAIL_FROM_NAME=MS Education
```

### Step 3: Configure MongoDB

Make sure your MongoDB connection string is set in `.env.local`:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
```

### Step 4: Test the Setup

1. **Start the development server:**

```bash
npm run dev
```

2. **Test the subscription:**
   - Navigate to http://localhost:3000
   - Scroll to the footer
   - Enter a valid email address
   - Click "Subscribe"
   - Check for success message
   - Check your email inbox for the welcome message

## 🎨 Features

### Client-Side Validation
- Email format validation
- Length validation (5-254 characters per RFC 5321)
- Empty field validation
- Real-time feedback with toast notifications

### Server-Side Validation
- Zod schema validation
- Email normalization (lowercase, trimmed)
- Duplicate prevention
- MongoDB unique index

### Email Features
- Beautiful HTML email template
- Responsive design
- Branded with MS Education colors
- Social media links
- Unsubscribe link (placeholder)

### Database Schema
```typescript
{
  email: string (unique, required, 5-254 chars)
  subscribedAt: Date
  isActive: boolean
  source: string ('footer-newsletter', 'course-page', 'popup', 'other')
  ipAddress: string
  timestamps: true
}
```

## 📁 Files Created/Modified

### New Files:
- `lib/models/Subscriber.ts` - MongoDB model for subscribers
- `lib/email-service.ts` - Email service with Nodemailer
- `app/api/newsletter/subscribe/route.ts` - API endpoint for subscriptions
- `NEWSLETTER_SETUP.md` - This setup guide

### Modified Files:
- `components/Footer.tsx` - Updated with subscription form and logic
- `env.example` - Added email configuration variables
- `package.json` - Added nodemailer dependency

## 🔧 API Endpoints

### POST `/api/newsletter/subscribe`
Subscribe a new email to the newsletter.

**Request:**
```json
{
  "email": "user@example.com",
  "source": "footer-newsletter"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Thank you for subscribing! Check your email for a welcome message.",
  "emailSent": true,
  "subscriber": {
    "email": "user@example.com",
    "subscribedAt": "2025-11-01T12:00:00.000Z"
  }
}
```

**Error Response (400/409/500):**
```json
{
  "success": false,
  "message": "Error message here",
  "errors": [...]
}
```

### GET `/api/newsletter/subscribe?email=user@example.com`
Check if an email is subscribed.

**Response:**
```json
{
  "success": true,
  "subscribed": true,
  "subscribedAt": "2025-11-01T12:00:00.000Z"
}
```

## 🎯 Testing Checklist

- [ ] Valid email submission works
- [ ] Invalid email shows error (e.g., "test@")
- [ ] Email too short shows error (< 5 chars)
- [ ] Email too long shows error (> 254 chars)
- [ ] Empty submission shows error
- [ ] Duplicate email shows appropriate message
- [ ] Welcome email arrives in inbox
- [ ] Email template displays correctly
- [ ] Loading state appears during submission
- [ ] Success state appears after subscription
- [ ] Form clears after successful submission
- [ ] MongoDB stores subscriber correctly

## 🐛 Troubleshooting

### Email Not Sending

1. **Check credentials:**
   ```bash
   # Verify EMAIL_USER and EMAIL_PASSWORD are set correctly
   ```

2. **Gmail users:** Make sure you're using App Password, not regular password

3. **Check SMTP settings:**
   - Gmail: `smtp.gmail.com:587`
   - Outlook: `smtp-mail.outlook.com:587`

4. **Check server logs:**
   ```bash
   # Look for error messages in terminal
   ```

### Subscription Not Saving

1. **Check MongoDB connection:**
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas network access
   - Check database user permissions

2. **Check server logs for database errors**

### Frontend Not Working

1. **Clear browser cache**
2. **Check browser console for errors**
3. **Verify API endpoint is accessible**

## 📊 Database Management

### View All Subscribers (MongoDB Shell)
```javascript
db.subscribers.find().pretty()
```

### Count Active Subscribers
```javascript
db.subscribers.countDocuments({ isActive: true })
```

### Export Subscribers to CSV
```javascript
mongoexport --db=your_db --collection=subscribers --type=csv --fields=email,subscribedAt,source --out=subscribers.csv
```

## 🔐 Security Best Practices

1. **Never commit `.env.local` to git**
2. **Use App Passwords for Gmail** (not regular password)
3. **Use environment variables** for all sensitive data
4. **Enable rate limiting** for production (consider adding)
5. **Validate email ownership** with double opt-in (future enhancement)
6. **Monitor failed login attempts** to email servers

## 🚀 Production Deployment

### Vercel Deployment

1. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all EMAIL_* variables
   - Add MONGODB_URI

2. Deploy:
   ```bash
   npm run build
   vercel --prod
   ```

### Environment-Specific Settings

**Development:**
- Use Gmail with App Password
- Test with personal email

**Production:**
- Use SendGrid or AWS SES
- Use professional email domain
- Enable email tracking
- Set up email delivery monitoring

## 📈 Future Enhancements

- [ ] Double opt-in verification
- [ ] Unsubscribe functionality
- [ ] Email preferences center
- [ ] Newsletter campaigns
- [ ] Subscriber analytics dashboard
- [ ] A/B testing for email templates
- [ ] Segmentation by interests
- [ ] Automated welcome series

## 📞 Support

If you encounter any issues:
1. Check this guide first
2. Review server logs
3. Test with a simple email provider (Gmail)
4. Verify environment variables are set correctly

## 📝 Notes

- The email template is responsive and works across all major email clients
- Subscriber emails are automatically converted to lowercase
- Duplicate subscriptions are handled gracefully
- Failed email sends don't prevent database storage
- All timestamps are in UTC

---

**Created:** November 2025  
**Version:** 1.0.0  
**Last Updated:** November 1, 2025

