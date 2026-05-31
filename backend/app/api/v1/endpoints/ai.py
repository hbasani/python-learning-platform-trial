from fastapi import APIRouter

from app.schemas.learning import AITutorIn, CodeReviewIn
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/tutor")
async def tutor(payload: AITutorIn) -> dict[str, str]:
    answer = await ai_service.tutor(payload.question, payload.context)
    return {"answer": answer}


@router.post("/review")
async def review(payload: CodeReviewIn) -> dict[str, str]:
    feedback = await ai_service.review_code(payload.code, payload.rubric)
    return {"feedback": feedback}

