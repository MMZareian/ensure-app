# Ensure Safety Analytics - User Guide

## 🚀 Quick Start Guide

### Starting the Application

Every time you want to use the application, you need to start TWO servers:

#### **Step 1: Start Backend Server**

1. Open **Terminal/Command Prompt**
2. Navigate to backend folder:
   ```bash
   cd C:\Users\mahdi\PycharmProjects\DigitalOcean\ensure-app\backend
   ```
3. Run the server:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
4. **Keep this terminal window open!**
5. You should see:
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

#### **Step 2: Start Frontend Server**

1. Open **ANOTHER Terminal/Command Prompt** (new window)
2. Navigate to frontend folder:
   ```bash
   cd C:\Users\mahdi\PycharmProjects\DigitalOcean\ensure-app\frontend
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. **Keep this terminal window open too!**
5. You should see:
   ```
   Local: http://localhost:3000/
   ```

#### **Step 3: Open in Browser**

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **http://localhost:3000**
3. You should see the Ensure Safety Analytics dashboard!

### Stopping the Application

**To stop the servers:**
1. Go to each terminal window
2. Press `Ctrl + C` (Windows/Linux) or `Cmd + C` (Mac)
3. Both servers will shut down
4. You can close the terminal windows

---

## 📱 Using the Application

### Navigation

The application has 4 main tabs at the top:

1. **Overview** - Project dashboard
2. **Scenarios** - Training scenarios list
3. **Comparison** - Project comparison (coming soon)
4. **Workers** - Worker performance

### Overview Tab

**Purpose:** See high-level project performance

**What to do:**
1. Select a project from the dropdown (top right)
   - Project A (North Sea)
   - Project B (Baltic)
   - Project C (Arctic)
   - Project D (Gulf)
   - Project E (Caspian)

2. **Read the RAG banner:**
   - 🟢 Green = "On Track" (≥75% accuracy)
   - 🟡 Amber = "Needs Attention" (60-74%)
   - 🔴 Red = "Action Required" (<60%)

3. **View KPI cards:**
   - How many scenarios completed
   - How many workers trained
   - Average High-Energy accuracy
   - Average Direct Control accuracy

4. **Explore Energy Wheel:**
   - Click the toggle buttons: 🎯 Identification | ⚡ High Energy | 🛡 Direct Control
   - Each segment represents one energy type
   - Longer segment = better performance
   - Hover to see exact percentages

**Tips:**
- Switch between projects to compare
- Try different wheel modes to see different metrics
- Green scores (≥75%) are good, red scores (<60%) need attention

### Scenarios Tab

**Purpose:** Browse training scenarios

**What to do:**
1. The list shows all scenarios for the currently selected project
2. Each card shows:
   - Scenario name
   - Number of workers
   - Average score (color-coded pill)
   - Weakest energy type (⚠ Weak)
   - Best energy type (★ Best)
   - Visual energy bar (10 colored segments)

3. **Reading the energy bar:**
   - Each colored segment = one energy type
   - Darker/more opaque = better performance
   - All 10 icons shown below the bar

**Tips:**
- Look for scenarios with red average scores - they need attention
- Scenarios with consistent weak energy types may need targeted training

### Workers Tab

**Purpose:** See individual worker performance

**What to do:**
1. View the table of all workers
2. Columns show:
   - Worker name
   - Number of scenarios they completed
   - Average Identification score
   - Average High Energy accuracy
   - Average Direct Control accuracy

3. **Reading scores:**
   - Green pill (≥75%) = Good performance
   - Amber pill (60-74%) = Acceptable
   - Red pill (<60%) = Needs improvement

4. **Sorting:**
   - Workers are sorted alphabetically
   - Shows data across ALL scenarios for selected project

**Tips:**
- Workers with red scores may need additional training
- Compare workers to identify top performers
- Look at scenario count - more scenarios = more data

### Comparison Tab

**Status:** Coming soon!

**Future features:**
- Compare multiple projects side-by-side
- Radar charts showing all 10 energy types
- Industry benchmark comparison
- Detailed comparison tables

---

## 🔧 Troubleshooting

### Problem: "Cannot connect to backend"

**Symptoms:**
- Loading spinners never stop
- Empty data or error messages
- Browser console shows network errors

**Solution:**
1. Check if backend is running:
   - Open http://localhost:8000 in browser
   - Should see: `{"message":"Ensure Safety Analytics API",...}`
2. If not running, start backend server (see Step 1 above)
3. Refresh browser page

### Problem: "Page won't load" or "Cannot reach localhost:3000"

**Symptoms:**
- Browser shows "can't reach this page"
- Connection refused error

**Solution:**
1. Check if frontend is running:
   - Look for terminal with `npm run dev` running
   - Should say "Local: http://localhost:3000/"
2. If not running, start frontend server (see Step 2 above)

### Problem: Backend won't start - "Port 8000 already in use"

**Symptoms:**
```
ERROR: error while attempting to bind on address ('0.0.0.0', 8000)
```

**Solution:**
Backend is already running! This is actually good. Just start the frontend.

**Or, to restart backend:**
1. Find the terminal running the backend
2. Press `Ctrl + C` to stop it
3. Start it again

### Problem: Frontend won't start - "Port 3000 already in use"

**Solution:**
Same as above - frontend is already running. Just open http://localhost:3000

### Problem: "Module not found" or "Import errors"

**For Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**For Frontend:**
```bash
cd frontend
npm install
```

### Problem: Data looks wrong or empty

**Solution:**
1. Check database file exists:
   ```bash
   dir data\ensure_mock.sqlite
   ```
2. Should be ~5MB
3. If missing, copy from original location:
   ```bash
   copy ..\ensure_mock_dataset_pack\sqlite\ensure_mock.sqlite data\
   ```

### Problem: Browser console shows errors

**To check:**
1. Open browser Developer Tools (F12)
2. Go to "Console" tab
3. Look for red error messages

**Common fixes:**
- Refresh the page (F5)
- Clear browser cache (Ctrl + Shift + Delete)
- Check both servers are running

---

## 📋 Keyboard Shortcuts

**In Browser:**
- `F5` - Refresh page
- `Ctrl + R` - Refresh page
- `F12` - Open Developer Tools
- `Ctrl + Shift + I` - Open Developer Tools

**In Terminal:**
- `Ctrl + C` - Stop server
- `Ctrl + L` - Clear terminal
- `↑` (up arrow) - Previous command

---

## 🎓 Understanding the Data

### Projects
Your system has 5 projects (companies/locations):
- **Project A** - North Sea (Aegir Offshore)
- **Project B** - Baltic (Baltica Process Systems)
- **Project C** - Arctic (Arctic Marine Ops)
- **Project D** - Gulf (Gulf Well Services)
- **Project E** - Caspian (Caspian Pump & Flow)

### Scenarios
Each project has 2-3 training scenarios:
- Project A: Subsea Pipeline Inspection, Deck Crane Operation, ROV Deployment
- Project B: Compressor Room Walkthrough, Chemical Storage Audit
- Project C: Ice Condition Ops
- Project D: Wellhead Maintenance
- Project E: Pump Station Inspection

### Workers
- Each project has 10-15 workers
- Workers are named "Worker 1", "Worker 2", etc. (per project)
- Same workers appear across multiple scenarios (to show progress)

### Energy Types (10 total)
1. **Gravity** ⬇ - Falling objects, working at heights
2. **Motion** 💨 - Moving machinery, conveyor belts
3. **Pressure** 🔵 - Compressed air/gas systems
4. **Electrical** ⚡ - Live circuits, power lines
5. **Mechanical** ⚙ - Gears, pulleys, moving parts
6. **Sound** 🔊 - Loud equipment, hearing hazards
7. **Biological** 🧬 - Bacteria, viruses, organic hazards
8. **Chemical** ⚗ - Toxic substances, corrosives
9. **Radiation** ☢ - Radioactive materials, X-rays
10. **Temperature** 🌡 - Hot/cold surfaces, burns

### Scores Explained

**Identification Score (0-100%):**
- % of hazards correctly identified by worker
- Example: Worker spots 8 out of 10 hazards = 80%

**High Energy Accuracy (0-100%):**
- % of correct "high energy" classifications
- Some hazards are high-energy (dangerous), others low-energy
- Worker must identify which is which

**Direct Control Accuracy (0-100%):**
- % of correct "direct control" classifications
- Some hazards can be directly controlled (turn off switch)
- Others need indirect control (call specialist)

**RAG Score:**
- Average of High Energy + Direct Control accuracy
- Green (≥75%), Amber (60-74%), Red (<60%)

---

## 💡 Tips & Best Practices

### For Daily Use

1. **Always check Overview first** - gives you the big picture
2. **Look at RAG status** - tells you if action is needed
3. **Drill into Scenarios** - find specific problem areas
4. **Check Workers tab** - identify who needs help

### For Analysis

1. **Compare projects** - see which locations perform best
2. **Track Energy Wheel** - find consistently weak energy types
3. **Look for patterns** - certain scenarios harder than others?
4. **Use color coding** - red pills = priority areas

### For Troubleshooting

1. **Always start backend first** - frontend needs it
2. **Keep terminals open** - closing them stops servers
3. **Check browser console** - shows detailed errors
4. **Refresh page** - fixes many UI issues

---

## 🔄 Daily Workflow Example

### Morning Routine

1. **Start servers:**
   ```bash
   # Terminal 1
   cd ensure-app/backend
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

   # Terminal 2 (new window)
   cd ensure-app/frontend
   npm run dev
   ```

2. **Open browser:** http://localhost:3000

3. **Check Overview tab:**
   - Review RAG status for each project
   - Note any red/amber statuses

4. **Drill into problem areas:**
   - Click Scenarios tab
   - Find scenarios with low scores
   - Note weak energy types

5. **Check Workers:**
   - Identify workers with red scores
   - Plan additional training if needed

### End of Day

1. **Stop servers:**
   - Go to each terminal
   - Press `Ctrl + C`

2. **Close terminals**

3. **Data is saved** - SQLite database keeps everything

---

## 📞 Getting Help

### Check Documentation
1. `DOCUMENTATION.md` - Full technical details
2. `README.md` - Project overview
3. `USER_GUIDE.md` - This file

### Check API Documentation
- Start backend server
- Visit: http://localhost:8000/docs
- Interactive API documentation (Swagger UI)

### Debug Mode
**Backend:**
```bash
# Add --reload flag for auto-restart on code changes
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
- Already in debug mode with `npm run dev`
- Check browser console (F12) for errors

