import { useEffect, useState } from 'react';
import type { FocusMode } from './data';
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
  const [mode, setMode] = useState<FocusMode>('ai');

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  return (
    <>
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
    </>
  );
}
