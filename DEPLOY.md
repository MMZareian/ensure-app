# Deploy to DigitalOcean - Complete Guide

## Prerequisites

✅ Code is on GitHub: https://github.com/MMZareian/ensure-app
✅ DigitalOcean account created
✅ GitHub connected to DigitalOcean

---

## Deployment Method 1: Using the App Platform UI (Recommended)

### Step 1: Create New App

1. Go to: **https://cloud.digitalocean.com/apps**
2. Click **"Create App"**
3. Select **"GitHub"** as source
4. Choose repository: **MMZareian/ensure-app**
5. Select branch: **main**
6. Click **"Next"**

---

### Step 2: Configure Backend Service

If components are not auto-detected, add them manually:

1. Click **"Edit Plan"** or **"Add Component"**
2. Click **"Add Resource"** → **"Web Service"**

**Backend Configuration:**
```
Name: backend
Type: Web Service
Source Directory: backend
Environment: Python
Build Command: (leave empty)
Run Command: uvicorn app.main:app --host 0.0.0.0 --port 8080
HTTP Port: 8080
Instance Size: Basic (512 MB RAM, 1 vCPU) - $5/month
Instance Count: 1
```

**Routes for Backend:**
```
Path: /api
```

---

### Step 3: Configure Frontend Static Site

1. Click **"Add Component"** → **"Static Site"**

**Frontend Configuration:**
```
Name: frontend
Type: Static Site
Source Directory: frontend
Environment: Node.js
Build Command: npm install && npm run build
Output Directory: dist
```

**Routes for Frontend:**
```
Path: / (catch-all)
```

---

### Step 4: Set Environment Variables

#### Backend Environment Variables:
Click on **backend** component → **Environment Variables** → **Add**:

```
PORT = 8080
```

#### Frontend Environment Variables:
Click on **frontend** component → **Environment Variables** → **Add**:

**IMPORTANT:** After the app is created, you'll get a URL like `https://your-app-name.ondigitalocean.app`

You need to set:
```
VITE_API_URL = https://your-app-name.ondigitalocean.app
```

**Note:** You may need to add this AFTER the first deployment when you know your app URL.

---

### Step 5: Review and Launch

1. Review the configuration:
   - Backend: $5/month
   - Frontend: FREE
   - **Total: ~$5/month**

2. Click **"Launch App"** or **"Create Resources"**

3. Wait 5-10 minutes for deployment

---

## Step 6: Post-Deployment Configuration

### A. Update Frontend API URL

Once deployed, your app will have a URL like:
```
https://ensure-safety-analytics-xxxxx.ondigitalocean.app
```

You need to update the frontend environment variable:

1. Go to your app in DigitalOcean dashboard
2. Click **"Settings"** → **"Components"** → **frontend**
3. Click **"Environment Variables"**
4. Add or update:
   ```
   VITE_API_URL = https://your-actual-app-url.ondigitalocean.app
   ```
5. Click **"Save"**
6. The app will automatically redeploy

---

### B. Verify Deployment

1. Visit your app URL: `https://your-app-name.ondigitalocean.app`
2. You should see the login page
3. Test login with:
   - **Username:** `sarah.johnson`
   - **Password:** `password123`

---

## Deployment Method 2: Using App Spec File (Advanced)

If you prefer using the YAML specification:

### Step 1: Use the Pre-configured Spec File

The repository already has `.do/app.yaml` configured.

### Step 2: Deploy via DigitalOcean UI

1. Go to: **https://cloud.digitalocean.com/apps**
2. Click **"Create App"**
3. Choose **"Use an existing spec"**
4. Upload or paste the contents of `.do/app.yaml`
5. Click **"Next"** → **"Launch"**

### Step 3: Update Environment Variables

After creation, update the `VITE_API_URL` as described in Step 6A above.

---

## Troubleshooting

### Problem: "No components detected"

**Solution:** Manually add components as described in Steps 2 and 3 above.

---

### Problem: Frontend shows "Failed to fetch" or API errors

