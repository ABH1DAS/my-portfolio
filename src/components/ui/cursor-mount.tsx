import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { CustomCursor } from './custom-cursor';

let cursorRoot: Root | null = null;

/**
 * Mount the React CustomCursor component to the DOM.
 */
export function mountCustomCursor(containerId = 'cursor-mount'): Root | null {
  if (typeof window === 'undefined') return null;

  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.setAttribute('aria-hidden', 'true');
    document.body.prepend(container);
  }

  if (!cursorRoot) {
    cursorRoot = createRoot(container);
  }

  cursorRoot.render(<CustomCursor color="#ff4c24" hoverColor="#ff0000" size={17} hoverSize={44} invertOnHover={true} />);
  return cursorRoot;
}

/**
 * Unmount the React CustomCursor.
 */
export function unmountCustomCursor() {
  if (cursorRoot) {
    cursorRoot.unmount();
    cursorRoot = null;
  }
}
