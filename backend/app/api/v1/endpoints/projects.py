from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/projects", tags=["projects"])


class ProjectSubmitIn(BaseModel):
    repository_url: str
    notes: str = ""


PROJECTS = [
    "calculator",
    "expense-tracker",
    "weather-app",
    "rest-api",
    "web-scraper",
    "automation-framework",
    "ai-chatbot"
]


@router.get("/templates")
async def templates() -> list[dict]:
    return [{"slug": p, "title": p.replace("-", " ").title()} for p in PROJECTS]


@router.post("/{project_slug}/submit")
async def submit_project(project_slug: str, payload: ProjectSubmitIn) -> dict:
    return {"project_slug": project_slug, "status": "submitted", "repo": payload.repository_url}


@router.get("/{project_slug}/rubric")
async def project_rubric(project_slug: str) -> dict:
    return {
        "project_slug": project_slug,
        "criteria": ["correctness", "readability", "tests", "documentation", "production-readiness"]
    }

