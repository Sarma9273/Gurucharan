import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../config';
import { journey } from '../data';

gsap.registerPlugin(ScrollTrigger);

export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.journey-item');
      items.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        });
      });
      gsap.to('.journey-line-fill', {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section id="journey" className="journey section" ref={root}>
      <div className="section-heading">
        <span className="micro-label">01 / ORIGIN SIGNAL</span>
        <h2>A career transition<br />that actually connects.</h2>
      </div>

      <div className="journey-layout">
        <div className="journey-sticky">
          <div className="journey-photo">
            <img
              src={asset(active < 3 ? 'images/guru-side.webp' : 'images/guru-full.webp')}
              alt="Guru Charan professional portrait"
            />
            <div className="photo-index">{journey[active].year}</div>
          </div>
          <div className="journey-active-copy">
            <span>{journey[active].signal}</span>
            <strong>{journey[active].title}</strong>
          </div>
        </div>

        <div className="journey-list">
          <div className="journey-line"><i className="journey-line-fill" /></div>
          {journey.map((item, index) => (
            <article className={`journey-item ${active === index ? 'active' : ''}`} key={item.year}>
              <span className="journey-year">{item.year}</span>
              <div>
                <small>STAGE {String(index + 1).padStart(2, '0')} · {item.signal}</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
