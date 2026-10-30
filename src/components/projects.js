/**
 * Projects Component (Selected Work)
 * Features sticky stacking cards suspended from the cross-thread with wind-blown swinging physics
 */

import { featuredProjects } from '../data/projects.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isMotionPaused } from '../animations/motionPreference.js';

export function renderProjects(container) {
  if (!container) return;

  const cardsHtml = featuredProjects
    .map((p, idx) => {
      const tagsHtml = p.tags.map(t => `<span>${t}</span>`).join('');
      return `
        <article class="proj" style="--i:${idx}" data-project-id="${p.id}" aria-label="${p.name}">
          <div class="proj-header">
            <small>${p.number} / ${p.category}</small>
            <span class="proj-badge">${p.status} • ${p.year}</span>
          </div>
          <div>
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="proj-tags">${tagsHtml}</div>
          </div>
          <div class="proj-footer">
            ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="proj-link">LIVE DEMO ↗</a>` : ''}
            ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="proj-link proj-link-gh">GITHUB ↗</a>` : ''}
          </div>
        </article>
      `;
    })
    .join('');

  container.innerHTML = `
    <section id="projects" aria-label="Selected Projects">
      <div class="sec-proximity-slot" data-proximity-heading="02 // SELECTED WORK" data-cursor=""></div>
      <h2>
        <span class="line-mask"><span class="line">Selected</span></span>
        <span class="line-mask"><span class="line"><span class="acc">work.</span></span></span>
      </h2>
      <div class="proj-stack">
        ${cardsHtml}
      </div>
    </section>
  `;
}

export function initProjectsAnimation() {
  if (isMotionPaused()) return;
  gsap.registerPlugin(ScrollTrigger);

  const cards = gsap.utils.toArray('.proj-stack .proj');
  if (cards.length === 0) return;

  // 1. Stacking depth and scaling as subsequent cards scroll into view
  cards.forEach((card, index) => {
    if (index < cards.length - 1) {
      const nextCard = cards[index + 1];
      gsap.to(card, {
        scale: 0.95,
        opacity: 0.55,
        ease: 'none',
        scrollTrigger: {
          trigger: nextCard,
          start: 'top 85%',
          end: 'top 20%',
          scrub: true
        }
      });
    }
  });

  // 2. Wind-Blown Thread Suspension Swing Physics
  // Scroll velocity induces a dynamic pendulum sway with spring dampening
  ScrollTrigger.create({
    trigger: '#projects',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      if (isMotionPaused()) return;
      const velocity = self.getVelocity();
      const clampedAngle = Math.min(Math.max(velocity / 350, -4.5), 4.5);

      cards.forEach(card => {
        gsap.to(card, {
          rotate: clampedAngle,
          duration: 0.25,
          ease: 'power1.out',
          overwrite: 'auto',
          onComplete: () => {
            gsap.to(card, {
              rotate: 0,
              duration: 0.9,
              ease: 'elastic.out(1.2, 0.45)'
            });
          }
        });
      });
    }
  });
}
