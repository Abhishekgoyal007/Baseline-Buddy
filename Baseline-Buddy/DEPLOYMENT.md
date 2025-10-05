# Baseline Buddy - Deployment Guide

This guide will help you deploy **Baseline Buddy** with the frontend on **Vercel** and the backend on **Railway**.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier works)
- Railway account (free tier works)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Firebase project (optional, if using Firebase features)

---

## 🚀 Backend Deployment (Railway)

### Step 1: Prepare Your Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Make sure all dependencies are listed in `package.json` (already done)

### Step 2: Deploy to Railway

1. Go to [Railway.app](https://railway.app) and sign in

2. Click **"New Project"** → **"Deploy from GitHub repo"**

3. Select your repository and choose the backend folder (or root if monorepo)

4. Railway will auto-detect Node.js and deploy

### Step 3: Configure Environment Variables

In Railway dashboard, go to your project → **Variables** tab and add:

```env
GOOGLE_API_KEY=your_google_gemini_api_key_here
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### Step 4: Get Your Backend URL

After deployment, Railway will provide a URL like:
```
https://your-app-name.up.railway.app
```

**Save this URL** - you'll need it for the frontend!

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Your Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Create a `.env.local` file for local testing (don't commit this):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

### Step 2: Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com) and sign in

2. Click **"Add New Project"** → **"Import Git Repository"**

3. Select your repository

4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (if monorepo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Click **"Deploy"**

### Step 3: Configure Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```env
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.up.railway.app
```

If using Firebase, also add:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 4: Redeploy

After adding environment variables, trigger a new deployment:
- Go to **Deployments** tab
- Click the **three dots** on the latest deployment
- Click **"Redeploy"**

---

## 🔄 Update CORS in Backend

After getting your Vercel URL:

1. Go back to Railway dashboard
2. Update the `FRONTEND_URL` environment variable with your Vercel URL:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
3. Railway will automatically redeploy

---

## ✅ Verify Deployment

### Test Backend:
Visit: `https://your-railway-url.up.railway.app`

You should see: "Baseline Buddy Backend is running!"

### Test Frontend:
Visit: `https://your-vercel-app.vercel.app`

Try checking a feature like "fetch" or ":has"

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- Check Railway logs for errors
- Verify `GOOGLE_API_KEY` is set correctly
- Make sure `package.json` has `"start": "node ./src/index.js"`

**Problem**: CORS errors
- Verify `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Make sure it includes `https://` and no trailing slash

### Frontend Issues

**Problem**: API calls failing
- Check browser console for errors
- Verify `NEXT_PUBLIC_API_URL` in Vercel settings
- Make sure backend URL is correct and accessible

**Problem**: Build fails
- Check Vercel build logs
- Verify all dependencies are in `package.json`
- Try building locally first: `npm run build`

---

## 📝 Local Development

### Backend
```bash
cd backend
npm install
# Create .env file with GOOGLE_API_KEY
npm run dev
```

Backend runs on: http://localhost:5000

### Frontend
```bash
cd frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

Frontend runs on: http://localhost:3000

---

## 🔐 Security Notes

1. **Never commit `.env` files** to Git
2. Keep `.env.example` files updated as templates
3. Rotate API keys regularly
4. Use environment variables for all sensitive data
5. Enable Vercel's password protection for preview deployments (optional)

---

## 📊 Monitoring

### Railway
- Check logs: Dashboard → Deployments → View Logs
- Monitor metrics: Dashboard → Metrics
- Set up alerts: Dashboard → Settings → Notifications

### Vercel
- Check logs: Dashboard → Deployments → View Function Logs
- Monitor analytics: Dashboard → Analytics
- Check usage: Dashboard → Settings → Usage

---

## 🎉 Success!

Your Baseline Buddy app should now be live:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.up.railway.app`

Share it with the world! 🌍

---

## 💡 Next Steps

- [ ] Set up custom domain on Vercel
- [ ] Configure Railway for better performance
- [ ] Set up CI/CD for automatic deployments
- [ ] Add monitoring and error tracking (e.g., Sentry)
- [ ] Enable rate limiting on backend
- [ ] Add caching for better performance

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

Need help? Check the logs first, then refer to the troubleshooting section!
