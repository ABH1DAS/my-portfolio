/**
 * Motion Preference Manager (Single Source of Truth)
 * Coordinates prefers-reduced-motion and manual (Pause motion) nav toggle.
 * Persists selection via localStorage.
 */

const STORAGE_KEY = 'abhijeet_portfolio_motion_paused';
const listeners = new Set();

let isManuallyPaused = false;
let systemPrefersReduced = false;

function computeIsPaused() {
  return isManuallyPaused || systemPrefersReduced;
}

export function isMotionPaused() {
  return computeIsPaused();
}

export function onMotionChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners() {
  const paused = computeIsPaused();
  document.body.classList.toggle('motion-paused', paused);

  // Update nav toggle buttons
  const toggleBtns = document.querySelectorAll('.motion-toggle');
  toggleBtns.forEach(btn => {
    btn.setAttribute('aria-pressed', String(paused));
    btn.textContent = paused ? '(Resume motion)' : '(Pause motion)';
  });

  listeners.forEach(cb => {
    try {
      cb(paused);
    } catch (err) {
      console.error('Error in motion preference listener:', err);
    }
  });
}

export function setMotionPaused(paused) {
  isManuallyPaused = paused;
  try {
    localStorage.setItem(STORAGE_KEY, paused ? 'true' : 'false');
  } catch (e) {
    // localStorage not accessible
  }
  notifyListeners();
}

export function toggleMotion() {
  setMotionPaused(!computeIsPaused());
}

export function initMotionPreference() {
  // 1. Read System Setting
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  systemPrefersReduced = mediaQuery.matches;

  mediaQuery.addEventListener('change', (e) => {
    systemPrefersReduced = e.matches;
    notifyListeners();
  });

  // 2. Read LocalStorage override
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      isManuallyPaused = saved === 'true';
    }
  } catch (e) {
    // Ignore storage errors
  }

  // 3. Initial broadcast
  notifyListeners();
}
