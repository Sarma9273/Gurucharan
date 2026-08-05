import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(max-width: 900px)').matches) return;
    const context = gsap.context(() => {
      const tween = gsap.to(track.current, {
        x: () => -(track.current!.scrollWidth - window.innerWidth + 80),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${track.current!.scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => tween.kill();
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section id="projects" className="projects" ref={root}>
      <div className="projects-intro">
        <span className="micro-label">02 / SELECTED SYSTEMS</span>
        <h2>Projects as evidence,<br />not decoration.</h2>
        <p>Scroll sideways through systems I have built, tested and continued to improve.</p>
      </div>
      <div className="project-track" ref={track}>
        {projects.map((project, index) => (
          <article
            className="project-panel"
            key={project.number}
            style={{ '--project-accent': project.accent } as React.CSSProperties}
          >
            <div className="project-visual">
              <div className="project-orbits">
                <span /><span /><span />
              </div>
              <div className="project-code">{project.code}</div>
              <div className="project-number">{project.number}</div>
              <div className="project-signal-grid">
                {Array.from({ length: 28 }, (_, dot) => <i key={dot} />)}
              </div>
            </div>
            <div className="project-copy">
              <div className="project-topline">
                <span>{project.subtitle}</span>
                <small>{project.status}</small>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <ul>
                {project.evidence.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="project-footer">
                <span>CASE STUDY / {String(index + 1).padStart(2, '0')}</span>
                <button type="button" disabled title="Repository/demo link will be added when public">
                  Evidence link coming
                </button>
              </div>
            </div>
          </article>
        ))}
        <div className="project-end">
          <span>THE NEXT SYSTEM</span>
          <h3>PRISM-Agent</h3>
          <p>A provenance-aware causal digital twin for safer and self-healing AI agents.</p>
        </div>
      </div>
    </section>
  );
}
