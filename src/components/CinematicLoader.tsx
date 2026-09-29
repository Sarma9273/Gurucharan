import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type Props = {
  onComplete: () => void;
  variant?: 'boot' | 'article';
};

const BOOT_MESSAGES = [
  'Identity signal detected',
  'Mapping security systems',
  'Connecting project archives',
  'Synchronising learning journal',
  'Access granted',
];

const ARTICLE_MESSAGES = [
  'Opening knowledge stream',
  'Decoding journal payload',
  'Reconstructing field notes',
  'Synchronising article content',
  'Knowledge stream ready',
];

function hasSeenIntro() {
  try {
    return sessionStorage.getItem('gc-intro-seen') === 'true';
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem('gc-intro-seen', 'true');
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}

export default function CinematicLoader({ onComplete, variant = 'boot' }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const completed = useRef(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const isArticle = variant === 'article';
  const messages = isArticle ? ARTICLE_MESSAGES : BOOT_MESSAGES;

  useEffect(() => {
    const finish = () => {
      if (completed.current) return;
      completed.current = true;
      if (!isArticle) markIntroSeen();

      const element = root.current;
      if (!element) {
        onComplete();
        return;
      }

      // Preserve the original loader's reveal: the screen lifts upward.
      gsap.to(element, {
        clipPath: 'inset(0 0 100% 0)',
        duration: isArticle ? 0.65 : 0.9,
        ease: 'power4.inOut',
        onComplete: () => {
          element.style.display = 'none';
          onComplete();
        },
      });
    };

    if (!isArticle && hasSeenIntro()) {
      finish();
      return;
    }

    const value = { current: 0 };
    const tween = gsap.to(value, {
      current: 100,
      // Keep the original cinematic sequence while shortening the first-visit wait.
      duration: isArticle ? 1.9 : 2.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        const next = Math.round(value.current);
        setProgress(next);
        setMessageIndex(Math.min(messages.length - 1, Math.floor(next / 22)));
      },
      onComplete: finish,
    });

    // Safety only; it never changes the normal 4.2s visual sequence.
    const safetyTimer = window.setTimeout(finish, isArticle ? 3000 : 4500);

    return () => {
      tween.kill();
      window.clearTimeout(safetyTimer);
    };
  }, [isArticle, messages.length, onComplete]);

  const skip = () => {
    if (completed.current) return;
    completed.current = true;
    if (!isArticle) markIntroSeen();

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
    <div className={`loader ${isArticle ? 'loader-article' : ''}`} ref={root}>
      <div className="loader-grid" />
      <div className="loader-orbit">
        <span />
        <span />
        <span />
      </div>
      <div className="loader-copy">
        <span className="micro-label">
          {isArticle ? 'GURUVERSE / LIVE LEARNING JOURNAL' : 'GURU CHARAN / SECURITY INTELLIGENCE UNIVERSE'}
        </span>
        <h1>
          {isArticle ? <>OPENING<br />KNOWLEDGE STREAM</> : <>INITIALISING<br />IDENTITY SYSTEM</>}
        </h1>
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