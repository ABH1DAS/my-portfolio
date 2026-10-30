import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { VariableProximity } from './variable-proximity';

const headingRoots = new Map<HTMLElement, Root>();
const headlineRoots = new Map<HTMLElement, Root>();

/**
 * Mounts VariableProximity on a sector tag element (e.g. 02 // SELECTED WORK).
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
 * Mounts VariableProximity on a giant section H2 headline line (e.g. "Selected", "work.").
 */
export function mountHeadlineProximity(element: HTMLElement, text: string, accentText?: string) {
  if (!element || typeof window === 'undefined') return;

  let root = headlineRoots.get(element);
  if (!root) {
    root = createRoot(element);
    headlineRoots.set(element, root);
  }

  root.render(
    <VariableProximity
      text={text}
      accentText={accentText}
      variant="pressure"
      radius={180}
      fromWeight={500}
      toWeight={800}
      className="h2-proximity-line"
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

/**
 * Discovers all elements with `data-proximity-line` and mounts VariableProximity.
 */
export function initAllHeadlineProximities() {
  if (typeof window === 'undefined') return;

  document.querySelectorAll<HTMLElement>('[data-proximity-line]').forEach(el => {
    const text = el.getAttribute('data-proximity-line');
    const accent = el.getAttribute('data-proximity-accent') || undefined;
    if (text) {
      mountHeadlineProximity(el, text, accent);
    }
  });
}
