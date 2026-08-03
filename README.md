# McKinsey AI Market Research & Strategy Engine

Production-oriented governed research workflow for consultants. It automates intake, planning, web research, evidence extraction, validation, aggregation, report generation, human review, audit logs, and Qdrant-backed research memory.

## Structure

- `frontend/` Next.js 15 App Router, JavaScript, Tailwind CSS, shadcn-style components, Redux Toolkit, React Query, Framer Motion, Recharts, Axios.
- `backend/` Node.js, Express, JWT auth, Bcrypt, Mongoose, LangGraph, Gemini 2.5 Pro, Tavily, Firecrawl, Playwright, Qdrant.
- `docs/` architecture and deployment notes.

## Run Locally

1. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. Configure environment:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```
   For local development, `backend/.env` can use `mongodb://127.0.0.1:27017/market_research_engine`. For production, set `MONGODB_URI` to your MongoDB Atlas connection string.
3. Start services:
   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```
4. Open `http://localhost:3000`.

The application uses real database and API data. Empty dashboards reflect an empty MongoDB database.

## Test

```bash
cd backend && npm test
cd frontend && npm test
```
