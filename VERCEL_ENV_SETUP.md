# 🔧 Vercel Environment Variables Setup

## Critical: Add These Environment Variables in Vercel Dashboard

### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Go to your project: `ms-education-pi`
3. Click "Settings" → "Environment Variables"

### Step 2: Add These Variables

**Copy and paste these exactly:**

```
MONGODB_URI=mongodb+srv://msenglish:ankur@msenglish.ugt6lgz.mongodb.net/mseducation
NEXTAUTH_URL=https://ms-education-pi.vercel.app
NEXTAUTH_SECRET=6f29f29b8b321a1a8c2f3e40d00c8f864fe69bf9a34099bdc592351a4633b427
CLOUDINARY_CLOUD_NAME=drzbeglpo
CLOUDINARY_API_KEY=444348525411693
CLOUDINARY_API_SECRET=gYAEgghJEuMe-0Ro0wDA2XGiQO4
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Step 3: Important Settings
- **Environment**: Select "Production", "Preview", and "Development"
- **Click "Save"** for each variable

### Step 4: Redeploy
After adding all variables:
1. Go to "Deployments" tab
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger redeploy

## Troubleshooting

### If Still Getting 500 Errors:
1. **Check Vercel Function Logs:**
   - Go to "Functions" tab in Vercel dashboard
   - Click on any function to see logs
   - Look for specific error messages

2. **Verify Environment Variables:**
   - Make sure all variables are added
   - Check for typos in variable names
   - Ensure no extra spaces

3. **MongoDB Connection:**
   - Verify MongoDB Atlas allows all IPs (0.0.0.0/0)
   - Check connection string format

### Common Issues:
- ❌ **Missing NEXTAUTH_SECRET** → 500 error
- ❌ **Wrong NEXTAUTH_URL** → Authentication fails
- ❌ **MongoDB connection issues** → Database errors
- ❌ **Missing Cloudinary credentials** → Upload fails

## Test After Setup:
1. Visit: `https://ms-education-pi.vercel.app/admin`
2. Login with: `admin` / `admin123`
3. Try creating a course
4. Test file uploads

Your admin panel should work perfectly after adding these environment variables! 🚀
