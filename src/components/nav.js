/**
 * Navigation Component
 * Header, Monogram, Live Status Pill, Nav Links & Pause Motion Toggle
 */

import { siteConfig } from '../data/site.js';
import { toggleMotion, isMotionPaused } from '../animations/motionPreference.js';

export function renderNav(container) {
  if (!container) return;

  const linksHtml = siteConfig.navLinks
    .map(link => `<a href="${link.href}">${link.label}</a>`)
    .join('');

  const initiallyPaused = isMotionPaused();

  container.innerHTML = `
    <nav aria-label="Main Navigation">
      <div class="nav-brand">
        <a href="#top" class="logo" aria-label="Abhijeet Das Home">ABHIJEET DAS</a>
      </div>
      <div class="nav-right">
        <div class="nav-links">
          ${linksHtml}
        </div>
        <button 
          type="button" 
          class="motion-toggle" 
          aria-pressed="${initiallyPaused}"
          aria-label="Toggle all scroll animations and motion"
        >
          ${initiallyPaused ? '(Resume motion)' : '(Pause motion)'}
        </button>
      </div>
    </nav>
  `;
}

export function initNav() {
  const toggleBtn = document.querySelector('.motion-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      toggleMotion();
    });
  }
}
