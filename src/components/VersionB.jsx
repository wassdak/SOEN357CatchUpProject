import React, { useEffect, useId, useState } from 'react';
import { SURVEY_URL } from '../surveyUrl';

// ─── Simulated AI Plan Generation Logic ────────────────────────────────────
// Mirrors the logic described in the research paper: structured, rule-based
// simulation that mirrors what a real AI would generate, prioritizing based
// on urgency, time remaining, and weight of each topic.

const TASK_TEMPLATES = {
  'COMP 346': [
    { topic: 'Process Synchronization', type: 'Reading', hours: 1.5, urgency: 'critical' },
    { topic: 'Deadlocks & Prevention', type: 'Review', hours: 2, urgency: 'critical' },
    { topic: 'Memory Management', type: 'Practice Problems', hours: 2.5, urgency: 'high' },
    { topic: 'File Systems', type: 'Reading', hours: 1, urgency: 'medium' },
    { topic: 'CPU Scheduling Algorithms', type: 'Practice Problems', hours: 2, urgency: 'high' },
    { topic: 'Virtual Memory & Paging', type: 'Review', hours: 1.5, urgency: 'high' },
  ],
  'SOEN 357': [
    { topic: 'User Research Methods', type: 'Reading', hours: 1, urgency: 'medium' },
    { topic: 'Usability Heuristics (Nielsen)', type: 'Review', hours: 1.5, urgency: 'high' },
    { topic: 'Prototyping Techniques', type: 'Reading', hours: 1, urgency: 'medium' },
    { topic: 'Cognitive Load Theory', type: 'Review', hours: 1.5, urgency: 'critical' },
    { topic: 'UX Evaluation Methods', type: 'Practice', hours: 2, urgency: 'high' },
  ],
  'COMP 352': [
    { topic: 'AVL Trees & Rotations', type: 'Practice Problems', hours: 2.5, urgency: 'critical' },
    { topic: 'Graph Algorithms (BFS/DFS)', type: 'Review', hours: 2, urgency: 'high' },
    { topic: 'Dynamic Programming', type: 'Practice Problems', hours: 3, urgency: 'critical' },
    { topic: 'Sorting Algorithm Analysis', type: 'Review', hours: 1.5, urgency: 'medium' },
    { topic: 'Hashing & Hash Tables', type: 'Reading', hours: 1, urgency: 'medium' },
  ],
  'ENGR 301': [
    { topic: 'Project Charter & Scope', type: 'Reading', hours: 1, urgency: 'medium' },
    { topic: 'Risk Management Frameworks', type: 'Review', hours: 1.5, urgency: 'high' },
    { topic: 'Agile vs Waterfall', type: 'Reading', hours: 1, urgency: 'medium' },
    { topic: 'Stakeholder Analysis', type: 'Practice', hours: 1.5, urgency: 'high' },
  ],
};

const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };

/**
 * Builds day-buckets of tasks from selected courses, sorted by urgency, packed by daily hour cap.
 * (Algorithm unchanged — comments document each step for the course report / Methods section.)
 *
 * @param {string[]} selectedCourses — Course codes the participant is behind in.
 * @param {number} daysLeft — Slider: days until exam (caps which day index tasks may land on).
 * @param {number} hoursPerDay — Slider: max hours to stack into one day before rolling forward.
 * @returns {{ day: number, tasks: object[], hours: number }[]}
 */
