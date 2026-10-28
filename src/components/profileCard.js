/**
 * Profile Cards Component
 * 4 tactile cards with 3D pointer tilt, cursor radial glow & scroll-drawn vermilion thread
 */

import { profile } from '../data/site.js';
import gsap from 'gsap';
import { isMotionPaused, onMotionChange } from '../animations/motionPreference.js';

export function renderProfileCards(container) {
  if (!container) return;

  const infoCards = [
    { number: '01', label: 'STUDYING', value: profile.field },
    { number: '02', label: 'UNIVERSITY', value: profile.university },
    { number: '03', label: 'BASED IN', value: profile.state }
  ];

  const infoCardsHtml = infoCards
    .map(card => `
      <article class="profile-card profile-card-info" tabindex="0" aria-label="${card.label}: ${card.value}">
        <div class="profile-info-header">
          <span class="profile-info-label">${card.label}</span>
          <span class="profile-info-num">${card.number}</span>
        </div>
        <div class="profile-info-val">${card.value}</div>
      </article>
    `)
    .join('');

  container.innerHTML = `
    <div class="profile-cards-section" aria-label="Profile Overview">
      <div class="profile-cards-grid">
        <article class="profile-card profile-card-main" tabindex="0" aria-label="${profile.firstName} ${profile.lastName} — ${profile.role} — ${profile.tag}">
          <div class="profile-main-top">
            <span class="profile-main-tag">${profile.tag}</span>
            <svg class="profile-thread-svg" aria-hidden="true" viewBox="0 0 320 60" preserveAspectRatio="none">
              <circle class="profile-thread-ring" cx="10" cy="30" r="3.5" />
              <path class="profile-thread-path" d="M 14 30 C 65 12, 130 52, 195 24 C 240 4, 280 46, 315 28" />
            </svg>
          </div>
          <div class="profile-main-body">
            <h3 class="profile-main-name">
              <span>${profile.firstName}</span>
              <span class="acc">${profile.lastName}</span>
            </h3>
            <p class="profile-main-role">${profile.role}</p>
          </div>
        </article>
        ${infoCardsHtml}
      </div>
    </div>
  `;
}

export function initProfileCards() {
  const cards = document.querySelectorAll('.profile-card');
  const path = document.querySelector('.profile-thread-path');

  // 1. Thread Drawing on Viewport Entry
  if (path) {
    const len = path.getTotalLength() || 320;
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;

    if (isMotionPaused()) {
      path.style.strokeDashoffset = '0';
    } else {
      const mainCard = document.querySelector('.profile-card-main');
      if (mainCard && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              gsap.to(path, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out' });
              observer.disconnect();
            }
          });
        }, { threshold: 0.25 });
        observer.observe(mainCard);
      } else {
        path.style.strokeDashoffset = '0';
      }
    }
  }

  // 2. 3D Pointer Tilt (max 8deg) & Cursor Radial Glow
  cards.forEach(card => {
    let bounds = null;

    card.addEventListener('pointerenter', () => { bounds = card.getBoundingClientRect(); });
    card.addEventListener('pointermove', (e) => {
      if (isMotionPaused()) return;
      if (!bounds) bounds = card.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const dx = Math.max(-0.5, Math.min(0.5, x / bounds.width - 0.5));
      const dy = Math.max(-0.5, Math.min(0.5, y / bounds.height - 0.5));
      const rotX = (-dy * 16).toFixed(2);
      const rotY = (dx * 16).toFixed(2);

      card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
      card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('pointerleave', () => {
      bounds = null;
      card.style.transform = '';
    });
    card.addEventListener('focus', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
    card.addEventListener('blur', () => { card.style.transform = ''; });
  });

  // 3. Motion Preference Listeners
  onMotionChange((paused) => {
    if (paused) {
      cards.forEach(card => { card.style.transform = ''; });
      if (path) path.style.strokeDashoffset = '0';
    }
  });
}
