/**
 * Continuous Vermilion Thread Animation Engine
 * Matches scroll speed 1:1 throughout the entire page, keeping the dot
 * permanently linked to the drawing tip of the thread at the middle horizon.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buildUnifiedThreadPath } from './threadPath.js';
import { isMotionPaused, onMotionChange } from './motionPreference.js';

let scrollTriggerInstance = null;

export function initThread() {
  gsap.registerPlugin(ScrollTrigger);
  const mount = document.getElementById('thread-mount');
  if (mount) {
    mount.innerHTML = `
      <svg class="thread-svg" id="thread-svg" aria-hidden="true">
        <path class="thread-glow" id="thread-glow" fill="none" />
        <path class="thread-path" id="thread-path" fill="none" />
        <circle class="thread-tip-ring" id="thread-tip-ring" r="8" />
        <circle class="thread-tip-dot" id="thread-tip-dot" r="3.5" />
      </svg>`;
  }

  const render = () => setupUnifiedThread();
  render();
  if (document.fonts) document.fonts.ready.then(render);

  let timer;
  window.addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(render, 120); });
  window.addEventListener('load', render);

  onMotionChange((paused) => {
    if (paused && scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = null;
    }
    render();
  });
}

function setupUnifiedThread() {
  const svg = document.getElementById('thread-svg');
  const path = document.getElementById('thread-path'), glow = document.getElementById('thread-glow');
  const tipDot = document.getElementById('thread-tip-dot');
  const tipRing = document.getElementById('thread-tip-ring');
  if (!svg || !path || !glow) return;

  const w = window.innerWidth, h = document.documentElement.scrollHeight;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('width', `${w}px`);
  svg.setAttribute('height', `${h}px`);

  const geom = buildUnifiedThreadPath(w, h);
  if (!geom) return;

  path.setAttribute('d', geom.fullD);
  glow.setAttribute('d', geom.fullD);

  const totalLen = path.getTotalLength();
  const endY = geom.endY || h;

  path.style.strokeDasharray = totalLen;
  glow.style.strokeDasharray = totalLen;

  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    scrollTriggerInstance = null;
  }

  if (isMotionPaused()) {
    path.style.strokeDashoffset = '0';
    glow.style.strokeDashoffset = '0';
    const endPt = path.getPointAtLength(totalLen);
    if (tipDot) { tipDot.setAttribute('cx', endPt.x.toFixed(1)); tipDot.setAttribute('cy', endPt.y.toFixed(1)); }
    if (tipRing) { tipRing.setAttribute('cx', endPt.x.toFixed(1)); tipRing.setAttribute('cy', endPt.y.toFixed(1)); }
    return;
  }

  // Updates thread length keeping the dot permanently linked to the drawing tip
  const updateThread = (scrollY) => {
    const horizonY = scrollY + window.innerHeight * 0.5;
    const progress = Math.min(1, Math.max(0, horizonY / Math.max(1, endY)));
    const currentDist = progress * totalLen;

    const offset = Math.max(0, totalLen - currentDist);
    path.style.strokeDashoffset = offset;
    glow.style.strokeDashoffset = offset;

    // Pin the terminal dot and ring directly to the exact drawing tip
    const pt = path.getPointAtLength(currentDist);
    if (tipDot) {
      tipDot.setAttribute('cx', pt.x.toFixed(1));
      tipDot.setAttribute('cy', pt.y.toFixed(1));
    }
    if (tipRing) {
      tipRing.setAttribute('cx', pt.x.toFixed(1));
      tipRing.setAttribute('cy', pt.y.toFixed(1));
    }
  };

  // 1-to-1 ScrollTrigger tracking the viewport's middle horizon across the whole document
  scrollTriggerInstance = ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.1,
    onUpdate: (self) => {
      if (isMotionPaused()) return;
      updateThread(self.scroll());
    }
  });

  // Sync position immediately with current scroll
  updateThread(window.scrollY || 0);
}
