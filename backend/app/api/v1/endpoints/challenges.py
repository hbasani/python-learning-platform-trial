from fastapi import APIRouter

from app.schemas.learning import ChallengeRunIn
from app.services.challenge_queue_service import challenge_queue_service

router = APIRouter(prefix="/challenges", tags=["challenges"])


@router.post("/run")
async def run_code(payload: ChallengeRunIn) -> dict:
    job_id = await challenge_queue_service.submit(payload.code, payload.stdin)
    result = await challenge_queue_service.wait_for_result(job_id)
    return {"job_id": job_id, **result}


@router.get("/jobs/{job_id}")
async def get_job(job_id: str) -> dict:
    return await challenge_queue_service.get_status(job_id)
