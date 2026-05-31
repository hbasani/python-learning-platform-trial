from fastapi import APIRouter
from app.db.redis_client import redis

router = APIRouter(prefix="/gamification", tags=["gamification"])


@router.get("/profile")
async def profile() -> dict:
    return {"xp": 1200, "coins": 350, "streak_days": 7, "badges": ["first-steps", "debugger"]}


@router.get("/leaderboard")
async def leaderboard() -> list[dict]:
    key = "leaderboard:global"
    cached = await redis.get(key)
    if cached:
        import json
        return json.loads(cached)

    data = [
        {"rank": 1, "user": "Ada", "xp": 4200},
        {"rank": 2, "user": "Grace", "xp": 3800},
        {"rank": 3, "user": "Linus", "xp": 3600}
    ]
    import json
    await redis.set(key, json.dumps(data), ex=60)
    return data


@router.get("/achievements")
async def achievements() -> list[dict]:
    return [
        {"key": "calculator-builder", "title": "Calculator Builder"},
        {"key": "api-architect", "title": "API Architect"},
        {"key": "ai-apprentice", "title": "AI Apprentice"}
    ]
