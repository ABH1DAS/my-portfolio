/**
 * Gallery Component "(Up close)"
 * Interactive Draggable Filmstrip Strip (inspired by mikewilcockdesign.com)
 */

import { galleryItems } from '../data/projects.js';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { isMotionPaused } from '../animations/motionPreference.js';

export function renderGallery(container) {
  if (!container) return;

  const cardsHtml = galleryItems
    .map(item => `
      <div class="gallery-card" data-gallery-id="${item.id}">
        <div>
          <small>${item.index} // ${item.category}</small>
          <h4>${item.title}</h4>
        </div>
        <p>${item.caption}</p>
      </div>
    `)
    .join('');

  container.innerHTML = `
    <section id="gallery" aria-label="Extra Hobbies">
      <div class="gallery-header">
        <div>
          <div class="sec-proximity-slot" data-proximity-heading="// EXTRA HOBBIES" data-cursor=""></div>
          <h2>
            <span class="line-mask"><span class="line">Extra</span></span>
            <span class="line-mask"><span class="line"><span class="acc">hobbies.</span></span></span>
          </h2>
        </div>
        <span class="sec-tag" style="margin:0">[DRAG TO EXPLORE ← →]</span>
      </div>
      <div class="gallery-container">
        <div class="gallery-track">
          ${cardsHtml}
        </div>
      </div>
    </section>
  `;
}

export function initGallery() {
  gsap.registerPlugin(Draggable);

  const container = document.querySelector('.gallery-container');
  const track = document.querySelector('.gallery-track');
  if (!container || !track) return;

  // Calculate dynamic left bound based on track scroll width
  function updateBounds() {
    const minX = container.offsetWidth - track.scrollWidth - 40;
    return minX < 0 ? minX : 0;
  }

  const draggableInstance = Draggable.create(track, {
    type: 'x',
    bounds: {
      minX: updateBounds(),
      maxX: 0
    },
    edgeResistance: 0.65,
    cursor: 'grab',
    activeCursor: 'grabbing',
    inertia: true
  })[0];

  window.addEventListener('resize', () => {
    if (draggableInstance) {
      draggableInstance.applyBounds({
        minX: updateBounds(),
        maxX: 0
      });
    }
  });
}
