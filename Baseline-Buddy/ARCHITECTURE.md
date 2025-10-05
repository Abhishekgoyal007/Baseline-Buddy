# 🏗️ Baseline Buddy - Deployment Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                │
│                      (Browser)                              │
└─────────────────┬───────────────────────────┬───────────────┘
                  │                           │
                  │                           │
                  ▼                           ▼
         ┌────────────────┐         ┌────────────────┐
         │    VERCEL      │         │   RAILWAY      │
         │   (Frontend)   │────────▶│   (Backend)    │
         └────────────────┘         └────────────────┘
         │                           │
         │  - Next.js 15             │  - Express.js
         │  - React                  │  - Node.js
         │  - Tailwind CSS           │  - web-features
         │  - Monaco Editor          │  - Google Gemini AI
         │                           │
         │  Env Variables:           │  Env Variables:
         │  - NEXT_PUBLIC_API_URL    │  - GOOGLE_API_KEY
         │  - NEXT_PUBLIC_FIREBASE_* │  - FRONTEND_URL
         │                           │  - NODE_ENV
         └───────────────────────────┴────────────────┘
```

## Data Flow

```
1. User Input
   │
   ▼
2. Frontend (Vercel)
   │ - React component receives input
   │ - Validates feature name
   │ - Sends POST request to backend
   │
   ▼
3. Backend (Railway)
   │ - Receives request
   │ - Checks CORS
   │ - Queries web-features library
   │ - Calls Google Gemini AI
   │ - Returns JSON response
   │
   ▼
4. Frontend (Vercel)
   │ - Receives response
   │ - Renders results
   │ - Displays browser compatibility
   │
   ▼
5. User sees results
```

## API Endpoints

### Frontend → Backend Communication

```
POST /check-feature
├── Request: { "feature": "fetch" }
└── Response: {
      "feature": "fetch",
      "baselineSafe": true,
      "browsers": ["chrome", "firefox", "safari", "edge"],
      "aiExplanation": "..."
    }

POST /analyze-code
├── Request: { "code": "...", "language": "javascript" }
└── Response: {
      "safe": [...],
      "caution": [...],
      "unsafe": [...],
      "explanations": {...},
      "alternatives": {...}
    }
```

## Environment Configuration

### Development (Local)

```
Frontend (localhost:3000)
    ↓
Backend (localhost:5000)
    ↓
Google Gemini API
```

### Production (Deployed)

```
Frontend (your-app.vercel.app)
    ↓
Backend (your-app.up.railway.app)
    ↓
Google Gemini API
```

## Security Layer

```
┌─────────────────────────────────────────┐
│            SECURITY                     │
├─────────────────────────────────────────┤
│ Frontend (Vercel):                      │
│ ✓ Environment variables in Vercel      │
│ ✓ HTTPS by default                     │
│ ✓ Firebase auth (optional)             │
│                                         │
│ Backend (Railway):                      │
│ ✓ CORS configured for specific origin  │
│ ✓ Environment variables encrypted      │
│ ✓ HTTPS by default                     │
│ ✓ Rate limiting (recommended)          │
│                                         │
│ API Keys:                               │
│ ✓ Never in code                        │
│ ✓ Only in environment variables        │
│ ✓ Different keys per environment       │
└─────────────────────────────────────────┘
```

## Deployment Flow

### 1. Code Push
```
Developer
    │
    ├── git push origin main
    │
    ├─────────────────┬──────────────────┐
    │                 │                  │
    ▼                 ▼                  ▼
GitHub           Vercel              Railway
    │                 │                  │
    │          Auto-detects         Auto-detects
    │          Next.js             Node.js
    │                 │                  │
    │          Builds frontend     Installs deps
    │                 │                  │
    │          Deploys to CDN      Starts server
    │                 │                  │
    ▼                 ▼                  ▼
Live Code      Live Frontend       Live Backend
```

### 2. Environment Variables
```
Vercel Dashboard               Railway Dashboard
    │                              │
    ├─ NEXT_PUBLIC_API_URL         ├─ GOOGLE_API_KEY
    ├─ NEXT_PUBLIC_FIREBASE_*      ├─ FRONTEND_URL
    │                              ├─ NODE_ENV
    │                              │
    ▼                              ▼
Applied to                    Applied to
Frontend                      Backend
```

## Scaling Considerations

```
┌─────────────────────────────────────────────┐
│         VERCEL (Frontend)                   │
├─────────────────────────────────────────────┤
│ • Global CDN                                │
│ • Auto-scaling                              │
│ • Edge functions                            │
│ • Analytics built-in                        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         RAILWAY (Backend)                   │
├─────────────────────────────────────────────┤
│ • Vertical scaling (upgrade plan)           │
│ • Auto-restart on failure                   │
│ • Monitoring & logs                         │
│ • Can add Redis cache                       │
│ • Can add rate limiting                     │
└─────────────────────────────────────────────┘
```

## Cost Structure (Free Tier)

```
Vercel Free:
├─ 100 GB bandwidth/month
├─ 6000 build minutes/month
├─ Unlimited deployments
└─ Suitable for: Small to medium traffic

Railway Free:
├─ $5 credit/month
├─ ~500 hours uptime
├─ 1 GB RAM, 1 vCPU
└─ Suitable for: Development & small apps
```

## Monitoring & Debugging

```
Frontend Issues:
├─ Vercel Dashboard → Deployments → Logs
├─ Browser DevTools → Console
└─ Vercel Analytics

Backend Issues:
├─ Railway Dashboard → Deployments → Logs
├─ Railway Dashboard → Metrics
└─ Check API endpoints directly

Common Checks:
├─ Backend health: curl https://your-backend-url/
├─ CORS: Check browser console
├─ Env vars: Verify in respective dashboards
└─ Build logs: Check deployment logs
```

## Backup & Disaster Recovery

```
Code:
├─ Git repository (GitHub)
└─ Multiple branches for safety

Configuration:
├─ .env.example files in repo
└─ Document all env vars

Deployment:
├─ Both platforms have rollback features
└─ Keep previous deployments available
```

## Performance Optimization

```
Frontend:
├─ Next.js automatic code splitting
├─ Image optimization (Next.js Image)
├─ Static generation where possible
└─ CDN distribution (Vercel)

Backend:
├─ Response caching (add if needed)
├─ Database connection pooling (if adding DB)
├─ Compress responses
└─ Rate limiting for API protection
```

## Future Enhancements

```
Potential Additions:
├─ Database (PostgreSQL on Railway)
├─ Redis cache for API responses
├─ Background jobs (Railway Cron)
├─ Email notifications
├─ User authentication (Firebase)
├─ Analytics dashboard
└─ API rate limiting
```

---

## Quick Reference

**Frontend URL Pattern**: `https://your-project-name.vercel.app`
**Backend URL Pattern**: `https://your-project-name.up.railway.app`

**Frontend Deploy**: Push to GitHub → Auto-deploy
**Backend Deploy**: Push to GitHub → Auto-deploy

**Need Help?**: Check DEPLOYMENT.md for detailed troubleshooting

---

Last updated: October 5, 2025
