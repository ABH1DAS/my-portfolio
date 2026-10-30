/**
 * About Component
 * Word-by-word narrative reveal on left & Tech Matrix Folder with slide-up cards on right
 */

import { aboutData } from '../data/site.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isMotionPaused } from '../animations/motionPreference.js';
import { renderProfileCards, initProfileCards } from './profileCard.js';

export function renderAbout(container) {
  if (!container) return;

  const headlineHtml = aboutData.headline
    .map((line, idx) => {
      const isLast = idx === aboutData.headline.length - 1;
      const content = isLast ? `<span class="acc">${line}</span>` : line;
      const accentAttr = isLast ? ` data-proximity-accent="${line}"` : '';
      return `<span class="line-mask"><span class="line" data-proximity-line="${line}"${accentAttr} data-cursor="">${content}</span></span>`;
    })
    .join('');

  const wordsHtml = aboutData.statement
    .split(' ')
    .map(word => `<span class="word-wrap"><span class="word">${word}</span></span>`)
    .join(' ');

  const folderCardsHtml = aboutData.skillsMatrix
    .map((skill, idx) => {
      const num = String(idx + 1).padStart(2, '0');
      return `
        <article class="folder-file-card" tabindex="0" aria-label="${skill.name} (${skill.type})">
          <div class="folder-file-tab">
            <span class="folder-file-num">${num}</span>
            <span class="folder-file-type">${skill.type}</span>
          </div>
          <div class="folder-file-body">
            <div class="folder-file-top">
              <b class="folder-file-name">${skill.name}</b>
              <span class="folder-file-dot"></span>
            </div>
            <div class="folder-file-foot">
              <span class="folder-file-meta">// VERIFIED</span>
              <span class="folder-file-arrow" aria-hidden="true">↑</span>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  container.innerHTML = `
    <section id="about" aria-label="About Abhijeet Das">
      <div class="about-grid">
        <div class="about-left">
          <div class="sec-proximity-slot" data-proximity-heading="${aboutData.tag}" data-cursor=""></div>
          <h2>${headlineHtml}</h2>
          <p class="sub about-statement">${wordsHtml}</p>
          <p class="signature">${aboutData.signoff}</p>
        </div>

        <div class="about-right">
          <div class="tech-folder-case" aria-label="Tech Matrix and Core Tools Folder">
            <div class="tech-folder-tab-bar">
              <div class="tech-folder-tab-active">
                <svg class="folder-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <h3 class="stack-group-title">TECH MATRIX &amp; CORE TOOLS</h3>
              </div>
              <span class="folder-meta-tag">[09 FILES ARCHIVED]</span>
            </div>
            <div class="tech-folder-deck">
              ${folderCardsHtml}
            </div>
          </div>
        </div>
      </div>

      <div id="profile-cards-mount"></div>
    </section>
  `;

  renderProfileCards(container.querySelector('#profile-cards-mount'));
}

export function initAboutAnimation() {
  if (isMotionPaused()) return;
  gsap.registerPlugin(ScrollTrigger);

  const words = document.querySelectorAll('.about-statement .word');
  if (words.length > 0) {
    gsap.fromTo(words,
      { y: '100%', opacity: 0 },
      {
        y: '0%', opacity: 1, duration: 0.6, stagger: 0.025, ease: 'power2.out',
        scrollTrigger: { trigger: '.about-statement', start: 'top 85%', toggleActions: 'play none none none', once: true }
      }
    );
  }

  initProfileCards();
}
