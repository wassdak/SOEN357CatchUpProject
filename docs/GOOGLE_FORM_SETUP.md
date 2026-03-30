# Google Form setup (copy-paste question bank)

## 1. Create the form

1. Go to [Google Forms](https://docs.google.com/forms).
2. Title: **CatchUp — Post-task survey (SOEN 357)**.
3. Settings (gear):  
   - **Responses:** create or link a **Google Sheet** for exports.  
   - Turn **Collect email addresses** **off** unless your design requires it (keeps anonymity simpler).  
   - Restrict to Concordia logins only if your instructor requires it.

## 2. Paste sections (suggested order)

### Section A — Consent

- **Description:** paste the consent blurb from [`STUDY_ALIGNMENT.md`](STUDY_ALIGNMENT.md).
- **Question:** Multiple choice (one answer) — “I agree to participate.” → **Yes** (required) or use checkbox-style with validation.

### Section B — Manipulation check

- **Which interface did you just use?** (Required)  
  - Version A — Standard Planner  
  - Version B — CatchUp AI  

### Section C — Primary measures (7-point Likert)

Use **Linear scale** 1 to 7 with labels:

1. **Right now, how stressed do you feel about catching up on your coursework after using this tool?**  
   - 1 = Not at all stressed · 7 = Extremely stressed  

2. **How confident are you that you could prepare effectively for exams if you followed a plan like the one you built or reviewed?**  
   - 1 = Not at all confident · 7 = Very confident  

### Section D — Usability (SUS-style, 5-point agreement)

Use **Linear scale** 1 to 5 or multiple choice rows:

1. I think I would like to use this system frequently.  
2. I found the system unnecessarily complex. *(reverse-score in analysis)*  
3. I thought the system was easy to use.  
4. I think I would need support to use this system. *(often reverse-scored)*  
5. I found the various functions well integrated.  
6. I thought there was too much inconsistency. *(reverse-scored)*  
7. I would imagine most people would learn to use this quickly.  
8. I found the system cumbersome. *(reverse-scored)*  
9. I felt very confident using the system.  
10. I needed to learn a lot before I could get going. *(reverse-scored)*  

Label ends: **1 = Strongly disagree · 5 = Strongly agree**

For a **short** session, pick **5 items** from the list above (keep at least one reverse-scored item). Document which items you used in the report.

### Section E — Open feedback (optional)

- **What helped or hurt your experience?** (Paragraph)  
- **Anything confusing or missing?** (Paragraph)

### Section F — Demographics (optional, minimal)

- **Are you currently a university student?** Yes / No  
- **Optional:** program or year of study (short answer)

## 3. Pilot

Run through with **one teammate** not involved in authoring the form. Fix typos and scale labels.

## 4. Publish

1. Click **Send** → link icon → shorten URL if you like.  
2. Copy the respondent link (often ends with `/viewform`).  
3. Set `REACT_APP_SURVEY_URL` in `.env.local` (see main README), or paste into team notes—see [`../src/surveyUrl.js`](../src/surveyUrl.js).

## 5. After data collection

- **Responses → Sheets** → download CSV for analysis.  
- Attach **screenshots or CSV** to the report **Appendix** (per SOEN 357 project PDF).  
- Keep participant permissions / consent language consistent with what you actually did.
