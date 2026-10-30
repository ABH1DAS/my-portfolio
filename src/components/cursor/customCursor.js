/**
 * Custom Cursor Component (React Bits Pro Adaptation)
 * 17px ring and dot cursor with elastic spring and red inverted hover morph
 */

import { getHoverState } from './cursorTargets.js';
import { isMotionPaused, onMotionChange } from '../../animations/motionPreference.js';
import './cursor.css';

export function initCustomCursor(options = {}) {
  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (isTouch || typeof window === 'undefined') return null;

  const container = document.createElement('div');
  container.className = 'custom-cursor-container';
  container.setAttribute('aria-hidden', 'true');

  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';

  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';

  container.appendChild(ring);
  container.appendChild(dot);
  document.body.appendChild(container);

  if (!isMotionPaused()) {
    document.body.classList.add('custom-cursor-active');
  }

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let dotX = -100, dotY = -100;
  let rafId = 0, isRunning = false, hasMoved = false;

  const tick = () => {
    // 1. Spring lerp for inner dot
    dotX += (mouseX - dotX) * 0.85;
    dotY += (mouseY - dotY) * 0.85;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

    // 2. Spring lerp for outer ring
    const dx = mouseX - ringX;
    const dy = mouseY - ringY;
    ringX += dx * 0.22;
    ringY += dy * 0.22;

    const vel = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const isHovered = ring.classList.contains('cursor-hover');
    const stretch = isHovered ? 0 : Math.min(vel * 0.0016, 0.18);

    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch})`;

    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      rafId = requestAnimationFrame(tick);
    } else {
      isRunning = false;
    }
  };

  const startLoop = () => {
    if (!isRunning && !isMotionPaused()) {
      isRunning = true;
      rafId = requestAnimationFrame(tick);
    }
  };

  const onPointerMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!hasMoved) {
      hasMoved = true;
      ringX = mouseX; ringY = mouseY;
      dotX = mouseX; dotY = mouseY;
      container.classList.add('is-visible');
    }
    startLoop();
  };

  const onPointerDown = () => ring.classList.add('cursor-active');
  const onPointerUp = () => ring.classList.remove('cursor-active');

  const onPointerOver = (e) => {
    const state = getHoverState(e.target);
    ring.classList.remove('cursor-hover', 'cursor-text');
    dot.classList.remove('cursor-hover');
    if (state === 'hover') {
      ring.classList.add('cursor-hover');
      dot.classList.add('cursor-hover');
    } else if (state === 'text') {
      ring.classList.add('cursor-text');
    }
  };

  const onPointerOut = (e) => {
    if (!e.relatedTarget || !container.contains(e.relatedTarget)) {
      ring.classList.remove('cursor-hover', 'cursor-text');
      dot.classList.remove('cursor-hover');
    }
  };

  const onPointerLeave = () => container.classList.remove('is-visible');
  const onPointerEnter = () => { if (hasMoved) container.classList.add('is-visible'); };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  document.addEventListener('pointerover', onPointerOver, { passive: true });
  document.addEventListener('pointerout', onPointerOut, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);
  document.documentElement.addEventListener('pointerenter', onPointerEnter);

  const unwatchMotion = onMotionChange((paused) => {
    document.body.classList.toggle('custom-cursor-active', !paused);
    if (paused) {
      container.classList.remove('is-visible');
      cancelAnimationFrame(rafId);
      isRunning = false;
    }
  });

  return {
    destroy() {
      cancelAnimationFrame(rafId);
      unwatchMotion();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.documentElement.removeEventListener('pointerenter', onPointerEnter);
      document.body.classList.remove('custom-cursor-active');
      container.remove();
    }
  };
}

export default initCustomCursor;
