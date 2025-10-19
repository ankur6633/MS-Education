# Netlify Deployment Guide

## Prerequisites
- Netlify account
- MongoDB Atlas database
- Cloudinary account

## Step 1: Prepare Your Repository

1. **Commit all changes to Git:**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

## Step 2: Deploy to Netlify

### Option A: Connect via Git (Recommended)
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub/GitLab repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** 18

### Option B: Manual Deploy
1. Run `npm run build` locally
2. Drag and drop the `.next` folder to Netlify

## Step 3: Configure Environment Variables

In Netlify dashboard, go to Site settings > Environment variables and add:

```
MONGODB_URI=mongodb+srv://msenglish:ankur@msenglish.ugt6lgz.mongodb.net/mseducation
NEXTAUTH_URL=https://your-site-name.netlify.app
NEXTAUTH_SECRET=6f29f29b8b321a1a8c2f3e40d00c8f864fe69bf9a34099bdc592351a4633b427
CLOUDINARY_CLOUD_NAME=drzbeglpo
CLOUDINARY_API_KEY=444348525411693
CLOUDINARY_API_SECRET=gYAEgghJEuMe-0Ro0wDA2XGiQO4
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**Important:** Replace `your-site-name` with your actual Netlify site URL.

## Step 4: Configure MongoDB Atlas

1. **Whitelist Netlify IPs:**
   - In MongoDB Atlas, go to Network Access
   - Add IP Address: `0.0.0.0/0` (allow all IPs)
   - Or add specific Netlify IP ranges

2. **Update Database User:**
   - Ensure your database user has read/write permissions

## Step 5: Test Your Deployment

1. Visit your Netlify site URL
2. Go to `/admin` to access the admin panel
3. Login with: `admin` / `admin123`
4. Test creating a course and uploading files

## Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check Node.js version (should be 18)
   - Verify all dependencies are in package.json

2. **Environment Variables Not Working:**
   - Ensure variables are set in Netlify dashboard
   - Redeploy after adding variables

3. **MongoDB Connection Issues:**
   - Check MongoDB Atlas network access
   - Verify connection string format

4. **File Upload Issues:**
   - Verify Cloudinary credentials
   - Check file size limits

### Alternative: Vercel Deployment

If Netlify doesn't work well, consider Vercel (better Next.js support):

1. Connect GitHub repo to Vercel
2. Add environment variables
3. Deploy automatically

## Security Notes

- Change default admin password in production
- Use strong NEXTAUTH_SECRET
- Restrict MongoDB access to specific IPs
- Enable Cloudinary security features

## Support

If you encounter issues:
1. Check Netlify function logs
2. Verify environment variables
3. Test MongoDB connection
4. Check Cloudinary upload limits