function generatePlan(selectedCourses, daysLeft, hoursPerDay) {
  // Product of timeline × daily budget (documents overall capacity next to participant inputs).
  const totalHours = daysLeft * hoursPerDay;

  // Accumulator for every instantiated task across all selected courses.
  let allTasks = [];

  // Flatten templates per course into concrete task objects with stable ids and course labels.
  selectedCourses.forEach((course) => {
    const templates = TASK_TEMPLATES[course] || [];
    templates.forEach((t, i) => {
      allTasks.push({
        ...t,
        course,
        id: `${course}-${i}`,
        done: false,
        day: null,
      });
    });
  });

  // Order work so the most urgent items are addressed first; tie-break by shorter tasks to fill days efficiently.
  allTasks.sort((a, b) => {
    const uDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency]; // smaller score = higher urgency
    if (uDiff !== 0) return uDiff; // keep strict urgency ordering when tiers differ
    return a.hours - b.hours; // within the same tier, schedule shorter tasks first
  });

  // Output structure: one entry per study day containing the tasks scheduled that day and total hours.
  let days = [];
  let currentDay = 1; // 1-based day index aligned with the participant's "Day N" mental model
  let currentDayHours = 0; // running sum of hours placed on the open day
  let dayTasks = []; // tasks collected for the open day

  // Greedy pack: add tasks in urgency order until the daily hour budget would be exceeded, then start the next day.
  allTasks.forEach((task) => {
    if (currentDayHours + task.hours > hoursPerDay && dayTasks.length > 0) {
      // Seal the current day once adding `task` would break the per-day hour cap (and the day is non-empty).
      days.push({ day: currentDay, tasks: dayTasks, hours: currentDayHours });
      currentDay++; // advance the calendar index
      dayTasks = []; // reset the open-day buffer
      currentDayHours = 0; // reset the hour tally for the new day
    }
    if (currentDay <= daysLeft) {
      dayTasks.push({ ...task, day: currentDay }); // assign this task to the active day
      currentDayHours += task.hours; // increase the day's load
    }
  });

  // Flush the final partially filled day so nothing remains only in local buffers.
  if (dayTasks.length > 0) {
    days.push({ day: currentDay, tasks: dayTasks, hours: currentDayHours });
  }

  return days;
}

/**
 * Maps template `type` strings to participant-facing labels (does not mutate stored task data).
 * @param {string} type — Raw type from TASK_TEMPLATES
 * @returns {string}
 */
function displayTaskType(type) {
  if (type === 'Practice') return 'Practice Problems';
  return type;
}

/**
 * Human-readable urgency for badges (always paired with color — not color-only coding).
 * @param {string} u — 'critical' | 'high' | 'medium' | 'low'
 * @returns {string}
 */
function urgencyLabel(u) {
  if (u === 'critical') return 'Critical';
  if (u === 'high') return 'High';
  if (u === 'medium') return 'Medium';
  if (u === 'low') return 'Low';
  return u;
}

/**
 * @param {number} dayNumber — 1-based day index from the plan.
 * @returns {string} e.g. "Monday, Apr 7"
 */
