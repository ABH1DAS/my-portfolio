/**
 * Particles WebGL2 Controller & Lifecycle
 */

import { PARTICLE_VERTEX } from './particleVertexShader.js';
import { PARTICLE_FRAGMENT } from './particleFragmentShader.js';
import { LINE_VERTEX, LINE_FRAGMENT } from './lineShaders.js';
import { BURST_SECONDS, clamp, link, normalizeSettings, createColorHelper } from './particlesUtils.js';
import { createParticleBuffers } from './particlesBuffers.js';
import { renderParticles } from './particlesDraw.js';
import { attachParticleEvents } from './particlesEvents.js';

export function initParticles(container, userOptions = {}) {
  if (!container) return null;

  let s = normalizeSettings(userOptions);
  container.classList.add('particles-container');

  const canvas = document.createElement('canvas');
  canvas.className = 'particles-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  const gl = canvas.getContext('webgl2', {
    alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false
  });
  if (!gl) return null;

  const dots = link(gl, PARTICLE_VERTEX, PARTICLE_FRAGMENT);
  const lines = link(gl, LINE_VERTEX, LINE_FRAGMENT);
  if (!dots || !lines) return null;

  const { dotVao, lineVao, lineData, buffers } = createParticleBuffers(gl);
  const colorHelper = createColorHelper();
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const view = { width: 1, height: 1, ratio: 1 };
  const pointer = { x: 0, y: 0, sx: 0, sy: 0, nx: 0, ny: 0, inside: false, active: 0 };
  const state = { clock: 0, spin: 0, travel: 0, offsetX: 0, offsetY: 0, reveal: s.intro && !reduce ? 0 : 1 };
  const bursts = [];
  const cloud = { key: '', count: 0, positions: new Float32Array(0), randoms: new Float32Array(0), colors: new Float32Array(0) };
  const screen = { x: new Float32Array(0), y: new Float32Array(0), ahead: new Float32Array(0), alpha: new Float32Array(0) };
  let raf = 0, last = 0, visible = true;

  const render = () => {
    renderParticles(gl, dots, lines, dotVao, lineVao, lineData, buffers, cloud, screen, state, pointer, bursts, view, s, colorHelper, canvas);
  };

  const frame = now => {
    raf = 0;
    if (!visible || document.hidden) return;
    const dt = last ? clamp((now - last) / 1000, 0.0005, 0.05) : 1 / 60;
    last = now;
    if (s.paused) { state.reveal = 1; render(); last = 0; return; }
    const motion = reduce ? 0 : 1;
    const pace = dt * s.speed * motion;
    state.clock += pace;
    if (s.rotate) state.spin += pace * 0.6;
    state.travel += dt * s.driftSpeed * motion * (s.drift === 3 ? 6 : 0.9);

    const engaged = s.mouse && pointer.inside && !reduce;
    const follow = 1 - Math.exp(-dt / 0.35);
    const parallax = engaged && s.hoverEffect === 0 ? s.hoverFactor : 0;
    state.offsetX += (-pointer.nx * parallax - state.offsetX) * follow;
    state.offsetY += (-pointer.ny * parallax - state.offsetY) * follow;
    pointer.sx += (pointer.x - pointer.sx) * (1 - Math.exp(-dt / 0.06));
    pointer.sy += (pointer.y - pointer.sy) * (1 - Math.exp(-dt / 0.06));
    pointer.active += ((engaged ? 1 : 0) - pointer.active) * (1 - Math.exp(-dt / 0.2));

    for (let i = bursts.length - 1; i >= 0; i--) {
      bursts[i].age += dt;
      if (bursts[i].age >= BURST_SECONDS) bursts.splice(i, 1);
    }
    if (!s.intro || reduce) state.reveal = 1;
    else if (state.reveal < 1) state.reveal = Math.min(1, state.reveal + dt / 1.8);
    render();
    raf = requestAnimationFrame(frame);
  };

  const wake = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  const resize = () => {
    const w = Math.max(1, container.clientWidth), h = Math.max(1, container.clientHeight);
    const ratio = Math.min(s.dpr || window.devicePixelRatio || 1, 2);
    view.width = w; view.height = h;
    canvas.width = Math.max(1, Math.round(w * ratio));
    canvas.height = Math.max(1, Math.round(h * ratio));
    view.ratio = canvas.width / w;
    render(); wake();
  };

  const detachEvents = attachParticleEvents(
    container, pointer, bursts, () => s, reduce, wake, resize,
    (vis) => { if (typeof vis === 'boolean') visible = vis; last = 0; if (visible) wake(); }
  );

  resize();

  return {
    canvas,
    destroy() {
      cancelAnimationFrame(raf);
      detachEvents();
      gl.deleteProgram(dots.program);
      gl.deleteProgram(lines.program);
      Object.values(buffers).forEach(b => gl.deleteBuffer(b));
      gl.deleteVertexArray(dotVao);
      gl.deleteVertexArray(lineVao);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    },
    updateSettings(nextOpts) {
      s = normalizeSettings({ ...s, ...nextOpts });
      resize();
    }
  };
}
