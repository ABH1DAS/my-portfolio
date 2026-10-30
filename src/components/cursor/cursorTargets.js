/**
 * Target Selectors & Element Detection for Morphing Cursor
 */

export const DEFAULT_TARGETS = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  '[role="button"]',
  '.folder-file-card',
  '.profile-card',
  '.depth-card',
  '.cap-card',
  '.proj',
  '.proj-link',
  '.gallery-card',
  '.motion-toggle',
  '.skip-link',
  '.channel-link',
  '[tabindex="0"]',
  '[data-cursor]'
].join(', ');

export function getHoverState(target, targetSelector = DEFAULT_TARGETS) {
  if (!target || !(target instanceof Element)) return null;

  if (target.closest('input, textarea, select')) {
    return 'text';
  }

  const match = target.closest(targetSelector);
  if (match) {
    return 'hover';
  }

  return null;
}
