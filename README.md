# CatchUp — Academic recovery A/B prototype (SOEN 357)

**SOEN 357 · Human-Computer Interaction & UX Design · Concordia University · Winter 2026**

This repository is the **CatchUp** research prototype used in a user study comparing **Version A** (manual planner) and **Version B** (AI-framed planner) after the same standardized scenario on the landing page. **Submit & take survey** opens the team [Google Form](https://forms.gle/HegWvg121bHZbvWu7) by default ([`src/surveyUrl.js`](src/surveyUrl.js)). **Align survey items and consent with your submitted proposal** — see [`docs/STUDY_ALIGNMENT.md`](docs/STUDY_ALIGNMENT.md) and the question bank in [`docs/GOOGLE_FORM_SETUP.md`](docs/GOOGLE_FORM_SETUP.md). Override the URL with **`REACT_APP_SURVEY_URL`** in **`.env.local`** if needed (e.g. `/survey.html` for the bundled demo in [`public/survey.html`](public/survey.html)).

---

## Tech stack

- **React 18** (Create React App, `react-scripts`)
- **Vanilla CSS** with design tokens in [`src/index.css`](src/index.css) (Syne + DM Sans from Google Fonts in [`public/index.html`](public/index.html))
- **No backend** — “AI” plan generation in Version B is a **deterministic client-side** algorithm (templates + sorting + day packing)

---

## Install and run

Prerequisites: **Node.js 18+** and **npm 9+**.

```bash
cd catchup
npm install
npm start
```

Optional: copy `.env.example` to `.env.local` only if you need to override the default survey URL (e.g. `REACT_APP_SURVEY_URL=/survey.html`).

The app runs at [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
```

Output is in `build/` (suitable for GitHub Pages, Netlify, Vercel, etc.).

---

## File structure

```
catchup/
├── docs/
│   ├── STUDY_ALIGNMENT.md   # Hypothesis, DVs, consent (align with proposal)
│   └── GOOGLE_FORM_SETUP.md # Form steps + full question bank
├── public/
│   ├── index.html          # Document shell + Google Fonts
│   └── survey.html         # Fallback survey if REACT_APP_SURVEY_URL unset
├── src/
│   ├── index.js            # React root mount
│   ├── index.css           # Global tokens, motion, utilities
│   ├── surveyUrl.js        # Survey URL from env or /survey.html
│   ├── App.jsx             # Switches landing ↔ Version A ↔ Version B
│   └── components/
│       ├── Landing.jsx     # Scenario + assigned-version entry
│       ├── VersionA.jsx    # Control: manual tasks, progress, survey link
│       └── VersionB.jsx    # Experimental: inputs, loading, plan, regenerate, survey link
├── .env.example            # REACT_APP_SURVEY_URL template
├── package.json
└── README.md
```

---

## Post-task survey

- **Default:** [`src/surveyUrl.js`](src/surveyUrl.js) opens the team **Google Form** ([CatchUp Survey](https://forms.gle/HegWvg121bHZbvWu7)) in a **new tab** (`target="_blank"` + `rel="noopener noreferrer"`).
- **Override:** Set `REACT_APP_SURVEY_URL` in **`.env.local`** (e.g. `/survey.html` to use the bundled demo page from [`public/survey.html`](public/survey.html)). Restart `npm start`; set the same variable when building for production if you need a different URL.
- **Form content:** Finish and pilot questions using [`docs/GOOGLE_FORM_SETUP.md`](docs/GOOGLE_FORM_SETUP.md); link responses to **Google Sheets** for your report appendix.

## Running sessions and the report appendix

1. **Facilitator script:** Landing scenario → participant opens **only** assigned **A** or **B** → complete the task flow → **Submit & take survey** (opens the Google Form unless overridden via env).
2. **Pilot** the Form with 1–2 people; fix scales and typos.
3. **After sessions:** In Google Forms, open the linked **Spreadsheet** → **File → Download → CSV** (or screenshot summary tables).
4. **Final report:** Use exports for **Results** (tables, simple stats, graphs). Put **raw CSV, screenshots, or consent text** in **Appendices** as required by the SOEN 357 project handout. Obtain any needed permissions for quotes or recordings.

---

## HCI design decisions (rubric / report)

1. **Progressive disclosure** — The landing page presents the study scenario before any version-specific UI; Version B reveals plan details only after a dedicated loading phase.
2. **Visibility of system status** — Version A shows a live progress bar, completion counts, and total planned hours; Version B shows plan-level stats and a completion progress bar under the header.
3. **Error prevention & recovery** — Version A blocks empty task names with inline feedback and motion; Version B offers **Regenerate plan** to revisit inputs (user control).
4. **Recognition rather than recall** — Course chips, priority labels, and urgency badges pair **text** with color so urgency is never communicated by color alone.
5. **Consistency & standards** — Shared dark theme, typography (Syne / DM Sans), and accent mint (`--accent`) tie the two conditions to one design system while Version A stays utilitarian and Version B uses accent glow for the “assisted” condition.
6. **Feedback** — Focus rings on fields, hover/active on controls, staggered loading copy in Version B, and animated task completion reinforce that the system responded to input.
7. **Accessibility basics** — Associated `<label>` elements, `aria-label` / `aria-live` / `role="progressbar"` where helpful, and keyboard toggling for course chips support inclusive evaluation sessions.

---

## User study flow

1. Participant reads **YOUR STUDY SCENARIO** on the landing screen.
2. Participant opens **only** the version they were assigned (A or B).
3. They build or review a recovery plan in that interface.
4. They open the **post-task survey** from the in-app link (new tab).
5. Team exports responses from **Google Sheets** for analysis and appendix materials.

---

## Team

- Yusuf Chahal  
- Wassim Dakka  
- Anthony Mousaoubaa  
- Hugo Valente  
- Paul Nasr  

---

## References (course materials)

- Sweller, J. (1988). Cognitive load during problem solving. *Cognitive Science, 12*(2), 257–285.  
- Nielsen, J. (1994). **10 usability heuristics** (visibility of system status, user control, error prevention, etc.).  
- Amershi, S., et al. (2019). Guidelines for human-AI interaction. *CHI 2019*.  
