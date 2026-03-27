# Bridge Safety Analytics Platform

A professional full-stack web application for safety training analytics with **multi-company authentication** and comprehensive data visualization.

## 🎯 Overview

**Bridge** helps safety managers track and analyze worker training performance across multiple projects and scenarios. Features include:

- 🔐 **Multi-Company Authentication** - Secure login for managers
- 📊 **Project Dashboards** - KPIs, energy wheels, and performance metrics
- 📈 **Scenario Analysis** - Track training scenarios and worker performance
- 🔍 **Cross-Company Comparison** - Benchmark against other projects
- 👥 **Worker Trends** - Individual performance tracking over time

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Backend** | FastAPI (Python 3.11) |
| **Database** | SQLite (dev) → PostgreSQL (production) |
| **Charts** | Chart.js + react-chartjs-2 |
| **Deployment** | DigitalOcean App Platform |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 24.14.0 LTS
- Git

### 1. Navigate to Repository
```bash
cd C:\Users\mahdi\PycharmProjects\DigitalOcean\ensure-app
```

### 2. Start Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: **http://localhost:8000**

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

### 4. Login
Open http://localhost:3000 and use any of these credentials:

| Username | Password | Company | Projects |
|----------|----------|---------|----------|
| `sarah.johnson` | `password123` | Apex Construction Ltd | 2 projects |
| `emma.davis` | `password123` | TechBuild Solutions | 2 projects |
| `lisa.martinez` | `password123` | SafeWorks Industrial | 1 project |

---

## 📁 Project Structure

```
ensure-app/
├── backend/                      # FastAPI application
│   ├── app/
│   │   ├── main.py              # App entry point
│   │   ├── database.py          # Database connection
│   │   ├── models.py            # Pydantic models
│   │   ├── routers/             # API endpoints
│   │   │   ├── auth.py          # Authentication ✨ NEW
│   │   │   ├── projects.py      # Project APIs
│   │   │   ├── scenarios.py     # Scenario APIs
│   │   │   ├── comparison.py    # Comparison APIs
│   │   │   └── workers.py       # Worker APIs
│   │   └── services/
│   │       ├── analytics.py     # Score calculations
│   │       └── queries.py       # Database queries
│   ├── data/
│   │   └── ensure_mock.sqlite   # SQLite database
│   └── requirements.txt
│
├── frontend/                     # React application
│   ├── src/
│   │   ├── pages/
│   │   │   └── LoginPage.tsx    # Login interface ✨ NEW
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  # Auth state ✨ NEW
│   │   ├── components/
│   │   │   ├── Topbar.tsx       # Navigation + user info ✨ NEW
│   │   │   ├── EnergyWheel.tsx  # Custom chart
│   │   │   ├── Pill.tsx         # Score badges
│   │   │   └── RagBanner.tsx    # RAG indicators
│   │   ├── tabs/
│   │   │   ├── OverviewTab.tsx  # Project dashboard
│   │   │   ├── ScenariosTab.tsx # Scenario browser
│   │   │   ├── ComparisonTab.tsx # Multi-project comparison
│   │   │   └── WorkersTab.tsx   # Worker trends
│   │   ├── api/
│   │   │   └── client.ts        # API wrapper
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript types
│   │   ├── App.tsx              # Main component
│   │   └── styles.css           # Global styles
│   └── package.json
│
├── data/
│   ├── ensure_mock.sqlite       # Database (with auth data)
│   └── rebuild_database.py      # Database regeneration script
│
└── public/                      # Static assets (logos)
    ├── Web_Logo.png
    ├── SafeWheel_Logo.png
    ├── Crane_Logo.png           # Overhead Crane Simulator
    └── InDevelopment_Logo.png
```

---

## 🔐 Authentication System

### Database Schema
```
companies
├── company_id (PK)
├── company_name
├── industry
└── created_at

managers (users)
├── manager_id (PK)
├── company_id (FK)
├── username (unique)
├── password
├── full_name
├── email
├── role (admin/manager)
└── last_login

projects
├── id (PK)
├── company_id (FK) ✨ NEW
├── name
├── region
└── ...
```

### Access Control

**Company-Filtered Tabs:**
- **Overview** - Only shows company's projects
- **Scenarios** - Only company's scenarios
- **Workers** - Only company's workers

**Cross-Company Tab:**
- **Comparison** - Shows ALL projects for benchmarking

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me?token={token}` - Get current user info

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects?company_id={id}` - Filter by company ✨ NEW
- `GET /api/projects/{id}/overview` - Project dashboard data
- `GET /api/projects/{id}/scenarios` - Project scenarios

