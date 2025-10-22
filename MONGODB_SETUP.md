# MongoDB Atlas Setup Guide

## 🔧 Fix MongoDB Connection Issues

### **Step 1: Whitelist IP Addresses**

1. **Go to MongoDB Atlas:**
   - Visit [cloud.mongodb.com](https://cloud.mongodb.com)
   - Log in with your account
   - Select your project

2. **Add Network Access:**
   - Click **"Network Access"** in the left sidebar
   - Click **"Add IP Address"**

3. **Choose IP Whitelist Option:**

   **Option A: Allow All IPs (Development Only)**
   ```
   - Click "Allow Access from Anywhere"
   - This adds 0.0.0.0/0 to whitelist
   - ⚠️ Only use for development, not production
   ```

   **Option B: Add Specific IPs (Recommended)**
   ```
   - Click "Add Current IP Address" (for local development)
   - Add these Vercel IP ranges for production:
     * 76.76.19.0/24
     * 76.76.20.0/24
     * 76.76.21.0/24
     * 76.76.22.0/24
   ```

### **Step 2: Verify Database User**

1. **Go to Database Access:**
   - Click **"Database Access"** in the left sidebar
   - Verify your user `msenglish` exists
   - Make sure password is correct: `ankur`

2. **Check User Permissions:**
   - User should have **"Read and write to any database"** role
   - Or at least access to `mseducation` database

### **Step 3: Test Connection**

After whitelisting IPs, test these URLs:

**Local Development:**
```
http://localhost:3000/api/db-test
```

**Vercel Production:**
```
https://ms-education-pi.vercel.app/api/db-test
```

### **Step 4: Common Issues & Solutions**

**Issue: "Could not connect to any servers"**
- ✅ **Solution:** Whitelist your IP address in Network Access

**Issue: "Authentication failed"**
- ✅ **Solution:** Check username/password in Database Access

**Issue: "Database not found"**
- ✅ **Solution:** Database will be created automatically on first connection

**Issue: "Connection timeout"**
- ✅ **Solution:** Check if MongoDB cluster is running (not paused)

### **Step 5: Environment Variables**

Make sure these are set in Vercel:

```
MONGODB_URI=mongodb+srv://msenglish:ankur@msenglish.ugt6lgz.mongodb.net/mseducation
```

### **Step 6: Test Commands**

**Test Database Connection:**
```bash
# Local
curl http://localhost:3000/api/db-test

# Vercel
curl https://ms-education-pi.vercel.app/api/db-test
```

**Expected Success Response:**
```json
{
  "status": "success",
  "message": "Database connected successfully!",
  "timestamp": "2024-01-XX..."
}
```

**Expected Error Response:**
```json
{
  "status": "error",
  "message": "Database connection failed",
  "error": "Could not connect to any servers...",
  "timestamp": "2024-01-XX..."
}
```

## 🚨 **Important Notes**

1. **IP Whitelisting:** This is the most common cause of connection issues
2. **Wait Time:** Changes may take 1-2 minutes to take effect
3. **Cluster Status:** Make sure your cluster is not paused
4. **User Permissions:** Verify database user has correct permissions
5. **Connection String:** Double-check the URI format and credentials

## 🎯 **Quick Fix Checklist**

- [ ] Whitelist IP address in Network Access
- [ ] Verify database user exists and has correct password
- [ ] Check cluster is running (not paused)
- [ ] Test connection with `/api/db-test`
- [ ] Add environment variables to Vercel
- [ ] Redeploy application
