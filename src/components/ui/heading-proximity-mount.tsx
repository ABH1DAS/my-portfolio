import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { VariableProximity } from './variable-proximity';

const headingRoots = new Map<HTMLElement, Root>();

/**
 * Mounts VariableProximity on a specific DOM element.
 */
export function mountHeadingProximity(element: HTMLElement, text: string) {
  if (!element || typeof window === 'undefined') return;

  let root = headingRoots.get(element);
  if (!root) {
    root = createRoot(element);
    headingRoots.set(element, root);
  }

  root.render(
    <VariableProximity
      text={text}
      variant="pressure"
      radius={120}
      fromWeight={400}
      toWeight={800}
      className="sec-heading-proximity"
    />
  );
}

/**
 * Discovers all elements with `data-proximity-heading` and mounts VariableProximity.
 */
export function initAllHeadingProximities() {
  if (typeof window === 'undefined') return;

  document.querySelectorAll<HTMLElement>('[data-proximity-heading]').forEach(el => {
    const text = el.getAttribute('data-proximity-heading');
    if (text) {
      mountHeadingProximity(el, text);
    }
  });
}
