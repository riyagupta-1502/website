'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cleanup = () => {};
    const configure = () => {
      cleanup();
      if (!pointer.matches || motion.matches || !ring.current || !dot.current) return;
      const ringElement = ring.current;
      const dotElement = dot.current;
      let targetX = 0, targetY = 0, x = 0, y = 0, frame = 0, initialized = false;
      const animate = () => {
        x += (targetX - x) * .2;
        y += (targetY - y) * .2;
        ringElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (Math.abs(targetX - x) + Math.abs(targetY - y) > .1) frame = requestAnimationFrame(animate);
        else frame = 0;
      };
      const hide = () => {
        document.documentElement.classList.remove('cursor-visible');
        initialized = false;
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') { hide(); return; }
        targetX = event.clientX;
        targetY = event.clientY;
        if (!initialized) { x = targetX; y = targetY; initialized = true; }
        dotElement.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        const target = event.target instanceof Element ? event.target : null;
        const textInput = !!target?.closest('input, textarea, [contenteditable="true"]');
        document.documentElement.classList.toggle('cursor-visible', !textInput);
        ringElement.classList.toggle('is-interactive', !!target?.closest('a, button, summary, [role="button"]'));
        if (!frame) frame = requestAnimationFrame(animate);
      };
      const down = () => ringElement.classList.add('is-pressed');
      const up = () => ringElement.classList.remove('is-pressed');
      document.documentElement.classList.add('custom-cursor');
      document.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerleave', hide);
      document.addEventListener('pointerdown', down);
      document.addEventListener('pointerup', up);
      window.addEventListener('blur', hide);
      cleanup = () => {
        cancelAnimationFrame(frame);
        document.documentElement.classList.remove('custom-cursor', 'cursor-visible');
        ringElement.classList.remove('is-interactive', 'is-pressed');
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerleave', hide);
        document.removeEventListener('pointerdown', down);
        document.removeEventListener('pointerup', up);
        window.removeEventListener('blur', hide);
      };
    };
    configure();
    pointer.addEventListener('change', configure);
    motion.addEventListener('change', configure);
    return () => { cleanup(); pointer.removeEventListener('change', configure); motion.removeEventListener('change', configure); };
  }, []);
  return <div className="cursor-layer" aria-hidden="true"><div ref={ring} className="cursor-ring"><span/></div><div ref={dot} className="cursor-dot"><span/></div></div>;
}
