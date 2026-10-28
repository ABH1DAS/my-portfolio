/**
 * Footer Component
 * Copyright, Live Indian Standard Time Ticker & Smooth Back to Top Anchor
 */

import { siteConfig } from '../data/site.js';

export function renderFooter(container) {
  if (!container) return;

  const currentYear = new Date().getFullYear();

  container.innerHTML = `
    <footer>
      <div>
        <span>© ${currentYear} ${siteConfig.name.toUpperCase()}. ALL RIGHTS RESERVED.</span>
      </div>
      <div>
        <span id="local-time" aria-live="polite">NEW DELHI, IN • --:--:-- IST</span>
      </div>
      <div>
        <a href="#top" id="back-to-top" aria-label="Scroll back to top of page">BACK TO TOP ↑</a>
      </div>
    </footer>
  `;
}

export function initFooter() {
  const timeDisplay = document.getElementById('local-time');
  if (timeDisplay) {
    function updateClock() {
      const now = new Date();
      const options = {
        timeZone: siteConfig.timezone || 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
      timeDisplay.textContent = `NEW DELHI, IN • ${formatted} IST`;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }
}