**Solution:** Check that `VITE_API_URL` is set correctly:
1. Go to frontend component settings
2. Verify `VITE_API_URL` = your full app URL
3. Redeploy if needed

---

### Problem: Backend fails to start

**Solution:** Check build logs:
1. Go to app dashboard
2. Click **"Runtime Logs"** → **backend**
3. Look for Python errors
4. Common issues:
   - Missing dependencies (check `requirements.txt`)
   - Python version mismatch (should auto-detect Python 3.8+)

---

### Problem: Database not working

**Current Setup:** The app uses SQLite database which is included in the repository.

**For Production:** You may want to upgrade to PostgreSQL:
1. Add a **Managed Database** component in DigitalOcean
2. Create PostgreSQL database
3. Update backend database connection
4. Migrate data from SQLite to PostgreSQL

**Note:** SQLite will work fine for development/testing but PostgreSQL is recommended for production.

---

## Database Migration (Optional - For PostgreSQL)

If you want to use PostgreSQL instead of SQLite:

### Step 1: Create Managed Database

1. In DigitalOcean dashboard, go to **Databases**
2. Click **"Create Database"**
3. Choose **PostgreSQL**
4. Select region (same as your app)
5. Choose plan (Basic $15/month minimum)

### Step 2: Update Backend Code

You'll need to:
1. Update `database.py` to use PostgreSQL connection
2. Add PostgreSQL driver: `pip install psycopg2-binary`
3. Update `requirements.txt`
4. Create migration script to move data from SQLite to PostgreSQL

### Step 3: Set Database URL

Add environment variable to backend:
```
DATABASE_URL = postgresql://user:password@host:port/dbname
```

---

## Monitoring and Logs

### View Application Logs

1. Go to your app in DigitalOcean dashboard
2. Click **"Runtime Logs"**
3. Select component (backend or frontend)
4. View real-time logs

### Check Build Logs

1. Go to app dashboard
2. Click **"Deployments"**
3. Click on a deployment
4. View build logs for each component

---

## Updating the Application

### Automatic Deployment (Recommended)

The app is configured with `deploy_on_push: true`, so:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. DigitalOcean will **automatically detect and deploy** the changes
4. Wait 3-5 minutes for deployment to complete

### Manual Deployment

If you want to manually trigger a deployment:

1. Go to your app dashboard
2. Click **"Actions"** → **"Force Rebuild and Deploy"**

---

## Cost Summary

**Monthly Costs:**
- **Backend Web Service**: $5/month (Basic plan - 512MB RAM)
- **Frontend Static Site**: FREE
- **Database (Optional)**:
  - SQLite (current): FREE (included in backend)
  - PostgreSQL: $15/month minimum (if upgraded)

**Total:** $5-20/month depending on database choice

---

## Security Checklist (Before Production)

### 1. Update CORS Settings

In `backend/app/main.py`, change:
```python
allow_origins=["*"]  # Current (allows all)
```

To:
```python
allow_origins=["https://your-actual-domain.com"]  # Production
```

### 2. Change Default Passwords

Update the manager passwords in the database (currently all are `password123`)

### 3. Use Environment Variables for Secrets

Never commit passwords or API keys to GitHub. Use DigitalOcean environment variables.

### 4. Enable HTTPS

DigitalOcean automatically provides HTTPS for your app URL.

---

## Custom Domain (Optional)

To use your own domain (e.g., `analytics.yourcompany.com`):

1. Go to app **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

---

## Support

- **DigitalOcean Docs**: https://docs.digitalocean.com/products/app-platform/
- **Community**: https://www.digitalocean.com/community
- **Support**: Open a ticket in DigitalOcean dashboard

---

## Quick Reference

**Repository:** https://github.com/MMZareian/ensure-app
**DigitalOcean Apps:** https://cloud.digitalocean.com/apps
**Test Credentials:**
- Username: `sarah.johnson`
- Password: `password123`

**Default Configuration:**
- Backend: Python (FastAPI) on port 8080
- Frontend: Node.js (React + Vite) → static files
- Database: SQLite (upgradable to PostgreSQL)
- Region: NYC (New York)
