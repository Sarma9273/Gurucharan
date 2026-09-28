import { useEffect, useState } from 'react';

const links = [
  ['Journey', '#journey'],
  ['About', '#about'],
  ['Experience', '#experience'],
  ['Projects', '#projects'],
  ['Architecture', '#architecture'],
  ['Research', '#research'],
  ['Technology', '#technology'],
  ['Journal', '#journal'],
  ['Contact', '#contact'],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="brand" href="#top" aria-label="Guru Charan home">
        <span className="brand-symbol">GC</span>
        <span><strong>Guru Charan</strong><small>Security Intelligence</small></span>
      </a>
      <nav className={open ? 'is-open' : ''} aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </nav>
      <a className="header-signal" href="/Gurucharan/resume/Guru_Charan_Mavuduru_Resume.pdf" target="_blank" rel="noreferrer"><i /> Open Resume ↗</a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span /><span />
      </button>
    </header>
  );
}
