# Bridge Safety Analytics Platform — Change Log

This file is a structured record of the code, build, and deployment changes for the Bridge Safety Analytics Platform (formerly "Ensure"). It helps AI assistants understand the project history and continue work without re-explaining context.

---

## Recent Updates (2026-03-26)

### Application Rebranding: "Ensure" → "Bridge"
- Changed application name throughout the platform
- Updated LoginPage, Topbar, and ApplicationHub components
- Increased logo sizes for better visibility
- Updated all documentation files

### Application Hub Updates
- **App 1**: Renamed to "Bridge" (was "Ensure")
- **App 2**: Renamed to "Overhead Crane Simulator" with special styling
  - Uses Crane_Logo.png
  - Orange gradient text effect
  - "Under Development" modal functionality maintained

### Industry Average Calculation Improvements
- **Fixed High Energy and Direct Control score calculations**
  - Previous issue: Non-identified hazards were counted as 0, artificially lowering averages
  - Solution: Removed `ELSE 0` clauses from CASE statements in `queries.py`
  - Now correctly calculates scores only among identified hazards
- **Two-stage averaging**: Calculate scenario averages, then average those (equal weighting per scenario)
- **Percentage formatting**: Fixed to display exactly 2 decimal places using `.toFixed(2)`
- **Dynamic comparison messages**: Shows each selected project's performance vs industry average

### Files Modified in Recent Updates
- `frontend/src/pages/LoginPage.tsx` - Rebranded to "Bridge"
- `frontend/src/components/Topbar.tsx` - Rebranded to "Bridge"
- `frontend/src/pages/ApplicationHub.tsx` - Updated App 2 to "Overhead Crane Simulator"
- `frontend/src/styles.css` - Increased logo sizes, added crane title styling
- `frontend/src/components/Pill.tsx` - Fixed percentage formatting
- `frontend/src/tabs/ComparisonTab.tsx` - Added industry comparison messages
- `backend/app/services/queries.py` - Fixed industry benchmark calculation
- Documentation files updated (README.md, RUN_LOCAL.md, AUTHENTICATION_UPDATE.md, backend/README.md)

---

## Historical Context

# Original deployment session detailed change log

---

## 1. Purpose of today's work

The main goal today was to take the locally working prototype and move it toward a working deployment on DigitalOcean App Platform, while keeping the current architecture:

- **Frontend**: React + TypeScript + Vite
- **Backend**: FastAPI (Python)
- **Database for prototype**: SQLite
- **Repository structure**: monorepo with separate `frontend` and `backend` folders

We also created and organized mock datasets earlier so the app could run before the real data arrives.

---

## 2. High-level summary of what happened

Today's work had four major phases:

1. **Prepared the project for deployment** by adjusting frontend/backend files and folder usage.
2. **Fixed frontend TypeScript/build issues** that appeared in DigitalOcean but did not block local dev mode.
3. **Fixed DigitalOcean frontend deployment issues** caused by dependency caching / Linux-specific Rollup dependency behavior.
4. **Added and deployed the backend**, then identified a remaining routing issue affecting login (`Not Found`).

At the end of today:

- **Frontend deployment is successful on DigitalOcean**.
- **Backend deployment is successful on DigitalOcean**.
- The **remaining issue** is likely DigitalOcean path trimming on the `/api` route, which breaks login/API routing.

---

## 3. Dataset work done before deployment

### 3.1 Created mock datasets in 3 formats
A mock dataset pack was created in three representations:

- **CSV**
- **JSON**
- **SQLite**

### Reason
The same core mock data was represented in three formats for different purposes:

- **CSV**: easiest for manual inspection, Excel checking, debugging, and sharing.
- **JSON**: easiest for frontend/prototype use, because the current UI naturally thinks in nested objects.
- **SQLite**: easiest for backend/API development and closest to how production database querying will work.

### Important conceptual note
These were **not three different datasets**. They were the **same logical mock data** represented in three different formats.

---

## 4. Deployment-preparation code changes suggested/applied today

This section records the code changes we worked through, including both the initial deployment-prep changes and the later fixes.

---

## 5. Frontend changes

### 5.1 API client base URL logic changed
**File:** `frontend/src/api/client.ts`

### Change
The frontend API base URL logic was changed from a hardcoded localhost fallback to:

```ts
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
```

### Reason
Originally, the frontend defaulted to `http://localhost:8000`, which is fine locally but wrong in production on DigitalOcean. In deployment:

- using a hardcoded localhost breaks the live site,
- using `import.meta.env.VITE_API_URL ?? ''` allows the app to use a deployment-specific environment variable or relative routing.

### Why it mattered
This was necessary so the deployed frontend would not try to call a backend on the visitor's own machine.

