import { useCallback, useEffect, useState } from 'react';
import type { FocusMode } from './data';
import CinematicLoader from './components/CinematicLoader';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import Hero from './components/Hero';
import Journey from './components/Journey';
import Projects from './components/Projects';
import Architecture from './components/Architecture';
import TechUniverse from './components/TechUniverse';
import LiveJournal from './components/LiveJournal';
import Contact from './components/Contact';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [mode, setMode] = useState<FocusMode>('ai');

  const complete = useCallback(() => setShowIntro(false), []);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  return (
    <>
      {showIntro && <CinematicLoader onComplete={complete} />}
      <CustomCursor />
      <Header />
      <main>
        <Hero mode={mode} onModeChange={setMode} />
        <Journey />
        <Projects />
        <Architecture />
        <TechUniverse />
        <LiveJournal />
        <Contact />
      </main>
      <footer className="footer">
        <span>© 2026 GURU CHARAN MAVUDURU</span>
        <strong>SECURITY INTELLIGENCE UNIVERSE / V5</strong>
        <a href="#top">Return to signal ↑</a>
      </footer>
      <button
        type="button"
        className="back-to-top"
        aria-label="Back to top"
        title="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </>
  );
}
