"""
Simple script to run the FastAPI server.

Usage:
    python run.py
"""
import sys
from pathlib import Path

# Add app directory to Python path
app_dir = Path(__file__).parent / "app"
sys.path.insert(0, str(app_dir))

if __name__ == "__main__":
    import uvicorn

    print("=" * 60)
    print("Starting Ensure Safety Analytics API Server")
    print("=" * 60)
    print("API will be available at: http://localhost:8000")
    print("API Documentation at: http://localhost:8000/docs")
    print("Press CTRL+C to stop the server")
    print("=" * 60)

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
