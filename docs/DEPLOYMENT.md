# Deployment Guide

## Frontend: Vercel

Set the project root to `frontend`.

Environment variables:

```bash
NEXT_PUBLIC_API_URL=https://your-render-api.onrender.com/api
```

Build command:

```bash
npm run build
```

## Backend: Render

Set the service root to `backend`.

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Environment variables are listed in `backend/.env.example`.

## Managed Services

- MongoDB Atlas: create a database and set `MONGODB_URI`.
- Qdrant Cloud: create an API key and set `QDRANT_URL` and `QDRANT_API_KEY`.
- Gemini: set `GEMINI_API_KEY`.
- Tavily: set `TAVILY_API_KEY`.
- Firecrawl: set `FIRECRAWL_API_KEY`.
