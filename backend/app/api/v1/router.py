from fastapi import APIRouter

from app.api.v1.endpoints import ai, auth, challenges, gamification, health, learning, projects

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(learning.router)
api_router.include_router(ai.router)
api_router.include_router(challenges.router)
api_router.include_router(auth.router)
api_router.include_router(gamification.router)
api_router.include_router(projects.router)
