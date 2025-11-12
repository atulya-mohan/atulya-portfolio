// src/lib/useTransientScrollbar.ts
import { useEffect, useRef } from 'react';

export function useTransientScrollbar<T extends HTMLElement>(delay = 900) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: number | null = null;
    const onScroll = () => {
      el.setAttribute('data-scrolling', 'true');
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        el.removeAttribute('data-scrolling');
        timer = null;
      }, delay);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (timer) window.clearTimeout(timer);
    };
  }, [delay]);

  return ref;
}
