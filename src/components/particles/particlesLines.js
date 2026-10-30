/**
 * Particles Line Constellation Generator
 */

import { MAX_LINES, clamp } from './particlesUtils.js';
import { project } from './particlesCloud.js';

export function buildLines(cloud, screen, lineData, view, s, matrix, state, pointer, bursts) {
  const total = project(cloud, screen, state, pointer, bursts, view, s, matrix);
  const reach = s.connectionDistance;
  const columns = Math.max(1, Math.ceil(view.width / reach) + 2);
  const buckets = new Map();

  for (let i = 0; i < total; i++) {
    if (screen.alpha[i] < 0.02) continue;
    const key = (Math.floor(screen.y[i] / reach) + 1) * columns + Math.floor(screen.x[i] / reach) + 1;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(i);
    else buckets.set(key, [i]);
  }

  let lineCount = 0;
  const limit = reach * reach;
  for (const [key, members] of buckets) {
    for (const offset of [0, 1, columns - 1, columns, columns + 1]) {
      const others = offset === 0 ? members : buckets.get(key + offset);
      if (!others) continue;
      for (let a = 0; a < members.length; a++) {
        const i = members[a];
        for (let b = offset === 0 ? a + 1 : 0; b < others.length; b++) {
          const j = others[b];
          const dx = screen.x[i] - screen.x[j];
          const dy = screen.y[i] - screen.y[j];
          const gap = dx * dx + dy * dy;
          if (gap > limit) continue;
          const layer = clamp(1 - Math.abs(screen.ahead[i] - screen.ahead[j]) / 18, 0, 1);
          if (layer <= 0) continue;
          if (lineCount >= MAX_LINES) return lineCount;
          const fade = 1 - Math.sqrt(gap) / reach;
          const base = lineCount * 8;
          lineData[base] = screen.x[i];
          lineData[base + 1] = screen.y[i];
          lineData[base + 2] = screen.x[j];
          lineData[base + 3] = screen.y[j];
          lineData[base + 4] = (cloud.colors[i * 3] + cloud.colors[j * 3]) / 2;
          lineData[base + 5] = (cloud.colors[i * 3 + 1] + cloud.colors[j * 3 + 1]) / 2;
          lineData[base + 6] = (cloud.colors[i * 3 + 2] + cloud.colors[j * 3 + 2]) / 2;
          lineData[base + 7] = fade * fade * layer * 0.7 * Math.min(screen.alpha[i], screen.alpha[j]);
          lineCount++;
        }
      }
    }
  }
  return lineCount;
}
