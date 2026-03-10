# Ensure Safety Analytics - Quick Reference Card

## 🚀 Starting the Application

### Every Time You Want to Use It:

**Terminal 1 - Backend:**
```bash
cd C:\Users\mahdi\PycharmProjects\DigitalOcean\ensure-app\backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
✅ Should see: `Uvicorn running on http://0.0.0.0:8000`

**Terminal 2 - Frontend:**
```bash
cd C:\Users\mahdi\PycharmProjects\DigitalOcean\ensure-app\frontend
npm run dev
```
✅ Should see: `Local: http://localhost:3000/`

**Browser:**
```
Open: http://localhost:3000
```

**To Stop:**
Press `Ctrl + C` in each terminal

---

## 📊 Features at a Glance

| Tab | What It Shows | Key Features |
|-----|---------------|--------------|
| **Overview** | Project dashboard | - RAG status<br>- 4 KPI cards<br>- Energy Wheel (3 modes) |
| **Scenarios** | Training scenarios list | - Scenario cards<br>- Energy bars<br>- Weak/strong tags |
| **Workers** | Worker performance | - Summary table<br>- Average scores<br>- Color-coded pills |
| **Comparison** | Multi-project compare | - Coming soon |

---

## 🎨 Color Coding

| Color | Score Range | Meaning |
|-------|-------------|---------|
| 🟢 Green | ≥75% | On Track - Good performance |
| 🟡 Amber | 60-74% | Needs Attention - Acceptable |
| 🔴 Red | <60% | Action Required - Needs improvement |

---

## 🔢 10 Energy Types

| Icon | Type | Example Hazards |
|------|------|-----------------|
| ⬇ | Gravity | Falls, dropped objects |
| 💨 | Motion | Moving machinery |
| 🔵 | Pressure | Compressed gases |
| ⚡ | Electrical | Live wires |
| ⚙ | Mechanical | Gears, pulleys |
| 🔊 | Sound | Loud equipment |
| 🧬 | Biological | Organic hazards |
| ⚗ | Chemical | Toxic substances |
| ☢ | Radiation | Radioactive materials |
| 🌡 | Temperature | Hot/cold surfaces |

---

## 📈 Metrics Explained

**Identification Score:**
- % of hazards correctly spotted
- Example: 8/10 identified = 80%

**High Energy Accuracy:**
- % of correct high/low energy classifications
- Must identify which hazards are high-energy

**Direct Control Accuracy:**
- % of correct controllability classifications
- Can it be controlled directly or needs specialist?

**RAG Score:**
- Average of High Energy + Direct Control
- Used for overall status (Red/Amber/Green)

---

## 🗂️ Project Structure

```
5 Projects:
├── Project A (North Sea) - 3 scenarios, 14 workers
├── Project B (Baltic) - 2 scenarios, 20 workers
├── Project C (Arctic) - 1 scenario, 10 workers
├── Project D (Gulf) - 1 scenario, 15 workers
└── Project E (Caspian) - 1 scenario, 13 workers

Total: 8 scenarios, 72 workers, ~2700 hazard responses
```

---

## 🔌 API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/projects` | List all projects |
| `GET /api/projects/{id}/overview` | Project dashboard data |
| `GET /api/projects/{id}/scenarios` | Scenario list |
| `GET /api/scenarios/{id}` | Scenario detail |
| `GET /api/scenarios/compare` | Compare two scenarios |
| `GET /api/workers/summary` | Worker table |
| `GET /api/workers/trends` | Worker progress |
| `GET /api/comparison/projects` | Multi-project radar |
| `GET /api/industry/benchmark` | Industry averages |

**API Docs:** http://localhost:8000/docs

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect | Start backend server |
| Page won't load | Start frontend server |
| Port already in use | Server already running (good!) or use `Ctrl+C` to stop |
| Empty data | Check `data/ensure_mock.sqlite` exists |
| Import errors | Run `pip install -r requirements.txt` (backend)<br>Run `npm install` (frontend) |

---

## 📂 Important Files

| Path | Description |
|------|-------------|
| `backend/app/main.py` | Backend entry point |
| `frontend/src/App.tsx` | Frontend entry point |
| `data/ensure_mock.sqlite` | Database (5MB) |
| `DOCUMENTATION.md` | Full technical docs |
| `USER_GUIDE.md` | Detailed user guide |
| `README.md` | Project overview |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `F5` | Refresh browser |
| `F12` | Open browser dev tools |
| `Ctrl + C` | Stop server (terminal) |
| `Ctrl + Shift + R` | Hard refresh (clear cache) |

---

## 🎯 Quick Workflow

1. **Start both servers** (backend → frontend)
2. **Open** http://localhost:3000
3. **Check Overview** - RAG status for all projects
4. **Drill into Scenarios** - find problem areas
5. **Review Workers** - identify who needs help
6. **Stop servers** when done (`Ctrl + C`)

---

## 🔗 URLs

| Service | URL |
|---------|-----|
| **Application** | http://localhost:3000 |
| **Backend API** | http://localhost:8000 |
| **API Docs** | http://localhost:8000/docs |
| **Health Check** | http://localhost:8000/health |

---

## 📱 Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome | ✅ Fully supported |
| Firefox | ✅ Fully supported |
| Edge | ✅ Fully supported |
| Safari | ⚠️ Mostly works |
| IE | ❌ Not supported |

---

## 💾 Data Storage

| Item | Location |
|------|----------|
| Database | `ensure-app/data/ensure_mock.sqlite` |
| Backend code | `ensure-app/backend/` |
| Frontend code | `ensure-app/frontend/` |
| Original dataset | `ensure_mock_dataset_pack/` |

---

## 🎓 Learning Resources

| Topic | Link |
|-------|------|
| React | https://react.dev/learn |
| FastAPI | https://fastapi.tiangolo.com/tutorial/ |
| TypeScript | https://www.typescriptlang.org/docs/ |
| Vite | https://vitejs.dev/guide/ |

---

## 📞 Help

1. **Check USER_GUIDE.md** - Detailed instructions
2. **Check DOCUMENTATION.md** - Technical details
3. **Check API docs** - http://localhost:8000/docs
4. **Browser console** - Press F12, check Console tab

---

**Version:** 1.0
**Created:** March 9, 2026
**Print this page for quick reference!**
