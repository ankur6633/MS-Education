# 📧 Newsletter Subscription System

Complete newsletter subscription with email validation, MongoDB storage, and beautiful welcome emails.

---

## ✅ What's Included

- ✅ Email validation (5-254 characters, RFC 5321 compliant)
- ✅ MongoDB storage for subscribers
- ✅ Beautiful HTML welcome emails (Nodemailer)
- ✅ Duplicate prevention
- ✅ Loading states & error handling
- ✅ Toast notifications
- ✅ Production-ready code

---

## 🚀 Setup (10 Minutes)

### 1. Email Already Configured ✅
Your Gmail is already set up in `.env.local`:
```env
EMAIL_USER=ankurkumartab6633@gmail.com
EMAIL_PASSWORD=mnsy pevw viwh wsmz
```

### 2. Get MongoDB URI (Required)

**Quick Setup:**
1. Go to https://www.mongodb.com/cloud/atlas/register (FREE)
2. Create cluster (M0 Free tier - 512MB)
3. Database Access → Add User → Save password
4. Network Access → Add IP → Allow 0.0.0.0/0
5. Connect → Drivers → Copy connection string

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mseducation?retryWrites=true&w=majority
```

### 3. Update `.env.local`

Add your MongoDB URI:
```env
MONGODB_URI=mongodb+srv://your-connection-string-here
```

### 4. Test

```bash
# Test email
node scripts/test-email.js ankurkumartab6633@gmail.com

# Start dev server
npm run dev
```

Visit http://localhost:3000, scroll to footer, and subscribe!

---

## 📁 Files Created

**Core (Required):**
- `lib/models/Subscriber.ts` - MongoDB model
- `lib/email-service.ts` - Email service with templates
- `app/api/newsletter/subscribe/route.ts` - API endpoint
- `components/Footer.tsx` - Updated with subscription form

**Utility:**
- `scripts/test-email.js` - Test email configuration

---

## 🚀 Deploy

### Vercel (Recommended)

```bash
vercel --prod
```

**Add these environment variables in Vercel dashboard:**
```env
MONGODB_URI=your_mongodb_uri_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=ankurkumartab6633@gmail.com
EMAIL_PASSWORD=mnsy pevw viwh wsmz
EMAIL_FROM=noreply@mseducation.in
EMAIL_FROM_NAME=MS Education
```

---

## 🐛 Troubleshooting

**"Invalid scheme" error:**
- Your MONGODB_URI is still placeholder
- Update `.env.local` with real MongoDB URI

**Email not sending:**
- Test with: `node scripts/test-email.js your-email@gmail.com`
- Check EMAIL_USER and EMAIL_PASSWORD in `.env.local`

**Subscriber not saved:**
- Verify MONGODB_URI is correct
- Check MongoDB Atlas network access (0.0.0.0/0)

---

## 📊 View Subscribers

**MongoDB Atlas:**
1. https://cloud.mongodb.com/
2. Database → Browse Collections
3. Collection: `subscribers`

**MongoDB Shell:**
```javascript
db.subscribers.find().pretty()
db.subscribers.countDocuments({ isActive: true })
```

---

## ⚠️ Production Tips

**Email Provider:**
- Gmail works but has limits
- Consider SendGrid (free 100/day) or AWS SES for production

**Security:**
- Update MongoDB Network Access with specific IPs
- Use strong passwords
- Add rate limiting

---

## ✨ That's It!

Your system is ready. Just add MongoDB URI and deploy! 🚀

