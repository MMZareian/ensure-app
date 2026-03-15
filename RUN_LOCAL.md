# Running Ensure Safety Analytics Platform Locally

## Quick Start Guide - Step by Step

Follow these exact steps to run the application on your local machine.

---

## Important: You Need TWO Terminal Windows Open!

You will run the backend in one terminal and the frontend in another terminal. Both must stay open while using the application.

---

## Step 1: Open First Terminal (for Backend)

Open a **Command Prompt** or **PowerShell** window.

Copy and paste this command:

```bash
cd C:\Users\mahdi\PycharmProjects\DigitalOcean\ensure-app\backend
```

Press Enter.

---

## Step 2: Start the Backend

In the same terminal, copy and paste this command:

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Press Enter.

✅ **Wait until you see:** `INFO:     Application startup complete.`

✅ **Keep this terminal window open!** Don't close it.

---

## Step 3: Open Second Terminal (for Frontend)

Open a **NEW** Command Prompt or PowerShell window (keep the first one open).

Copy and paste this command:

```bash
cd C:\Users\mahdi\PycharmProjects\DigitalOcean\ensure-app\frontend
```

Press Enter.

---

## Step 4: Start the Frontend

In the second terminal, copy and paste this command:

```bash
npm run dev
```

Press Enter.

✅ **Wait until you see:** `Local: http://localhost:3000/`

✅ **Keep this terminal window open too!**

---

## Step 5: Open Your Browser

Open your web browser and go to:

**http://localhost:3000**

(If you see a different port number like 3001 or 3002 in your terminal, use that instead)

---

## Step 6: Login

Use these test credentials:

**Username:** `sarah.johnson`
**Password:** `password123`

---

## ✅ That's It! The Application is Running

You can now use the dashboard. Navigate between tabs:
- **Overview** - Project summary and metrics
- **Scenarios** - Browse scenarios or compare two scenarios
- **Workers** - Worker performance and trends over time
- **Comparison** - Compare multiple projects

---

## Stopping the Application

When you're done:

1. Go to the **backend terminal** and press `Ctrl+C`
2. Go to the **frontend terminal** and press `Ctrl+C`

---

## All Test Login Credentials

| Username | Password | Company | Role |
|----------|----------|---------|------|
| sarah.johnson | password123 | Apex Construction Ltd | admin |
| mike.chen | password123 | Apex Construction Ltd | manager |
| emma.davis | password123 | TechBuild Solutions | admin |
| james.wilson | password123 | TechBuild Solutions | manager |
| lisa.martinez | password123 | SafeWorks Industrial | admin |

Each manager can only see their own company's data in Overview/Scenarios/Workers tabs.
The Comparison tab shows all projects for cross-company comparison.

---

## Troubleshooting

### Error: "TypeError: unsupported operand type(s) for |"

This means you're using Python 3.8 or 3.9. The code has been updated to work with Python 3.8+.
If you still see this error, update your Python packages:

```bash
cd C:\Users\mahdi\PycharmProjects\DigitalOcean\ensure-app\backend
pip install -r requirements.txt --upgrade
```

### Backend won't start

```bash
cd C:\Users\mahdi\PycharmProjects\DigitalOcean\ensure-app\backend
pip install -r requirements.txt --upgrade
```

### Frontend won't start

```bash
cd C:\Users\mahdi\PycharmProjects\DigitalOcean\ensure-app\frontend
npm install
```

### Port already in use

If you see "Port 3000 is in use", the frontend will automatically try 3001, 3002, etc.
Just use whatever port number it shows in the terminal output.

### Database issues - Reset to fresh data

```bash
cd C:\Users\mahdi\PycharmProjects\DigitalOcean\ensure-app
python data/rebuild_database.py
```

---

## Quick Reference

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Database Location**: `data/ensure_mock.sqlite`
- **Backend Code**: `backend/app/`
- **Frontend Code**: `frontend/src/`
