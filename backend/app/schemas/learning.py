from pydantic import BaseModel


class TrackOut(BaseModel):
    slug: str
    title: str
    level: str
    description: str


class ChallengeRunIn(BaseModel):
    code: str
    stdin: str = ""


class AITutorIn(BaseModel):
    question: str
    context: str = ""


class CodeReviewIn(BaseModel):
    code: str
    rubric: str = "correctness, readability, testing, performance"

