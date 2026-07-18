// A tiny file-based "database" so the MVP has real persistence without
// standing up Postgres yet. Swap this module out for Prisma + Postgres
// (see README) once you move past the prototype stage — this file storage
// is NOT safe for concurrent users or serverless deploys (e.g. Vercel),
// since the filesystem there is read-only / ephemeral at runtime.

import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const DEFAULT_STATE = {
  resumeText: `Damodara Rao
Software Developer

Motivated software developer with experience in building web applications.

Experience:
- Built internal tools using React and Node.js
- Worked with PostgreSQL databases
- Collaborated with a small team on a job portal product

Skills: JavaScript, React, Node.js, SQL, Git`,
  jobDesc: `We are hiring a Software Engineer with 2+ years of experience in React, Node.js and REST API development. Experience with PostgreSQL, agile teams, and performance optimization is a plus. You'll build scalable web applications and collaborate cross-functionally.`,
  atsResult: null,
  improved: null,
  coverLetters: {}, // keyed by jobId, "_general" for job-less letters
  applications: [],
};

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_STATE, null, 2));
  }
}

export function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function writeDb(partial) {
  const current = readDb();
  const next = { ...current, ...partial };
  fs.writeFileSync(DB_PATH, JSON.stringify(next, null, 2));
  return next;
}
