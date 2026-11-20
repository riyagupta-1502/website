'use client';
import { useEffect } from 'react';

export default function Enhancements() {
  useEffect(() => {
    let frame = 0;
    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (!link || link.hasAttribute('download')) return;
      const hash = link.getAttribute('href')!;
      let target: HTMLElement | null = null;
      if (hash !== '#') {
        try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
        if (!target) return;
      }
      event.preventDefault();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const header = document.querySelector<HTMLElement>('.header-inner');
        const offset = (header?.getBoundingClientRect().height ?? 75) + 34;
        const top = target ? Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset) : 0;
        if (window.location.hash !== hash) window.history.pushState(null, '', hash);
        if (target) {
          const hadTabIndex = target.hasAttribute('tabindex');
          if (!hadTabIndex) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          if (!hadTabIndex) target.removeAttribute('tabindex');
        }
        window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      });
    };
    document.addEventListener('click', navigate);
    return () => { document.removeEventListener('click', navigate); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sections = document.querySelectorAll<HTMLElement>('.section, .contact');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });
    if (!reduced) sections.forEach(section => {
      section.classList.add('reveal-section');
      observer.observe(section);
    });
    return () => {
      observer.disconnect();
      sections.forEach(section => section.classList.remove('reveal-section'));
    };
  }, []);
  return null;
}
