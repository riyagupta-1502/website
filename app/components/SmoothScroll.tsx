'use client';

import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let destination = window.scrollY;
    let previousTime = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      destination = window.scrollY;
    };
    const animate = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 40) : 16;
      previousTime = time;
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      destination = Math.max(0, Math.min(destination, max));
      const remaining = destination - window.scrollY;
      if (Math.abs(remaining) < 1) {
        window.scrollTo({ top: destination, behavior: 'instant' });
        stop();
        return;
      }
      window.scrollTo({ top: window.scrollY + remaining * (1 - Math.exp(-elapsed / 105)), behavior: 'instant' });
      frame = requestAnimationFrame(animate);
    };
    const wheel = (event: WheelEvent) => {
      if (event.defaultPrevented || motion.matches || event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY || !event.cancelable) return;
      let element = event.target instanceof Element ? event.target : null;
      if (element?.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) return;
      // Let independently scrollable menus and other panels retain native scrolling.
      while (element && element !== document.body && element !== document.documentElement) {
        const style = getComputedStyle(element);
        if (/(auto|scroll|overlay)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1) return;
        element = element.parentElement;
      }
      event.preventDefault();
      if (!frame) destination = window.scrollY;
      const multiplier = event.deltaMode === 1 ? 24 : event.deltaMode === 2 ? window.innerHeight : 1;
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      destination = Math.max(0, Math.min(destination + event.deltaY * multiplier, max));
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const key = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Escape'].includes(event.key)) stop();
    };
    window.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('keydown', key);
    window.addEventListener('pointerdown', stop);
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('resize', stop);
    window.addEventListener('blur', stop);
    motion.addEventListener('change', stop);
    return () => {
      stop();
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('keydown', key);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('resize', stop);
      window.removeEventListener('blur', stop);
      motion.removeEventListener('change', stop);
    };
  }, []);
  return null;
}
