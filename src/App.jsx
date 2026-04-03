import React, { useState } from 'react';
import './index.css';
import Landing from './components/Landing';
import VersionA from './components/VersionA';
import VersionB from './components/VersionB';

/**
 * Root shell: switches between the landing briefing and Version A / B prototypes without a router.
 * Passes `onDone` into each version so facilitators can return to the landing screen between participants.
 */
export default function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'A' | 'B'

  if (screen === 'A') return <VersionA onDone={() => setScreen('landing')} />;
  if (screen === 'B') return <VersionB onDone={() => setScreen('landing')} />;
  return <Landing onSelect={(v) => setScreen(v)} />;
}

// line