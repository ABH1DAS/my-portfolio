import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import TextPressure, { type TextPressureProps } from './TextPressure';

const activeRoots = new Map<string, Root>();

/**
 * Mounts the React Bits <TextPressure /> component into a DOM element.
 */
export function mountTextPressure(
  container: HTMLElement | string,
  props: Partial<TextPressureProps> = {}
): Root | null {
  if (typeof window === 'undefined') return null;

  const targetEl = typeof container === 'string' ? document.getElementById(container) : container;
  if (!targetEl) return null;

  const containerKey = targetEl.id || 'default-text-pressure';

  if (activeRoots.has(containerKey)) {
    activeRoots.get(containerKey)?.unmount();
    activeRoots.delete(containerKey);
  }

  const root = createRoot(targetEl);
  activeRoots.set(containerKey, root);

  const defaultProps: TextPressureProps = {
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
    idleSpeed: 1,
    clickRipple: true,
    textColor: 'var(--fg-bright, #ffffff)',
    pressureColor: 'var(--acc, #ff3b00)',
    strokeColor: '#ff3b00',
    strokeWidth: 2,
    minFontSize: 32,
    scale: true,
    ...props
  };

  root.render(<TextPressure {...defaultProps} />);
  return root;
}

export function unmountTextPressure(containerId: string) {
  if (activeRoots.has(containerId)) {
    activeRoots.get(containerId)?.unmount();
    activeRoots.delete(containerId);
  }
}
