# Testing Strategy

## Backend
- Unit tests for services and domain rules.
- Integration tests for API + PostgreSQL + Redis.
- Security tests for auth and input validation.

## Frontend
- Component tests (Vitest + Testing Library).
- Integration tests for course/challenge flows.
- E2E tests for login, submission, and AI tutor.

## AI
- Prompt regression suite.
- RAG retrieval relevance checks.
- Safety checks and hallucination monitoring.

## CI Gates
- Lint + type checks + unit tests on every PR.
- Optional nightly load/perf tests.

