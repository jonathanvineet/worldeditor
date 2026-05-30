# Gazebo Studio Backend

A FastAPI-based backend service for Gazebo Studio, providing RESTful APIs for the 3D world editor.

## Prerequisites

- Python 3.8+
- pip

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the development server with auto-reloading:

```bash
python -m uvicorn app.main:app --reload
```

The server will start on `http://localhost:8000`

### Alternative: Run with Uvicorn directly

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Main FastAPI application
│   ├── routes/
│   │   ├── __init__.py
│   │   └── health.py           # Health check endpoint
│   └── models/
│       └── __init__.py         # Pydantic models
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## Available Endpoints

### Health Check
- **GET** `/api/health`
  - Returns the service status
  - Response: `{"status": "ok", "service": "gazebo-studio-backend"}`

## Configuration

### CORS
The backend is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:3001`

Modify the `allow_origins` list in `app/main.py` to add additional origins.

## Development

### Adding New Routes

1. Create a new file in `app/routes/` (e.g., `app/routes/projects.py`)
2. Define your router:
```python
from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["projects"])

@router.get("/projects")
async def get_projects():
    return {"projects": []}
```

3. Include it in `app/main.py`:
```python
from app.routes import projects
app.include_router(projects.router)
```

### Adding Data Models

Add Pydantic models in `app/models/` for type safety and validation:
```python
from pydantic import BaseModel

class Project(BaseModel):
    name: str
    description: str
```

## Best Practices

- Use async/await for I/O operations
- Validate input with Pydantic models
- Use proper HTTP status codes
- Document endpoints with docstrings
- Keep routes organized in separate files
- Use dependency injection for shared logic

## Dependencies

- **FastAPI** (0.104.1): Modern web framework for building APIs
- **Uvicorn** (0.24.0): ASGI server for running FastAPI
- **python-multipart** (0.0.6): Support for form data parsing

## Troubleshooting

### Port already in use
If port 8000 is already in use, specify a different port:
```bash
python -m uvicorn app.main:app --port 8001 --reload
```

### Module not found
Ensure you're in the backend directory and have installed dependencies:
```bash
pip install -r requirements.txt
```

## License

MIT
