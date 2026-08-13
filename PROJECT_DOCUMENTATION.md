# McKinsey: AI Market Research & Strategy Engine

Complete Project Documentation

Date: August 10, 2026

---

## Table of Contents

1. [Title Page](#1-title-page)
2. [Project Overview](#2-project-overview)
3. [Features](#3-features)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Project Workflow](#6-project-workflow)
7. [AI and Agent Architecture](#7-ai-and-agent-architecture)
8. [Detailed Module Description](#8-detailed-module-description)
9. [Folder Structure](#9-folder-structure)
10. [Database Documentation](#10-database-documentation)
11. [API Documentation](#11-api-documentation)
12. [Authentication and Authorization](#12-authentication-and-authorization)
13. [File Upload and Document Processing](#13-file-upload-and-document-processing)
14. [AI Research Workflow](#14-ai-research-workflow)
15. [Report Generation](#15-report-generation)
16. [Frontend Documentation](#16-frontend-documentation)
17. [Backend Documentation](#17-backend-documentation)
18. [Installation and Setup](#18-installation-and-setup)
19. [Environment Variables](#19-environment-variables)
20. [How to Run the Project](#20-how-to-run-the-project)
21. [User Guide](#21-user-guide)
22. [Error Handling](#22-error-handling)
23. [Security](#23-security)
24. [Testing](#24-testing)
25. [Performance Considerations](#25-performance-considerations)
26. [Limitations](#26-limitations)
27. [Future Enhancements](#27-future-enhancements)
28. [Deployment](#28-deployment)
29. [Screenshots](#29-screenshots)
30. [References and Documentation](#30-references-and-documentation)
31. [Conclusion](#31-conclusion)

---

## 1. Title Page

| Item | Details |
|---|---|
| Project name | McKinsey: AI Market Research & Strategy Engine |
| Project type | Full-stack AI market research, strategy intelligence, evidence review, and report-generation platform |
| Team/member information | No contributors file, team file, or explicit project member metadata was found in the repository. The UI supports named users after signup/login. |
| Frontend stack | Next.js 15, React 19, Tailwind CSS, Redux Toolkit, TanStack React Query, Axios, Recharts |
| Backend stack | Node.js 20, Express 4, MongoDB/Mongoose, JWT, bcrypt, LangGraph, Gemini, Tavily, Firecrawl, Playwright, Qdrant |
| Database | MongoDB through Mongoose models |
| AI/LLM provider | Google Gemini through `@google/generative-ai` |
| Date | August 10, 2026 |

---

## 2. Project Overview

### Introduction

McKinsey: AI Market Research & Strategy Engine is a full-stack web application for creating market research jobs, collecting source-backed evidence, validating claims, generating strategy reports, and monitoring research activity through dashboards. The system combines a Next.js frontend with an Express/MongoDB backend and a LangGraph-based AI workflow.

### Problem Statement

Market research and strategic analysis often require consultants or business analysts to search across many public sources, compare competitors, extract evidence, validate findings, and convert insights into professional reports. Manual workflows can be slow, inconsistent, and difficult to audit.

### Proposed Solution

The project implements a governed AI-assisted research platform where authenticated users can submit a research question, generate a research plan, collect public sources, extract evidence, validate findings, create reports, review evidence, manage uploads, search project knowledge, and export reports.

### Purpose

The purpose of the project is to demonstrate a professional AI-enabled market strategy workflow suitable for technical review, college project evaluation, and Demo Day presentation.

### Objectives

- Provide authenticated access for consultants, reviewers, and administrators.
- Convert research intake into tracked research jobs.
- Generate or regenerate structured research plans.
- Execute a multi-step research workflow using search, browsing, extraction, validation, aggregation, and report generation.
- Maintain evidence records with source references and confidence scores.
- Provide reviewer/admin evidence approval, rejection, and flagging.
- Store reusable validated knowledge in MongoDB and optionally Qdrant.
- Generate and export reports in Markdown, CSV, PDF, and DOCX formats.
- Provide dashboard, operations, search, uploads, and workspace views.

### Key Benefits

- Reduces manual research coordination effort.
- Improves source traceability through `Source`, `EvidenceRecord`, and `ValidationResult` models.
- Separates user roles for research creation, evidence review, and operations monitoring.
- Provides deterministic fallback behavior for selected AI paths when Gemini quota/model access fails.
- Makes project activity visible through MongoDB-backed dashboard aggregations.

---

## 3. Features

### Implemented Features

| Feature | Status | Description |
|---|---|---|
| User signup | Implemented | Public signup creates `consultant` or `reviewer` accounts. Public `admin` signup is blocked. |
| User login | Implemented | Email/password login returns access and refresh tokens. |
| JWT authentication | Implemented | Protected backend routes require `Authorization: Bearer <accessToken>`. |
| Role-based access control | Implemented | Reviewer/admin-only and admin-only route protection is implemented with `requireRole`. |
| Persistent frontend authentication | Implemented | Frontend stores tokens and cached user data in `localStorage` and validates with `/api/auth/me`. |
| Logout | Implemented on frontend | Logout removes tokens from `localStorage`; no backend logout/revoke endpoint exists. |
| Research intake | Implemented | Users submit question, industry, geography, timeframe, competitors, and output type. |
| Background planning and workflow start | Implemented | New research jobs trigger asynchronous planning, auto-approval, and workflow execution. |
| Research plan regeneration | Implemented | Users can regenerate a plan for owned jobs; admins can regenerate any job plan. |
| Manual plan approval/run endpoints | Implemented | Plan approval and workflow run endpoints exist, although new jobs are also auto-approved and executed. |
| LangGraph research workflow | Implemented | Workflow nodes browse, extract, validate, aggregate, and generate a report. |
| Tavily search | Implemented | Used for source discovery during workflow execution when `TAVILY_API_KEY` is configured. |
| Firecrawl scraping | Implemented as optional | Used when `FIRECRAWL_API_KEY` is configured; otherwise returns `null`. Code uses `/v1/scrape`. |
| Playwright page retrieval | Implemented | Used as a fallback browser text retrieval mechanism when Firecrawl does not return content. |
| Gemini planning/extraction/aggregation/reporting | Implemented | Gemini is called through `generateJson` and `generateText`. |
| AI quota/model fallback | Partially implemented | Planner, extraction, aggregation, report generation, and dashboard analysis include deterministic fallbacks for quota/provider errors. Chat does not include a fallback. |
| Evidence validation | Implemented | Validation computes credibility, recency, duplicate risk, contradiction risk, and status. |
| Evidence review queue | Implemented | Reviewers/admins can approve, flag, or reject evidence. |
| Report listing and detail retrieval | Implemented | Users can list and retrieve reports scoped by ownership, with admin global access. |
| Report export | Implemented | Backend streams Markdown, CSV, PDF, and DOCX exports. Frontend supports PDF from reports page and PDF/MD/CSV from recent reports. |
| Dashboard metrics | Implemented | Aggregates jobs, reports, evidence, knowledge, uploads, source quality, validation, industries, and competitors. |
| Admin operations dashboard | Implemented | Admin-only metrics for total jobs, failed jobs, validation failures, runtime, industries, competitors, and source quality. |
| Knowledge base | Implemented | Lists knowledge records and allows reviewer/admin creation. Optional Qdrant semantic results are returned when search query is provided. |
| Qdrant semantic memory | Implemented as optional | Report workflow attempts vector upsert; knowledge search attempts semantic search and falls back to empty semantic results on error. |
| File uploads | Implemented | Supports multipart upload of up to eight files, 50 MB each, with MIME validation. |
| Uploaded file management | Implemented | Users can list uploads and soft-delete owned uploads. |
| Global search | Implemented | Searches owned jobs, owned reports, global knowledge, and uploaded files with status `uploaded`. |
| AI assistant chat | Implemented | Sends a message to Gemini and returns a strategy-oriented response. |
| AI dashboard analysis | Implemented | Global search "Analyze" creates structured Gemini/fallback analysis and displays charts. |
| Notifications API | Implemented | Lists notifications, marks one as read, and marks all as read. Falls back to recent audit logs when no notification documents exist. |
| Notifications menu/panel components | Implemented | Components exist and call the notifications API. |
| Frontend dashboard and workspaces | Implemented | Dashboard, research explorer, workflow monitor, research plans, reports, evidence review, data sources, knowledge base, AI assistant, operations, settings, and analysis workspaces exist. |
| Tests | Implemented | Backend and frontend Jest tests exist for selected units/routes/configuration. |
| Deployment configuration | Partially implemented | Frontend includes `vercel.json`; backend has Render-compatible scripts and environment examples. |

### Incomplete or Limited Features

| Feature | Current State |
|---|---|
| Password reset | The frontend has a forgot-password UI, but no backend password-reset API, email delivery, token generation, or password update flow was found. |
| Backend logout/revoke | No logout route or refresh-token revocation endpoint was found. Logout is client-side token removal only. |
| Admin account creation | Public admin signup is intentionally blocked; no separate admin user-management route was found. |
| Durable uploaded file storage | Uploaded files are processed in memory and represented by metadata. The original file is not written to disk/cloud storage by the upload controller. |
| Rich DOCX/XLSX/PPTX/CSV extraction | Non-PDF uploads are processed by `buffer.toString("utf8")`/Latin-1 normalization, not specialized Office or spreadsheet parsers. |
| Uploaded files in research workflow | Uploads create knowledge memory when text is extracted, but the LangGraph workflow itself collects web sources through Tavily/Firecrawl/Playwright and does not directly attach uploaded files to a specific research job. |
| Separate market/competitor/finance/news agents | The code does not define separate finance or news agents. Competitor tasks are handled inside the planner, search tasks, aggregation, and report generation. |
| Notifications page route | `frontend/app/(dashboard)/notifications/page.js` is commented out and has no active default export. Notifications API and components exist, but the route page itself appears incomplete. |
| Report approval workflow | Reports are created with `status: "in_review"`, but no report approve/archive route was found. |
| Persisted export URLs | Report exports are streamed on request. The `Report.exports` array exists in the schema, but export URLs are not populated by the export controller. |

---

## 4. Technology Stack

### Frontend

| Technology | Version | Purpose/Usage |
|---|---:|---|
| Node.js | `24.x` engine in `frontend/package.json` | Frontend runtime target |
| Next.js | `^15.1.4` | App Router frontend, route groups, layouts, API proxy route |
| React | `^19.0.0` | Component rendering |
| React DOM | `^19.0.0` | DOM rendering |
| Tailwind CSS | `^3.4.17` | Utility-first styling |
| Redux Toolkit | `^2.5.0` | Auth and generated-analysis state slices |
| React Redux | `^9.2.0` | Redux bindings |
| TanStack React Query | `^5.64.2` | Server-state fetching, caching, refetching, mutations |
| Axios | `^1.7.9` | HTTP client and bearer-token interceptor |
| Recharts | `^2.15.0` | Dashboard and AI analysis charts |
| Framer Motion | `^11.18.1` | UI motion |
| Lucide React | `^0.468.0` | Icon library |
| class-variance-authority | `^0.7.1` | UI component variants |
| clsx | `^2.1.1` | Conditional class names |
| tailwind-merge | `^2.6.0` | Tailwind class merging |
| tailwindcss-animate | `^1.0.7` | Animation utilities |
| Jest | `^29.7.0` | Frontend unit tests |
| Testing Library React | `^16.1.0` | Component tests |
| Jest DOM | `^6.6.3` | DOM matchers |

### Backend

| Technology | Version | Purpose/Usage |
|---|---:|---|
| Node.js | `20.x` engine in `backend/package.json` | Backend runtime target |
| Express | `^4.21.2` | REST API server |
| MongoDB Node driver | `^7.5.0` | MongoDB driver dependency |
| Mongoose | `^8.9.5` | MongoDB models and schemas |
| bcrypt | `^5.1.1` | Password hashing and refresh-token hashing |
| jsonwebtoken | `^9.0.2` | Access and refresh tokens |
| Zod | `^3.24.1` | Request validation |
| LangGraph | `^0.2.74` | Research workflow orchestration |
| LangChain Core | `^0.3.80` | LangGraph dependency/core primitives |
| Google Generative AI SDK | `^0.24.1` | Gemini content generation |
| Axios | `^1.7.9` | External API calls to Tavily/Firecrawl |
| Qdrant JS REST client | `^1.13.0` | Optional vector memory/search |
| Playwright | `^1.49.1` | Browser-based source text retrieval |
| Multer | `^1.4.5-lts.1` | Multipart uploads using memory storage |
| PDFKit | `^0.15.2` | Backend PDF export |
| docx | `^9.2.0` | Backend DOCX export |
| Helmet | `^8.0.0` | HTTP security headers |
| CORS | `^2.8.5` | Cross-origin access control |
| compression | `^1.7.5` | Response compression |
| Morgan | `^1.10.0` | HTTP logging |
| express-rate-limit | `^7.5.0` | API rate limiting |
| dotenv | `^16.4.7` | Environment variable loading |
| Jest | `^29.7.0` | Backend tests |
| Supertest | `^7.0.0` | HTTP route tests |
| Nodemon | `^3.1.9` | Development server reload |

---

## 5. System Architecture

The system uses a two-application architecture:

- The frontend is a Next.js App Router application under `frontend/`.
- The backend is an Express API under `backend/`.
- MongoDB is the primary database.
- Gemini provides AI text/JSON generation.
- LangGraph orchestrates the research workflow.
- Tavily, Firecrawl, and Playwright are used for web source discovery and retrieval.
- Qdrant is optional for vector-style semantic memory.
- Uploaded files are processed through Multer memory storage and stored as metadata/knowledge records, not as durable files.
- Report exports are generated by the backend on demand.

```mermaid
flowchart LR
  User[Consultant / Reviewer / Admin] --> Frontend[Next.js 15 Frontend]
  Frontend --> ApiClient[Axios Client]
  Frontend --> Proxy[Next.js API Proxy /api/[...path]]
  ApiClient --> Backend[Express REST API]
  Proxy --> Backend

  Backend --> Security[Helmet / CORS / Rate Limit / Auth Middleware]
  Security --> Routes[Express Routes and Controllers]
  Routes --> Mongo[(MongoDB via Mongoose)]
  Routes --> Uploads[Upload Controller / Multer Memory Storage]
  Routes --> Reports[Report Export: MD / CSV / PDF / DOCX]
  Routes --> Dashboard[Dashboard Aggregations]
  Routes --> Assistant[Assistant Controller]
  Routes --> Graph[LangGraph Research Workflow]
  Routes --> Knowledge[Knowledge Controller]

  Assistant --> Gemini[Google Gemini API]

  Graph --> Planner[Planner Agent Function]
  Planner --> Gemini
  Graph --> Browse[Browse Node]
  Browse --> Tavily[Tavily Search API]
  Browse --> Firecrawl[Firecrawl Scrape API]
  Browse --> Playwright[Playwright Chromium]
  Graph --> Extract[Extraction Node]
  Extract --> Gemini
  Graph --> Validate[Validation Node]
  Graph --> Aggregate[Aggregation Node]
  Aggregate --> Gemini
  Graph --> ReportNode[Report Generation Node]
  ReportNode --> Gemini
  ReportNode --> Mongo
  ReportNode --> Qdrant[(Qdrant Optional Vector Store)]
  Knowledge --> Qdrant
```

### Frontend

The frontend uses:

- `frontend/app` for App Router pages.
- `frontend/components` for shared layout, auth, UI, dashboard, upload, assistant, and chart components.
- `frontend/lib/api.js` for base URL resolution and Axios configuration.
- `frontend/redux/store.js` for auth and generated analysis state.
- `frontend/app/api/[...path]/route.js` as a same-origin API proxy for local/deployed backend requests.

### Backend

The backend uses:

- `backend/src/app.js` for Express app configuration, middleware, health check, route mounts, and error handlers.
- `backend/src/server.js` for environment loading, MongoDB connection, and server startup.
- `backend/src/routes` for Express route definitions.
- `backend/src/controllers` for route handlers.
- `backend/src/models` for Mongoose schemas.
- `backend/src/agents/researchGraph.js` for the LangGraph workflow.
- `backend/src/services` for Gemini, Tavily, Firecrawl, Playwright, and Qdrant integrations.

### Database

MongoDB stores users, jobs, plans, sources, evidence records, validation results, reports, uploaded file metadata, knowledge memory, notifications, feedback, and audit logs.

### AI/LLM Layer

Gemini is used by:

- `assistant.controller.js` for chat and structured dashboard analysis.
- `researchGraph.js` for planner, extraction, aggregation, and report generation.
- `qdrant.service.js` for generating a 768-dimension "embedding-like" vector through Gemini JSON output.

### External APIs

- Tavily: source search.
- Firecrawl: optional page scraping.
- Qdrant: optional semantic storage/search.
- Gemini: AI generation.

### Communication Between Components

```mermaid
sequenceDiagram
  participant U as User
  participant FE as Next.js Frontend
  participant API as Express API
  participant DB as MongoDB
  participant AI as Gemini
  participant WEB as Tavily/Firecrawl/Playwright

  U->>FE: Submit research intake
  FE->>API: POST /api/research-jobs
  API->>DB: Create ResearchJob
  API-->>FE: 201 accepted
  API->>AI: Generate research plan
  API->>DB: Store ResearchPlan and approve
  API->>WEB: Collect sources
  API->>DB: Store Source records
  API->>AI: Extract evidence
  API->>DB: Store EvidenceRecord records
  API->>DB: Store ValidationResult records
  API->>AI: Aggregate and generate report
  API->>DB: Store Report and KnowledgeMemory
  FE->>API: Poll jobs/reports/dashboard
  API-->>FE: Progress, report, evidence, dashboard data
```

---

## 6. Project Workflow

### Research Workflow

```mermaid
flowchart TD
  A[User creates account or logs in] --> B[Submit research intake]
  B --> C[Backend validates intake with Zod]
  C --> D[Create ResearchJob with planning status]
  D --> E[Background plannerAgent creates ResearchPlan]
  E --> F[Plan is auto-approved]
  F --> G[LangGraph workflow starts]
  G --> H[Browse node searches Tavily and retrieves pages]
  H --> I[Source records saved]
  I --> J[Extraction node creates evidence records]
  J --> K[Validation node scores credibility, recency, duplicates, contradictions]
  K --> L[Aggregation node groups findings]
  L --> M[Report node creates in-review report]
  M --> N[KnowledgeMemory records created]
  N --> O[Optional Qdrant upsert attempted]
  O --> P[Job status moves to review with 100 percent progress]
  P --> Q[Frontend dashboard, workflow monitor, reports, evidence review update]
```

### Upload Workflow

```mermaid
flowchart TD
  A[User selects or drags files] --> B[Frontend sends multipart form-data field files]
  B --> C[Multer memory storage accepts up to 8 files, 50 MB each]
  C --> D[Controller validates MIME type]
  D --> E{Supported type?}
  E -- No --> F[UploadedFile status failed]
  E -- Yes --> G[Extract text]
  G --> H[Create UploadedFile metadata]
  H --> I{Text extracted?}
  I -- Yes --> J[Create KnowledgeMemory with extracted preview/content]
  I -- No --> K[Keep status uploaded]
  J --> L[Dashboard/uploads/knowledge can refresh]
  K --> L
```

### Report Export Workflow

```mermaid
flowchart TD
  A[User opens reports page] --> B[Frontend GET /api/reports]
  B --> C[Backend returns scoped reports]
  C --> D[User clicks export]
  D --> E[Frontend GET /api/reports/:id/export/:format]
  E --> F[Backend fetches report and evidence appendix]
  F --> G{Format}
  G --> H[Markdown stream]
  G --> I[CSV stream]
  G --> J[PDFKit PDF stream]
  G --> K[docx package DOCX buffer]
  H --> L[Browser download]
  I --> L
  J --> L
  K --> L
```

---

## 7. AI and Agent Architecture

### LLM Used

The backend uses Google Gemini through `@google/generative-ai`.

Default model behavior in `backend/src/services/gemini.service.js`:

- Default model: `gemini-2.5-flash-lite`
- Environment override: `GEMINI_MODEL`
- Fallback models: `GEMINI_MODEL_FALLBACKS`, then built-in `gemini-2.5-flash` and `gemini-2.5-flash-lite`

### Gemini Integration

The Gemini service exposes:

- `generateText(prompt)`: returns text from Gemini.
- `generateJson(prompt, fallback)`: asks Gemini for strict JSON, cleans markdown fences, parses JSON, and optionally uses a fallback function if parsing fails.
- `configuredGeminiModels()`: returns configured model list.
- `isAiQuotaError(err)`: detects quota-style errors.

Gemini error handling normalizes quota errors, unavailable models, and provider errors into application errors with status, code, retry delay, and provider details.

### Implemented Agent/Workflow Components

| Component | Implemented? | Source | Description |
|---|---:|---|---|
| Planner Agent | Yes | `backend/src/agents/researchGraph.js` | Generates `ResearchPlan` goals, workstreams, search tasks, source categories, and validation criteria. |
| Browser/Search Node | Yes | `researchGraph.js`, `tavily.service.js`, `firecrawl.service.js`, `playwright.service.js` | Searches Tavily, optionally scrapes with Firecrawl, otherwise retrieves body text with Playwright. |
| Extraction Node | Yes | `researchGraph.js` | Uses Gemini or deterministic extraction to create evidence records from source content. |
| Validation Node | Yes | `researchGraph.js` | Computes credibility, recency, duplicate risk, contradiction risk, and validation status. |
| Aggregation Node | Yes | `researchGraph.js` | Groups approved evidence into trends, opportunities, risks, and competitor movements. |
| Report Agent/Writer Node | Yes | `researchGraph.js` | Uses Gemini or deterministic report creation to create a `Report`, evidence appendix, and knowledge records. |
| Market Research Agent | Not separate | N/A | Market research is covered through planner workstreams and aggregation, not a separately named module. |
| Competitor Agent | Not separate | N/A | Competitor movement is part of planner search tasks and aggregation/reporting. |
| Finance Agent | No | N/A | No finance-specific agent module or route was found. |
| News Agent | No | N/A | No news-specific agent module was found; Tavily searches may return news sources. |

### Prompting Approach

Prompts are embedded directly in controller/service/workflow code. They ask Gemini to return strict JSON for structured outputs. Prompt schemas are included inline as JSON examples. The system uses deterministic fallback functions for planner, extraction, aggregation, report generation, and assistant analysis when quota/provider errors occur.

### Agent Communication

Agent communication is state-based through LangGraph:

- The graph state includes `jobId`, `plan`, `sources`, `evidence`, `aggregation`, and `report`.
- Each node returns partial state updates.
- The graph edges are linear: `browse -> extract -> validate -> aggregate -> generateReport`.

### AI Error Handling

- Missing `GEMINI_API_KEY` returns a 503-style error from the Gemini service.
- Quota or unavailable model errors are normalized and retried across fallback models.
- Several workflow nodes continue with deterministic fallback output for quota/provider problems.
- Assistant chat does not implement a deterministic fallback and will return an error if Gemini fails.

---

## 8. Detailed Module Description

### Root-Level Modules

| Path | Purpose |
|---|---|
| `README.md` | Existing project overview and run/deployment information. |
| `PROJECT_DOCUMENTATION.md` | This complete project documentation file. |
| `backend/` | Express API, models, controllers, services, agents, and backend tests. |
| `frontend/` | Next.js application, pages, components, state, API client, and frontend tests. |
| `docs/` | Existing supplementary docs for API, architecture, deployment, Gemini quota, and testing. |
| `charts/` | Generated chart image/SVG assets. |
| `reports/` | Generated Markdown final report artifact. |
| `output/` | Generated HTML/PDF report output and preview image. |
| `scripts/` | Script for generating final report artifacts. |

### Backend Modules

| Module | Important Files | Description |
|---|---|---|
| App/server | `src/app.js`, `src/server.js` | Creates Express app, configures middleware, mounts routes, connects MongoDB, starts server. |
| Routes | `src/routes/*.routes.js` | Defines REST endpoints for auth, research, reports, dashboard, knowledge, uploads, notifications, assistant, and search. |
| Controllers | `src/controllers/*.controller.js` | Implements request validation, DB operations, AI calls, upload processing, report export, dashboard aggregation, and role-specific behavior. |
| Middleware | `src/middleware/auth.middleware.js`, `src/middleware/error.middleware.js` | JWT authentication, role authorization, 404 handling, and standardized error responses. |
| Models | `src/models/*.js` | Mongoose schemas for all persisted entities. |
| AI workflow | `src/agents/researchGraph.js` | LangGraph workflow and deterministic fallback functions. |
| External services | `src/services/*.service.js` | Gemini, Tavily, Firecrawl, Playwright, and Qdrant integrations. |
| Utilities | `src/utils/db.js`, `src/utils/tokens.js`, `src/utils/audit.js` | MongoDB connection, token creation, and audit-log helper. |
| Tests | `backend/tests/*.test.js` | Jest/Supertest tests for auth, CORS, protected routes, and model validation. |

### Frontend Modules

| Module | Important Files | Description |
|---|---|---|
| App Router | `frontend/app` | Home, auth pages, dashboard route group, API proxy route, layout, providers. |
| Auth UI | `components/AuthExperience.js`, `app/(auth)/*` | Login, signup, and forgot-password UI. |
| App shell | `components/AppShell.js`, `app/(dashboard)/layout.js` | Sidebar navigation, global search, new research modal, upload modal, theme toggle, logout. |
| Dashboard | `app/(dashboard)/dashboard/page.js`, dashboard components | Metrics, charts, recent reports/uploads, market trends, sentiment, generated analysis dashboard. |
| Research screens | `research-intake`, `research-plans`, `workflow-monitor`, `ResearchModal.js` | Intake form, plan cards, workflow status, agent logs. |
| Reports | `app/(dashboard)/reports/page.js`, `RecentReports.js`, `ExportButtons.js` | Report viewing and export/download controls. |
| Knowledge/evidence | `knowledge-base`, `evidence-review` | Knowledge CRUD/listing and reviewer evidence decisions. |
| Uploads/data sources | `UploadDataHub.js`, `data-sources/page.js` | Multipart uploads, uploaded source listing, provider configuration status. |
| Assistant/search | `AIAssistantPanel.js`, `GlobalSearch.js`, `AnalysisDashboard.js` | Chat, local search, Gemini analysis, charted analysis results. |
| State | `redux/store.js`, `providers.js` | Auth state, generated analysis state, QueryClient configuration, auth hydration. |
| API client | `lib/api.js`, `app/api/[...path]/route.js` | Browser API base URL resolution, bearer interceptor, error formatting, same-origin proxy. |

---

## 9. Folder Structure

```text
AI_Market_Strategy_Engine/
|-- README.md
|-- PROJECT_DOCUMENTATION.md
|-- .gitignore
|-- backend/
|   |-- .env.example
|   |-- package.json
|   |-- package-lock.json
|   |-- src/
|   |   |-- app.js
|   |   |-- server.js
|   |   |-- agents/
|   |   |   `-- researchGraph.js
|   |   |-- controllers/
|   |   |   |-- assistant.controller.js
|   |   |   |-- auth.controller.js
|   |   |   |-- dashboard.controller.js
|   |   |   |-- knowledge.controller.js
|   |   |   |-- notification.controller.js
|   |   |   |-- report.controller.js
|   |   |   |-- research.controller.js
|   |   |   |-- search.controller.js
|   |   |   `-- upload.controller.js
|   |   |-- middleware/
|   |   |   |-- auth.middleware.js
|   |   |   `-- error.middleware.js
|   |   |-- models/
|   |   |   |-- AuditLog.js
|   |   |   |-- EvidenceRecord.js
|   |   |   |-- Feedback.js
|   |   |   |-- KnowledgeMemory.js
|   |   |   |-- Notification.js
|   |   |   |-- Report.js
|   |   |   |-- ResearchJob.js
|   |   |   |-- ResearchPlan.js
|   |   |   |-- Source.js
|   |   |   |-- UploadedFile.js
|   |   |   |-- User.js
|   |   |   `-- ValidationResult.js
|   |   |-- routes/
|   |   |-- services/
|   |   `-- utils/
|   `-- tests/
|-- frontend/
|   |-- .env.example
|   |-- package.json
|   |-- vercel.json
|   |-- app/
|   |   |-- (auth)/
|   |   |-- (dashboard)/
|   |   |-- api/[...path]/route.js
|   |   |-- globals.css
|   |   |-- layout.js
|   |   |-- page.js
|   |   `-- providers.js
|   |-- components/
|   |   |-- dashboard/
|   |   `-- ui/
|   |-- hooks/
|   |-- lib/
|   |-- redux/
|   `-- tests/
|-- docs/
|-- charts/
|-- output/
|-- reports/
`-- scripts/
```

---

## 10. Database Documentation

### Database Technology

The project uses MongoDB as the primary database, accessed through Mongoose. The connection utility supports:

- `MONGODB_URI`
- `MONGO_URL`
- Local development fallback: `mongodb://127.0.0.1:27017/market_research_engine`

In production, a MongoDB URI is required.

### Collections and Schemas

Mongoose model names map to MongoDB collections using Mongoose's default pluralization.

#### User

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, lowercase, indexed |
| `passwordHash` | String | Required, excluded by default |
| `role` | Enum | `consultant`, `reviewer`, `admin`; default `consultant` |
| `isActive` | Boolean | Default `true` |
| `preferences` | Object | Theme, default geography, default industry |
| `apiSettings` | Object | Flags for Gemini/Tavily/Firecrawl/Qdrant configuration |
| `refreshTokenHash` | String | Excluded by default |
| timestamps | Date | `createdAt`, `updatedAt` |

Relationships:

- Users own research jobs, reports, uploaded files, notifications, feedback, and audit actions.

#### ResearchJob

| Field | Type | Notes |
|---|---|---|
| `owner` | ObjectId -> User | Required, indexed |
| `question` | String | Required |
| `industry` | String | Required, indexed |
| `geography` | String | Required, indexed |
| `timeframe` | String | Required |
| `competitors` | String array | Indexed |
| `outputType` | Enum | Market Entry Scan, Competitor Landscape, Trend Analysis, Opportunity Assessment, Proposal Support |
| `status` | Enum | `intake`, `planning`, `approved`, `running`, `review`, `completed`, `failed` |
| `progress` | Number | 0-100 |
| `currentStep` | String | Workflow stage label |
| `error` | String | Failure message |
| `startedAt`, `completedAt` | Date | Runtime tracking |
| `runtimeMs` | Number | Runtime in milliseconds |
| `logs` | Array | Stage, message, level, createdAt |

Relationships:

- One job has one `ResearchPlan`.
- One job has many `Source`, `EvidenceRecord`, `ValidationResult`, and `Report` records.

#### ResearchPlan

| Field | Type | Notes |
|---|---|---|
| `job` | ObjectId -> ResearchJob | Required, unique |
| `goals` | String array | Required strings |
| `workstreams` | Array | Name, objective, searchTasks, sourceCategories, evidenceRequirements |
| `validationCriteria` | String array | Quality checks |
| `status` | Enum | `draft`, `approved`, `regenerating` |
| `generatedBy` | String | Defaults to `Planner Agent` |
| `approvedBy` | ObjectId -> User | Optional |
| `approvedAt` | Date | Optional |

#### Source

| Field | Type | Notes |
|---|---|---|
| `job` | ObjectId -> ResearchJob | Required |
| `url` | String | Required |
| `canonicalUrl` | String | Required, indexed |
| `title` | String | Source title |
| `publisher` | String | Indexed |
| `publishDate` | Date | Optional |
| `sourceType` | Enum | `news`, `company`, `report`, `filing`, `academic`, `government`, `other` |
| `snippet` | String | Search snippet |
| `content` | String | Retrieved content |
| `retrievedAt` | Date | Default current time |
| `qualityScore` | Number | 0-1 |
| `metadata` | Mixed | Provider metadata |

Unique index:

- `{ job: 1, canonicalUrl: 1 }`

#### EvidenceRecord

| Field | Type | Notes |
|---|---|---|
| `job` | ObjectId -> ResearchJob | Required |
| `source` | ObjectId -> Source | Required |
| `claim` | String | Required |
| `excerpt` | String | Source excerpt |
| `entity` | String | Indexed |
| `topic` | String | Indexed |
| `date` | Date | Optional claim date |
| `confidence` | Number | Required, 0-1 |
| `validationStatus` | Enum | `pending`, `approved`, `rejected`, `flagged` |
| `reviewedBy` | ObjectId -> User | Optional |
| `reviewedAt` | Date | Optional |

#### ValidationResult

| Field | Type | Notes |
|---|---|---|
| `job` | ObjectId -> ResearchJob | Required |
| `evidence` | ObjectId -> EvidenceRecord | Required |
| `credibility` | Number | 0-1 |
| `recency` | Number | 0-1 |
| `duplicateRisk` | Number | 0-1 |
| `contradictionRisk` | Number | 0-1 |
| `status` | Enum | `passed`, `failed`, `conflict` |
| `rationale` | String | Validation explanation |

#### Report

| Field | Type | Notes |
|---|---|---|
| `job` | ObjectId -> ResearchJob | Required |
| `owner` | ObjectId -> User | Required |
| `title` | String | Required |
| `outputType` | String | From job |
| `sections` | Array | `title`, `body`, evidence references |
| `evidenceAppendix` | ObjectId array -> EvidenceRecord | Source appendix |
| `status` | Enum | `draft`, `in_review`, `approved`, `archived` |
| `confidenceScore` | Number | 0-1 |
| `exports` | Array | Format, URL, createdAt. Schema exists but export controller does not currently populate URLs. |

#### UploadedFile

| Field | Type | Notes |
|---|---|---|
| `owner` | ObjectId -> User | Required |
| `originalName` | String | Required |
| `mimeType` | String | File MIME type |
| `size` | Number | Required |
| `status` | Enum | `uploaded`, `processed`, `failed`, `deleted` |
| `storageKey` | String | Generated key string; no durable storage write found |
| `metadata` | Mixed | Extraction metadata, preview, failure reason, optional knowledgeMemoryId |

#### KnowledgeMemory

| Field | Type | Notes |
|---|---|---|
| `collection` | Enum | `market_insights`, `competitor_insights`, `trend_analysis`, `research_reports` |
| `sourceEvidence` | ObjectId array -> EvidenceRecord | Optional |
| `report` | ObjectId -> Report | Optional |
| `title` | String | Required |
| `content` | String | Required |
| `industry` | String | Optional |
| `geography` | String | Optional |
| `competitors` | String array | Optional |
| `tags` | String array | Optional |
| `qdrantPointId` | String | Optional |
| `confidence` | Number | Default 0.7 |

#### Notification

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId -> User | Required |
| `message` | String | Required |
| `type` | Enum | `research`, `report`, `evidence`, `system` |
| `relatedType` | String | Optional |
| `relatedId` | ObjectId | Optional |
| `href` | String | Optional |
| `readAt` | Date | Optional |

#### Feedback

| Field | Type | Notes |
|---|---|---|
| `report` | ObjectId -> Report | Required by schema |
| `user` | ObjectId -> User | Required |
| `rating` | Number | 1-5 |
| `comment` | String | Optional |
| `category` | Enum | `accuracy`, `coverage`, `format`, `source_quality`, `other` |

Important note: both `/api/feedback` and `/api/reports/feedback` pass arbitrary request body fields plus `user`. Because `Feedback.report` is required by the schema, feedback requests must include a valid `report` value or Mongoose validation will fail.

#### AuditLog

| Field | Type | Notes |
|---|---|---|
| `actor` | ObjectId -> User | Optional |
| `action` | String | Required |
| `entityType` | String | Required |
| `entityId` | ObjectId | Optional |
| `metadata` | Mixed | Optional |
| `ip` | String | Request IP |

### Data Flow Summary

1. User submits auth data -> `User` is created or loaded.
2. User creates research job -> `ResearchJob` is created.
3. Planner creates/updates `ResearchPlan`.
4. Workflow creates `Source`, `EvidenceRecord`, `ValidationResult`, `Report`, and `KnowledgeMemory`.
5. Reviewers/admins update evidence review fields.
6. Dashboard aggregates over jobs, reports, evidence, sources, validations, uploads, knowledge, and audit logs.

---

## 11. API Documentation

### Base URLs

| Environment | URL |
|---|---|
| Local backend | `http://localhost:8080` |
| Local API prefix | `http://localhost:8080/api` |
| Deployed backend found in source | `https://ai-market-strategy-engine.onrender.com` |
| Deployed API prefix found in source | `https://ai-market-strategy-engine.onrender.com/api` |

### Common Headers

Protected endpoints require:

```http
Authorization: Bearer <accessToken>
```

JSON endpoints use:

```http
Content-Type: application/json
```

Upload endpoint uses:

```http
Content-Type: multipart/form-data
```

### Common Error Response

```json
{
  "error": "ApplicationError",
  "message": "Human readable error message",
  "details": null,
  "retryAfterSeconds": null
}
```

Validation errors return:

```json
{
  "error": "ValidationError",
  "message": "Please check the highlighted fields and try again.",
  "details": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

### Health

#### GET `/health`

| Item | Details |
|---|---|
| Purpose | Service health check |
| Auth required | No |
| Request body | None |

Example response:

```json
{
  "ok": true,
  "service": "market-research-engine"
}
```

### Authentication APIs

#### POST `/api/auth/signup`

| Item | Details |
|---|---|
| Purpose | Create a new consultant or reviewer account |
| Auth required | No |
| Roles | Public signup permits `consultant` and `reviewer`; `admin` is rejected |

Request body:

```json
{
  "name": "Jane Consultant",
  "email": "jane@example.com",
  "password": "Password123!",
  "role": "consultant"
}
```

Example request:

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jane Consultant\",\"email\":\"jane@example.com\",\"password\":\"Password123!\",\"role\":\"consultant\"}"
```

Example response:

```json
{
  "user": {
    "id": "66...",
    "name": "Jane Consultant",
    "email": "jane@example.com",
    "role": "consultant",
    "preferences": {
      "theme": "system"
    },
    "apiSettings": {
      "geminiConfigured": false,
      "tavilyConfigured": false,
      "firecrawlConfigured": false,
      "qdrantConfigured": false
    }
  },
  "tokens": {
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>"
  }
}
```

Error responses:

- `400` validation error
- `403` admin accounts cannot be created from public signup
- `409` email already registered

#### POST `/api/auth/login`

| Item | Details |
|---|---|
| Purpose | Authenticate a user |
| Auth required | No |

Request body:

```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```

Example response:

```json
{
  "user": {
    "id": "66...",
    "name": "Jane Consultant",
    "email": "jane@example.com",
    "role": "consultant",
    "preferences": {},
    "apiSettings": {}
  },
  "tokens": {
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>"
  }
}
```

Error responses:

- `400` validation error
- `401` invalid email or password

#### POST `/api/auth/refresh`

| Item | Details |
|---|---|
| Purpose | Exchange refresh token for a new access token |
| Auth required | No |

Request body:

```json
{
  "refreshToken": "<refreshToken>"
}
```

Example response:

```json
{
  "accessToken": "<newAccessToken>"
}
```

Error responses:

- `401` invalid refresh token

#### GET `/api/auth/me`

| Item | Details |
|---|---|
| Purpose | Return authenticated user profile |
| Auth required | Yes |

Example response:

```json
{
  "user": {
    "id": "66...",
    "name": "Jane Consultant",
    "email": "jane@example.com",
    "role": "consultant",
    "preferences": {},
    "apiSettings": {}
  }
}
```

Error responses:

- `401` missing/invalid token or inactive user

### Research and Evidence APIs

#### POST `/api/research-jobs`

| Item | Details |
|---|---|
| Purpose | Create research job and start background planning/workflow |
| Auth required | Yes |

Request body:

```json
{
  "question": "What is the AI opportunity in retail banking?",
  "industry": "Banking",
  "geography": "North America",
  "timeframe": "2026-2028",
  "competitors": ["JPMorgan", "Bank of America"],
  "outputType": "Market Entry Scan"
}
```

Allowed `outputType` values:

- `Market Entry Scan`
- `Competitor Landscape`
- `Trend Analysis`
- `Opportunity Assessment`
- `Proposal Support`

Example response:

```json
{
  "job": {
    "_id": "66...",
    "question": "What is the AI opportunity in retail banking?",
    "industry": "Banking",
    "geography": "North America",
    "timeframe": "2026-2028",
    "competitors": ["JPMorgan", "Bank of America"],
    "outputType": "Market Entry Scan",
    "status": "planning",
    "currentStep": "Planning",
    "progress": 10
  },
  "plan": null,
  "accepted": true
}
```

Error responses:

- `400` validation error
- `401` missing/invalid token
- Workflow errors are written later to job status/logs because planning runs asynchronously.

#### GET `/api/research-jobs`

| Item | Details |
|---|---|
| Purpose | List research jobs |
| Auth required | Yes |
| Authorization behavior | Consultants see owned jobs; reviewers/admins see all jobs |

Example response:

```json
{
  "jobs": [
    {
      "_id": "66...",
      "question": "What is the AI opportunity in retail banking?",
      "status": "running",
      "progress": 48
    }
  ]
}
```

#### GET `/api/research-jobs/:id`

| Item | Details |
|---|---|
| Purpose | Get job detail with plan, sources, and evidence |
| Auth required | Yes |
| Authorization behavior | Consultants see owned jobs; reviewers/admins can view all jobs |

Example response:

```json
{
  "job": { "_id": "66...", "question": "..." },
  "plan": { "_id": "66...", "goals": [] },
  "sources": [],
  "evidence": []
}
```

Error responses:

- `401` unauthorized
- `404` research job not found

#### GET `/api/evidence`

| Item | Details |
|---|---|
| Purpose | List evidence records and summary counts |
| Auth required | Yes |
| Roles | `reviewer`, `admin` |
| Query params | `status`, `limit` |

Example:

```bash
curl http://localhost:8080/api/evidence?status=pending\&limit=100 \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Example response:

```json
{
  "evidence": [
    {
      "_id": "66...",
      "claim": "Source-backed claim",
      "confidence": 0.76,
      "validationStatus": "approved"
    }
  ],
  "summary": {
    "approved": 10,
    "flagged": 2
  }
}
```

Error responses:

- `401` unauthorized
- `403` insufficient role

#### POST `/api/research-plan`

| Item | Details |
|---|---|
| Purpose | Create/regenerate a research plan |
| Auth required | Yes |
| Authorization behavior | Owner or admin |

Request body:

```json
{
  "jobId": "66..."
}
```

Response:

```json
{
  "plan": {
    "_id": "66...",
    "goals": [],
    "workstreams": [],
    "validationCriteria": []
  }
}
```

#### POST `/api/research-jobs/:jobId/approve-plan`

| Item | Details |
|---|---|
| Purpose | Approve an existing plan |
| Auth required | Yes |
| Authorization behavior | Owner or admin |

Example response:

```json
{
  "plan": {
    "_id": "66...",
    "status": "approved"
  }
}
```

#### POST `/api/research-jobs/:jobId/run`

| Item | Details |
|---|---|
| Purpose | Execute an approved workflow synchronously |
| Auth required | Yes |
| Authorization behavior | Owner or admin |

Example response:

```json
{
  "message": "Research workflow completed"
}
```

Error responses:

- `404` job not found
- `409` research plan must be approved before workflow execution
- `503` external provider not configured, depending on failure source

#### POST `/api/browse`, `/api/extract`, `/api/validate`, `/api/aggregate`, `/api/generate-report`

| Item | Details |
|---|---|
| Purpose | Compatibility endpoints for workflow steps |
| Auth required | Yes |
| Actual behavior | Do not execute individual steps; return accepted message |

Response:

```json
{
  "message": "This workflow step is orchestrated through approved research job execution.",
  "accepted": true
}
```

#### PATCH `/api/evidence/:id/review`

| Item | Details |
|---|---|
| Purpose | Approve, reject, or flag evidence |
| Auth required | Yes |
| Roles | `reviewer`, `admin` |

Request body:

```json
{
  "status": "approved"
}
```

Allowed status values:

- `approved`
- `rejected`
- `flagged`

Response:

```json
{
  "evidence": {
    "_id": "66...",
    "validationStatus": "approved"
  }
}
```

### Report APIs

#### GET `/api/reports`

| Item | Details |
|---|---|
| Purpose | List reports |
| Auth required | Yes |
| Authorization behavior | Admin sees all; others see owned reports |

Example response:

```json
{
  "reports": [
    {
      "_id": "66...",
      "title": "Market Entry Scan: Banking in North America",
      "status": "in_review",
      "sections": []
    }
  ]
}
```

#### GET `/api/reports/:id`

| Item | Details |
|---|---|
| Purpose | Get report with populated evidence appendix |
| Auth required | Yes |

Response:

```json
{
  "report": {
    "_id": "66...",
    "title": "Market Entry Scan: Banking in North America",
    "sections": [],
    "evidenceAppendix": []
  }
}
```

#### GET `/api/reports/:id/export/:format`

| Item | Details |
|---|---|
| Purpose | Download a report export |
| Auth required | Yes |
| Formats | `md`, `markdown`, `csv`, `pdf`, `docx` |

Example request:

```bash
curl -L http://localhost:8080/api/reports/REPORT_ID/export/pdf \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -o report.pdf
```

Error responses:

- `400` unsupported export format
- `401` unauthorized
- `404` report not found

#### POST `/api/reports/feedback` and POST `/api/feedback`

| Item | Details |
|---|---|
| Purpose | Create report feedback |
| Auth required | Yes |
| Important requirement | `report` is required by the `Feedback` schema |

Request body:

```json
{
  "report": "66...",
  "rating": 4,
  "comment": "Good evidence quality.",
  "category": "source_quality"
}
```

Response:

```json
{
  "feedback": {
    "_id": "66...",
    "report": "66...",
    "rating": 4,
    "category": "source_quality"
  }
}
```

### Dashboard APIs

#### GET `/api/dashboard`

| Item | Details |
|---|---|
| Purpose | Return dashboard metrics, charts, source configuration, recent activity |
| Auth required | Yes |
| Authorization behavior | Admin global scope; other users owner scope for user-owned models |

Example response:

```json
{
  "metrics": {
    "activeJobs": 1,
    "marketOpportunities": 20,
    "emergingTrends": 4,
    "competitorsMonitored": 3,
    "reportsGenerated": 2,
    "uploadedFiles": 3,
    "processedUploads": 2
  },
  "charts": {
    "volume": [],
    "uploadVolume": [],
    "sourceQuality": [],
    "validation": [],
    "industries": [],
    "competitors": []
  },
  "dataSources": [],
  "recentActivity": []
}
```

#### GET `/api/dashboard/operations`

| Item | Details |
|---|---|
| Purpose | Admin operations metrics |
| Auth required | Yes |
| Roles | `admin` |

Example response:

```json
{
  "totalResearchJobs": 10,
  "avgRuntimeMs": 45000,
  "failedJobs": 1,
  "validationFailures": 2,
  "sourceQuality": [],
  "topIndustries": [],
  "topCompetitors": []
}
```

### Knowledge APIs

#### GET `/api/knowledge`

| Item | Details |
|---|---|
| Purpose | List or search knowledge memory |
| Auth required | Yes |
| Query params | `q`, `collection`, `industry`, `geography`, `tag`, `limit` |

Without `q`, response:

```json
{
  "results": []
}
```

With `q`, response includes optional semantic results:

```json
{
  "results": [],
  "semantic": []
}
```

#### POST `/api/knowledge`

| Item | Details |
|---|---|
| Purpose | Create knowledge record |
| Auth required | Yes |
| Roles | `reviewer`, `admin` |

Request body:

```json
{
  "collection": "market_insights",
  "title": "Retail AI demand signal",
  "content": "Validated insight content.",
  "industry": "Retail",
  "geography": "US",
  "tags": ["ai", "retail"],
  "confidence": 0.8
}
```

Response:

```json
{
  "item": {
    "_id": "66...",
    "collection": "market_insights",
    "title": "Retail AI demand signal"
  }
}
```

### Upload APIs

#### GET `/api/uploads`

| Item | Details |
|---|---|
| Purpose | List current user's non-deleted uploads |
| Auth required | Yes |
| Limit | 20 most recent files |

Response:

```json
{
  "files": [
    {
      "_id": "66...",
      "originalName": "market-data.csv",
      "mimeType": "text/csv",
      "size": 1200,
      "status": "processed"
    }
  ]
}
```

#### POST `/api/uploads`

| Item | Details |
|---|---|
| Purpose | Upload files |
| Auth required | Yes |
| Form field | `files` |
| File count limit | 8 |
| File size limit | 50 MB each |

Supported MIME types:

- `application/pdf`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `text/csv`
- `application/vnd.ms-powerpoint`
- `application/vnd.openxmlformats-officedocument.presentationml.presentation`

Example request:

```bash
curl -X POST http://localhost:8080/api/uploads \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "files=@market-data.csv"
```

Response:

```json
{
  "files": [
    {
      "_id": "66...",
      "originalName": "market-data.csv",
      "status": "processed",
      "metadata": {
        "extractedCharacters": 1000,
        "extractionStatus": "completed"
      }
    }
  ]
}
```

#### DELETE `/api/uploads/:id`

| Item | Details |
|---|---|
| Purpose | Soft-delete an owned upload |
| Auth required | Yes |

Response:

```json
{
  "file": {
    "_id": "66...",
    "status": "deleted"
  }
}
```

### Notification APIs

#### GET `/api/notifications`

| Item | Details |
|---|---|
| Purpose | List notifications and unread count |
| Auth required | Yes |
| Fallback behavior | If no notifications exist, recent audit logs are returned as read system notifications |

Response:

```json
{
  "notifications": [],
  "unreadCount": 0
}
```

#### PATCH `/api/notifications/read-all`

Response:

```json
{
  "ok": true
}
```

#### PATCH `/api/notifications/:id/read`

Response:

```json
{
  "notification": {
    "_id": "66...",
    "readAt": "2026-08-10T00:00:00.000Z"
  }
}
```

### Assistant APIs

#### POST `/api/assistant/chat`

| Item | Details |
|---|---|
| Purpose | Strategy-oriented assistant chat |
| Auth required | Yes |

Request body:

```json
{
  "message": "Summarize the EV charging market in India."
}
```

Response:

```json
{
  "response": "..."
}
```

Error responses:

- `400` message is required
- `503` Gemini not configured
- `502` Gemini/provider error

#### POST `/api/assistant/analyze`

| Item | Details |
|---|---|
| Purpose | Generate structured market intelligence dashboard analysis |
| Auth required | Yes |
| Fallback | Deterministic fallback for quota/model/provider failures |

Request body:

```json
{
  "query": "AI in retail banking North America"
}
```

Response:

```json
{
  "analysis": {
    "title": "AI In Retail Banking North America Market Intelligence Analysis",
    "executiveSummary": "...",
    "marketSize": {
      "tam": "...",
      "sam": "...",
      "som": "..."
    },
    "competitors": [],
    "opportunities": [],
    "risks": [],
    "recommendations": [],
    "confidence": 68
  }
}
```

### Search API

#### GET `/api/search`

| Item | Details |
|---|---|
| Purpose | Global search across local entities |
| Auth required | Yes |
| Query params | `q` |

Search scope:

- Owned research jobs.
- Owned reports.
- Global knowledge records.
- Owned uploaded files with status `uploaded`.

Response:

```json
{
  "results": [
    {
      "id": "66...",
      "type": "Research",
      "title": "Question",
      "subtitle": "Industry",
      "href": "/workflow-monitor"
    }
  ]
}
```

---

## 12. Authentication and Authorization

### Signup

Implemented in:

- Backend: `backend/src/controllers/auth.controller.js`
- Frontend: `frontend/app/(auth)/signup/page.js`

Signup validates:

- `name`: minimum 2 characters
- `email`: valid email
- `password`: minimum 8 characters
- `role`: optional enum of `consultant`, `reviewer`, `admin`

Public signup role behavior:

- Missing role defaults to `consultant`.
- `consultant` is allowed.
- `reviewer` is allowed.
- `admin` is rejected with `403`.

### Login

Implemented in:

- Backend: `login` controller
- Frontend: `frontend/app/(auth)/login/page.js`

Login loads the user by lowercased email, includes password hash, verifies password with bcrypt, audits login, and returns sanitized user data plus tokens.

### JWT

Implemented in:

- `backend/src/utils/tokens.js`
- `backend/src/middleware/auth.middleware.js`

Access token payload:

```json
{
  "sub": "userId",
  "role": "consultant"
}
```

Refresh token payload:

```json
{
  "sub": "userId",
  "type": "refresh"
}
```

### Protected Routes

Route groups using `router.use(requireAuth)`:

- Research routes
- Reports
- Dashboard
- Knowledge
- Uploads
- Notifications
- Assistant
- Search

`GET /api/auth/me` is also protected.

### Role-Based Authorization

Implemented roles:

- `consultant`
- `reviewer`
- `admin`

Reviewer/admin routes:

- `GET /api/evidence`
- `PATCH /api/evidence/:id/review`
- `POST /api/knowledge`

Admin-only route:

- `GET /api/dashboard/operations`

### Token Handling on Frontend

The frontend:

- Saves `accessToken` and `refreshToken` to `localStorage`.
- Adds bearer token to Axios requests through an interceptor.
- Caches `currentUser` in `localStorage`.
- Calls `/api/auth/me` during auth hydration.
- Clears cached user/token state when validation fails.

### Logout

Frontend logout:

- Removes `accessToken`.
- Removes `refreshToken`.
- Clears Redux user state.
- Redirects to `/login`.

No backend logout/revoke endpoint was found.

### Password Handling

- Passwords are hashed with bcrypt using cost factor 12 during signup.
- Password verification uses bcrypt comparison.
- Refresh tokens are hashed with bcrypt before being stored.

### Forgot Password

The frontend page exists at `/forgot-password`, but it only sets local UI state indicating instructions are ready. No backend password-reset endpoint or email integration was found.

---

## 13. File Upload and Document Processing

### Supported File Types

Frontend accept string:

```text
.pdf,.docx,.xlsx,.csv,.ppt,.pptx
```

Backend MIME allowlist:

| File type | MIME type |
|---|---|
| PDF | `application/pdf` |
| DOCX | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| XLSX | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| CSV | `text/csv` |
| PPT | `application/vnd.ms-powerpoint` |
| PPTX | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |

### Upload Process

1. User opens Upload & Data Hub.
2. Frontend creates `FormData`.
3. Files are appended under field name `files`.
4. Frontend posts to `/api/uploads`.
5. Backend Multer receives files in memory.
6. Controller validates MIME type.
7. Text extraction is attempted.
8. `UploadedFile` metadata is created.
9. If text is extracted, a `KnowledgeMemory` item is also created.
10. Frontend invalidates upload/dashboard/knowledge queries.

### File Limits

Configured in `backend/src/routes/upload.routes.js`:

- Up to 8 files per request.
- Maximum 50 MB per file.
- Memory storage is used.

### Text Extraction

Implemented extraction:

- PDF: custom parser searches PDF literal and hex strings, attempts FlateDecode inflation for streams, then normalizes text.
- Non-PDF: converts raw buffer to UTF-8 or Latin-1 text and normalizes it.
- Extracted text is trimmed to 20,000 characters.
- Knowledge memory content is trimmed to 12,000 characters.
- Metadata preview is first 500 characters.

### Important Limitation

The code does not use dedicated parsers such as `pdf-parse`, `mammoth`, `xlsx`, `pptx` parsers, or CSV parsing libraries. DOCX/XLSX/PPT/PPTX/CSV handling is therefore basic and may not extract high-quality human-readable text from binary Office files.

### How Extracted Information Enters AI Workflow

Uploaded text enters `KnowledgeMemory` when extraction succeeds. The main LangGraph research workflow does not directly consume uploaded files for a job; it collects public web sources through Tavily/Firecrawl/Playwright. Knowledge memory can be viewed/searched in knowledge-related frontend pages.

---

## 14. AI Research Workflow

### End-to-End Flow

1. User submits a research question from Research Intake or New Research modal.
2. Backend validates the request using Zod.
3. Backend creates a `ResearchJob` with `status: "planning"`, `currentStep: "Planning"`, and `progress: 10`.
4. `setImmediate` starts background planning.
5. `plannerAgent(job)` asks Gemini to generate goals, workstreams, search tasks, source categories, and validation criteria.
6. If Gemini quota fails, deterministic plan fallback is used.
7. The plan is saved as `ResearchPlan`.
8. The plan is automatically approved.
9. The job is updated to `status: "approved"`.
10. `runResearchWorkflow(job._id)` starts the LangGraph workflow.
11. Browse node searches Tavily for up to 10 search tasks.
12. For each result, canonical URL is computed and deduplicated.
13. Firecrawl scrape is attempted if configured.
14. Playwright fetches page body text if Firecrawl does not return content.
15. `Source` records are upserted.
16. Extraction node creates evidence records using Gemini or deterministic extraction.
17. Validation node creates `ValidationResult` records and updates evidence statuses/confidence.
18. Aggregation node groups approved evidence.
19. Report node creates a report with sections and evidence appendix.
20. Report node writes up to 50 knowledge memory records.
21. Qdrant memory upsert is attempted if configured.
22. Job moves to `status: "review"` and `progress: 100`.
23. Frontend polling updates workflow monitor, dashboard, evidence review, knowledge, and reports.

### Workflow Stages Shown in Frontend

Frontend workflow monitor stages:

1. Research Query
2. Planning Agent
3. Browser Agent
4. Extraction Agent
5. Validation Agent
6. Aggregation Agent
7. Report Generation

These labels map to backend `currentStep` values such as `Intake`, `Planning`, `Plan Approved`, `Browsing`, `Extraction`, `Validation`, `Aggregation`, `Report Generation`, and `Review`.

---

## 15. Report Generation

### Report Creation

Reports are created in `reportNode` in `backend/src/agents/researchGraph.js`.

The node:

- Loads approved evidence for the job.
- Prompts Gemini to generate report sections as JSON.
- Falls back to deterministic report sections if Gemini quota/provider failure occurs.
- Creates a `Report` document.
- Sets report status to `in_review`.
- Computes average confidence score from evidence.
- Stores evidence references in `evidenceAppendix`.

### Report Structure

The AI prompt asks for sections:

- Executive Summary
- Market Overview
- Market Signals
- Competitor Analysis
- Industry Trends
- Risks
- Growth Opportunities
- Strategic Recommendations

The deterministic fallback currently generates:

- Executive Summary
- Market Overview
- Market Signals
- Competitor Analysis
- Risks
- Growth Opportunities

Frontend report page normalizes and displays:

- Executive Summary
- Key Findings
- Competitor Analysis
- Opportunities
- Risks
- Recommendations

Aliases:

- `Market Signals` -> `Key Findings`
- `Industry Trends` -> `Key Findings`
- `Growth Opportunities` -> `Opportunities`
- `Strategic Recommendations` -> `Recommendations`

### Preview Functionality

The reports page renders report sections in an article-style preview. No separate backend preview endpoint exists.

### PDF Generation

Backend:

- `GET /api/reports/:id/export/pdf`
- Uses PDFKit.
- Streams a generated PDF response.

Frontend:

- Reports page downloads PDF.
- RecentReports component downloads PDF.
- Analysis dashboard export uses frontend-generated PDF/print behavior for generated dashboard analysis, separate from stored backend reports.

### DOCX Generation

Backend:

- `GET /api/reports/:id/export/docx`
- Uses the `docx` package and returns a `.docx` buffer.

Frontend:

- Backend report DOCX export is available by API.
- The current visible reports page focuses on PDF.
- `ExportButtons.js` creates a separate client-side DOCX for generated AI dashboard analysis.

### Markdown and CSV Generation

Backend:

- `GET /api/reports/:id/export/md`
- `GET /api/reports/:id/export/markdown`
- `GET /api/reports/:id/export/csv`

Frontend:

- `RecentReports.js` exposes PDF, MD, and CSV buttons for recent reports.

### Filename Conventions

Backend uses:

```js
report.title.replace(/[^a-z0-9]+/gi, "-")
```

Then appends:

- `.md`
- `.csv`
- `.pdf`
- `.docx`

### APIs Involved

- `GET /api/reports`
- `GET /api/reports/:id`
- `GET /api/reports/:id/export/:format`
- `POST /api/reports/feedback`

---

## 16. Frontend Documentation

### Pages and Routes

| Route | Source | Status | Description |
|---|---|---|---|
| `/` | `frontend/app/page.js` | Implemented | Redirects to `/login`. |
| `/login` | `frontend/app/(auth)/login/page.js` | Implemented | Login form, remember email, show/hide password. |
| `/signup` | `frontend/app/(auth)/signup/page.js` | Implemented | Signup form for consultant/reviewer. |
| `/forgot-password` | `frontend/app/(auth)/forgot-password/page.js` | UI only | Displays reset form and local success message; no backend reset API. |
| `/dashboard` | `frontend/app/(dashboard)/dashboard/page.js` | Implemented | Metrics, charts, dashboard customization, generated analysis view. |
| `/research-intake` | `frontend/app/(dashboard)/research-intake/page.js` | Implemented | Research job creation form. |
| `/research-plans` | `frontend/app/(dashboard)/research-plans/page.js` | Implemented | Plan display, approve, regenerate, run actions. |
| `/workflow-monitor` | `frontend/app/(dashboard)/workflow-monitor/page.js` | Implemented | Job progress and agent logs with polling. |
| `/reports` | `frontend/app/(dashboard)/reports/page.js` | Implemented | Report list, article preview, PDF export. |
| `/evidence-review` | `frontend/app/(dashboard)/evidence-review/page.js` | Implemented | Reviewer/admin evidence queue. |
| `/knowledge-base` | `frontend/app/(dashboard)/knowledge-base/page.js` | Implemented | Search/list knowledge; reviewer/admin add insights. |
| `/upload-data-hub` | `frontend/app/(dashboard)/upload-data-hub/page.js` | Implemented | Upload and manage source files. |
| `/data-sources` | `frontend/app/(dashboard)/data-sources/page.js` | Implemented | Provider configuration and uploaded sources workspace. |
| `/operations` | `frontend/app/(dashboard)/operations/page.js` | Implemented | Admin-only operations metrics. |
| `/ai-assistant` | `frontend/app/(dashboard)/ai-assistant/page.js` | Implemented | Assistant panel. |
| `/research-explorer` | `frontend/app/(dashboard)/research-explorer/page.js` | Implemented | Active research jobs workspace. |
| `/market-intelligence` | `frontend/app/(dashboard)/market-intelligence/page.js` | Implemented | Market trends/opportunities from dashboard/knowledge data. |
| `/competitive-analysis` | `frontend/app/(dashboard)/competitive-analysis/page.js` | Implemented | Competitor signals from dashboard/knowledge data. |
| `/consumer-insights` | `frontend/app/(dashboard)/consumer-insights/page.js` | Implemented | Demand/customer related knowledge items. |
| `/forecasting` | `frontend/app/(dashboard)/forecasting/page.js` | Implemented | Activity trend chart. |
| `/strategy-builder` | `frontend/app/(dashboard)/strategy-builder/page.js` | Implemented | Report-derived strategy inputs. |
| `/swot-analysis` | `frontend/app/(dashboard)/swot-analysis/page.js` | Implemented | Regex-grouped knowledge into SWOT categories. |
| `/porters-five-forces` | `frontend/app/(dashboard)/porters-five-forces/page.js` | Implemented | Regex-grouped knowledge into Porter's forces. |
| `/saved-insights` | `frontend/app/(dashboard)/saved-insights/page.js` | Implemented | Knowledge memory listing. |
| `/templates` | `frontend/app/(dashboard)/templates/page.js` | Placeholder | Section page with default message. |
| `/settings` | `frontend/app/(dashboard)/settings/page.js` | Implemented | Shows profile name, email, role. |
| `/notifications` | `frontend/app/(dashboard)/notifications/page.js` | Incomplete | File is commented out and has no active default export. |

### Dashboard

Dashboard features:

- Role-aware page header.
- Date range selector.
- Section customization stored in `localStorage`.
- Metric cards for market opportunities, emerging trends, competitors monitored, reports generated, uploaded files.
- Market trends chart.
- Emerging trends table.
- Opportunity map.
- Recent reports/uploads.
- Sentiment gauge.
- Generated analysis dashboard when `GlobalSearch` "Analyze" has returned data.

### Forms

Implemented forms:

- Login.
- Signup.
- Forgot password UI.
- Research intake.
- New Research modal.
- Knowledge creation.
- Upload file input and drag/drop.
- AI assistant message input.
- Global search input.

### Query Interface

Global search:

- Debounced local search via `/api/search`.
- Recent searches stored in `localStorage`.
- `Ctrl/Cmd + K` focuses the search box.
- "Analyze" button calls `/api/assistant/analyze`.
- Analysis result is stored in Redux and rendered on dashboard.

### Upload Interface

`UploadDataHub` supports:

- Drag/drop.
- File chooser.
- Progress indicator.
- Recent upload list.
- Delete action.
- Query invalidation after upload/delete.

### Progress/Status Display

`WorkflowMonitorPage` polls:

- `GET /api/research-jobs`
- `GET /api/research-jobs/:id`

It displays:

- Stage list.
- Current stage.
- Progress percentage.
- Runtime.
- Error message.
- Agent logs.

### Results Display

Results appear in:

- Dashboard metrics/charts.
- Reports.
- Evidence review queue.
- Knowledge base.
- Market intelligence and other SectionPage workspaces.
- Generated AI analysis dashboard.

### Authentication UI

Auth UI uses `AuthExperience` layout for:

- Login.
- Signup.
- Forgot password.

After login/signup, tokens are saved and user is redirected to `/dashboard`.

---

## 17. Backend Documentation

### Server Architecture

`backend/src/server.js`:

1. Loads `.env` from backend folder.
2. Reads `PORT` or defaults to `8080`.
3. Connects to MongoDB with `connectMongo()`.
4. Starts Express app.

`backend/src/app.js`:

- Creates Express app.
- Applies Helmet, compression, CORS, JSON parser, URL-encoded parser, Morgan, and rate limit.
- Exposes `/health`.
- Mounts route modules.
- Applies not found and error middleware.

### Routes

| Route Mount | Module |
|---|---|
| `/api/auth` | `auth.routes.js` |
| `/api` | `research.routes.js` |
| `/api/reports` | `report.routes.js` |
| `/api/dashboard` | `dashboard.routes.js` |
| `/api/knowledge` | `knowledge.routes.js` |
| `/api/uploads` | `upload.routes.js` |
| `/api/notifications` | `notification.routes.js` |
| `/api/assistant` | `assistant.routes.js` |
| `/api/search` | `search.routes.js` |

### Controllers/Services

| Controller | Responsibilities |
|---|---|
| `auth.controller.js` | Signup, login, refresh, profile response, sanitization. |
| `research.controller.js` | Research job creation/list/detail, planning, approval, execution, evidence review, workflow placeholder endpoints. |
| `report.controller.js` | Report listing/detail, feedback creation, export generation. |
| `dashboard.controller.js` | Dashboard metrics and admin operations aggregations. |
| `knowledge.controller.js` | Knowledge list/search and create. |
| `upload.controller.js` | Upload validation, extraction, upload metadata, knowledge memory, soft delete. |
| `notification.controller.js` | Notification listing and read state updates. |
| `assistant.controller.js` | Gemini chat and structured market dashboard analysis. |
| `search.controller.js` | Local global search. |

| Service | Responsibilities |
|---|---|
| `gemini.service.js` | Model fallback list, text/JSON generation, Gemini error normalization. |
| `tavily.service.js` | Tavily search call. |
| `firecrawl.service.js` | Optional Firecrawl scrape call. |
| `playwright.service.js` | Chromium page text retrieval. |
| `qdrant.service.js` | Optional collections, upsert, semantic search. |

### Middleware

| Middleware | Description |
|---|---|
| `requireAuth` | Verifies bearer token, loads active user, attaches `req.user`. |
| `requireRole` | Allows only listed roles. |
| `notFound` | Converts unknown routes into 404 errors. |
| `errorHandler` | Formats errors and Zod validation details. |

### Database Connection

`connectMongo()`:

- Supports local fallback in development.
- Requires URI in production.
- Configures optional DNS servers.
- Sets connection timeouts from env vars.
- Enables TLS for SRV/TLS URIs.
- Redacts MongoDB credentials in connection error messages.

### AI Integration

Backend AI integration is centralized in Gemini service and LangGraph workflow. External source gathering is implemented through Tavily, Firecrawl, and Playwright services.

### File Handling

Multer uses memory storage. Files are not saved to local disk or cloud storage by the current implementation.

### Report Generation

Reports are persisted as MongoDB documents and exported on demand with in-controller generation logic.

---

## 18. Installation and Setup

### Prerequisites

| Requirement | Notes |
|---|---|
| Git | Required to clone the repository. |
| Node.js | Backend expects Node `20.x`; frontend package declares Node `24.x`. |
| npm | Required for dependency installation and scripts. |
| MongoDB | Local MongoDB or MongoDB Atlas. |
| Gemini API key | Required for AI features. |
| Tavily API key | Required for research source search. |
| Firecrawl API key | Optional page scraping. |
| Qdrant URL/API key | Optional semantic memory/search. |
| Playwright browsers | Required for browser retrieval during workflow; package is installed, but browser binaries may require `npx playwright install` depending on environment. |

### Clone Repository

```bash
git clone https://github.com/mdsameer2023/AI_Market_Strategy_Engine.git
cd AI_Market_Strategy_Engine
```

If using the local folder directly:

```bash
cd AI_Market_Strategy_Engine
```

### Backend Setup

```bash
cd backend
npm install
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Edit `backend/.env` with MongoDB and provider credentials.

### Frontend Setup

```bash
cd ../frontend
npm install
copy .env.example .env.local
```

On macOS/Linux:

```bash
cp .env.example .env.local
```

### Local MongoDB Option

For local development without Atlas:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/market_research_engine
```

If no MongoDB URI is set and `NODE_ENV` is not production, the backend defaults to this local URI.

### AI Setup

At minimum, set:

```env
GEMINI_API_KEY=your-key
TAVILY_API_KEY=your-key
```

Optional:

```env
FIRECRAWL_API_KEY=your-key
QDRANT_URL=your-qdrant-url
QDRANT_API_KEY=your-qdrant-key
```

---

## 19. Environment Variables

### Backend `.env.example`

```env
NODE_ENV=development
PORT=8080
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3010,https://ai-market-strategy-engine.vercel.app
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/market_research
# MONGO_URL is also supported for MongoDB Atlas compatibility.
JWT_ACCESS_SECRET=replace-with-long-random-access-secret
JWT_REFRESH_SECRET=replace-with-long-random-refresh-secret
# JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_MODEL_FALLBACKS=gemini-2.5-flash
# Gemini 2.5 Pro requires available quota/billing on the configured Google AI project.
TAVILY_API_KEY=
FIRECRAWL_API_KEY=
QDRANT_URL=
QDRANT_API_KEY=
RESEARCH_TIMEOUT_MS=45000
EXTRACTION_PROMPT_CONTENT_CHARS=6000
RATE_LIMIT_PER_MINUTE=120
MONGODB_SERVER_SELECTION_TIMEOUT_MS=10000
MONGODB_CONNECT_TIMEOUT_MS=10000
MONGODB_SOCKET_TIMEOUT_MS=45000
# Local troubleshooting only. Do not enable in production.
MONGODB_TLS_ALLOW_INVALID_CERTIFICATES=false
# Optional: fixes Atlas mongodb+srv DNS lookup failures on some networks.
DNS_SERVERS=8.8.8.8,1.1.1.1
```

| Variable | Purpose | Required |
|---|---|---|
| `NODE_ENV` | Runtime environment. Production enforces MongoDB URI. | Yes |
| `PORT` | Backend port. Defaults to `8080` when unset. | No |
| `CORS_ORIGIN` | Comma-separated allowed frontend origins. | Yes for deployment |
| `MONGODB_URI` | MongoDB connection URI. | Required in production |
| `MONGO_URL` | Alternative MongoDB URI variable. | Optional |
| `JWT_ACCESS_SECRET` | Access-token signing secret. | Yes |
| `JWT_REFRESH_SECRET` | Refresh-token signing secret. | Yes |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime. Defaults to `15m`. | Optional |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime. Defaults to `7d`. | Optional |
| `GEMINI_API_KEY` | Gemini provider API key. | Required for AI features |
| `GEMINI_MODEL` | Primary Gemini model. | Optional |
| `GEMINI_MODEL_FALLBACKS` | Comma-separated Gemini fallback models. | Optional |
| `TAVILY_API_KEY` | Tavily source search API key. | Required for research workflow search |
| `FIRECRAWL_API_KEY` | Firecrawl scraping API key. | Optional |
| `QDRANT_URL` | Qdrant endpoint. | Required for semantic memory/search |
| `QDRANT_API_KEY` | Qdrant API key. | Required for semantic memory/search |
| `RESEARCH_TIMEOUT_MS` | Timeout for research provider calls. | Optional |
| `EXTRACTION_PROMPT_CONTENT_CHARS` | Max source text included in extraction prompt. | Optional |
| `RATE_LIMIT_PER_MINUTE` | Express rate limit per minute. | Optional |
| `MONGODB_SERVER_SELECTION_TIMEOUT_MS` | MongoDB server selection timeout. | Optional |
| `MONGODB_CONNECT_TIMEOUT_MS` | MongoDB connection timeout. | Optional |
| `MONGODB_SOCKET_TIMEOUT_MS` | MongoDB socket timeout. | Optional |
| `MONGODB_TLS_ALLOW_INVALID_CERTIFICATES` | Local TLS troubleshooting only. | No |
| `DNS_SERVERS` | Optional DNS servers for SRV lookup troubleshooting. | No |

### Frontend `.env.example`

```env
# Local development:
API_URL=https://ai-market-strategy-engine.onrender.com
NEXT_PUBLIC_API_URL=/api

# Production on Vercel:
# NEXT_PUBLIC_API_URL=https://ai-market-strategy-engine.onrender.com/api
```

| Variable | Purpose | Required |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Browser-visible API base URL. `/api` uses the Next proxy route. | Yes |
| `API_URL` | Server-side backend origin for Next.js API proxy. | Optional |

---

## 20. How to Run the Project

### Backend Development Mode

```bash
cd backend
npm run dev
```

Expected local backend URL:

```text
http://localhost:8080
```

Health check:

```bash
curl http://localhost:8080/health
```

### Frontend Development Mode

Open another terminal:

```bash
cd frontend
npm run dev
```

Expected local frontend URL:

```text
http://localhost:3000
```

### Backend Production Mode

```bash
cd backend
npm start
```

### Frontend Production Mode

```bash
cd frontend
npm run build
npm start
```

### Tests

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm test
```

### AI/Python Components

No separate Python AI component was found. AI and agent workflow code is implemented in Node.js.

---

## 21. User Guide

### Create Account

1. Open `/signup`.
2. Enter full name, email, password.
3. Select account type:
   - Consultant
   - Reviewer
4. Submit.
5. The app stores tokens and opens the dashboard.

### Login

1. Open `/login`.
2. Enter email and password.
3. Optionally select "Remember me" for remembered email.
4. Submit.
5. The app redirects to `/dashboard`.

### Enter Query / Start Research

Option 1:

1. Click "New Research" in the top bar.
2. Enter industry, geography, time period, competitors, and objective.
3. Click Analyze.
4. The app navigates to workflow monitor.

Option 2:

1. Open `/research-intake`.
2. Enter research question, industry, geography, timeframe, and competitors.
3. Click Start Research.
4. The app navigates to research plans.

### Upload Document

1. Click "Upload Files" in the top bar or open `/upload-data-hub`.
2. Drag files or choose files.
3. Supported extensions are PDF, DOCX, XLSX, CSV, PPT, and PPTX.
4. Upload progress is shown.
5. Uploaded files appear in recent uploads/data sources.

### Monitor Progress

1. Open `/workflow-monitor`.
2. View stage timeline.
3. Track current stage, progress percent, runtime, error, and logs.
4. Page refetches every 5 seconds.

### View Results

Use:

- `/dashboard` for metrics and trends.
- `/reports` for generated reports.
- `/knowledge-base` for stored knowledge records.
- `/evidence-review` for reviewer/admin evidence decisions.
- `/market-intelligence`, `/competitive-analysis`, `/forecasting`, etc. for specialized workspace views.

### Preview Report

1. Open `/reports`.
2. The report is shown in article-style sections.
3. Missing normalized sections display placeholder text.

### Download Report

1. In `/reports`, click Export PDF.
2. In Recent Reports on dashboard, use PDF, MD, or CSV buttons.
3. Backend API also supports DOCX export.

### Use AI Assistant

1. Open `/ai-assistant`.
2. Type a strategy/market question.
3. Submit to receive a Gemini-generated response.

### Use Global Search and Analysis

1. Use the search bar in the top header.
2. Type a market, company, industry, report, or file term.
3. Matching local results appear.
4. Click Analyze to generate a structured market analysis dashboard.

### Logout

1. Click Logout in the sidebar profile area.
2. The frontend removes local tokens and redirects to `/login`.

---

## 22. Error Handling

### Backend Error Handling

Implemented in `backend/src/middleware/error.middleware.js`.

Behaviors:

- Unknown routes produce `404` with route method and URL.
- Zod validation errors produce status `400`, `error: "ValidationError"`, and details array.
- Provider/application errors use `err.status` or `err.statusCode`.
- Fallback status is `500`.
- `retryAfterSeconds` is returned and added as `Retry-After` header when present.

### Common Errors

| Error | Cause | Resolution |
|---|---|---|
| `Authentication token missing` | No bearer token sent. | Log in and include access token. |
| `User is not authorized` | Invalid token or inactive user. | Log in again; verify user is active. |
| `Insufficient permissions` | Route requires reviewer/admin or admin. | Use correct role. |
| `Email is already registered` | Duplicate signup email. | Log in or use another email. |
| `Admin accounts cannot be created from public signup` | Signup role is `admin`. | Create admin manually through DB/admin process; no route exists. |
| `Research plan must be approved before workflow execution` | Manual run without approved plan. | Approve plan first. |
| `Tavily API key is not configured` | Missing `TAVILY_API_KEY`. | Set env var. |
| `Gemini API key is not configured` | Missing `GEMINI_API_KEY`. | Set env var. |
| `Qdrant is not configured` | Missing Qdrant env vars. | Set `QDRANT_URL` and `QDRANT_API_KEY` or accept no semantic results. |
| `Unsupported export format` | Invalid report export format. | Use `md`, `markdown`, `csv`, `pdf`, or `docx`. |
| `No files were provided` | Multipart request lacks `files`. | Send files under field name `files`. |
| Upload failed record | Unsupported MIME type. | Upload allowed file types only. |

### Frontend Error Handling

The Axios interceptor:

- Extracts backend validation details when present.
- Formats server error messages.
- Rejects with a user-facing `Error`.

Pages/components display errors in inline messages, such as auth errors, research errors, dashboard errors, upload errors, assistant errors, and evidence review errors.

---

## 23. Security

### Implemented Security Measures

| Measure | Status | Notes |
|---|---|---|
| Password hashing | Implemented | bcrypt cost 12. |
| Refresh token hashing | Implemented | Refresh token stored as bcrypt hash. |
| JWT access tokens | Implemented | Required by protected API routes. |
| Role-based access | Implemented | `requireRole` controls reviewer/admin/admin-only endpoints. |
| Active user check | Implemented | `requireAuth` rejects missing/inactive users. |
| Helmet | Implemented | Adds standard HTTP security headers. |
| CORS allowlist | Implemented | Local and deployed origins are allowed; env can add more. |
| Rate limiting | Implemented | Global per-minute limit, default 120. |
| Request validation | Partially implemented | Zod validates auth, intake, and evidence review. Some endpoints accept arbitrary body. |
| File type validation | Implemented | MIME allowlist in upload controller. |
| Upload size/count limits | Implemented | 50 MB each, 8 files. |
| Environment variables | Implemented | Secrets are expected in `.env`; examples do not expose real keys. |
| Scoped database queries | Implemented | Jobs/reports/uploads scoped to owner unless reviewer/admin/admin behavior applies. |
| Audit logging | Partially implemented | Signup, login, research create, plan approval, and evidence decisions are audited. |

### Security Gaps or Improvements

- No backend logout/revoke endpoint.
- No password reset token flow.
- No CSRF-specific protection; API is bearer-token based.
- Some endpoints accept arbitrary feedback/knowledge request bodies without strong schema validation.
- Uploaded files are kept in memory during processing; large uploads can pressure memory despite limits.
- Admin user creation is not implemented through a secure admin management flow.
- No malware scanning or content moderation for uploads.
- No persistent provider health-check endpoint.

---

## 24. Testing

### Existing Backend Tests

Located in `backend/tests/`.

| File | Coverage |
|---|---|
| `auth.test.js` | Password hashing/verification, default role, public signup role restrictions. |
| `research.test.js` | Protected research route rejects anonymous users; research job model validation. |
| `cors.test.js` | Deployed Vercel origin and common local frontend ports are allowed. |

Run:

```bash
cd backend
npm test
```

### Existing Frontend Tests

Located in `frontend/tests/`.

| File | Coverage |
|---|---|
| `smoke.test.js` | Reusable button renders children. |
| `api.test.js` | API base URL resolution for local/deployed/proxy cases. |

Run:

```bash
cd frontend
npm test
```

### Recommended Test Cases

The existing tests are useful but not complete. Recommended additional tests:

- Signup/login API integration with test MongoDB.
- Refresh token success/failure.
- Role-based access for reviewer/admin/admin-only endpoints.
- Full research workflow with mocked Gemini/Tavily/Firecrawl/Playwright/Qdrant.
- Tavily missing key and Gemini missing key error paths.
- Upload MIME rejection and size limit behavior.
- PDF/DOCX/CSV/Markdown export response headers and content.
- Evidence review status changes.
- Knowledge search with and without Qdrant.
- Dashboard aggregation accuracy with seeded data.
- Frontend protected route behavior.
- Frontend workflow monitor polling behavior.
- Frontend reports export actions.
- End-to-end flow from signup to research job to report export.

---

## 25. Performance Considerations

### Implemented Performance-Related Behavior

- React Query caching reduces repeated frontend requests.
- Dashboard uses MongoDB aggregations for grouped metrics.
- Research job creation returns immediately while planning/workflow starts asynchronously.
- Source collection deduplicates canonical URLs per workflow run.
- Dashboard page dynamically imports heavier chart/workspace components.
- Frontend API calls use timeouts, with longer timeouts for research and AI analysis where configured.
- Backend rate limiting reduces high-frequency abuse.
- MongoDB indexes exist for frequently searched/scoped fields.

### Potential Bottlenecks

- Research workflow is not queued; background execution uses `setImmediate` and then runs provider calls in-process.
- Playwright launches Chromium per page retrieval, which can be slow and resource-intensive.
- Upload processing uses memory storage, so concurrent large uploads can increase memory pressure.
- Qdrant embedding generation asks Gemini to create numeric vectors, which is slower and less appropriate than a dedicated embedding API.
- Dashboard aggregations may become heavier as data grows.
- Report exports are generated on demand rather than cached.
- The workflow can fail if Tavily is not configured because source search is required.

---

## 26. Limitations

- No backend password reset implementation.
- No backend logout/refresh token revocation endpoint.
- No secure admin management UI/API.
- Notifications route page is commented out, although API/components exist.
- Uploaded original files are not persisted to disk or cloud storage.
- Office document extraction is basic and not format-aware.
- Uploaded files are not directly attached to LangGraph research jobs.
- Separate finance/news agents do not exist.
- Report approval/archive endpoints do not exist.
- Report export URL persistence is not implemented.
- Qdrant vectors are generated through Gemini JSON prompts rather than a dedicated embedding model.
- Some existing documentation in `docs/ARCHITECTURE.md` mentions Gemini 2.5 Pro, but source defaults to `gemini-2.5-flash-lite`.
- The frontend package declares Node `24.x` while the backend declares Node `20.x`, which can complicate a single-machine setup.
- Some frontend text contains mojibake-style rendering artifacts, such as an incorrectly encoded separator, in a few components.

---

## 27. Future Enhancements

- Add backend logout and refresh-token revocation.
- Implement full password reset with secure tokens and email provider.
- Add secure admin user management.
- Add a real background job queue for research execution.
- Add OpenAPI/Swagger generation for the REST API.
- Add specialized parsers for PDF, DOCX, XLSX, CSV, PPT/PPTX.
- Store uploaded files in S3, Cloudinary, Azure Blob, or another durable storage provider.
- Attach uploaded files to research jobs and include them in source/evidence extraction.
- Add dedicated embedding model integration for Qdrant.
- Add report approve/archive routes and reviewer workflow for reports.
- Cache generated exports and populate `Report.exports`.
- Add provider health endpoints for Gemini, Tavily, Firecrawl, Qdrant, and MongoDB.
- Expand test coverage with integration and E2E tests.
- Add observability for provider latency, workflow runtime, failures, and token usage.
- Complete `/notifications` page route.
- Add committed screenshots for final project submission.

---

## 28. Deployment

### Frontend Deployment: Vercel

The frontend contains `frontend/vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

Recommended Vercel settings:

| Setting | Value |
|---|---|
| Project root | `frontend` |
| Build command | `npm run build` |
| Output directory | `.next` |
| Environment variable | `NEXT_PUBLIC_API_URL=https://ai-market-strategy-engine.onrender.com/api` |

Live frontend URL found in source:

```text
https://ai-market-strategy-engine.vercel.app
```

### Backend Deployment: Render

The backend has Render-compatible scripts:

```json
{
  "scripts": {
    "start": "node src/server.js"
  }
}
```

Recommended Render settings:

| Setting | Value |
|---|---|
| Service type | Web Service |
| Root directory | `backend` |
| Build command | `npm install` |
| Start command | `npm start` |
| Runtime | Node |

Backend URL found in source:

```text
https://ai-market-strategy-engine.onrender.com
```

### Backend Environment for Deployment

Set real values for:

- `NODE_ENV=production`
- `PORT` as provided by platform or `8080` if platform expects it
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_REFRESH_EXPIRES_IN`
- `GEMINI_API_KEY`
- `TAVILY_API_KEY`
- Optional `FIRECRAWL_API_KEY`
- Optional `QDRANT_URL`
- Optional `QDRANT_API_KEY`
- `CORS_ORIGIN=https://ai-market-strategy-engine.vercel.app`

### Database Deployment

MongoDB Atlas is a reasonable production option because the code supports standard MongoDB/MongoDB Atlas connection strings.

### Deployment Caveats

- The backend must be able to run Playwright/Chromium in the hosting environment if workflow retrieval relies on Playwright.
- Production requires a reachable MongoDB URI.
- Gemini/Tavily credentials are required for full research workflow functionality.
- Qdrant and Firecrawl are optional but improve semantic memory and scraping.

---

## 29. Screenshots

No committed screenshot set for all UI pages was found in the repository. The user-provided prompt included a dashboard screenshot, but it is not a repository file. The repository does contain generated chart/report assets.

### Screenshot Placeholders for Submission

Add real screenshots before final college/Demo Day submission:

| Screenshot | Route/Area | Status |
|---|---|---|
| Login screen | `/login` | Placeholder needed |
| Signup screen | `/signup` | Placeholder needed |
| Dashboard | `/dashboard` | Placeholder needed |
| Research intake | `/research-intake` or New Research modal | Placeholder needed |
| File upload | `/upload-data-hub` or Upload modal | Placeholder needed |
| Workflow monitor | `/workflow-monitor` | Placeholder needed |
| Evidence review | `/evidence-review` | Placeholder needed |
| Knowledge base | `/knowledge-base` | Placeholder needed |
| Reports preview | `/reports` | Placeholder needed |
| Report download/export | `/reports` export action | Placeholder needed |
| AI assistant | `/ai-assistant` | Placeholder needed |
| Operations dashboard | `/operations` admin account | Placeholder needed |

### Existing Visual Assets

| Asset | Path |
|---|---|
| Final report HTML preview | `output/pdf/final_report_html_preview.png` |
| Final report PDF | `output/pdf/AI_Market_Strategy_Engine_Final_Report.pdf` |
| Final report HTML | `output/html/AI_Market_Strategy_Engine_Final_Report.html` |
| Markdown final report | `reports/AI_Market_Strategy_Engine_Final_Report.md` |
| AI adoption value gap chart | `charts/ai_adoption_value_gap.png` |
| AI governance risk indicators chart | `charts/ai_governance_risk_indicators.png` |
| AI private investment gap chart | `charts/ai_private_investment_gap.png` |
| AI spending by market chart | `charts/ai_spending_by_market.png` |
| Competitive capability index chart | `charts/competitive_capability_index.png` |
| Customer segments chart | `charts/customer_segments.png` |
| Market opportunity ranking chart | `charts/market_opportunity_ranking.png` |
| Risk heatmap chart | `charts/risk_heatmap.png` |
| SWOT radar chart | `charts/swot_radar.png` |

---

## 30. References and Documentation

### Project Source References

| Resource | Purpose |
|---|---|
| `backend/src/app.js` | Express middleware, health check, route mounts |
| `backend/src/server.js` | Backend startup and MongoDB connection |
| `backend/src/routes` | API route definitions |
| `backend/src/controllers` | Route behavior and response logic |
| `backend/src/models` | Mongoose schemas |
| `backend/src/agents/researchGraph.js` | LangGraph research workflow |
| `backend/src/services/gemini.service.js` | Gemini integration and model fallback |
| `backend/src/services/tavily.service.js` | Tavily search integration |
| `backend/src/services/firecrawl.service.js` | Firecrawl scrape integration |
| `backend/src/services/playwright.service.js` | Playwright page retrieval |
| `backend/src/services/qdrant.service.js` | Qdrant semantic memory |
| `frontend/app` | Next.js pages/routes |
| `frontend/components` | UI and dashboard components |
| `frontend/lib/api.js` | Axios API client and URL resolution |
| `frontend/redux/store.js` | Redux slices |
| `frontend/app/api/[...path]/route.js` | Next.js API proxy |
| `docs/API.md` | Existing API route summary |
| `docs/ARCHITECTURE.md` | Existing architecture notes |
| `docs/DEPLOYMENT.md` | Existing deployment guide |
| `docs/TESTING.md` | Existing testing guide |
| `docs/GEMINI_QUOTA.md` | Existing Gemini quota notes |

### Official Documentation

| Technology | Official Documentation |
|---|---|
| Next.js App Router | https://nextjs.org/docs/app |
| React | https://react.dev/reference/react |
| Express 4 | https://expressjs.com/en/4x/api.html |
| MongoDB Node.js Driver | https://www.mongodb.com/docs/drivers/node/current/ |
| Mongoose | https://mongoosejs.com/docs/ |
| Google Gemini API | https://ai.google.dev/api |
| LangGraph JS | https://docs.langchain.com/oss/javascript/langgraph/overview |
| Tavily Search API | https://docs.tavily.com/documentation/api-reference/endpoint/search |
| Firecrawl API | https://docs.firecrawl.dev/api-reference/v2-introduction |
| Playwright | https://playwright.dev/docs/intro |
| Qdrant | https://qdrant.tech/documentation/ |
| Tailwind CSS | https://tailwindcss.com/docs |
| Redux Toolkit | https://redux.js.org/redux-toolkit/overview/ |
| TanStack Query | https://tanstack.com/query/latest/docs/framework/react/overview |
| Recharts | https://recharts.github.io/ |
| Axios | https://axios-http.com/docs/intro |
| Multer | https://www.npmjs.com/package/multer |
| PDFKit | https://pdfkit.org/docs/getting_started.html |
| Jest | https://jestjs.io/ |
| Vercel Next.js deployment | https://vercel.com/docs/frameworks/full-stack/nextjs |
| Render Node/Express deployment | https://render.com/docs/deploy-node-express-app |

---

## 31. Conclusion

McKinsey: AI Market Research & Strategy Engine implements a professional full-stack AI research workflow for market strategy use cases. The project solves the problem of slow, hard-to-audit research by combining authenticated user workspaces, research intake, source collection, evidence extraction, validation, report generation, knowledge memory, dashboards, and reviewer/admin governance.

Technically, the system is built with a modern Next.js frontend, an Express/MongoDB backend, Mongoose data models, JWT/bcrypt authentication, a LangGraph workflow, Gemini AI generation, Tavily/Firecrawl/Playwright source collection, optional Qdrant semantic memory, and report exports in multiple formats.

The project is strong for a college submission or Demo Day because it demonstrates real full-stack engineering, AI workflow orchestration, role-based access control, evidence traceability, and dashboard-driven operations. The most important improvements before final submission are completing password reset/logout/admin management, improving file extraction and storage, finishing the notifications page, expanding tests, and adding real screenshots.