---

### 5.2 Added Vite environment typing
**File added:** `frontend/src/vite-env.d.ts`

### Change
A Vite environment declaration file was added.

### Reason
DigitalOcean production build failed earlier with:

- `Property 'env' does not exist on type 'ImportMeta'`

This happens when TypeScript does not know about Vite's `import.meta.env` typing.

### Why it mattered
The app could still appear to work in local dev mode, but strict production build (`tsc && vite build`) failed without this file.

---

### 5.3 Removed/fixed TypeScript build errors
**Files touched during the frontend cleanup:**

- `frontend/src/api/client.ts`
- `frontend/src/components/ScenarioComparisonView.tsx`
- `frontend/src/tabs/ComparisonTab.tsx`
- `frontend/src/tabs/ScenariosTab.tsx`
- `frontend/src/tabs/WorkersTab.tsx`

### Changes
The following kinds of fixes were applied:

- removed unused imports / variables,
- removed or adjusted values that were declared but never read,
- fixed a null-safety issue in chart tooltip/context parsing.

### Reason
DigitalOcean production build surfaced TypeScript errors that local dev mode had tolerated.

Examples of the earlier errors included:

- unused declarations,
- `context.parsed` possibly being null,
- import meta typing problems.

### Why it mattered
These errors blocked deployment even though the app seemed fine locally.

---

### 5.4 Frontend Node version pinned
**File:** `frontend/package.json`

### Change
Added engine requirement:

```json
"engines": {
  "node": "20.x"
}
```

### Reason
DigitalOcean was initially building the frontend with its default Node version, which was not explicitly pinned. Pinning Node reduced build inconsistency between environments.

### Why it mattered
This made the cloud build environment more predictable and reduced version-related surprises.

---

### 5.5 Local frontend dependency cleanup performed
**Manual/local step, not a code rewrite**

### Change
The following manual cleanup was performed locally:

- deleted `frontend/node_modules`
- attempted to delete `frontend/package-lock.json`
- re-ran:
  - `npm install`
  - `npm run build`

### Reason
DigitalOcean logs showed build issues related to stale or platform-specific dependencies.

### Why it mattered
This helped regenerate dependencies cleanly and confirmed the frontend could build successfully in local production mode.

---

### 5.6 Important workspace observation
**Repo-level behavior**

### Observation
The project uses npm workspaces from the repo root, so a lockfile may exist at:

- `ensure-app/package-lock.json`

rather than inside:

- `frontend/package-lock.json`

### Reason
Because the root `package.json` manages the workspace, the lockfile can live at the root instead of the frontend subfolder.

### Why it mattered
This explained why the frontend folder sometimes did not show a lockfile after reinstalling packages.

---

## 6. Backend changes

### 6.1 Assistant-prepared database path improvement
**File prepared in the assistant-generated patch set:** `backend/app/database.py`

### Change proposed/prepared
A version of `database.py` was prepared that could:

- read a database path from an environment variable,
- otherwise fall back to bundled SQLite paths.

### Reason
That would make deployment on DigitalOcean cleaner and remove ambiguity about where the SQLite file is stored.

### Important note
This was part of the assistant-generated deployment patch set, but the **current GitHub version still appears to use hardcoded fallback paths** rather than reading `DATABASE_PATH`. So this item should be treated as a **prepared improvement / deployment recommendation**, not a guaranteed current committed state.

### Why it mattered
It would make future deployment and migration to PostgreSQL easier.

---

### 6.2 SQLite file bundled for backend deployment
**Location used in assistant-prepared deployment patch:** `backend/data/ensure_mock.sqlite`

### Reason
When App Platform deploys a component from a monorepo subdirectory, only files in that source directory are reliably available to that component at runtime. Therefore bundling the SQLite demo DB inside `backend/data/` is safer than relying on a root-level `data/` folder.

### Why it mattered
This avoids backend runtime errors caused by missing database files inside the deployment container.

---

## 7. Deployment configuration changes on DigitalOcean

These are not code-file changes inside the repo, but they are essential project-state changes that another AI assistant must understand.

---

### 7.1 Frontend deployed as a Static Site

### Final configuration used
- **Component type:** Static Site
- **Source directory:** `frontend`
- **Build command (final working version):**

```bash
rm -rf node_modules package-lock.json && npm install && npm run build
```

- **Output directory:** `dist`

### Reason
The frontend is a Vite-generated static app. It should not be deployed as a Node web service.

### Why it mattered
DigitalOcean originally auto-detected the whole repo as a Node.js web service, which was wrong for the frontend.

---

### 7.2 Backend deployed as a Web Service

