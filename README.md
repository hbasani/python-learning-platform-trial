# Python Learning Platform (Production-Ready Starter)

Production-oriented monorepo starter for an AI-powered Python learning platform.

## Stack
- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn-style component structure
- Backend: FastAPI, Python 3.13, PostgreSQL, Redis
- AI: OpenAI API, RAG architecture, AI tutor, AI code reviewer

## Run
1. Copy env files:
   - `backend/.env.example` -> `backend/.env`
   - `frontend/.env.example` -> `frontend/.env.local`
2. Run migrations:
   - `cd backend`
   - `alembic upgrade head`
3. Start stack:
   - `docker compose up --build`
4. URLs:
   - Frontend: `http://localhost:3000`
   - Backend docs: `http://localhost:8000/docs`

## Monorepo
- `frontend/`
- `backend/`
- `executor_worker/`
- `infra/`
- `docs/`
