/**
 * URL opened when participants click "Submit & take survey" (new tab).
 *
 * **Default:** team Google Form (public respondent link).
 *
 * **Override:** set `REACT_APP_SURVEY_URL` in `.env.local` (e.g. `/survey.html` for local demo only).
 * Restart `npm start` after changing env; set the same variable in CI/hosting for production builds.
 */
const TEAM_GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeFgob-_1v3mejFEm0eCu1-aBtQmroTrDvjg3GckG4pGESDAg/viewform?usp=publish-editor';

const fromEnv = process.env.REACT_APP_SURVEY_URL;
export const SURVEY_URL =
  typeof fromEnv === 'string' && fromEnv.trim().length > 0 ? fromEnv.trim() : TEAM_GOOGLE_FORM_URL;
