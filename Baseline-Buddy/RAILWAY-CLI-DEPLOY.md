# 🚂 Railway CLI Deployment Guide

If Railway can't find your GitHub repository, you can deploy directly using Railway CLI.

## Step 1: Install Railway CLI

```powershell
# Using npm (recommended)
npm install -g @railway/cli

# Verify installation
railway --version
```

## Step 2: Login to Railway

```powershell
railway login
```

This will open a browser window for authentication.

## Step 3: Deploy Backend

```powershell
# Navigate to backend directory
cd backend

# Initialize Railway project
railway init

# Add environment variables
railway variables set GOOGLE_API_KEY=your_gemini_api_key_here
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://your-vercel-app.vercel.app

# Deploy!
railway up
```

After deployment, Railway will give you a URL like:
`https://your-app.up.railway.app`

## Step 4: Get Your Backend URL

```powershell
# Get your deployment URL
railway status
```

Copy the domain URL - you'll need it for Vercel!

---

## Alternative: Push to GitHub First, Then Deploy

If you haven't pushed your code to GitHub yet:

```powershell
# Navigate to project root
cd C:\Users\Abhishek\Desktop\baseline-buddy-copy\Baseline-Buddy

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/Abhishekgoyal007/Baseline-Buddy.git

# Push to GitHub
git push -u origin main
```

Then go back to Railway and refresh - your repo should appear!

---

## Troubleshooting

### Railway doesn't show my repo
- Make sure the repository exists on GitHub
- Check Railway's GitHub connection in Account Settings
- Try searching for the exact repository name
- Ensure Railway has access to the organization/account

### Can't find Railway CLI commands
- Restart your terminal after installing Railway CLI
- Check installation: `railway --version`
- Try: `npx @railway/cli` instead

---

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] GitHub connected to Railway
- [ ] Repository appears in Railway
- [ ] Ready to deploy!

---

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.
