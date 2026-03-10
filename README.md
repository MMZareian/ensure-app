# Ensure Safety Analytics Dashboard

A full-stack web application for analyzing safety training data in offshore/industrial environments.

## 🏗️ Architecture

**Backend:** FastAPI + Python + SQLite
**Frontend:** React + TypeScript + Vite
**Deployment Target:** DigitalOcean App Platform

## 📁 Project Structure

```
ensure-app/
├── backend/          # FastAPI application
│   ├── app/
│   │   ├── main.py           # FastAPI entry point
│   │   ├── database.py       # SQLite connection
│   │   ├── models.py         # Pydantic models
│   │   ├── routers/          # API endpoints
│   │   │   ├── projects.py
│   │   │   ├── scenarios.py
│   │   │   ├── comparison.py
│   │   │   └── workers.py
│   │   └── services/         # Business logic
│   │       ├── analytics.py  # Calculations
│   │       └── queries.py    # Database queries
│   ├── requirements.txt
│   └── README.md
│
├── frontend/         # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── tabs/             # Main tab views
│   │   ├── api/              # API client
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx           # Main app
│   │   └── styles.css        # Global styles
│   ├── package.json
│   └── index.html
│
├── data/             # SQLite database
│   └── ensure_mock.sqlite
│
└── README.md (this file)
```

## 🚀 Getting Started

### Prerequisites
- Python 3.11+ (installed ✅)
- Node.js 24.x LTS (installed ✅)
- npm 11.x (installed ✅)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: http://localhost:3000

## 📊 Features

### ✅ Implemented
- **Overview Tab**
  - Project selector
  - KPI cards (scenarios, workers, accuracy metrics)
  - RAG status banner
  - Energy Wheel visualization (3 modes: Identification, High Energy, Direct Control)

- **Scenarios Tab**
  - List all scenarios for selected project
  - Visual energy type breakdown
  - Average worker scores
  - Weak/strong energy types highlighted

- **Workers Tab**
  - Worker summary table
  - Average scores across all scenarios
  - Identification, High Energy, and Direct Control metrics

- **Comparison Tab** (Placeholder - ready for expansion)

### 🔄 API Endpoints

```
GET  /api/projects                             # List all projects
GET  /api/projects/{id}/overview               # Project overview data
GET  /api/projects/{id}/scenarios              # Project scenarios
GET  /api/scenarios/{id}                       # Scenario detail
GET  /api/scenarios/compare?scenario_a=&scenario_b= # Compare scenarios
GET  /api/comparison/projects?project_ids=...  # Comparison radar data
GET  /api/comparison/table?project_ids=...     # Comparison table data
GET  /api/workers/summary?project_id=&scenario_id= # Worker summary
GET  /api/workers/trends?project_id=           # Worker trends
GET  /api/industry/benchmark                   # Industry benchmark
```

## 🎨 Design

- **Fonts:** DM Sans (body), Playfair Display (headings)
- **Color Scheme:** Clean blue/gray with energy-type specific colors
- **Responsive:** Mobile-friendly design
- **Charts:** Canvas-based Energy Wheel, Chart.js ready for expansion

## 📊 Data Model

### Energy Types (10)
- Gravity, Motion, Pressure, Electrical, Mechanical
- Sound, Biological, Chemical, Radiation, Temperature

### Projects (5)
- Project A (North Sea)
- Project B (Baltic)
- Project C (Arctic)
- Project D (Gulf)
- Project E (Caspian)

### Metrics Tracked
- **Identification Score:** % correctly identified hazards
- **High Energy Score:** % correctly classified as high/low energy
- **Direct Control Score:** % correctly classified as directly controllable

### RAG Thresholds
- 🟢 Green (On Track): ≥75%
- 🟡 Amber (Needs Attention): 60-74%
- 🔴 Red (Action Required): <60%

## 🔧 Development

### Run Backend in Development Mode
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Run Frontend in Development Mode
```bash
cd frontend
npm run dev
```

### Build Frontend for Production
```bash
cd frontend
npm run build
```

## 📦 Deployment (Future)

### DigitalOcean App Platform

1. Push code to GitHub repository
2. Connect GitHub to DigitalOcean App Platform
3. Configure build settings:
   - Backend: Python app, runs `uvicorn app.main:app`
   - Frontend: Static site, builds with `npm run build`
   - Database: Postgres (replace SQLite in production)

## 🐛 Known Issues / Future Enhancements

- [ ] Scenario detail view (click on scenario to see full data)
- [ ] Scenario comparison with charts
- [ ] Full Comparison tab with radar charts
- [ ] Worker trend charts over time
- [ ] Export functionality (CSV, PDF)
- [ ] User authentication
- [ ] Real-time data updates
- [ ] Switch from SQLite to PostgreSQL for production

## 👥 Contributors

Built with Claude Code (Anthropic) - March 2026

## 📝 Notes

This application was built from a prototype and uses mock data.
The data structure and calculations match the original prototype exactly.
Ready for real data integration when available.

---

**Last Updated:** March 9, 2026
**Status:** ✅ Fully functional MVP with mock data
