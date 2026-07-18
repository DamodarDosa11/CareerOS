# CareerOS — Phase 1 MVP (Next.js)

A full-stack Next.js implementation of the CareerOS wireframe: landing page,
dashboard, job search, ATS resume check, AI resume improvement, AI cover
letter generation, an application tracker with pipeline stages, and AI
interview prep.

## Stack

- **Next.js 14** (App Router) + React 18
- **Tailwind CSS** for styling
- **Local LLM via Ollama** (`lib/ai.js`) for all AI features — ATS scoring,
  resume rewriting, cover letter generation, interview question prep
- **File-based JSON storage** (`data/db.json`) standing in for a real
  database during the prototype phase — see "Moving to production" below

## Getting started

```bash
npm install
cp .env.local.example .env.local
# make sure Ollama is running and you've pulled a model, e.g.:
#   ollama pull llama3.1
#   ollama serve
npm run dev
```

Visit `http://localhost:3000`.

## Project structure

```
app/
  page.js                 → public landing page
  (app)/layout.js          → sidebar + topbar shell for the app screens
  (app)/dashboard/         → dashboard (stats, recommended jobs)
  (app)/job-search/        → searchable job list
  (app)/ats-check/         → paste resume + JD, get a real AI ATS score
  (app)/resume-improve/    → AI-rewritten resume summary/bullets
  (app)/cover-letter/      → AI-generated cover letter
  (app)/applications/      → Kanban application tracker (Applied → Interviewing → Offer/Rejected)
  (app)/interview-prep/    → AI-generated interview questions + answering tips per job
  (app)/profile/           → edit your master resume
  api/
    state/route.js               → GET/PATCH the shared app state (file-backed)
    ats-check/route.js            → POST → AI ATS scoring
    resume-improve/route.js       → POST → AI resume rewrite
    cover-letter/route.js         → POST → AI cover letter generation
    interview-questions/route.js  → POST → AI interview question + tip generation
    applications/route.js         → GET/POST tracked applications, PATCH to change pipeline status
lib/
  ai.js          → server-side LLM client wrapper (Ollama)
  db.js          → tiny JSON-file persistence layer
  useAppState.js → client hook wrapping /api/state
data/
  mockJobs.js  → sample job listings (Phase 2: replace with a real job API)
  db.json      → generated on first run, holds your resume/ATS/app/interview state
```

## Feature: Application pipeline tracking

Applications now carry a `status` field (`Applied`, `Interviewing`, `Offer`,
`Rejected`) instead of just a flat "applied" list. The Applications page
renders a 4-column Kanban board; moving an application between columns
`PATCH`es `/api/applications` with `{ id, status }`. The Dashboard's
"Interviews" stat now reflects real counts instead of a hardcoded `0`.

## Feature: AI interview prep

From the Applications board (or the sidebar), open **Interview Prep**, pick
a tracked application (or use your general resume/JD), and generate 8
tailored interview questions — a mix of Behavioral, Technical, Role-specific,
and Culture Fit — each with a short tip on how to answer it well given your
resume. Results are cached per job in `db.json` so you don't regenerate
every visit.

## What's real vs. mocked right now

**Real (calls the local LLM live):**
- ATS resume scoring
- AI resume improvement (before/after rewrite)
- AI cover letter generation
- AI interview question + tip generation

**Mocked (Phase 2+ work):**
- Job listings (`data/mockJobs.js`) — no live job board integration yet
- Auth — single implicit user, no login/session system
- "Jobs Matched: 128" stat is a placeholder

## Moving to production

The file-based store in `lib/db.js` is fine for local development but is
**not safe for serverless deploys** (e.g. Vercel) since the filesystem there
is read-only/ephemeral at runtime, and it has no concept of multiple users.
When you're ready:

1. Swap `lib/db.js` for **Prisma + Postgres** (Supabase/Neon/RDS all work).
2. Add real auth — **Clerk** or **NextAuth** are the fastest paths.
3. Replace `data/mockJobs.js` with a real job aggregator (Adzuna, JSearch/
   RapidAPI, or your own scraper pipeline).
4. Move resume file uploads (PDF/DOCX parsing) into a dedicated endpoint —
   right now the app takes plain resume text, not a file upload.
5. If you swap the local Ollama model back for the Anthropic API, restore an
   `ANTHROPIC_API_KEY`-based client in `lib/ai.js` (a `lib/anthropic.js`-style
   wrapper) and set the key in `.env.local`.

## Environment variables

| Variable | Description |
|---|---|
| `OLLAMA_HOST` | Base URL of your running Ollama instance (default `http://localhost:11434`) |
| `OLLAMA_MODEL` | Model to use for all AI features (default `llama3.1`) |