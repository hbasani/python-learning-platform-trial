from fastapi import APIRouter

from app.schemas.learning import TrackOut

router = APIRouter(prefix="/learning", tags=["learning"])

TRACKS = [
    {"slug": "beginner-python", "title": "Beginner Python", "level": "beginner", "description": "Syntax, control flow, functions"},
    {"slug": "intermediate-python", "title": "Intermediate Python", "level": "intermediate", "description": "Files, modules, decorators"},
    {"slug": "advanced-python", "title": "Advanced Python", "level": "advanced", "description": "Concurrency, internals, optimization"},
    {"slug": "data-structures", "title": "Data Structures", "level": "intermediate", "description": "Lists, trees, hash maps"},
    {"slug": "algorithms", "title": "Algorithms", "level": "advanced", "description": "Sorting, searching, graph traversal"},
    {"slug": "oop", "title": "OOP", "level": "intermediate", "description": "Classes, polymorphism, composition"},
    {"slug": "api-development", "title": "API Development", "level": "intermediate", "description": "FastAPI and integrations"},
    {"slug": "testing", "title": "Testing", "level": "intermediate", "description": "pytest, fixtures, mocks"},
    {"slug": "automation", "title": "Automation", "level": "intermediate", "description": "Scripting and scheduling"},
    {"slug": "data-science", "title": "Data Science", "level": "advanced", "description": "NumPy, pandas, ML basics"},
    {"slug": "ai-engineering", "title": "AI Engineering", "level": "advanced", "description": "RAG, evals, agent workflows"}
]


@router.get("/tracks", response_model=list[TrackOut])
async def list_tracks() -> list[TrackOut]:
    return [TrackOut(**t) for t in TRACKS]

