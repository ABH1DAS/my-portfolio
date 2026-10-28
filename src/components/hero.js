/**
 * Hero Component
 * Clean Bold Typography & Skills Marquee
 */

import { heroData } from '../data/site.js';
import gsap from 'gsap';
import { isMotionPaused } from '../animations/motionPreference.js';

export function renderHero(container) {
  if (!container) return;

  const fullHeadlineText = heroData.headline.join(' ');

  const linesHtml = heroData.headline
    .map((line, idx) => {
      const isLast = idx === heroData.headline.length - 1;
      const content = isLast ? `<span class="acc">${line}</span>` : line;
      return `<span class="line-mask"><span class="line">${content}</span></span>`;
    })
    .join('');

  const marqueeItems = [...heroData.marqueeSkills, ...heroData.marqueeSkills]
    .map(skill => `<span class="marquee-item">${skill} <span class="marquee-sep">✦</span></span>`)
    .join('');

  container.innerHTML = `
    <section id="top" aria-label="Introduction">
      <span class="sec-tag">${heroData.tag}</span>
      
      <h1 class="hero-headline" aria-label="${fullHeadlineText}">
        ${linesHtml}
      </h1>

      <p class="sub">${heroData.subtext}</p>
      
      <div class="marquee-wrapper" aria-hidden="true">
        <div class="marquee-track marquee-animated">
          ${marqueeItems}
        </div>
      </div>

      <div class="hint">
        <span>${heroData.hintText}</span>
        <span class="hint-arrow">↓</span>
      </div>
    </section>
  `;
}

export function initHeroAnimation() {
  if (isMotionPaused()) return;

  gsap.fromTo('#top .line',
    { y: '110%', opacity: 0 },
    { y: '0%', opacity: 1, duration: 1.1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
  );

  gsap.fromTo('#top .sub, #top .hint, #top .sec-tag, #top .marquee-wrapper',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, delay: 0.7, ease: 'power2.out', stagger: 0.1 }
  );
}
