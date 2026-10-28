/**
 * Application Entry Point (Vite + Vanilla ES Modules)
 * Orchestrates rendering, styles, Lenis smooth scrolling & GSAP animations
 */

// 1. Stylesheet Imports
import 'lenis/dist/lenis.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/animations.css';

// 2. Motion Preference & Animations
import { initMotionPreference } from './animations/motionPreference.js';
import { initSmoothScroll, getLenis } from './animations/smoothScroll.js';
import { initThread } from './animations/thread.js';
import { initReveals } from './animations/reveals.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 3. Components
import { renderNav, initNav } from './components/nav.js';
import { renderHero, initHeroAnimation } from './components/hero.js';
import { renderFramework, initFrameworkAnimation } from './components/framework.js';
import { renderCapabilities, initCapabilitiesAnimation } from './components/capabilities.js';
import { renderProjects, initProjectsAnimation } from './components/projects.js';
import { renderGallery, initGallery } from './components/gallery.js';
import { renderAbout, initAboutAnimation } from './components/about.js';
import { renderContact, initContact } from './components/contact.js';

function boot() {
  // A. Initialize Motion Preferences (prefers-reduced-motion + toggle)
  initMotionPreference();

  // B. Mount all Components to DOM
  renderNav(document.getElementById('nav-mount'));
  renderHero(document.getElementById('hero-mount'));
  renderFramework(document.getElementById('framework-mount'));
  renderCapabilities(document.getElementById('capabilities-mount'));
  renderProjects(document.getElementById('projects-mount'));
  renderAbout(document.getElementById('about-mount'));
  renderGallery(document.getElementById('gallery-mount'));
  renderContact(document.getElementById('contact-mount'));

  // C. Initialize Component Interactivity
  initNav();
  initContact();
  initGallery();

  // D. Initialize Smooth Scrolling Engine
  initSmoothScroll();

  // E. Initialize Thread SVG & Animations
  initThread();
  initHeroAnimation();
  initFrameworkAnimation();
  initCapabilitiesAnimation();
  initProjectsAnimation();
  initAboutAnimation();
  initReveals();

  // F. Smooth Anchor Link Navigation via Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const lenis = getLenis();
      if (targetId === '#top') {
        e.preventDefault();
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          if (lenis) lenis.scrollTo(targetEl, { offset: 0, duration: 1.2 });
          else targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // G. Refresh ScrollTrigger after assets settle
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
}

document.addEventListener('DOMContentLoaded', boot);
