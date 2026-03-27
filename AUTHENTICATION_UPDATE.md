# Authentication & Multi-Company System

This document describes the authentication and multi-company architecture of the Bridge Safety Analytics Platform.

## System Architecture

### Database Structure

**New Tables:**
1. **companies** - Stores company information
   - company_id (PK)
   - company_name
   - industry
   - created_at

2. **managers** - User authentication
   - manager_id (PK)
   - company_id (FK → companies)
   - username (unique)
   - password (plaintext for now, will be hashed)
   - full_name
   - email
   - role (admin/manager)
   - created_at
   - last_login

**Updated Tables:**
- **projects** - Added `company_id` column linking to companies

### Data Structure

**3 Companies:**
1. Apex Construction Ltd (c1) - 2 projects (p1, p2)
2. TechBuild Solutions (c2) - 2 projects (p3, p4)
3. SafeWorks Industrial (c3) - 1 project (p5)

**5 Manager Accounts:**
| Username       | Password    | Company                  | Role    |
|----------------|-------------|--------------------------|---------|
| sarah.johnson  | password123 | Apex Construction Ltd    | admin   |
| mike.chen      | password123 | Apex Construction Ltd    | manager |
| emma.davis     | password123 | TechBuild Solutions      | admin   |
| james.wilson   | password123 | TechBuild Solutions      | manager |
| lisa.martinez  | password123 | SafeWorks Industrial     | admin   |

---

## Implementation Status

### ✅ Completed Features

#### Backend (FastAPI)
- ✅ Authentication router (`backend/app/routers/auth.py`):
  - POST `/api/auth/login` - Verify credentials, return session token
  - POST `/api/auth/logout` - Clear session
  - GET `/api/auth/me` - Get current logged-in user info
- ✅ Company-filtered project queries
- ✅ Cross-company comparison tab support

#### Frontend (React + TypeScript)
- ✅ Login Page (`frontend/src/pages/LoginPage.tsx`)
- ✅ Auth Context (`frontend/src/contexts/AuthContext.tsx`)
- ✅ Protected routes in App.tsx
- ✅ Company filtering in Overview/Scenarios/Workers tabs
- ✅ Cross-company Comparison tab
- ✅ User information display in Topbar with logout

#### Database
- ✅ `data/rebuild_database.py` - Database regeneration script
- ✅ `data/ensure_mock.sqlite` - Updated with companies and managers
- ✅ `backend/data/ensure_mock.sqlite` - Backend database copy

---

## Features

### 1. Login System
- Professional login form before accessing the platform
- Username/password authentication against managers table
- Session management with localStorage token storage
- Company name and user name displayed in header

### 2. Company-Based Access Control
- **Overview Tab**: Shows only company's projects
- **Scenarios Tab**: Shows only company's scenarios
- **Workers Tab**: Shows only company's workers

### 3. Cross-Company Analysis
- **Comparison Tab**: Shows ALL projects for benchmarking across companies
- **Industry Benchmark**: Available for all users to compare against industry averages

---

## Testing Credentials

Use any of these to test login:

```
Username: sarah.johnson
Password: password123
Company: Apex Construction Ltd (2 projects)

Username: emma.davis
Password: password123
Company: TechBuild Solutions (2 projects)

Username: lisa.martinez
Password: password123
Company: SafeWorks Industrial (1 project)
```

---

## Security Notes

**Current State** (Development):
- Passwords stored in plaintext
- No JWT tokens yet
- No session expiration

**Production TODO**:
- Hash passwords with bcrypt
- Use JWT tokens with expiration
- Add HTTPS only
- Add rate limiting on login endpoint
- Add password complexity requirements
