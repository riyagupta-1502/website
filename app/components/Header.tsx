'use client';

import { useEffect, useState } from 'react';

const links = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#initiatives', label: 'Initiatives' },
  { href: '#expertise', label: 'Expertise' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(range > 0 ? Math.min(100, window.scrollY / range * 100) : 0);
      let current = '';
      links.forEach(link => {
        const section = document.querySelector(link.href);
        if (section && section.getBoundingClientRect().top <= 180) current = link.href;
      });
      const contact = document.querySelector('#contact');
      if (contact && contact.getBoundingClientRect().top <= 180) current = '#contact';
      setActive(current);
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return <header className="site-header">
    <div className="header-inner">
      <a href="#" className="header-brand" aria-label="Riya Gupta home" onClick={() => setOpen(false)}>
        <img className="header-avatar" src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/riya-gupta.jpg`} alt="Riya Gupta" width="48" height="48" />
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(link => <a key={link.href} href={link.href} aria-current={active === link.href ? 'location' : undefined}>{link.label}</a>)}
      </nav>
      <div className="header-actions">
        <a className="header-resume" href="/riya-gupta-resume.pdf" download aria-label="Download resume"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 16v5h14v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
        <a className="header-cta" href="#contact" onClick={() => setOpen(false)}>Contact <span aria-hidden="true">↗</span></a>
        <button id="menu-toggle" className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setOpen(!open)}>
          <span className={open ? 'menu-lines is-open' : 'menu-lines'} aria-hidden="true"><i/><i/></span>
        </button>
      </div>
    </div>
    <div className={`mobile-menu-panel${open ? ' is-open' : ''}`} inert={!open} aria-hidden={!open}>
    <div className="mobile-menu-clip">
    <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
      {links.map((link, index) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{link.label}<span aria-hidden="true">↗</span></a>)}
      <a className="mobile-contact" href="#contact" onClick={() => setOpen(false)}><span>05</span>Contact<span aria-hidden="true">↗</span></a>
      <a className="mobile-resume-button" href="/riya-gupta-resume.pdf" download onClick={() => setOpen(false)}>Download resume<span aria-hidden="true">↓</span></a>
    </nav>
    </div>
    </div>
    <div className="reading-progress" aria-hidden="true"><span style={{ width: `${progress}%` }}/></div>
  </header>;
}
