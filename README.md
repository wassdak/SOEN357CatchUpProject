# CatchUp

**SOEN 357 — Concordia University — Winter 2026**

**Repository:** [github.com/wassdak/SOEN357CatchUpProject](https://github.com/wassdak/SOEN357CatchUpProject)

CatchUp is a React prototype for an A/B user study: **Version A** is a manual study planner; **Version B** generates a day-by-day recovery plan with client-side rules (no server). The landing page shows the study scenario; participants open the version they were assigned, then use **Submit & take survey** to open the post-task questionnaire in a new tab.

**Tech:** React 18 (Create React App), CSS. Post-task URL: [`src/surveyUrl.js`](src/surveyUrl.js) (default: team Google Form).

## How to run

Requires **Node.js 18+** and **npm**.

```bash
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
```

Output folder: `build/`.

Optional: copy `.env.example` to `.env.local` and set `REACT_APP_SURVEY_URL` only if you need a different survey link than the default in `surveyUrl.js`.

## Project layout

- `public/` — `index.html`, static assets  
- `src/` — `App.jsx` (screens), `index.css`, `components/` (`Landing`, `VersionA`, `VersionB`), `surveyUrl.js`  
- `docs/` — extra notes for the study form (optional)

## Team

- Yusuf Chahal  
- Wassim Dakka  
- Anthony Mousaoubaa  
- Hugo Valente  
- Paul Nasr  