function calendarSuffixForDay(dayNumber) {
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  base.setDate(base.getDate() + (dayNumber - 1));
  return base.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    paddingBottom: 80,
    animation: 'fadeIn 0.4s ease both',
  },
  header: {
    borderBottom: '1px solid var(--border)',
    background: 'var(--header-surface)',
    backdropFilter: 'blur(12px)',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    position: 'sticky',
    top: 0,
    zIndex: 20,
  },
  backBtn: {
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: 14,
    padding: '8px 10px',
    borderRadius: 8,
    flexShrink: 0,
  },
  headerMid: { display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 },
  versionBadge: {
    background: 'var(--accent-fill-mid)',
    border: '1px solid var(--accent-border-mid)',
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--accent)',
    letterSpacing: '0.08em',
    flexShrink: 0,
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    fontWeight: 800,
    color: 'var(--text)',
  },
  headerRight: { fontSize: 13, color: 'var(--accent)', fontWeight: 500, flexShrink: 0 },
  main: { maxWidth: 800, margin: '0 auto', padding: '48px 24px 0' },

  stepTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 30,
    fontWeight: 800,
    color: 'var(--text)',
    marginBottom: 6,
  },
  stepSub: {
    fontSize: 14,
    color: 'var(--text-muted)',
    marginBottom: 36,
    lineHeight: 1.7,
  },
  formCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    marginBottom: 24,
  },
  formSection: { marginBottom: 28 },
  formLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 6,
    display: 'block',
  },
  formHint: { fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  sliderRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  sliderGroup: {
    background: 'var(--surface2)',
    borderRadius: 10,
    padding: '16px 20px',
    border: '1px solid var(--border)',
  },
  sliderLabel: { fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 },
  sliderValue: {
    fontFamily: 'var(--font-display)',
    fontSize: 32,
    fontWeight: 800,
    color: 'var(--accent)',
    lineHeight: 1.1,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    accentColor: 'var(--accent)',
    cursor: 'pointer',
  },
  generateBtn: {
    width: '100%',
    background: 'var(--accent)',
    color: 'var(--bg)',
    borderRadius: 12,
    padding: '16px',
    fontSize: 16,
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.02em',
  },
  notesArea: {
    width: '100%',
    minHeight: 88,
    resize: 'vertical',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '12px 14px',
    color: 'var(--text)',
    fontSize: 14,
    marginTop: 8,
  },

  loadingScreen: {
    textAlign: 'center',
    padding: '80px 24px',
    animation: 'fadeIn 0.3s ease both',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid var(--border)',
    borderTop: '3px solid var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 16px',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--accent)',
    margin: '0 auto 20px',
    animation: 'pulse 1.2s ease-in-out infinite',
  },
  loadingTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 16,
  },
  loadingList: {
    textAlign: 'left',
    maxWidth: 420,
    margin: '0 auto',
    fontSize: 14,
    color: 'var(--text-muted)',
    lineHeight: 2,
    listStyle: 'none',
    padding: 0,
  },

  planHeader: {
    background: `linear-gradient(135deg, var(--accent-gradient-start) 0%, var(--accent-gradient-end) 100%)`,
    border: '1px solid var(--accent-border-soft)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px 32px',
    marginBottom: 0,
    animation: 'fadeIn 0.5s ease both',
  },
  planHeaderTop: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  aiLabel: {
    background: 'var(--accent-fill-badge)',
    border: '1px solid var(--accent-border-mid)',
    borderRadius: 6,
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--accent)',
    letterSpacing: '0.08em',
  },
  planHeaderTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    fontWeight: 800,
    color: 'var(--text)',
  },
  planStats: {
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap',
  },
  planStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  planStatValue: {
    fontFamily: 'var(--font-display)',
    fontSize: 26,
    fontWeight: 800,
    color: 'var(--accent)',
    lineHeight: 1,
  },
  planStatLabel: { fontSize: 12, color: 'var(--text-muted)' },

  progressBar: {
    height: 8,
    background: 'var(--surface2)',
    borderRadius: 4,
    marginBottom: 28,
    marginTop: 20,
    overflow: 'hidden',
    border: '1px solid var(--border)',
  },
  progressFill: (pct) => ({
    height: '100%',
    width: `${pct}%`,
    background: 'linear-gradient(90deg, var(--accent), var(--progress-fill-end))',
    borderRadius: 4,
    transition: 'width 0.4s ease',
  }),

  dayBlock: {
    marginBottom: 24,
    animation: 'slideIn 0.4s ease both',
  },
  dayHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  dayLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '0.02em',
  },
  dayHours: {
    fontSize: 12,
    color: 'var(--text-dim)',
    background: 'var(--surface2)',
    borderRadius: 4,
    padding: '4px 10px',
    border: '1px solid var(--border)',
  },
  taskCheck: (done) => ({
    width: 20,
    height: 20,
    minWidth: 20,
    borderRadius: 6,
    border: `2px solid ${done ? 'var(--accent)' : 'var(--border)'}`,
    background: done ? 'var(--accent)' : 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    color: 'var(--bg)',
    flexShrink: 0,
  }),
  taskContent: { flex: 1, minWidth: 0 },
  taskTitle: (done) => ({
    fontSize: 14,
    fontWeight: 500,
    color: done ? 'var(--text-dim)' : 'var(--text)',
    textDecoration: done ? 'line-through' : 'none',
    marginBottom: 4,
    transition: 'color 0.35s ease, text-decoration-color 0.35s ease',
  }),
  taskType: {
    fontSize: 11,
    color: 'var(--text-muted)',
  },
  taskRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
    flexShrink: 0,
  },
  hoursLabel: { fontSize: 11, color: 'var(--text-dim)' },
  doneSection: {
    marginTop: 40,
    borderTop: '1px solid var(--border)',
    paddingTop: 32,
    textAlign: 'center',
  },
  surveyBtn: {
    display: 'inline-block',
    background: 'var(--accent)',
    color: 'var(--bg)',
    borderRadius: 10,
    padding: '14px 36px',
    fontSize: 15,
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.02em',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  secondaryBtn: {
    display: 'block',
    margin: '0 auto 24px',
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
  },
};

const urgencyBorder = {
  critical: 'var(--urgency-critical)',
  high: 'var(--urgency-high)',
  medium: 'var(--urgency-medium)',
  low: 'var(--text-dim)',
};

