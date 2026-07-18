# CareerOS — Phase 1 MVP (Next.js)

A full-stack Next.js implementation of the CareerOS wireframe: landing page,
dashboard, job search, ATS resume check, AI resume improvement, AI cover
letter generation, and an application tracker.

## Stack

- **Next.js 14** (App Router) + React 18
- **Tailwind CSS** for styling
- **Anthropic SDK** (server-side) for all AI features — ATS scoring, resume
  rewriting, cover letter generation
- **File-based JSON storage** (`data/db.json`) standing in for a real
  database during the prototype phase — see "Moving to production" below

## Getting started

```bash
npm install
cp .env.local.example .env.local
# then edit .env.local and add your real Anthropic API key
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
  (app)/applications/      → application tracker
  (app)/profile/           → edit your master resume
  api/
    state/route.js         → GET/PATCH the shared app state (file-backed)
    ats-check/route.js      → POST → Claude ATS scoring
    resume-improve/route.js → POST → Claude resume rewrite
    cover-letter/route.js   → POST → Claude cover letter generation
    applications/route.js   → GET/POST tracked applications
lib/
  anthropic.js  → server-side Claude client wrapper
  db.js         → tiny JSON-file persistence layer
  useAppState.js → client hook wrapping /api/state
data/
  mockJobs.js  → sample job listings (Phase 2: replace with a real job API)
  db.json      → generated on first run, holds your resume/ATS/app state
```

## What's real vs. mocked right now

**Real (calls Claude live):**
- ATS resume scoring
- AI resume improvement (before/after rewrite)
- AI cover letter generation

**Mocked (Phase 2+ work):**
- Job listings (`data/mockJobs.js`) — no live job board integration yet
- Auth — single implicit user, no login/session system
- "Jobs Matched: 128" and "Interviews: 0" stats are placeholders

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

## Environment variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key — required for all AI features |
