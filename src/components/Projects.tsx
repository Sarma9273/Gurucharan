import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, type FocusMode } from '../data';
import ProjectExplorer from './ProjectExplorer';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(null);
  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))], []);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const hay = [p.title,p.subtitle,p.description,p.category,...p.technologies].join(' ').toLowerCase();
      return (category === 'All' || p.category === category) && (!q || hay.includes(q));
    });
  }, [query, category]);

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
  }, [visible.length]);

  return (
    <section id="projects" className="projects" ref={root}>
      <div className="projects-intro">
        <span className="micro-label">02 / SELECTED SYSTEMS</span>
        <h2>Projects as evidence,<br />not decoration.</h2>
        <p>Scroll sideways through systems I have built, tested and continued to improve.</p>
        <ProjectExplorer
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
          count={visible.length}
        />
      </div>
      <div className="project-track" ref={track}>
        {visible.map((project, index) => (
          <article
            className="project-panel"
            key={project.number}
            style={{ '--project-accent': project.accent } as React.CSSProperties}
          >
            <div className="project-visual">
              <div className="project-orbits"><span /><span /><span /></div>
              <div className="project-code">{project.code}</div>
              <div className="project-number">{project.number}</div>
              <div className="project-signal-grid">{Array.from({ length: 28 }, (_, dot) => <i key={dot} style={{ '--i': ((dot % 7) + 1) / 8 } as React.CSSProperties} />)}</div>
            </div>
            <div className="project-copy">
              <div className="project-topline"><span>{project.subtitle}</span><small>{project.status}</small></div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <ul>{project.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
              <div className="project-footer">
                <span>{project.category} / CASE STUDY {String(index + 1).padStart(2, '0')}</span>
                <div className="project-actions">
                  <button type="button" onClick={() => setSelected(project)}>Explore system ↗</button>
                  {project.repo && <a href={project.repo} target="_blank" rel="noreferrer">GitHub ↗</a>}
                </div>
              </div>
            </div>
          </article>
        ))}
        {!visible.length && <div className="project-empty"><span>NO MATCHING SYSTEMS</span><p>Clear the explorer filters to restore the project universe.</p></div>}
        <div className="project-end">
          <span>THE NEXT SYSTEM</span>
          <h3>PRISM-Agent</h3>
          <p>A provenance-aware causal digital twin for safer and self-healing AI agents.</p>
        </div>
      </div>
      {selected && <ProjectCaseStudy project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function ProjectCaseStudy({ project, onClose }: { project: (typeof projects)[number]; onClose: () => void }) {
  return <div className="case-study-backdrop" onMouseDown={(e) => e.currentTarget === e.target && onClose()}>
    <section className="case-study" role="dialog" aria-modal="true" aria-labelledby="case-title">
      <header><div><span className="micro-label">GURUVERSE PROJECT INTELLIGENCE</span><h2 id="case-title">{project.title}</h2><p>{project.overview}</p></div><button type="button" onClick={onClose} aria-label="Close case study">×</button></header>
      <div className="case-study-grid">
        {project.problem && <article><span>PROBLEM</span><p>{project.problem}</p></article>}
        {project.solution && <article><span>SOLUTION</span><p>{project.solution}</p></article>}
        {project.architecture?.length && <article><span>ARCHITECTURE</span><ol>{project.architecture.map((x) => <li key={x}>{x}</li>)}</ol></article>}
        {project.workflow?.length && <article><span>WORKFLOW</span><ol>{project.workflow.map((x) => <li key={x}>{x}</li>)}</ol></article>}
        {project.achievements?.length && <article><span>DOCUMENTED OUTCOMES</span><ul>{project.achievements.map((x) => <li key={x}>{x}</li>)}</ul></article>}
        <article><span>TECHNOLOGY</span><div className="case-tags">{project.technologies.map((x) => <i key={x}>{x}</i>)}</div></article>
      </div>
      <footer>{project.repo && <a href={project.repo} target="_blank" rel="noreferrer">OPEN REPOSITORY ↗</a>}{project.demo && <a href={project.demo} target="_blank" rel="noreferrer">OPEN LIVE DEMO ↗</a>}<button type="button" onClick={onClose}>RETURN TO UNIVERSE</button></footer>
    </section>
  </div>;
}