const urgencyBadgeStyle = (u) => ({
  fontSize: 10,
  fontWeight: 700,
  padding: '3px 8px',
  borderRadius: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  background:
    u === 'critical'
      ? 'var(--urgency-critical-bg)'
      : u === 'high'
        ? 'var(--urgency-high-bg)'
        : u === 'medium'
          ? 'var(--urgency-medium-bg)'
          : 'var(--urgency-low-bg)',
  color:
    u === 'critical'
      ? 'var(--urgency-critical)'
      : u === 'high'
        ? 'var(--urgency-high)'
        : u === 'medium'
          ? 'var(--urgency-medium)'
          : 'var(--text-muted)',
  border: '1px solid var(--border)',
});

const ALL_COURSES = ['COMP 346', 'SOEN 357', 'COMP 352', 'ENGR 301'];

const LOADING_MESSAGES = [
  'Analyzing your academic backlog...',
  'Identifying critical gaps...',
  'Allocating tasks across your schedule...',
  'Optimizing your recovery plan...',
];

/**
 * Version B (experimental): AI-framed planner with client-side deterministic plan generation,
 * loading feedback, checkable tasks, regenerate, and survey handoff.
 *
 * @param {Object} props
 * @param {() => void} props.onDone — Return to landing between participants.
 *
 * HCI: **System status & feedback** (staggered loading copy); **user control** (regenerate, checkboxes);
 * **progressive disclosure** (input → loading → plan).
 */
