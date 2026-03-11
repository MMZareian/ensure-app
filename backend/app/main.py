"""
Ensure Safety Analytics Backend

FastAPI application serving safety training analytics data.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import projects, scenarios, comparison, workers, auth

# Create FastAPI app
app = FastAPI(
    title="Ensure Safety Analytics API",
    description="Backend API for Ensure Safety Knowledge Management System",
    version="1.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing)
# This allows the frontend (React) to call the backend (FastAPI)
# In production, you'd restrict this to your specific domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production: ["https://your-domain.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)  # Authentication endpoints
app.include_router(projects.router)
app.include_router(scenarios.router)
app.include_router(comparison.router)
app.include_router(workers.router)


@app.get("/")
def root():
    """
    Root endpoint - health check.

    Returns:
        Welcome message
    """
    return {
        "message": "Ensure Safety Analytics API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint.

    Returns:
        Health status
    """
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    # Run the server
    # uvicorn will reload automatically when code changes (reload=True)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
