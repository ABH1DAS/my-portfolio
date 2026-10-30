/**
 * Capabilities Component
 * 3-Column Technical Expertise Breakdown (Web, IoT, AI)
 */

import { capabilitiesData } from '../data/site.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isMotionPaused } from '../animations/motionPreference.js';

export function renderCapabilities(container) {
  if (!container) return;

  const headlineHtml = capabilitiesData.headline
    .map((line, idx) => {
      const isSecond = idx === 1;
      const content = isSecond ? line.replace('working', '<span class="acc">working</span>') : line;
      return `<span class="line-mask"><span class="line">${content}</span></span>`;
    })
    .join('');

  const columnsHtml = capabilitiesData.columns
    .map(col => {
      const itemsHtml = col.items
        .map(item => `
          <li>
            <b>${item.heading}</b>
            <span>${item.detail}</span>
          </li>
        `)
        .join('');

      return `
        <div class="cap-card">
          <h3>
            <span>${col.index} / ${col.title}</span>
            <span class="acc">✦</span>
          </h3>
          <ul>${itemsHtml}</ul>
        </div>
      `;
    })
    .join('');

  container.innerHTML = `
    <section id="capabilities" aria-label="Capabilities">
      <div class="sec-proximity-slot" data-proximity-heading="${capabilitiesData.tag}" data-cursor=""></div>
      <h2>${headlineHtml}</h2>
      <div class="caps">
        ${columnsHtml}
      </div>
    </section>
  `;
}

export function initCapabilitiesAnimation() {
  if (isMotionPaused()) return;
  gsap.registerPlugin(ScrollTrigger);

  const cards = document.querySelectorAll('.cap-card');
  if (cards.length > 0) {
    gsap.fromTo(cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.16,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.caps',
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  }
}
