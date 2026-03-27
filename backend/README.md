# Bridge Safety Analytics - Backend

FastAPI backend for the Bridge Safety Analytics Platform.

## Setup

1. **Install Python dependencies:**

```bash
cd backend
pip install -r requirements.txt
```

2. **Verify database exists:**

Make sure the SQLite database is in `../data/ensure_mock.sqlite`

3. **Run the server:**

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- **Interactive docs (Swagger):** http://localhost:8000/docs
- **Alternative docs (ReDoc):** http://localhost:8000/redoc

## API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/{project_id}/overview` - Project overview
- `GET /api/projects/{project_id}/scenarios` - Project scenarios

### Scenarios
- `GET /api/scenarios/{scenario_id}` - Scenario detail
- `GET /api/scenarios/compare?scenario_a=g1&scenario_b=g2` - Compare scenarios

### Comparison
- `GET /api/comparison/projects?project_ids=p1,p2&mode=ident&include_industry=true` - Radar data
- `GET /api/comparison/table?project_ids=p1,p2&include_industry=true` - Table data
- `GET /api/industry/benchmark` - Industry benchmark

### Workers
- `GET /api/workers/summary?project_id=p1&scenario_id=all` - Worker summary
- `GET /api/workers/trends?project_id=p1` - Worker trends

## Testing

You can test the API using:
- The built-in Swagger UI at `/docs`
- curl commands
- Postman
- Or any HTTP client

Example curl command:
```bash
curl http://localhost:8000/api/projects
```