---

## 🔐 Important Notes

### Security
- Currently runs locally only (localhost)
- No authentication/login required
- Don't expose to internet without security measures

### Data
- Mock data included for demonstration
- Database: `data/ensure_mock.sqlite`
- Safe to experiment - you can always restore from backup

### Performance
- Backend handles hundreds of requests per second
- Frontend updates in real-time
- No page reloads needed (single-page app)

### Browser Compatibility
Works best in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ⚠️ Safari (may have minor issues)
- ❌ Internet Explorer (not supported)

---

## 📚 Additional Resources

### Learn More About:

**React:**
- Official docs: https://react.dev
- Learn basics: https://react.dev/learn

**FastAPI:**
- Official docs: https://fastapi.tiangolo.com
- Tutorial: https://fastapi.tiangolo.com/tutorial/

**TypeScript:**
- Official docs: https://www.typescriptlang.org
- Handbook: https://www.typescriptlang.org/docs/handbook/

**SQLite:**
- Official docs: https://www.sqlite.org/docs.html

---

## 🎯 Common Tasks

### Change Project in Overview
1. Click dropdown in top-right
2. Select different project
3. Data updates automatically

### Find Weak Scenarios
1. Go to Scenarios tab
2. Look for red pills (scores <60%)
3. Check "⚠ Weak" tags

### Identify Workers Needing Training
1. Go to Workers tab
2. Sort by looking at pill colors
3. Red pills = priority for retraining

### Check Specific Energy Type
1. Go to Overview tab
2. Toggle Energy Wheel mode (Identification/High Energy/Direct Control)
3. Look at segment lengths
4. Hover for exact percentages

---

**User Guide Version:** 1.0
**Last Updated:** March 9, 2026
**Support:** Check DOCUMENTATION.md for technical details
