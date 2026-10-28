/**
 * Smooth Scrolling Engine (Lenis + GSAP ScrollTrigger Integration)
 * Pauses or restores inertial scrolling based on motionPreference state.
 */

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isMotionPaused, onMotionChange } from './motionPreference.js';

let lenisInstance = null;

export function initSmoothScroll() {
  gsap.registerPlugin(ScrollTrigger);

  if (isMotionPaused()) {
    return null;
  }

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.2
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    if (lenisInstance) {
      lenisInstance.raf(time * 1000);
    }
  });
  gsap.ticker.lagSmoothing(0);

  // Synchronize with user motion preferences
  onMotionChange((paused) => {
    if (paused) {
      if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
      }
    } else {
      if (!lenisInstance) {
        initSmoothScroll();
      }
    }
  });

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}
