import { useState } from 'react';
import { architectureStages } from '../data';

export default function Architecture() {
  const [active, setActive] = useState(0);
  const stage = architectureStages[active];

  return (
    <section id="architecture" className="architecture section">
      <div className="section-heading compact">
        <span className="micro-label">03 / REASONING CHAMBER</span>
        <h2>Explore the system,<br />not just the title.</h2>
      </div>

      <div className="architecture-shell">
        <div className="architecture-map">
          <div className="architecture-core">
            <span>{stage.id}</span>
            <strong>{stage.title}</strong>
          </div>
          <svg viewBox="0 0 800 600" aria-hidden="true">
            <circle cx="400" cy="300" r="210" />
            <circle cx="400" cy="300" r="145" />
            {architectureStages.map((_, index) => {
              const angle = (index / architectureStages.length) * Math.PI * 2 - Math.PI / 2;
              const x = 400 + Math.cos(angle) * 210;
              const y = 300 + Math.sin(angle) * 210;
              return <line key={index} x1="400" y1="300" x2={x} y2={y} />;
            })}
          </svg>
          {architectureStages.map((item, index) => {
            const angle = (index / architectureStages.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <button
                type="button"
                key={item.id}
                className={`architecture-node ${active === index ? 'active' : ''}`}
                style={{
                  '--x': `${50 + Math.cos(angle) * 39}%`,
                  '--y': `${50 + Math.sin(angle) * 39}%`,
                } as React.CSSProperties}
                onClick={() => setActive(index)}
              >
                <span>{item.id}</span>
                <strong>{item.title}</strong>
              </button>
            );
          })}
        </div>

        <div className="architecture-detail">
          <span className="architecture-status">{stage.status}</span>
          <h3>{stage.title}</h3>
          <p>{stage.purpose}</p>
          <dl>
            <div><dt>Input</dt><dd>{stage.input}</dd></div>
            <div><dt>Output</dt><dd>{stage.output}</dd></div>
            <div><dt>Technology</dt><dd>{stage.tech}</dd></div>
          </dl>
          <div className="architecture-progress">
            <span>Architecture position</span>
            <i><b style={{ width: `${((active + 1) / architectureStages.length) * 100}%` }} /></i>
            <strong>{active + 1} / {architectureStages.length}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
