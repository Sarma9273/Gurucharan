import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type Props = { onComplete: () => void };

const messages = [
  'Identity signal detected',
  'Mapping security systems',
  'Connecting project archives',
  'Synchronising learning journal',
  'Access granted',
];

export default function CinematicLoader({ onComplete }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const completed = useRef(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const finish = () => {
      if (completed.current) return;
      completed.current = true;
      sessionStorage.setItem('gc-intro-seen', 'true');

      const element = root.current;
      if (!element) {
        onComplete();
        return;
      }

      gsap.to(element, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.65,
        ease: 'power4.inOut',
        onComplete: () => {
          element.style.display = 'none';
          onComplete();
        },
      });
    };

    if (sessionStorage.getItem('gc-intro-seen')) {
      onComplete();
      return;
    }

    const value = { current: 0 };
    const tween = gsap.to(value, {
      current: 100,
      duration: 2.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        const next = Math.round(value.current);
        setProgress(next);
        setMessageIndex(Math.min(messages.length - 1, Math.floor(next / 22)));
      },
      onComplete: finish,
    });

    // Never allow the intro to become a permanent black screen.
    const safetyTimer = window.setTimeout(finish, 5000);

    return () => {
      tween.kill();
      window.clearTimeout(safetyTimer);
    };
  }, [onComplete]);

  const skip = () => {
    sessionStorage.setItem('gc-intro-seen', 'true');
    completed.current = true;
    gsap.to(root.current, {
      opacity: 0,
      duration: 0.45,
      onComplete: () => {
        if (root.current) root.current.style.display = 'none';
        onComplete();
      },
    });
  };

  return (
    <div className="loader" ref={root}>
      <div className="loader-grid" />
      <div className="loader-orbit">
        <span />
        <span />
        <span />
      </div>
      <div className="loader-copy">
        <span className="micro-label">GURU CHARAN / SECURITY INTELLIGENCE UNIVERSE</span>
        <h1>INITIALISING<br />IDENTITY SYSTEM</h1>
        <div className="loader-status">
          <span>{messages[messageIndex]}</span>
          <strong>{String(progress).padStart(3, '0')}%</strong>
        </div>
        <div className="loader-track"><i style={{ width: `${progress}%` }} /></div>
      </div>
      <button type="button" className="loader-skip" onClick={skip}>Skip intro</button>
    </div>
  );
}

