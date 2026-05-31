# API Design (`/api/v1`)

## Authentication
- `POST /auth/email/register`
- `POST /auth/email/login`
- `GET /auth/oauth/google/start`
- `GET /auth/oauth/google/callback`
- `GET /auth/oauth/github/start`
- `GET /auth/oauth/github/callback`
- `GET /auth/me` (Bearer JWT)

## Learning
- `GET /learning/tracks`
- `GET /learning/courses/{slug}`
- `GET /learning/lessons/{id}`
- `POST /learning/quizzes/{id}/submit`

## Interactive
- `POST /challenges/run`
- `GET /challenges/jobs/{job_id}`
- `POST /challenges/{id}/submit`
- `POST /debugging/{id}/submit`

## AI
- `POST /ai/tutor`
- `POST /ai/review`
- `POST /ai/hints`
- `POST /ai/explain`

## Gamification
- `GET /gamification/profile`
- `GET /gamification/leaderboard`
- `GET /gamification/badges`
- `GET /gamification/achievements`

## Projects
- `GET /projects/templates`
- `POST /projects/{id}/submit`
- `GET /projects/{id}/rubric`
