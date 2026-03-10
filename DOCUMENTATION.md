# Ensure Safety Analytics - Complete Documentation

## 📖 Table of Contents
1. [What Is This Application?](#what-is-this-application)
2. [How Does It Work?](#how-does-it-work)
3. [Architecture Explained Simply](#architecture-explained-simply)
4. [Features Overview](#features-overview)
5. [Technical Details](#technical-details)
6. [File Structure Explained](#file-structure-explained)

---

## What Is This Application?

### Purpose
**Ensure Safety Analytics** is a web-based dashboard that helps safety managers monitor and analyze worker performance in hazard identification training.

### Real-World Scenario
Imagine you're a safety manager at an offshore oil platform. Your workers go through VR training simulations where they identify different types of energy hazards (electrical, mechanical, chemical, etc.). This dashboard shows you:
- How well workers identify hazards
- Which energy types are most difficult
- How different projects compare
- Individual worker progress over time

### Key Concept
Workers complete **scenarios** (like "Subsea Pipeline Inspection" or "Deck Crane Operation"). For each scenario, they identify 10 types of energy hazards and classify them. The system calculates scores and shows visual analytics.

---

## How Does It Work?

### The Simple Explanation

```
User's Browser (Frontend)
        ↓
    [Shows beautiful dashboard with charts]
        ↓
    [Asks for data: "Show me Project A overview"]
        ↓
FastAPI Backend (Your Computer)
        ↓
    [Processes request and calculates scores]
        ↓
SQLite Database (Your Computer)
        ↓
    [Retrieves worker responses and scenario data]
        ↓
Backend sends data back to Frontend
        ↓
Frontend displays charts and tables
```

### The Technical Flow

1. **You open your browser** → Go to http://localhost:3000
2. **React app loads** → Shows the dashboard interface
3. **You click "Overview" tab** → Frontend calls API: `GET /api/projects/p1/overview`
4. **Backend receives request** → FastAPI processes it
5. **Backend queries database** → Gets hazard response data from SQLite
6. **Backend calculates scores** → Runs analytics (averages, percentages, etc.)
7. **Backend sends JSON response** → Returns data to frontend
8. **Frontend displays data** → Shows KPIs, charts, and Energy Wheel

---

## Architecture Explained Simply

### Three Main Parts

#### 1. **Frontend (React + TypeScript)**
**What it does:** The visual interface you see in your browser

**Like:** A restaurant menu - shows you what's available in a nice format

**Technology:**
- **React:** JavaScript library for building interactive UIs
- **TypeScript:** JavaScript with type checking (catches errors before they happen)
- **Vite:** Fast build tool (makes development quick)
- **CSS:** Styling to make everything look good

**Files you care about:**
- `src/App.tsx` - Main application component
- `src/tabs/` - Each tab (Overview, Scenarios, Workers, Comparison)
- `src/components/` - Reusable pieces (buttons, charts, etc.)
- `src/api/client.ts` - Code that talks to the backend

#### 2. **Backend (FastAPI + Python)**
**What it does:** Processes requests, calculates scores, manages data

**Like:** A restaurant kitchen - takes orders, prepares data, sends it back

**Technology:**
- **FastAPI:** Modern Python web framework (like Express.js)
- **Python 3.11:** Programming language
- **Pydantic:** Data validation (ensures data is correct)
- **Uvicorn:** Server that runs FastAPI

**Files you care about:**
- `app/main.py` - Entry point, defines all API routes
- `app/routers/` - API endpoints organized by feature
- `app/services/analytics.py` - Calculation logic
- `app/services/queries.py` - Database queries
- `app/models.py` - Data structure definitions

#### 3. **Database (SQLite)**
**What it does:** Stores all the training data

**Like:** A filing cabinet - organizes and stores information

**Technology:**
- **SQLite:** Simple file-based database (no server needed)
- **Location:** `data/ensure_mock.sqlite`

**Tables:**
- `projects` - 5 projects (A, B, C, D, E)
- `scenarios` - 8 training scenarios
- `workers` - Worker information
- `hazard_responses` - Worker answers (10 energy types per worker per scenario)
- `energy_types` - 10 energy type definitions
- `industry_benchmark` - Industry average scores

---

## Features Overview

### ✅ What Works Now

#### **1. Overview Tab**
**Purpose:** High-level project dashboard

**What you see:**
- **Project Selector** - Dropdown to switch between 5 projects
- **RAG Status Banner** - Traffic light (Red/Amber/Green) showing overall performance
- **4 KPI Cards:**
  - Scenarios Completed
  - Workers Trained
  - High-Energy Accuracy (average)
  - Direct Control Accuracy (average)
- **Energy Wheel** - Circular chart showing performance across 10 energy types
  - 3 modes: Identification, High Energy, Direct Control
  - Each segment shows a different energy type
  - Longer segment = better performance

**How it works:**
1. Select a project from dropdown
2. Frontend calls: `GET /api/projects/{project_id}/overview`
3. Backend calculates all scores from database
4. Frontend draws the Energy Wheel on HTML canvas
5. Updates every time you change projects

#### **2. Scenarios Tab**
**Purpose:** List all training scenarios for selected project

**What you see:**
- List of scenario cards
- Each card shows:
  - Scenario name (e.g., "Subsea Pipeline Inspection")
  - Number of workers who completed it
  - Average identification score
  - Tags showing weakest and strongest energy types
  - Visual bar chart (10 colored bars for 10 energy types)
  - Icon row showing all energy types

**How it works:**
1. Frontend calls: `GET /api/projects/{project_id}/scenarios`
2. Backend returns all scenarios with calculated scores
3. Frontend displays them as cards
4. Bar colors show performance (darker = better)

#### **3. Workers Tab**
**Purpose:** View worker performance summary

**What you see:**
- Table with all workers for selected project
- Columns:
  - Worker name
  - Number of scenarios completed
  - Average Identification score
  - Average High Energy accuracy
  - Average Direct Control accuracy
- Color-coded pills (Green ≥75%, Amber 60-74%, Red <60%)

**How it works:**
1. Frontend calls: `GET /api/workers/summary?project_id={id}&scenario_id=all`
2. Backend aggregates all responses for each worker
3. Calculates averages across all scenarios
4. Returns sorted by worker name

#### **4. Comparison Tab**
**Purpose:** Compare multiple projects (placeholder for now)

**What you see:**
- "Coming Soon" message
- Prepared for future expansion

**Future features:**
- Multi-project radar charts
- Side-by-side comparison tables
- Industry benchmark overlay

---

## Technical Details

### Data Model

#### **10 Energy Types**
```
1. Gravity ⬇ - Falls, dropped objects
2. Motion 💨 - Moving machinery
3. Pressure 🔵 - Compressed gases
4. Electrical ⚡ - Live wires, circuits
5. Mechanical ⚙ - Gears, moving parts
6. Sound 🔊 - Noise hazards
7. Biological 🧬 - Organic hazards
8. Chemical ⚗ - Toxic substances
9. Radiation ☢ - Radioactive materials
10. Temperature 🌡 - Hot/cold surfaces
```

#### **For Each Hazard Response, We Track:**
```javascript
{
  energyId: "electrical",
  identifiedCorrectly: true,        // Did they spot it?
  markedHighEnergy: true,            // Did they mark it as high-energy?
  correctHighEnergy: true,           // Was it actually high-energy?
  markedDirectControl: false,        // Did they mark it as directly controllable?
  correctDirectControl: false        // Was it actually directly controllable?
}
```

#### **Score Calculations**

**Identification Score:**
```
identScore = (correctly_identified / total_hazards) × 100
```

**High Energy Accuracy:**
```
highScore = (correct_high_energy_classifications / total_hazards) × 100
```

**Direct Control Accuracy:**
```
controlScore = (correct_direct_control_classifications / total_hazards) × 100
```

**RAG Status:**
```
ragScore = (highScore + controlScore) / 2

if (ragScore >= 75) → Green "On Track"
else if (ragScore >= 60) → Amber "Needs Attention"
else → Red "Action Required"
```

### API Endpoints Explained

#### **Projects**
```
GET /api/projects
→ Returns: List of all 5 projects
→ Used by: Project selector dropdown

GET /api/projects/{project_id}/overview
→ Returns: Complete overview data (KPIs, energy breakdown, RAG score)
→ Used by: Overview tab
→ Example: /api/projects/p1/overview

GET /api/projects/{project_id}/scenarios
→ Returns: All scenarios for a project with summary stats
→ Used by: Scenarios tab
→ Example: /api/projects/p1/scenarios
```

#### **Scenarios**
```
GET /api/scenarios/{scenario_id}
→ Returns: Detailed scenario data with all worker results
→ Used by: Scenario detail view (not implemented yet)
→ Example: /api/scenarios/g1

GET /api/scenarios/compare?scenario_a={id}&scenario_b={id}
→ Returns: Side-by-side comparison of two scenarios
→ Used by: Scenario comparison feature (not implemented yet)
→ Example: /api/scenarios/compare?scenario_a=g1&scenario_b=g2
```

#### **Workers**
```
GET /api/workers/summary?project_id={id}&scenario_id={id}
→ Returns: Worker summary table with averages
→ Used by: Workers tab
→ Example: /api/workers/summary?project_id=p1&scenario_id=all

GET /api/workers/trends?project_id={id}
→ Returns: Worker performance over time (multiple scenarios)
→ Used by: Worker trend charts (not implemented yet)
→ Example: /api/workers/trends?project_id=p1
```

#### **Comparison**
```
GET /api/comparison/projects?project_ids={ids}&mode={mode}&include_industry={bool}
→ Returns: Radar chart data for multiple projects
→ Used by: Comparison tab (not implemented yet)
→ Example: /api/comparison/projects?project_ids=p1,p2&mode=ident&include_industry=true

GET /api/comparison/table?project_ids={ids}&include_industry={bool}
→ Returns: Full comparison table data
→ Used by: Comparison tab (not implemented yet)

GET /api/industry/benchmark
→ Returns: Industry average scores for all energy types
→ Used by: Comparison features
```

---

## File Structure Explained

### Backend Files

```
backend/
├── app/
│   ├── __init__.py                 # Makes 'app' a Python package (empty file)
│   ├── main.py                     # FastAPI entry point - defines app and includes routers
│   ├── database.py                 # Database connection wrapper
│   ├── models.py                   # Pydantic models (data structure definitions)
│   │
│   ├── routers/                    # API endpoint definitions
│   │   ├── __init__.py            # Empty package marker
│   │   ├── projects.py            # 3 endpoints: list, overview, scenarios
│   │   ├── scenarios.py           # 2 endpoints: detail, compare
│   │   ├── comparison.py          # 3 endpoints: radar, table, benchmark
│   │   └── workers.py             # 2 endpoints: summary, trends
│   │
│   └── services/                   # Business logic (pure functions)
│       ├── __init__.py            # Empty package marker
│       ├── analytics.py           # Score calculation functions
│       └── queries.py             # SQL query functions
│
├── requirements.txt                # Python dependencies (fastapi, uvicorn, etc.)
├── run.py                         # Simple script to start the server
└── README.md                      # Backend-specific documentation
```

#### **Key Files Explained:**

**`app/main.py`** (60 lines)
- Creates FastAPI app instance
- Configures CORS (allows frontend to call backend)
- Includes all routers (projects, scenarios, workers, comparison)
- Defines root endpoint (/) and health check

**`app/database.py`** (90 lines)
- `Database` class with connection handling
- `execute_query()` - runs SELECT queries, returns list of dicts
- `execute_one()` - returns single result or None
- `get_database()` - singleton pattern, returns shared instance

**`app/models.py`** (160 lines)
- Pydantic models for request/response validation
- Every API endpoint has a response model
- TypeScript-like type definitions for Python
- Ensures data structure is always correct

**`app/services/analytics.py`** (150 lines)
- Pure calculation functions (no database access)
- `calculate_energy_breakdown()` - main scoring function
- `calculate_worker_score()` - individual worker metrics
- `get_rag_status()` - determines Red/Amber/Green

**`app/services/queries.py`** (180 lines)
- All SQL queries in one place
- Functions like `get_all_projects()`, `get_scenario_by_id()`
- Uses parameterized queries (safe from SQL injection)
- Returns dictionaries (easy to work with)

**`app/routers/projects.py`** (170 lines)
- 3 endpoints for project-related data
- `/api/projects` - simple list
- `/api/projects/{id}/overview` - complex aggregation
- `/api/projects/{id}/scenarios` - scenario summaries

### Frontend Files

```
frontend/
├── public/                         # Static assets (empty for now)
├── src/
│   ├── main.tsx                   # Entry point - mounts React app to DOM
│   ├── App.tsx                    # Main component - navigation and routing
│   ├── styles.css                 # Global CSS (600 lines, all styling)
│   │
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions (matches backend)
│   │
│   ├── api/
│   │   └── client.ts              # API client - all backend communication
│   │
│   ├── components/                # Reusable UI components
│   │   ├── Pill.tsx              # Score pill (Green/Amber/Red badge)
│   │   ├── RagBanner.tsx         # Status banner component
│   │   └── EnergyWheel.tsx       # Canvas-based circular chart
│   │
│   └── tabs/                      # Main tab views
│       ├── OverviewTab.tsx       # Project dashboard
│       ├── ScenariosTab.tsx      # Scenario list
│       ├── WorkersTab.tsx        # Worker summary table
│       └── ComparisonTab.tsx     # Placeholder
│
├── index.html                     # HTML template
├── package.json                   # npm dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite build configuration
└── README.md                      # Frontend-specific docs
```

#### **Key Files Explained:**

**`src/main.tsx`** (7 lines)
- Mounts React app to `<div id="root">` in index.html
- Wraps app in React.StrictMode (development checks)

**`src/App.tsx`** (80 lines)
- Main application component
- State management (activeTab, selectedProject)
- Navigation bar rendering
- Conditional tab rendering based on activeTab

**`src/types/index.ts`** (130 lines)
- TypeScript interfaces matching backend models
- Ensures frontend and backend speak same language
- Autocomplete support in IDE

**`src/api/client.ts`** (140 lines)
- All API calls in one place
- Type-safe fetch wrappers
- Organized by feature (projectsAPI, scenariosAPI, etc.)
- Error handling

**`src/components/EnergyWheel.tsx`** (110 lines)
- Canvas-based visualization
- useEffect hook redraws when data changes
- Draws 10 segments (one per energy type)
- Segment length = performance score

**`src/tabs/OverviewTab.tsx`** (140 lines)
- Fetches overview data on mount and when project changes
- Manages wheelMode state (ident/high/control)
- Renders KPIs, RAG banner, Energy Wheel
- Loading state handling

**`src/styles.css`** (600 lines)
- All global styles
- CSS classes for components
- Responsive design (mobile-friendly)
- Color scheme and typography

### Database

```
data/
└── ensure_mock.sqlite              # SQLite database file (5MB)
```

#### **Tables:**

**`projects`** (5 rows)
```sql
id | name | region | company_name | industry
p1 | Project A | North Sea | Aegir Offshore | Offshore inspection
...
```

**`scenarios`** (8 rows)
```sql
scenario_id | project_id | scenario_name | scenario_date | expected_worker_count
g1 | p1 | Subsea Pipeline Inspection | 2025-01-15 | 14
...
```

**`workers`** (~50 rows)
```sql
worker_id | project_id | worker_name | role | experience_band
p1_w01 | p1 | Worker 1 | Operator | 0-2 years
...
```

**`hazard_responses`** (~2700 rows)
```sql
scenario_id | worker_id | energy_id | identified_correctly | marked_high_energy | correct_high_energy | ...
g1 | p1_w01 | gravity | 1 | 0 | 0 | 0 | 0
...
```

**`energy_types`** (10 rows)
```sql
id | label | icon | color
gravity | Gravity | ⬇ | #64748b
...
```

**`industry_benchmark`** (10 rows)
```sql
energy_id | ident_score | high_score | control_score
gravity | 72 | 68 | 65
...
```

---

## How the Frontend and Backend Connect

### Example: Loading Overview Tab

**Step-by-Step:**

1. **User opens browser** → Goes to http://localhost:3000
2. **React app loads** → Renders `App.tsx`
3. **User clicks "Overview"** → Sets `activeTab = 'overview'`
4. **`OverviewTab` component mounts** → Runs `useEffect` hook
5. **API call triggered:**
   ```typescript
   projectsAPI.getOverview('p1')
   ```
6. **Fetch request sent:**
   ```javascript
   fetch('http://localhost:8000/api/projects/p1/overview')
   ```
7. **Backend receives request** → FastAPI routes to `get_project_overview()`
8. **Backend queries database:**
   ```python
   hazard_responses = queries.get_hazard_responses_by_project('p1')
   ```
9. **SQL query executed:**
   ```sql
   SELECT * FROM hazard_responses WHERE project_id = 'p1'
   ```
10. **Database returns ~340 rows** (34 workers × 10 energy types)
11. **Backend calculates scores:**
    ```python
    energy_scores = analytics.calculate_energy_breakdown(hazard_responses)
    ```
12. **Backend builds response:**
    ```python
    return {
        'project': {...},
        'totalScenarios': 3,
        'totalSessions': 34,
        'highAccAll': 76,
        'ctrlAccAll': 74,
        'ragScore': 75,
        'energyBreakdown': [...]
    }
    ```
13. **FastAPI validates response** → Pydantic checks structure
14. **JSON sent back to frontend:**
    ```json
    {
      "project": {"id": "p1", "name": "Project A", ...},
      "totalScenarios": 3,
      ...
    }
    ```
15. **Frontend receives JSON** → TypeScript validates types
16. **State updated:**
    ```typescript
    setOverview(data)
    ```
17. **React re-renders** → Shows KPIs, RAG banner, Energy Wheel
18. **Canvas draws Energy Wheel** → useEffect runs drawing code

### Why This Architecture?

**Separation of Concerns:**
- Frontend: User interface only
- Backend: Business logic only
- Database: Data storage only

**Benefits:**
- Easy to modify one without breaking others
- Can replace frontend (mobile app) without changing backend
- Can switch database (SQLite → PostgreSQL) without changing frontend
- Each part can be developed/tested independently

**Scalability:**
- Frontend can be served by CDN
- Backend can be scaled horizontally (multiple instances)
- Database can be upgraded to PostgreSQL with replication

---

## Summary

### What You Have Now
✅ Full-stack web application
✅ Backend API with 8 working endpoints
✅ Frontend dashboard with 3 working tabs
✅ Mock data with realistic patterns
✅ Ready for expansion

### What Works
- Project selection and overview
- KPI dashboard
- Energy Wheel visualization
- Scenario browsing
- Worker performance summary
- Real-time data from backend

### What's Ready But Not Implemented
- Scenario detail view
- Scenario comparison
- Multi-project comparison with radar charts
- Worker trend charts over time
- Export functionality

### Next Steps for Production
1. Replace SQLite with PostgreSQL
2. Add user authentication
3. Implement remaining views
4. Add data export (CSV, PDF)
5. Deploy to DigitalOcean
6. Connect to real training data

---

**Documentation Version:** 1.0
**Last Updated:** March 9, 2026
**Built with:** Claude Code (Anthropic AI)
