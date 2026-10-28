/**
 * Framework Component (01 IDEA -> 02 BUILD -> 03 SHIP)
 * Delivery methodology inspired by mikewilcockdesign.com / dakshgajjar.com
 */

import { frameworkSteps } from '../data/site.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isMotionPaused } from '../animations/motionPreference.js';

export function renderFramework(container) {
  if (!container) return;

  const cardsHtml = frameworkSteps
    .map(step => `
      <div class="framework-card">
        <span class="sec-tag">${step.step} // PHASE</span>
        <h3>${step.title} <span>— ${step.subtitle}</span></h3>
        <p>${step.description}</p>
      </div>
    `)
    .join('');

  container.innerHTML = `
    <section id="framework" aria-label="Development Framework">
      <div class="framework-grid">
        ${cardsHtml}
      </div>
    </section>
  `;
}

export function initFrameworkAnimation() {
  if (isMotionPaused()) return;
  gsap.registerPlugin(ScrollTrigger);

  const cards = document.querySelectorAll('.framework-card');
  if (cards.length > 0) {
    gsap.fromTo(cards,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#framework',
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  }
}