### Final configuration used
- **Component type:** Web Service
- **Source directory:** `backend`
- **Runtime:** Python
- **Run command:**

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8080
```

- **Public HTTP port:** `8080`
- **Route:** `/api`

### Reason
The backend is FastAPI and needs to run as a Python service.

### Why it mattered
This exposed the API under the app domain and kept the architecture aligned with the original plan.

---

### 7.3 Switched frontend deployment strategy from normal deploy to forced rebuild / cache-clearing rebuild

### Change
Instead of using plain deploy repeatedly, we used:

- **Force rebuild and deploy**

and also changed the frontend build command to explicitly remove cached dependencies before reinstalling.

### Reason
The frontend build kept failing on DigitalOcean due to missing Linux Rollup optional/native packages. The problem appeared to be affected by stale cache and platform-specific dependency resolution.

### Why it mattered
After cache-clearing and a forced rebuild, the frontend finally deployed successfully.

---

### 7.4 App spec investigated for route behavior

### Current app-spec situation
The backend is exposed at route `/api`, but the DigitalOcean backend routing currently shows **Path trimmed**.

### Reason this matters
If the incoming request is:

```text
/api/auth/login
```

and DigitalOcean trims the `/api` prefix before forwarding, the backend receives:

```text
/auth/login
```

But the backend routes are defined under `/api/...`, so this results in **404 Not Found** on login.

### Required app-spec change (next step)
Inside the backend ingress rule, the backend component should be changed to preserve the full path prefix:

```yaml
ingress:
  rules:
  - component:
      name: backend
      preserve_path_prefix: true
    match:
      authority:
        exact: ""
      path:
        prefix: /api
```

### Status
This is the **main remaining deployment issue** identified today.

---

## 8. Temporary/attempted solutions discussed during debugging

These are useful to remember even if they are not the final permanent solution.

### 8.1 `.do/app.yaml` was reviewed
A deployment YAML existed in the repo, but it was not the main control path used in the DigitalOcean UI deployment.

### Why it mattered
The Control Panel did not auto-apply the intended monorepo split the way expected.

### Note
The current `.do/app.yaml` still contains some values that are not ideal for the final production path and should not be assumed to be the authoritative source of truth for the live deployment.

---

### 8.2 Optional Linux Rollup dependency was discussed as a possible fix
At one point, adding an explicit optional dependency for the Linux Rollup package was discussed as a workaround for the cloud build problem.

### Reason
The DigitalOcean error repeatedly referenced a Linux Rollup package not being found.

### Outcome
The frontend was ultimately deployed successfully after cache-clearing/forced rebuild and build-command cleanup, so this optional dependency workaround is not the current main blocker.

---

## 9. Current known good state at the end of today

### Confirmed working
- mock dataset pack exists and is usable,
- frontend local production build works,
- frontend DigitalOcean deployment works,
- backend DigitalOcean deployment works,
- app and components are live in DigitalOcean.

### Confirmed remaining issue
- login returns **Not Found**,
- likely because the backend route `/api` is being **path trimmed** by DigitalOcean before the request reaches FastAPI.

### Most likely next action
Update the **DigitalOcean app spec** to set:

```yaml
preserve_path_prefix: true
```

for the backend ingress rule.

---

## 10. Practical guidance for Claude or another AI assistant later

If another AI assistant picks up this project later, it should assume the following:

1. The app is a **monorepo** with:
   - `frontend/` = React + TypeScript + Vite static site
   - `backend/` = FastAPI web service

2. The frontend deployment problem was mainly due to:
   - TypeScript production-build issues,
   - then DigitalOcean/Linux Rollup dependency cache issues.

3. The frontend is now deployed successfully.

4. The backend is also deployed successfully.

5. The main unresolved production issue is **API path handling**, not frontend build or backend startup.

6. Before changing frontend or backend source logic again, the assistant should first verify whether the route-prefix preservation issue has already been fixed in the DigitalOcean app spec.

---

## 11. Recommended next checklist

When resuming the project later, check these in order:

- [ ] Confirm whether `preserve_path_prefix: true` has been added to the backend ingress rule in the DigitalOcean app spec.
- [ ] Test `/api/health` directly on the live domain.
- [ ] Test `/api/docs` directly on the live domain.
- [ ] Test login again using demo credentials.
- [ ] Only if login still fails after the routing fix, inspect backend runtime logs.
- [ ] If needed later, clean up backend DB path handling by making `database.py` explicitly use an environment variable.

---

## 12. Shortest plain-English summary

Today we:

- prepared the app for deployment,
- fixed frontend TypeScript issues,
- fixed frontend DigitalOcean build/dependency issues,
- successfully deployed frontend and backend,
- and narrowed the remaining live-app problem to backend route-prefix trimming on DigitalOcean.

