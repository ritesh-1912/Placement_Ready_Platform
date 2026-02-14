# Placement Readiness Platform

A structured web app that helps candidates prepare for placement interviews by analyzing job descriptions, extracting skills, generating round-wise checklists, 7-day plans, and interview questions—all running locally with no external APIs.

---

## Features

### Core Analysis
- **JD analysis** — Paste a job description; get skills, readiness score, and preparation artifacts.
- **Skill extraction** — Case-insensitive keyword detection across 6 categories: Core CS, Languages, Web, Data, Cloud/DevOps, Testing. Fallback to "General fresher stack" or default other skills when none detected.
- **Readiness score** — Deterministic 0–100 score from JD length, company/role, and detected categories. Base score is fixed at analysis time; live score adjusts with skill confidence toggles.

### Interactive Results
- **Skill confidence toggles** — Each extracted skill has "I know this" / "Need practice" (default: Need practice). Stored per history entry as `skillConfidenceMap[skill] = "know" | "practice"`.
- **Live score** — Score updates in real time: baseScore + 2×(know) − 2×(practice), clamped 0–100.
- **Action Next** — Top 3 weak (practice-marked) skills and suggestion: "Start Day 1 plan now."

### Company Intel & Round Mapping
- **Company Intel** (when company name is provided) — Company name, inferred industry, size (Startup &lt;200 / Mid-size 200–2000 / Enterprise 2000+), and "Typical Hiring Focus" (templates by size). Heuristic-based; no scraping. Demo note shown.
- **Round mapping** — Dynamic interview round flow by company size and detected skills (e.g. Enterprise + DSA → 4 rounds including HR; Startup + React/Node → 3 rounds). Vertical timeline with "Why this round matters" per round.

### Data & Export
- **History** — All analyses saved in `localStorage` with a consistent schema. Corrupted entries are skipped with a calm warning.
- **Export** — Copy 7-day plan, copy round checklist, copy 10 questions; Download as TXT (single file with all sections).

### Quality & Ship
- **Input validation** — JD required; minimum 200 characters (submission blocked below that with a calm warning). Company and Role optional.
- **Test checklist** (`/prp/07-test`) — 10 manual tests with checkboxes and "How to test" hints. Summary: "Tests Passed: X / 10"; warning if &lt;10: "Fix issues before shipping." Stored in `localStorage`.
- **Ship lock** (`/prp/08-ship`) — Page shows "Shipped" only when: all 8 build steps completed, all 10 test items passed, and all 3 proof links provided. Otherwise locked with requirements list.
- **Proof page** (`/prp/proof`) — 8 step completion overview; 3 required URLs (Lovable Project, GitHub Repo, Deployed URL) with validation; "Copy Final Submission" for formatted export. Links stored in `prp_final_submission`.

---

## Tech Stack

- **React 18** + **Vite**
- **React Router** for routes
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **localStorage** for persistence (no backend)

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/dashboard` | Dashboard home |
| `/dashboard/analyze` | Analyze JD form |
| `/dashboard/results` | Analysis results (use `?id=<entryId>` for a specific history entry) |
| `/dashboard/history` | Saved analyses list |
| `/dashboard/practice` | Practice |
| `/dashboard/assessments` | Assessments |
| `/dashboard/profile` | Profile |
| `/prp/07-test` | Test checklist (10 items) |
| `/prp/proof` | Build proof (8 steps + 3 proof links) |
| `/prp/08-ship` | Ship (locked until all requirements met) |

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install and run
```bash
npm install
npm run dev
```
Open `http://localhost:5173`.

### Build for production
```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/     # UI components (Card, dashboard widgets)
├── layouts/        # DashboardLayout (sidebar, routes)
├── pages/          # Analyze, Results, History, Proof, TestChecklist, Ship, etc.
└── utils/          # analysisEngine, skillExtraction, storage, schema,
                    # companyIntel, roundMapping, testChecklist, proofSubmission
```

### Key modules
- **`analysisEngine.js`** — Orchestrates skill extraction, checklist, 7-day plan, questions, score, company intel, round mapping.
- **`skillExtraction.js`** — Keyword-based skill detection and category mapping.
- **`storage.js`** — Save/load/update history; uses `schema.js` for normalization and validation.
- **`companyIntel.js`** — Heuristic company size and industry; hiring focus templates.
- **`roundMapping.js`** — Rounds by company size and detected skills.
- **`testChecklist.js`** — Test checklist state in localStorage.
- **`proofSubmission.js`** — Step completion and proof links; shipped status (8 steps + 10 tests + 3 links).

---

## Data Stored (localStorage)

| Key | Purpose |
|-----|--------|
| `placement_analysis_history` | Array of analysis entries (id, company, role, jdText, extractedSkills, roundMapping, checklist, plan7Days, questions, baseScore, finalScore, skillConfidenceMap, etc.) |
| `prp_test_checklist` | 10 test items with `checked` state |
| `prp_steps_completion` | 8 build steps with `completed` state |
| `prp_final_submission` | Proof links: lovableProjectLink, githubRepoLink, deployedUrl |

---

## Documentation

- **[VERIFICATION.md](./VERIFICATION.md)** — Verification guide, test scenarios, and checklists for all features.
- **[SAMPLE_JD.md](./SAMPLE_JD.md)** — Sample job description for testing the analyzer.
- **[docs/KodNest-Design-System.md](./docs/KodNest-Design-System.md)** — Design system (colors, typography, components).

---

## License

Private project. All rights reserved.
