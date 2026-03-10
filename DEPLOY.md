# Deploy to DigitalOcean - Updated Guide

## Step 1: Push to GitHub (Already Done ✅)

Your code is already on GitHub at: https://github.com/MMZareian/ensure-app

---

## Step 2: Deploy on DigitalOcean

### Go to DigitalOcean App Platform

1. Visit: https://cloud.digitalocean.com/apps
2. Click **"Create App"**
3. Select **"GitHub"**
4. Choose repository: **MMZareian/ensure-app**
5. Branch: **main**
6. Click **"Next"**

### Configure Resources (Manual Setup)

Since you see "No components detected" error, you need to add components manually:

#### In the "Source Directory" box, enter: `frontend`
Then click **"Next"** or **"Detect from source code"**

This will detect the frontend. Now you need to add backend:

1. Click **"Add Resource"** or **"Add Component"**
2. Select **"Web Service"** (for backend)

**Backend Configuration:**
- **Name**: `backend`
- **Source Directory**: `backend`
- **Build Command**: Leave empty
- **Run Command**: `uvicorn app.main:app --host 0.0.0.0 --port 8080`
- **HTTP Port**: `8080`

3. Your frontend should already be detected as a **Static Site**

**Frontend Configuration (verify these):**
- **Name**: `frontend`
- **Source Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `dist`

### Review Routes

Make sure:
- Backend routes: `/api`
- Frontend routes: `/` (catchall)

### Choose Plan
- Backend: **Basic ($5/month)** or **Free trial if available**
- Frontend: **Free** (static sites are free)

### Launch

Click **"Launch App"** or **"Create Resources"**

---

## Step 3: Wait for Deployment

Build takes 3-5 minutes. You'll see:
1. Building backend...
2. Building frontend...
3. Deploying...
4. ✅ Live!

---

## Your App URL

After successful deployment:
```
https://ensure-safety-analytics-xxxxx.ondigitalocean.app
```

or similar URL based on your app name.

---

## If Deployment Still Fails

### Option 1: Try entering source directory during setup
In the initial "Source Directory" field, try: `frontend`

### Option 2: Contact DigitalOcean
Their interface might need GitHub permissions refresh.

### Option 3: Use doctl CLI (Advanced)

Install DigitalOcean CLI and run:
```bash
doctl apps create --spec .do/app.yaml
```

---

## Cost Summary

- **Backend**: $5/month (Basic plan)
- **Frontend**: FREE (static hosting)
- **Total**: ~$5/month

---

## Need Help?

Check build logs in DigitalOcean dashboard under your app → "Runtime Logs"