### Scenarios
- `GET /api/scenarios/{id}` - Scenario details

### Comparison
- `GET /api/comparison/projects` - Radar chart data
- `GET /api/comparison/table` - Comparison table data

### Workers
- `GET /api/workers/summary` - Worker summary stats
- `GET /api/workers/trends` - Worker performance trends

---

## 📊 Features

### 1. Project Overview Tab
- **KPI Cards**: Scenarios completed, high-energy accuracy, control accuracy
- **RAG Score**: Red/Amber/Green safety classification
- **Energy Wheel**: Custom circular chart showing 10 energy types
- **Mode Toggle**: View identification, high energy, or direct control scores

### 2. Scenarios Tab
- Browse all scenarios for selected project
- View scenario details with worker-level data
- Expandable cards with hazard responses

### 3. Comparison Tab
- **Radar Charts**: Compare multiple projects simultaneously
- **Project Toggles**: Select up to 5 projects + industry benchmark
- **Full Breakdown Table**: All metrics across all projects
- **Cross-Company**: Shows ALL projects regardless of user's company ✨

### 4. Workers Tab
- **Summary Table**: Average scores per worker
- **Expandable Cards**: Click to see performance trends
- **Trend Charts**: Line charts showing improvement over scenarios
- **Project/Scenario Filters**: Filter by project or specific scenario

---

## 🗂️ Documentation Files

| File | Purpose | Status |
|------|---------|--------|
| `README.md` | Main project documentation | ✅ **YOU ARE HERE** |
| `AUTHENTICATION_UPDATE.md` | Authentication implementation details | ✅ Current |
| `RUN_LOCAL.md` | Local development guide | ✅ Current |
| `DEPLOY.md` | DigitalOcean deployment guide | ✅ Current |
| `ensure_change_log_for_claude.md` | Detailed deployment change log | ✅ Current |

---

## 🚢 Deployment to DigitalOcean

See **[DEPLOY.md](DEPLOY.md)** for detailed deployment instructions.

**Quick Summary:**
1. Push to GitHub
2. Go to https://cloud.digitalocean.com/apps
3. Connect GitHub repo `MMZareian/ensure-app`
4. Import app spec from `.do/app.yaml`
5. Deploy!

**Cost:** ~$5/month (backend $5 + frontend free)

---

## 🔧 Development

### Regenerate Database
```bash
cd data
python rebuild_database.py
```

This recreates the database with:
- 3 companies
- 5 manager accounts
- 5 projects linked to companies
- All original scenarios and workers

### Add New Manager
```python
# In data/rebuild_database.py, add to managers list:
('m6', 'c1', 'new.user', 'password123', 'New User', 'new@email.com', 'manager'),
```

Then run `python rebuild_database.py`

### Backend Development
```bash
cd backend
python -m uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm run dev
```

---

## 📈 Data Model

### Core Entities
- **Companies** (3) → **Managers** (5 users)
- **Companies** (3) → **Projects** (5)
- **Projects** → **Scenarios** (8 total)
- **Scenarios** → **Workers** (~100 sessions)
- **Workers** → **Hazard Responses** (~1000 responses)

### Energy Types (10)
Gravity, Motion, Pressure, Electrical, Mechanical, Sound, Biological, Chemical, Radiation, Temperature

### Metrics (3 per energy type)
1. **Identification Score** - % correctly identified
2. **High Energy Accuracy** - % correctly marked as high energy
3. **Direct Control Accuracy** - % correctly marked as direct control

---

## 🧪 Testing

### Test Accounts
Use the 3 test accounts to verify company filtering:
1. Login as `sarah.johnson` → See only Apex projects (p1, p2)
2. Login as `emma.davis` → See only TechBuild projects (p3, p4)
3. Login as `lisa.martinez` → See only SafeWorks project (p5)

### Test Comparison Tab
- All 3 users should see ALL 5 projects in Comparison tab
- Verify industry benchmark toggle works

### Test Logout
- Click avatar in top-right → Logs out
- Refresh page → Should redirect to login

---

## 🤝 Contributing

This is a private project for Mahdi Zareian.

---

## 📝 License

Proprietary - All rights reserved

---

## 📞 Support

For issues or questions, contact: mahdi@example.com

---

**Last Updated:** 2026-03-26
**Version:** 2.1.0 (Bridge rebranding + enhanced analytics)
