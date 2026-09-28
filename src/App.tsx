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
import ExperienceSystem from './components/ExperienceSystem';
import GuruBot from './components/GuruBot';
import PortfolioIntelligence from './components/PortfolioIntelligence';

export default function App() {
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<FocusMode>('ai');

  const complete = useCallback(() => setReady(true), []);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  return (
    <>
      {!ready && <CinematicLoader onComplete={complete} />}
      <CustomCursor />
      <Header />
      <ExperienceSystem />
      <main className={ready ? 'site-ready' : ''}>
        <Hero mode={mode} onModeChange={setMode} />
        <Journey />
        <PortfolioIntelligence />
        <Projects />
        <Architecture />
        <TechUniverse />
        <LiveJournal />
        <Contact />
      </main>
      <GuruBot />
      <footer className="footer">
        <span>© 2026 GURU CHARAN MAVUDURU</span>
        <strong>SECURITY INTELLIGENCE UNIVERSE / V5</strong>
        <a href="#top">Return to signal ↑</a>
      </footer>
    </>
  );
}
