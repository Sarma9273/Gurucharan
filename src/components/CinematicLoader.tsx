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
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem('gc-intro-seen')) {
      onComplete();
      return;
    }

    const value = { current: 0 };
    const tween = gsap.to(value, {
      current: 100,
      duration: 4.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        const next = Math.round(value.current);
        setProgress(next);
        setMessageIndex(Math.min(messages.length - 1, Math.floor(next / 22)));
      },
      onComplete: () => {
        const timeline = gsap.timeline({
          onComplete: () => {
            sessionStorage.setItem('gc-intro-seen', 'true');
            onComplete();
          },
        });
        timeline
          .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power4.inOut' })
          .set(root.current, { display: 'none' });
      },
    });

    return () => {
      tween.kill();
    };
  }, [onComplete]);

  const skip = () => {
    sessionStorage.setItem('gc-intro-seen', 'true');
    gsap.to(root.current, {
      opacity: 0,
      duration: 0.45,
      onComplete,
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

