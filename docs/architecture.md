# Architecture

## High-Level
- Next.js frontend for learning UX, coding playground, and gamification views.
- FastAPI backend for APIs, AI orchestration, challenge execution, and progress scoring.
- Dedicated execution worker service for isolated Python challenge runtime.
- PostgreSQL for durable relational data.
- Redis for caching, sessions, and leaderboard snapshots.
- Redis queues for challenge execution jobs and result handoff.
- OpenAI API for AI tutor and code review.

## Learning Domain
- Tracks: beginner, intermediate, advanced
- Modules: data structures, algorithms, OOP, API dev, testing, automation, data science, AI engineering
- Interactive units: coding challenges, quizzes, debugging exercises

## AI + RAG Flow
1. Receive learner question or code review request.
2. Retrieve top-k chunks from course docs and prior attempts.
3. Build grounded prompt with user context.
4. Generate tutor/reviewer response.
5. Log response metadata for evaluation and safety checks.
