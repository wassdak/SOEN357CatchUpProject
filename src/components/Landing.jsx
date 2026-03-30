import React from 'react';

/**
 * Landing screen for the CatchUp A/B study: presents the standardized backlog scenario
 * and lets participants open the interface version they were assigned (A or B).
 *
 * @param {Object} props
 * @param {(version: 'A' | 'B') => void} props.onSelect — Navigates to Version A (control) or B (experimental).
 *
 * HCI: **Progressive disclosure** — scenario context is shown before any version choice;
 * **Recognition over recall** — distinct card treatments signal manual vs AI-assisted paths without requiring memorization.
 */
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    animation: 'fadeIn 0.6s ease both',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--accent-soft)',
    border: '1px solid var(--accent-border-soft)',
    borderRadius: 100,
    padding: '6px 16px',
    marginBottom: 32,
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--accent)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
    animation: 'pulse 2s ease infinite',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(52px, 9vw, 96px)',
    fontWeight: 800,
    lineHeight: 0.95,
    letterSpacing: '-0.03em',
    textAlign: 'center',
    marginBottom: 8,
    color: 'var(--text)',
  },
  titleAccent: {
    color: 'var(--accent)',
  },
  subtitle: {
    fontSize: 17,
    color: 'var(--text-muted)',
    textAlign: 'center',
    maxWidth: 480,
    marginBottom: 48,
    fontWeight: 300,
    lineHeight: 1.7,
  },
  studyCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '28px 32px',
    marginBottom: 36,
    maxWidth: 600,
    width: '100%',
    boxShadow: 'var(--shadow)',
  },
  studyLabel: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--text)',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid var(--border)',
  },
  studyScenario: {
    fontSize: 15,
    color: 'var(--text-muted)',
    lineHeight: 1.75,
  },
  scenarioList: {
    marginTop: 16,
    paddingLeft: 20,
    color: 'var(--text-muted)',
    fontSize: 14,
    lineHeight: 1.8,
  },
  scenarioHighlight: {
    color: 'var(--accent3)',
    fontWeight: 600,
  },
  prompt: {
    fontSize: 15,
    fontWeight: 500,
    color: 'var(--text-muted)',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 420,
    lineHeight: 1.5,
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 18,
    maxWidth: 600,
    width: '100%',
    alignItems: 'stretch',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 10,
    color: 'var(--text)',
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 1.6,
  },
  cardIcon: {
    fontSize: 26,
    marginBottom: 12,
    display: 'block',
    opacity: 0.9,
  },
  footer: {
    marginTop: 48,
    fontSize: 12,
    color: 'var(--text-dim)',
    textAlign: 'center',
    maxWidth: 520,
    lineHeight: 1.5,
  },
};

export default function Landing({ onSelect }) {
  const [hovered, setHovered] = React.useState(null);

  return (
    <div className="landing-root">
      <div className="landing-bg-pulse" aria-hidden />
      <div className="landing-dot-grid" aria-hidden />
      <div className="landing-inner" style={styles.container}>
        <div style={styles.badge}>
          <span style={styles.dot} />
          SOEN 357 — UI/UX Research Study
        </div>

        <h1 style={styles.title}>
          Catch<span style={styles.titleAccent}>Up</span>
        </h1>

        <p style={styles.subtitle}>
          An AI-powered academic recovery interface.
          <br />
          Helping students get back on track before it&apos;s too late.
        </p>

        <div style={styles.studyCard}>
          <p style={styles.studyLabel}>YOUR STUDY SCENARIO</p>
          <div style={styles.studyScenario}>
            <p style={{ marginBottom: 12 }}>
              You are a university student managing{' '}
              <span style={styles.scenarioHighlight}>4 courses</span>. You have fallen behind by approximately{' '}
              <span style={styles.scenarioHighlight}>2 weeks</span> in two of your courses and have{' '}
              <span style={styles.scenarioHighlight}>final exams in 10 days</span>. You have a mix of readings,
              assignments, and review topics that need to be covered.
            </p>
            <ul style={styles.scenarioList}>
              <li>Use only the interface version you were assigned in the study.</li>
              <li>Build or review your recovery plan, then complete the post-task survey.</li>
            </ul>
          </div>
        </div>

        <p style={styles.prompt}>
          Select the version you were told to use (A or B). Both are available here so facilitators can demo either
          condition.
        </p>

        <div style={styles.cards}>
          <button
            type="button"
            className="landing-card landing-card-a"
            style={{
              textAlign: 'left',
              padding: '22px 20px',
              borderRadius: 16,
              cursor: 'pointer',
              opacity: hovered === 'B' ? 0.72 : 1,
              transform: hovered === 'A' ? 'translateY(-3px)' : undefined,
            }}
            onClick={() => onSelect('A')}
            onMouseEnter={() => setHovered('A')}
            onMouseLeave={() => setHovered(null)}
            aria-label="Open Version A: Standard manual planner"
          >
            <span style={{ ...styles.cardIcon, filter: 'grayscale(0.2)' }}>📋</span>
            <p style={{ ...styles.cardLabel, color: 'var(--text-dim)' }}>Version A</p>
            <p style={styles.cardTitle}>Standard Planner</p>
            <p style={{ ...styles.cardDesc, color: 'var(--text-muted)' }}>
              Manual to-do list: you set priorities, deadlines, and task order yourself.
            </p>
          </button>

          <button
            type="button"
            className="landing-card landing-card-b"
            style={{
              textAlign: 'left',
              padding: '26px 22px',
              borderRadius: 16,
              cursor: 'pointer',
              transform:
                hovered === 'B' ? 'translateY(-4px) scale(1.02)' : 'scale(1.02)',
              transformOrigin: 'center',
            }}
            onClick={() => onSelect('B')}
            onMouseEnter={() => setHovered('B')}
            onMouseLeave={() => setHovered(null)}
            aria-label="Open Version B: AI-assisted recovery planner"
          >
            <span style={styles.cardIcon}>✦</span>
            <p style={{ ...styles.cardLabel, color: 'var(--accent)' }}>Version B</p>
            <p style={styles.cardTitle}>CatchUp AI</p>
            <p style={{ ...styles.cardDesc, color: 'var(--text-muted)' }}>
              Describe your backlog and constraints; CatchUp generates a prioritized day-by-day plan.
            </p>
          </button>
        </div>

        <p style={styles.footer}>
          Concordia University · SOEN 357 W2026 · Chahal · Dakka · Mousaoubaa · Valente · Nasr
        </p>
      </div>
    </div>
  );
}
