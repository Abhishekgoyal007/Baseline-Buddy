# 🚀 Vercel Deployment Guide - Frontend & Backend

Complete guide to deploy both frontend and backend on Vercel.

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free) - [Sign up here](https://vercel.com/signup)
- ✅ Google Gemini API key - [Get it here](https://makersuite.google.com/app/apikey)
- ✅ Code pushed to GitHub (already done ✅)

---

## 🎯 Part 1: Deploy Frontend (5 minutes)

### Step 1: Go to Vercel
1. Open [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Sign in with GitHub

### Step 2: Import Repository
1. Click **"Add New..."** → **"Project"**
2. Find your repository: **"Baseline-Buddy"**
3. Click **"Import"**

### Step 3: Configure Frontend
**IMPORTANT:** Configure these settings:

```
Project Name: baseline-buddy-frontend
Root Directory: frontend              ← VERY IMPORTANT!
Framework Preset: Next.js             ← Auto-detected
Build Command: npm run build          ← Auto-detected
Output Directory: .next                ← Auto-detected
Install Command: npm install           ← Auto-detected
```

### Step 4: Environment Variables
Click **"Environment Variables"** and add:

```
Name: NEXT_PUBLIC_API_URL
Value: (leave empty for now, we'll add after backend deploys)
```

### Step 5: Deploy Frontend
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. You'll get a URL like: `https://baseline-buddy-frontend.vercel.app`
4. **SAVE THIS URL!** ✅

---

## 🎯 Part 2: Deploy Backend (5 minutes)

### Step 1: Create New Project
1. Go back to Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. Select **"Baseline-Buddy"** repository again
4. Click **"Import"**

### Step 2: Configure Backend
**IMPORTANT:** Configure these settings:

```
Project Name: baseline-buddy-backend
Root Directory: backend               ← VERY IMPORTANT!
Framework Preset: Other               ← Select "Other"
Build Command: (leave empty)
Output Directory: (leave empty)
Install Command: npm install
```

### Step 3: Add vercel.json to Backend

Before deploying, we need to create `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ]
}
```

### Step 4: Environment Variables
Add these environment variables:

```
Name: GOOGLE_API_KEY
Value: your_google_gemini_api_key_here

Name: FRONTEND_URL
Value: https://baseline-buddy-frontend.vercel.app  (your frontend URL from Part 1)

Name: NODE_ENV
Value: production
```

### Step 5: Deploy Backend
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://baseline-buddy-backend.vercel.app`
4. **SAVE THIS URL!** ✅

---

## 🔄 Part 3: Connect Frontend & Backend

### Update Frontend Environment Variable

1. Go to your **frontend project** in Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Edit `NEXT_PUBLIC_API_URL`:
   ```
   Value: https://baseline-buddy-backend.vercel.app  (your backend URL)
   ```
4. Click **"Deployments"** tab
5. Click **"..."** on latest deployment → **"Redeploy"**

### Update Backend CORS

1. Go to your **backend project** in Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Update `FRONTEND_URL` if needed:
   ```
   Value: https://baseline-buddy-frontend.vercel.app  (your actual frontend URL)
   ```
4. Redeploy if you made changes

---

## ✅ Part 4: Test Your Deployment

### Test Backend
1. Open: `https://baseline-buddy-backend.vercel.app`
2. Should see: **"Baseline Buddy Backend is running!"**
3. ✅ If you see this, backend is working!

### Test Frontend
1. Open: `https://baseline-buddy-frontend.vercel.app`
2. Try searching for a feature (e.g., "fetch")
3. Click **"Check Feature"**
4. Should see results!
5. ✅ If you see results, everything is working!

### Check Browser Console
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Should be **NO CORS errors**
4. ✅ If no errors, perfect!

---

## 📝 Summary of URLs

After deployment, you'll have:

```
Frontend: https://baseline-buddy-frontend.vercel.app
Backend:  https://baseline-buddy-backend.vercel.app
```

**Save these URLs!**

---

## 🔧 Troubleshooting

### Backend shows 404 error
- Check `vercel.json` exists in backend folder
- Verify root directory is set to `backend`
- Check deployment logs for errors

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS: Make sure `FRONTEND_URL` in backend matches your frontend URL
- Redeploy frontend after changing env vars

### "Module not found" errors
- Check all dependencies are in `package.json`
- Verify `node_modules` is in `.gitignore`
- Try redeploying

---

## 🎉 Success Checklist

- [ ] Frontend deployed successfully
- [ ] Backend deployed successfully
- [ ] Frontend URL saved
- [ ] Backend URL saved
- [ ] `NEXT_PUBLIC_API_URL` set in frontend
- [ ] `GOOGLE_API_KEY` set in backend
- [ ] `FRONTEND_URL` set in backend
- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] Feature search works
- [ ] No CORS errors in console

---

## 🚀 Next Steps

### Custom Domains (Optional)
1. Go to project **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration steps

### Auto-Deploy
Already enabled! Every push to GitHub will auto-deploy both projects.

---

## 💡 Pro Tips

1. **Same Platform** - Easy to manage both projects
2. **Environment Variables** - Can copy between projects
3. **Deployment Logs** - Check logs if something fails
4. **Preview Deployments** - Every branch gets a preview URL
5. **Rollback** - Easy to rollback to previous deployments

---

**Need help? Check deployment logs in Vercel dashboard!**

*Last updated: October 2025*
