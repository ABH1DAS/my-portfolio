/**
 * ScrollTrigger Heading Line-by-Line Reveals, Bold Parallax Drift & Fade-Up Animations
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isMotionPaused } from './motionPreference.js';

export function initReveals() {
  if (isMotionPaused()) return;
  gsap.registerPlugin(ScrollTrigger);

  // 1. Line-by-line reveals for section titles
  const headings = document.querySelectorAll('section:not(#top) h2');
  headings.forEach(heading => {
    const lines = heading.querySelectorAll('.line');
    if (lines.length > 0) {
      gsap.fromTo(lines,
        { y: '115%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 1,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }
  });

  // 2. Minimal left-to-right & right-to-left subtle parallax drift in bold texts (2-3 cm displacement)
  const isMobile = window.innerWidth < 640;
  const dist = isMobile ? 18 : 34;

  const boldHeadings = document.querySelectorAll('.hero-headline, section h2');
  boldHeadings.forEach((heading) => {
    const masks = heading.querySelectorAll('.line-mask');
    masks.forEach((mask, idx) => {
      const isEven = idx % 2 === 0;
      const fromX = isEven ? -dist : dist;
      const toX = isEven ? dist : -dist;

      gsap.fromTo(mask,
        { x: fromX },
        {
          x: toX,
          ease: 'none',
          scrollTrigger: {
            trigger: heading,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      );
    });
  });

  // 3. Fade up general block elements
  const fadeBlocks = document.querySelectorAll('.fade-up');
  fadeBlocks.forEach(el => {
    gsap.fromTo(el,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      }
    );
  });
}
