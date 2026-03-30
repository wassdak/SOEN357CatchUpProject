import React, { useId, useMemo, useState } from 'react';
import { SURVEY_URL } from '../surveyUrl';

const COURSES = ['COMP 346', 'SOEN 357', 'COMP 352', 'ENGR 301'];
const PRIORITIES = ['High', 'Medium', 'Low'];

/**
 * @param {string} priority — 'High' | 'Medium' | 'Low'
 * @returns {string} CSS class for priority chip (uses design tokens in index.css).
 */
function priorityChipClass(priority) {
  if (priority === 'High') return 'priority-chip priority-chip--high';
  if (priority === 'Medium') return 'priority-chip priority-chip--medium';
  return 'priority-chip priority-chip--low';
}

/**
 * Small metadata chip for course, deadline, hours (neutral styling).
 * @param {string} color — CSS color value (e.g. var(--text-muted)).
 * @param {string} bg — CSS background value.
 * @returns {React.CSSProperties}
 */
function metaChipStyle(color, bg) {
  return {
    fontSize: 11,
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: 4,
    background: bg,
    color,
    border: '1px solid var(--border)',
  };
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    padding: '0 0 80px',
    animation: 'fadeIn 0.4s ease both',
  },
  header: {
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface)',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    position: 'sticky',
    top: 0,
    zIndex: 20,
  },
  headerMid: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  backBtn: {
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: 14,
    padding: '8px 10px',
    borderRadius: 8,
    flexShrink: 0,
  },
  versionBadge: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    flexShrink: 0,
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    fontWeight: 800,
    color: 'var(--text)',
  },
  headerRight: { fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 },
  main: { maxWidth: 760, margin: '0 auto', padding: '48px 24px 0' },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 8,
    color: 'var(--text)',
  },
  sectionSub: {
    fontSize: 14,
    color: 'var(--text-muted)',
    marginBottom: 32,
    lineHeight: 1.6,
  },
  addCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px 32px',
    marginBottom: 32,
  },
  addTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 20,
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 12,
  },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
  },
  input: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 14px',
    color: 'var(--text)',
    fontSize: 14,
  },
  select: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 14px',
    color: 'var(--text)',
    fontSize: 14,
    appearance: 'none',
    cursor: 'pointer',
  },
  addBtn: {
    marginTop: 8,
    background: 'var(--text)',
    color: 'var(--bg)',
    borderRadius: 8,
    padding: '11px 24px',
    fontSize: 14,
    fontWeight: 600,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    color: 'var(--accent2)',
    marginTop: 6,
    minHeight: 18,
  },
  tasksSection: { marginTop: 8 },
  tasksHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  tasksLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  hoursTotal: {
    fontSize: 13,
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  progressWrap: {
    height: 8,
    background: 'var(--surface2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
    border: '1px solid var(--border)',
  },
  progressFill: (pct) => ({
    height: '100%',
    width: `${pct}%`,
    background: 'linear-gradient(90deg, var(--accent), var(--progress-fill-end))',
    borderRadius: 4,
    transition: 'width 0.35s ease',
  }),
  progressCaptions: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    color: 'var(--text-dim)',
    marginBottom: 8,
  },
  emptyState: {
    background: 'var(--surface)',
    border: '1px dashed var(--border)',
    borderRadius: 'var(--radius)',
    padding: '40px 24px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: 14,
  },
  taskCard: (done) => ({
    background: done ? 'var(--done-surface)' : 'var(--surface)',
    border: `1px solid ${done ? 'var(--text-dim)' : 'var(--border)'}`,
    borderRadius: 'var(--radius)',
    padding: '16px 20px',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    opacity: done ? 0.55 : 1,
    transform: done ? 'translateX(10px)' : 'translateX(0)',
    transition: 'opacity 0.35s ease, transform 0.35s ease, border-color 0.2s ease, background-color 0.2s ease',
    animation: 'slideIn 0.3s ease both',
  }),
  checkbox: (done) => ({
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
    fontSize: 11,
    color: 'var(--bg)',
    marginTop: 2,
    flexShrink: 0,
  }),
  taskInfo: { flex: 1, minWidth: 0 },
  taskName: (done) => ({
    fontSize: 15,
    fontWeight: 500,
    color: done ? 'var(--text-dim)' : 'var(--text)',
    textDecoration: done ? 'line-through' : 'none',
    textDecorationThickness: '2px',
    marginBottom: 4,
    transition: 'color 0.35s ease, text-decoration-color 0.35s ease',
  }),
  taskMeta: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  deleteBtn: {
    background: 'transparent',
    color: 'var(--text-dim)',
    borderRadius: 6,
    padding: '4px 8px',
    fontSize: 16,
    flexShrink: 0,
  },
  doneSection: {
    marginTop: 40,
    paddingTop: 32,
    borderTop: '1px solid var(--border)',
    textAlign: 'center',
  },
  doneSub: { fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.65 },
  surveyBtn: {
    display: 'inline-block',
    background: 'var(--accent)',
    color: 'var(--bg)',
    borderRadius: 10,
    padding: '14px 36px',
    fontSize: 15,
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    textDecoration: 'none',
    letterSpacing: '0.02em',
    cursor: 'pointer',
  },
};

