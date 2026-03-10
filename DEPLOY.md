# Deploy to DigitalOcean - Simple Guide

## Step 1: Push to GitHub

Your code is already set up! Just push the latest changes:

```bash
cd "C:\Users\mahdi\PycharmProjects\DigitalOcean\ensure-app"
git add .
git commit -m "Ready for DigitalOcean deployment"
git push origin main
```

## Step 2: Deploy on DigitalOcean

### Method 1: Import App Spec (Easiest)

1. Go to https://cloud.digitalocean.com/apps
2. Click **"Create App"**
3. Select **GitHub** and choose your repo: `MMZareian/ensure-app`
4. Click **"Next"**
5. When you see the error, click **"Edit App Spec"**
6. Copy and paste this:

```yaml
name: ensure-safety-analytics
region: nyc

services:
  - name: backend
    environment_slug: python
    github:
      branch: main
      deploy_on_push: true
      repo: MMZareian/ensure-app
    source_dir: /backend
    run_command: uvicorn app.main:app --host 0.0.0.0 --port 8080
    http_port: 8080
    instance_count: 1
    instance_size_slug: basic-xxs
    routes:
      - path: /api

  - name: frontend
    environment_slug: node-js
    github:
      branch: main
      deploy_on_push: true
      repo: MMZareian/ensure-app
    source_dir: /frontend
    build_command: npm install && npm run build
    output_dir: dist
    routes:
      - path: /
```

7. Click **"Save"**
8. Click **"Next"** → Choose **Basic plan ($5/month)**
9. Click **"Launch App"**

Done! Your app will be live in 5 minutes.

---

### Method 2: Manual Setup

If you don't see "Edit App Spec":

1. After connecting GitHub, click **"Add Component Manually"**

2. **Add Backend:**
   - Click **"+ Web Service"**
   - Name: `backend`
   - Source Directory: `backend`
   - Run Command: `uvicorn app.main:app --host 0.0.0.0 --port 8080`
   - HTTP Port: `8080`

3. **Add Frontend:**
   - Click **"+ Static Site"**
   - Name: `frontend`
   - Source Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`

4. Click **"Next"** and deploy

---

## Your App URL

After deployment, you'll get a URL like:
```
https://ensure-safety-analytics-xxxxx.ondigitalocean.app
```

## Cost

- Backend: $5/month
- Frontend: Free
- **Total: $5/month**

## Need Help?

If deployment fails, check the build logs in DigitalOcean dashboard.
