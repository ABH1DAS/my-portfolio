/**
 * Hero Component
 * Clean Bold Typography, Skills Marquee & Interactive WebGL Particles Background
 */

import { heroData } from '../data/site.js';
import gsap from 'gsap';
import { isMotionPaused, onMotionChange } from '../animations/motionPreference.js';
import { initParticles } from './particles/Particles.js';
import { mountTextPressure } from './ui/text-pressure-mount.tsx';

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
      <div id="hero-particles" class="hero-particles" aria-hidden="true"></div>

      <span class="sec-tag">${heroData.tag}</span>
      
      <h1 class="hero-headline" aria-label="${fullHeadlineText}">
        ${linesHtml}
      </h1>

      <p class="sub">${heroData.subtext}</p>

      <div id="hero-pressure-mount" class="hero-pressure-mount" style="position: relative; height: 110px; width: 100%; max-width: 820px; margin: 2rem 0 0.5rem; overflow: hidden;" data-cursor=""></div>
      
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
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    const particles = initParticles(particlesContainer, {
      particleColors: ['#ffffff'],
      particleCount: 280,
      particleSpread: 10,
      speed: 0.1,
      particleBaseSize: 100,
      glow: 0.5,
      twinkle: 0.2,
      moveParticlesOnHover: true,
      hoverEffect: 'parallax',
      sizeRandomness: 0.75,
      paused: isMotionPaused()
    });

    if (particles) {
      onMotionChange((paused) => {
        particles.updateSettings({ paused });
      });
    }
  }

  mountTextPressure('hero-pressure-mount', {
    text: 'COME ALIVE',
    flex: true,
    alpha: false,
    stroke: false,
    width: true,
    weight: true,
    italic: true,
    radius: 1.1,
    smoothing: 0.3,
    idle: 'wave',
    idleSpeed: 0.8,
    clickRipple: true,
    textColor: 'var(--fg-bright, #ffffff)',
    pressureColor: 'var(--acc, #ff3b00)',
    strokeColor: '#ff3b00',
    strokeWidth: 2,
    minFontSize: 36,
    scale: true
  });

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