/**
 * Version A (control): manual task list with priorities, deadlines, and estimated hours.
 *
 * @param {Object} props
 * @param {() => void} props.onDone — Return to landing (facilitator reset between sessions).
 *
 * HCI: **Visibility of system status** (progress bar, counts, hours total); **error prevention**
 * (inline validation on empty task name); **user control** (check off, delete, full edit before add).
 */
export default function VersionA({ onDone }) {
  const id = useId();
  const nameId = `${id}-task-name`;
  const courseId = `${id}-course`;
  const priorityId = `${id}-priority`;
  const deadlineId = `${id}-deadline`;
  const hoursId = `${id}-hours`;
  const errId = `${id}-name-err`;

  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    name: '',
    course: COURSES[0],
    priority: 'High',
    deadline: '',
    estHours: '',
  });
  const [nameError, setNameError] = useState(false);
  const [shake, setShake] = useState(false);

  const addTask = () => {
    if (!form.name.trim()) {
      setNameError(true);
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      return;
    }
    setNameError(false);
    setTasks((prev) => [...prev, { ...form, id: Date.now(), done: false }]);
    setForm((f) => ({ ...f, name: '', estHours: '', deadline: '' }));
  };

  const toggleDone = (taskId) =>
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)));
  const deleteTask = (taskId) => setTasks((prev) => prev.filter((t) => t.id !== taskId));

  const doneCount = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const totalHoursPlanned = useMemo(() => {
    return tasks.reduce((sum, t) => {
      const h = parseFloat(String(t.estHours), 10);
      return sum + (Number.isFinite(h) && h > 0 ? h : 0);
    }, 0);
  }, [tasks]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button
          type="button"
          className="btn-interactive"
          style={styles.backBtn}
          onClick={onDone}
          aria-label="Back to home"
        >
          ← Back
        </button>
        <div style={styles.headerMid}>
          <span style={styles.versionBadge}>VERSION A</span>
          <div style={styles.logo}>CatchUp</div>
        </div>
        <p style={styles.headerRight}>Standard Planner</p>
      </header>

      <div style={styles.main} className="form-row-responsive">
        <h1 style={styles.sectionTitle}>Build your recovery plan</h1>
        <p style={styles.sectionSub}>
          Add all the tasks you need to complete to catch up before your exams. Set priorities and deadlines
          manually to organize your workload.
        </p>

        <div style={styles.addCard}>
          <p style={styles.addTitle}>+ Add a task</p>
          <div style={{ marginBottom: 12 }}>
            <div style={styles.formGroup}>
              <label htmlFor={nameId} style={styles.label}>
                Task name
              </label>
              <input
                id={nameId}
                className={`input-field ${nameError ? 'input-error' : ''} ${shake ? 'shake-error' : ''}`}
                style={styles.input}
                placeholder="e.g. Review lecture slides Week 9"
                value={form.name}
                aria-invalid={nameError}
                aria-describedby={nameError ? errId : undefined}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }));
                  if (nameError) setNameError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTask();
                }}
              />
              <p id={errId} role="alert" style={styles.errorText}>
                {nameError ? 'Task name is required' : '\u00a0'}
              </p>
            </div>
          </div>
          <div style={styles.formRow} className="form-row-responsive">
            <div style={styles.formGroup}>
              <label htmlFor={courseId} style={styles.label}>
                Course
              </label>
              <select
                id={courseId}
                className="select-field"
                style={styles.select}
                value={form.course}
                onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
              >
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor={priorityId} style={styles.label}>
                Priority
              </label>
              <select
                id={priorityId}
                className="select-field"
                style={styles.select}
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={styles.formRow} className="form-row-responsive">
            <div style={styles.formGroup}>
              <label htmlFor={deadlineId} style={styles.label}>
                Deadline
              </label>
              <input
                id={deadlineId}
                type="date"
                className="input-field"
                style={styles.input}
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor={hoursId} style={styles.label}>
                Estimated hours
              </label>
              <input
                id={hoursId}
                type="number"
                className="input-field"
                style={styles.input}
                placeholder="e.g. 2"
                min={0.5}
                step={0.5}
                value={form.estHours}
                onChange={(e) => setForm((f) => ({ ...f, estHours: e.target.value }))}
              />
            </div>
          </div>
          <button type="button" className="btn-interactive" style={styles.addBtn} onClick={addTask}>
            Add task
          </button>
        </div>

        <div style={styles.tasksSection}>
          <div style={styles.tasksHeader}>
            <span style={styles.tasksLabel}>Your tasks</span>
            <span style={styles.hoursTotal}>Total: {totalHoursPlanned.toFixed(1)} hours planned</span>
          </div>

          {total > 0 && (
            <>
              <div style={styles.progressCaptions}>
                <span>
                  Progress: {doneCount}/{total} completed
                </span>
                <span>{pct}%</span>
              </div>
              <div
                style={styles.progressWrap}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                aria-label={`Task completion ${pct} percent`}
              >
                <div style={styles.progressFill(pct)} />
              </div>
            </>
          )}

          {total === 0 ? (
            <div style={styles.emptyState}>
              <EmptyTasksIllustration />
              <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>
                No tasks yet — add your first one above to start building your plan.
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} style={styles.taskCard(task.done)}>
                <button
                  type="button"
                  style={styles.checkbox(task.done)}
                  onClick={() => toggleDone(task.id)}
                  aria-label={task.done ? `Mark "${task.name}" as not done` : `Mark "${task.name}" as done`}
                >
                  {task.done ? '✓' : ''}
                </button>
                <div style={styles.taskInfo}>
                  <p style={styles.taskName(task.done)}>{task.name}</p>
                  <div style={styles.taskMeta}>
                    <span style={metaChipStyle('var(--text-muted)', 'var(--surface2)')}>{task.course}</span>
                    <span className={priorityChipClass(task.priority)}>{task.priority} priority</span>
                    {task.deadline && (
                      <span style={metaChipStyle('var(--text-dim)', 'transparent')}>Due {task.deadline}</span>
                    )}
                    {task.estHours !== '' && Number.isFinite(parseFloat(String(task.estHours), 10)) && (
                      <span style={metaChipStyle('var(--text-dim)', 'transparent')}>
                        {parseFloat(String(task.estHours), 10)}h est.
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-interactive"
                  style={styles.deleteBtn}
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete task ${task.name}`}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {total >= 3 && (
          <div style={styles.doneSection}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
              Your plan is ready.
            </h2>
            <p style={styles.doneSub}>
              Now complete the 2-minute post-task survey. It opens in a new tab so you can return here if needed.
            </p>
            <a
              href={SURVEY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive"
              style={styles.surveyBtn}
            >
              Submit &amp; take survey →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Simple inline SVG empty state (no external assets).
 */
function EmptyTasksIllustration() {
  return (
    <svg width="120" height="88" viewBox="0 0 120 88" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="8" y="12" width="104" height="64" rx="10" stroke="var(--border)" strokeWidth="2" fill="var(--surface2)" />
      <path d="M24 32h48M24 44h72M24 56h40" stroke="var(--text-dim)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="92" cy="28" r="14" fill="var(--accent-fill-mid)" stroke="var(--accent-border-soft)" strokeWidth="2" />
      <path d="M88 28l4 4 8-8" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
