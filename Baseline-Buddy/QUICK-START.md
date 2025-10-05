# 🎯 Baseline Buddy - Quick Deployment Checklist

## ✅ Deployment Checklist

### Backend (Railway)
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Deploy backend
- [ ] Add environment variables:
  - `GOOGLE_API_KEY`
  - `FRONTEND_URL`
  - `NODE_ENV=production`
- [ ] Copy Railway URL (e.g., `https://your-app.up.railway.app`)
- [ ] Test backend: Visit Railway URL, should see "Baseline Buddy Backend is running!"

### Frontend (Vercel)
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Deploy frontend (select `frontend` folder as root directory)
- [ ] Add environment variable:
  - `NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app`
- [ ] Add Firebase env vars (if using Firebase)
- [ ] Redeploy after adding env vars
- [ ] Copy Vercel URL

### Final Steps
- [ ] Update `FRONTEND_URL` in Railway with your Vercel URL
- [ ] Test the full app: Try checking "fetch" or ":has" feature
- [ ] Check browser console for errors
- [ ] Done! 🎉

## 🔗 Important Files

- **Backend Environment**: `backend/.env.example`
- **Frontend Environment**: `frontend/.env.example`
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🚨 Common Issues

**CORS Error**: Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly

**API Error**: Check that `NEXT_PUBLIC_API_URL` in Vercel has your Railway backend URL

**Build Error**: Ensure all dependencies are in package.json and committed

## 📚 Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step guide.

---

**Quick Deploy Commands:**

```bash
# Backend (already configured for Railway)
cd backend
npm install
npm start

# Frontend (already configured for Vercel)
cd frontend
npm install
npm run build
```

Both platforms will handle the rest automatically! 🚀
