# Authentication & Multi-Company Update

## What Changed

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

## New Requirements

### 1. Login System
- **Login Page**: Professional login form before accessing the tool
- **Authentication**: Verify username/password against managers table
- **Session Management**: Keep user logged in, show company name in header

### 2. Company-Based Access Control
- **Scenarios Tab**: Managers only see their own company's projects
- **Overview Tab**: Only show projects from manager's company
- **Workers Tab**: Filter by company's projects only

### 3. Comparison Tab
- **Cross-Company**: Managers can compare ALL projects (any company)
- **Industry Benchmark**: Still available for all users

---

## Files Modified

### Database:
- ✅ `data/rebuild_database.py` - Script to rebuild database with new structure
- ✅ `data/ensure_mock.sqlite` - Updated with companies and managers
- ✅ `backend/data/ensure_mock.sqlite` - Copy for backend

### Still Need to Update:
- ⏳ Backend authentication endpoints
- ⏳ Frontend login page
- ⏳ Frontend authentication context
- ⏳ Filter scenarios/overview by company
- ⏳ Protected routes

---

## Next Implementation Steps

### Backend (FastAPI):

1. **Add authentication router** (`backend/app/routers/auth.py`):
   - POST `/api/auth/login` - Verify credentials, return session token
   - POST `/api/auth/logout` - Clear session
   - GET `/api/auth/me` - Get current logged-in user info

2. **Add password hashing**:
   - Install `passlib` and `python-jose`
   - Hash passwords in database
   - Create JWT tokens for sessions

3. **Update project queries**:
   - Filter by company_id for scenarios/overview
   - Keep comparison open to all projects

### Frontend (React):

1. **Create Login Page** (`frontend/src/pages/LoginPage.tsx`):
   - Professional form with username/password
   - Call `/api/auth/login`
   - Store token in localStorage
   - Redirect to dashboard on success

2. **Add Auth Context** (`frontend/src/contexts/AuthContext.tsx`):
   - Store current user (company_id, full_name, role)
   - Provide login/logout functions
   - Check if user is authenticated

3. **Protect Routes**:
   - Wrap App.tsx with AuthProvider
   - Show LoginPage if not authenticated
   - Show main dashboard if authenticated

4. **Update Tabs**:
   - Pass company_id to API calls
   - Filter projects in Overview/Scenarios
   - Keep Comparison showing all projects

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