export default function VersionB({ onDone }) {
  const id = useId();
  const notesFieldId = `${id}-notes`;
  const daysSliderId = `${id}-days`;
  const hoursSliderId = `${id}-hours`;

  const [step, setStep] = useState('input');
  const [selectedCourses, setSelectedCourses] = useState(['COMP 346', 'SOEN 357']);
  const [daysLeft, setDaysLeft] = useState(10);
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [optionalNotes, setOptionalNotes] = useState('');
  const [plan, setPlan] = useState([]);
  const [taskStates, setTaskStates] = useState({});
  const [loadingVisibleCount, setLoadingVisibleCount] = useState(0);

  /**
   * Toggles a course chip selection (template data unchanged).
   * @param {string} c — Course code
   */
  const toggleCourse = (c) => {
    setSelectedCourses((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  /**
   * Moves to loading step; `useEffect` below reveals status lines every 700ms and finalizes the plan.
   */
  const handleGenerate = () => {
    if (selectedCourses.length === 0) return;
    setLoadingVisibleCount(0);
    setStep('loading');
  };

  useEffect(() => {
    if (step !== 'loading') return undefined;

    setLoadingVisibleCount(1);

    const timeouts = [];
    for (let i = 1; i < LOADING_MESSAGES.length; i += 1) {
      timeouts.push(
        window.setTimeout(() => {
          setLoadingVisibleCount(i + 1);
        }, 700 * i),
      );
    }

    // Last line finishes at 700 * (n - 1); add a short beat before swapping to the plan view.
    const finishAt = 700 * (LOADING_MESSAGES.length - 1) + 500;
    timeouts.push(
      window.setTimeout(() => {
        const generated = generatePlan(selectedCourses, daysLeft, hoursPerDay);
        setPlan(generated);
        const initStates = {};
        generated.forEach((day) =>
          day.tasks.forEach((t) => {
            initStates[t.id] = false;
          }),
        );
        setTaskStates(initStates);
        setStep('plan');
      }, finishAt),
    );

    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, [step, selectedCourses, daysLeft, hoursPerDay]);

  /**
   * @param {string} taskId — Stable task id from generation
   */
  const toggleTask = (taskId) => setTaskStates((prev) => ({ ...prev, [taskId]: !prev[taskId] }));

  /**
   * Nielsen #3 user control: return to inputs and discard the current plan snapshot.
   */
  const handleRegenerate = () => {
    setPlan([]);
    setTaskStates({});
    setStep('input');
  };

  const totalTasks = plan.reduce((a, d) => a + d.tasks.length, 0);
  const doneTasks = Object.values(taskStates).filter(Boolean).length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const totalHours = plan.reduce((a, d) => a + d.hours, 0);

  return (
    <div style={s.page}>
      <header style={s.header}>
        <button
          type="button"
          className="btn-interactive"
          style={s.backBtn}
          onClick={onDone}
          aria-label="Back to home"
        >
          ← Back
        </button>
        <div style={s.headerMid}>
          <span style={s.versionBadge}>VERSION B</span>
          <span style={s.logo}>CatchUp</span>
        </div>
        <p style={s.headerRight}>✦ AI-assisted recovery</p>
      </header>

      <div style={s.main} className="form-row-responsive">
        {step === 'input' && (
          <>
            <h1 style={s.stepTitle}>Tell us your situation</h1>
            <p style={s.stepSub}>
              CatchUp will analyze your backlog and generate a personalized, prioritized day-by-day recovery plan —
              structured for you based on your inputs.
            </p>

            <div style={s.formCard}>
              <div style={s.formSection}>
                <span style={s.formLabel} id={`${id}-courses-label`}>
                  Which courses are you behind in?
                </span>
                <p style={s.formHint}>Select all that apply based on the study scenario.</p>
                <div style={s.courseGrid} role="group" aria-labelledby={`${id}-courses-label`}>
                  {ALL_COURSES.map((c) => {
                    const selected = selectedCourses.includes(c);
                    return (
                      <div
                        key={c}
                        role="checkbox"
                        tabIndex={0}
                        aria-checked={selected}
                        aria-label={`${c}, ${selected ? 'selected' : 'not selected'}. Toggle course.`}
                        className={`course-chip-tile${selected ? ' course-chip--selected' : ''}`}
                        style={{
                          background: selected ? 'var(--accent-fill-mid)' : 'var(--surface2)',
                          border: `1px solid ${selected ? 'var(--accent-border-strong)' : 'var(--border)'}`,
                          borderRadius: 10,
                          padding: '14px 18px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          color: selected ? 'var(--accent)' : 'var(--text-muted)',
                        }}
                        onClick={() => toggleCourse(c)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleCourse(c);
                          }
                        }}
                      >
                        <span className="chip-check-wrap" aria-hidden>
                          <span className="chip-check-box">
                            <span className="chip-check-mark">{selected ? '✓' : ''}</span>
                          </span>
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{c}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={s.formSection}>
                <span style={s.formLabel}>Your constraints</span>
                <div style={s.sliderRow} className="form-row-responsive">
                  <div style={s.sliderGroup}>
                    <label htmlFor={daysSliderId} style={s.sliderLabel}>
                      Days until exam
                    </label>
                    <p style={s.sliderValue} aria-live="polite">
                      {daysLeft}
                    </p>
                    <input
                      id={daysSliderId}
                      type="range"
                      min={3}
                      max={21}
                      value={daysLeft}
                      className="range-input"
                      style={s.slider}
                      aria-valuemin={3}
                      aria-valuemax={21}
                      aria-valuenow={daysLeft}
                      aria-label="Days until exam"
                      onChange={(e) => setDaysLeft(Number(e.target.value))}
                    />
                  </div>
                  <div style={s.sliderGroup}>
                    <label htmlFor={hoursSliderId} style={s.sliderLabel}>
                      Hours per day
                    </label>
                    <p style={s.sliderValue} aria-live="polite">
                      {hoursPerDay}
                    </p>
                    <input
                      id={hoursSliderId}
                      type="range"
                      min={1}
                      max={10}
                      value={hoursPerDay}
                      className="range-input"
                      style={s.slider}
                      aria-valuemin={1}
                      aria-valuemax={10}
                      aria-valuenow={hoursPerDay}
                      aria-label="Hours available per day for studying"
                      onChange={(e) => setHoursPerDay(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div style={s.formSection}>
                <label htmlFor={notesFieldId} style={s.formLabel}>
                  Anything else we should know?{' '}
                  <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
                </label>
                <p style={s.formHint}>
                  For example: part-time work on weekdays. This note is not used by the planner logic but signals that
                  your situation matters to the study interface.
                </p>
                <textarea
                  id={notesFieldId}
                  className="textarea-field"
                  style={s.notesArea}
                  value={optionalNotes}
                  onChange={(e) => setOptionalNotes(e.target.value)}
                  placeholder="e.g. I have a part-time job on weekdays"
                  rows={3}
                />
              </div>

              <button
                type="button"
                className="btn-interactive"
                style={{ ...s.generateBtn, opacity: selectedCourses.length === 0 ? 0.4 : 1 }}
                onClick={handleGenerate}
                disabled={selectedCourses.length === 0}
              >
                ✦ Generate my recovery plan
              </button>
            </div>
          </>
        )}

        {step === 'loading' && (
          <div style={s.loadingScreen}>
            <div style={s.spinner} role="status" aria-live="polite" aria-label="Generating plan" />
            <div style={s.pulseDot} aria-hidden />
            <h2 style={s.loadingTitle}>Building your plan…</h2>
            <ul style={s.loadingList}>
              {LOADING_MESSAGES.map((msg, i) => (
                <li
                  key={msg}
                  className={`loading-line ${i < loadingVisibleCount ? 'loading-line--visible' : ''}`}
                  style={{ color: i < loadingVisibleCount ? 'var(--accent)' : 'var(--text-dim)' }}
                >
                  {i < loadingVisibleCount ? '✓ ' : '… '}
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === 'plan' && (
          <>
            <div style={s.planHeader}>
              <div style={s.planHeaderTop}>
                <span style={s.aiLabel}>✦ AI GENERATED</span>
                <h2 style={s.planHeaderTitle}>Your personalized recovery plan</h2>
              </div>
              <div style={s.planStats}>
                <div style={s.planStat}>
                  <span style={s.planStatValue}>{plan.length}</span>
                  <span style={s.planStatLabel}>Study days</span>
                </div>
                <div style={s.planStat}>
                  <span style={s.planStatValue}>{totalTasks}</span>
                  <span style={s.planStatLabel}>Total tasks</span>
                </div>
                <div style={s.planStat}>
                  <span style={s.planStatValue}>{totalHours.toFixed(1)}h</span>
                  <span style={s.planStatLabel}>Total hours</span>
                </div>
                <div style={s.planStat}>
                  <span style={s.planStatValue}>{pct}%</span>
                  <span style={s.planStatLabel}>Completion</span>
                </div>
              </div>
            </div>

            <div
              style={s.progressBar}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              aria-label={`Plan completion ${pct} percent`}
            >
              <div style={s.progressFill(pct)} />
            </div>

            <button type="button" className="btn-interactive" style={s.secondaryBtn} onClick={handleRegenerate}>
              Regenerate plan
            </button>

            {plan.map((day, di) => (
              <div key={day.day} style={{ ...s.dayBlock, animationDelay: `${di * 0.06}s` }}>
                <div style={s.dayHeader}>
                  <span style={s.dayLabel}>
                    Day {day.day} — {calendarSuffixForDay(day.day)}
                  </span>
                  <span style={s.dayHours}>{day.hours.toFixed(1)}h planned today</span>
                </div>
                {day.tasks.map((task) => {
                  const done = taskStates[task.id];
                  const borderColor = done ? 'var(--text-dim)' : urgencyBorder[task.urgency] || 'var(--border)';
                  return (
                    <div
                      key={task.id}
                      style={{
                        background: done ? 'var(--done-surface)' : 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderLeft: `3px solid ${borderColor}`,
                        borderRadius: 10,
                        padding: '14px 18px',
                        marginBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        opacity: done ? 0.5 : 1,
                        transform: done ? 'translateX(10px)' : 'translateX(0)',
                        transition: 'opacity 0.35s ease, transform 0.35s ease',
                      }}
                    >
                      <button
                        type="button"
                        style={s.taskCheck(done)}
                        onClick={() => toggleTask(task.id)}
                        aria-label={
                          done ? `Mark "${task.topic}" not done` : `Mark "${task.topic}" done`
                        }
                      >
                        {done ? '✓' : ''}
                      </button>
                      <div style={s.taskContent}>
                        <p style={s.taskTitle(done)}>{task.topic}</p>
                        <p style={s.taskType}>
                          {displayTaskType(task.type)} · {task.course}
                        </p>
                      </div>
                      <div style={s.taskRight}>
                        <span style={urgencyBadgeStyle(task.urgency)}>{urgencyLabel(task.urgency)} urgency</span>
                        <span style={s.hoursLabel}>{task.hours}h est.</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            <div style={s.doneSection}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
                Your plan is ready.
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.65 }}>
                Now complete the 2-minute post-task survey. It opens in a new tab so you can return here if needed.
              </p>
              <a
                href={SURVEY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interactive"
                style={s.surveyBtn}
              >
                Submit &amp; take survey →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
