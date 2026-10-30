/**
 * Particles Event Observers & Pointer Handlers
 */

import { MAX_BURSTS } from './particlesUtils.js';

export function attachParticleEvents(container, pointer, bursts, getSettings, reduce, wake, resize, onVisibilityChange) {
  const locate = e => {
    const r = container.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const wasInside = pointer.inside;
    pointer.inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
    pointer.x = x; pointer.y = r.height - y;
    pointer.nx = (x / Math.max(1, r.width)) * 2 - 1;
    pointer.ny = -((y / Math.max(1, r.height)) * 2 - 1);
    if (pointer.inside && !wasInside) { pointer.sx = pointer.x; pointer.sy = pointer.y; }
  };

  const onPointerMove = e => { locate(e); if (!getSettings().paused) wake(); };
  const onPointerDown = e => {
    locate(e);
    const s = getSettings();
    if (!pointer.inside || !s.clickBurst || s.paused || reduce) return;
    bursts.push({ x: pointer.x, y: pointer.y, age: 0 });
    if (bursts.length > MAX_BURSTS) bursts.shift();
    wake();
  };
  const onPointerUp = e => { if (e.pointerType !== 'mouse') pointer.inside = false; };
  const onPointerLeave = () => { pointer.inside = false; };
  const onVisibility = () => onVisibilityChange();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  const intersection = new IntersectionObserver(entries => {
    const visible = entries.some(entry => entry.isIntersecting);
    onVisibilityChange(visible);
  });
  intersection.observe(container);

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerUp, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    resizeObserver.disconnect();
    intersection.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
