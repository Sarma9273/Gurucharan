import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const move = (event: PointerEvent) => {
      gsap.to(dot.current, { x: event.clientX, y: event.clientY, duration: 0.08 });
      gsap.to(ring.current, { x: event.clientX, y: event.clientY, duration: 0.35, ease: 'power3.out' });
    };
    const over = (event: Event) => {
      const target = event.target as HTMLElement;
      const interactive = target.closest('a,button,[data-cursor]');
      ring.current?.classList.toggle('is-active', Boolean(interactive));
    };

    window.addEventListener('pointermove', move);
    document.addEventListener('pointerover', over);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring} />
    </>
  );
}
