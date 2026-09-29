import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { asset } from '../config';
import { focusModes, type FocusMode } from '../data';
import SecurityScene from './SecurityScene';
import { Component, type ErrorInfo, type ReactNode } from 'react';

class SecuritySceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('GURUVERSE hero scene error:', error, info);
  }

  render() {
    if (this.state.failed) {
      return <div className="security-scene-fallback" aria-hidden="true" />;
    }
    return this.props.children;
  }
}

type Props = {
  mode: FocusMode;
  onModeChange: (mode: FocusMode) => void;
};

export default function Hero({ mode, onModeChange }: Props) {
  const root = useRef<HTMLElement>(null);
  const active = focusModes[mode];

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.from('.hero-reveal', {
        yPercent: 115,
        opacity: 0,
        duration: 1.2,
        stagger: 0.09,
        ease: 'power4.out',
      });
      // Keep the portrait visible even if the animation is interrupted or the
      // browser is still decoding the image while the cinematic intro runs.
      gsap.from('.hero-portrait', {
        xPercent: 20,
        duration: 1.6,
        ease: 'power3.out',
        delay: 0.2,
      });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section id="top" className="hero" ref={root}>
      <div className="hero-grid" />
      <div className="hero-copy">
        <div className="hero-reveal micro-label">
          <span className="live-dot" /> IIT PATNA · M.TECH AI & DSE · BUILDING IN PUBLIC
        </div>
        <h1>
          <span className="hero-reveal">GURU</span>
          <span className="hero-reveal outline">CHARAN</span>
        </h1>
        <div className="hero-statement hero-reveal">
          <span>{active.eyebrow}</span>
          <h2>{active.headline}</h2>
          <p>{active.summary}</p>
        </div>
        <div className="mode-switcher hero-reveal" aria-label="Professional focus">
          {(Object.keys(focusModes) as FocusMode[]).map((key) => (
            <button
              type="button"
              key={key}
              className={mode === key ? 'active' : ''}
              onClick={() => onModeChange(key)}
              style={{ '--mode-colour': focusModes[key].colour } as React.CSSProperties}
            >
              <span>0{Object.keys(focusModes).indexOf(key) + 1}</span>
              {key === 'ai' ? 'AI Security' : key === 'soc' ? 'SOC Engineering' : 'Applied AI'}
            </button>
          ))}
        </div>
      </div>

      <div className="hero-visual">
        <SecuritySceneBoundary><SecurityScene mode={mode} /></SecuritySceneBoundary>
        <div className="portrait-frame">
          <img
            className="hero-portrait"
            src={asset('images/guru-front.webp')}
            alt="Guru Charan Mavuduru in professional attire"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="portrait-scan" />
          <span className="portrait-id">IDENTITY / GC-9273</span>
        </div>
        <div className="hero-coordinate top">17.6868° N / 83.2185° E</div>
        <div className="hero-coordinate bottom">SECURITY SIGNAL: ACTIVE</div>
      </div>

      <a className="scroll-cue" href="#journey">
        <span>Scroll to enter</span><i />
      </a>
    </section>
  );
}