/**
 * Particles Constants, Math, Normalization & WebGL Helpers
 */

export const SHAPES = { circle: 0, square: 1, ring: 2, sparkle: 3 };
export const EFFECTS = { parallax: 0, repel: 1, attract: 2 };
export const DRIFTS = { none: 0, up: 1, down: 2, forward: 3 };
export const MAX_COUNT = 20000;
export const MAX_LINKED = 900;
export const MAX_LINES = 9000;
export const MAX_BURSTS = 4;
export const DEPTH = 10;
export const FOCAL = 7.595754;
export const NEAR = 0.1;
export const FAR = 100;
export const INTRO_SECONDS = 1.8;
export const BURST_SECONDS = 1.5;
export const BURST_SPEED = 520;
export const BURST_WIDTH = 46;

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export const easeOut = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
export const wrap = (v, span) => ((v % span) + span) % span;

export const seeded = seed => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const compile = (gl, type, src) => {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) return s;
  gl.deleteShader(s);
  return null;
};

export const link = (gl, vert, frag) => {
  const v = compile(gl, gl.VERTEX_SHADER, vert);
  const f = compile(gl, gl.FRAGMENT_SHADER, frag);
  const prog = gl.createProgram();
  if (!v || !f || !prog) return null;
  gl.attachShader(prog, v);
  gl.attachShader(prog, f);
  gl.linkProgram(prog);
  gl.deleteShader(v);
  gl.deleteShader(f);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { gl.deleteProgram(prog); return null; }
  const uniforms = {};
  const cnt = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < cnt; i++) {
    const info = gl.getActiveUniform(prog, i);
    if (info) uniforms[info.name.replace('[0]', '')] = gl.getUniformLocation(prog, info.name);
  }
  return { program: prog, uniforms };
};

export function normalizeSettings(p = {}) {
  const pal = (Array.isArray(p.particleColors) ? p.particleColors : [p.particleColors]).filter(Boolean).map(String);
  return {
    count: clamp(Math.round(p.particleCount ?? 200), 1, MAX_COUNT),
    spread: Math.max(0.1, p.particleSpread ?? 10),
    speed: p.speed ?? 0.1,
    colors: pal.length ? pal : ['#ffffff'],
    mouse: p.moveParticlesOnHover ?? true,
    hoverFactor: Math.max(0, p.particleHoverFactor ?? 1),
    soft: p.alphaParticles ?? false,
    size: Math.max(0, p.particleBaseSize ?? 100),
    randomness: Math.max(0, p.sizeRandomness ?? 1),
    camera: Math.max(1, p.cameraDistance ?? 20),
    rotate: !(p.disableRotation ?? false),
    dpr: p.pixelRatio,
    shape: SHAPES[p.shape] ?? 0,
    glow: Math.max(0, p.glow ?? 0.5),
    twinkle: clamp(p.twinkle ?? 0.3, 0, 1),
    depthOfField: Math.max(0, p.depthOfField ?? 0),
    connections: p.connections ?? false,
    connectionDistance: Math.max(10, p.connectionDistance ?? 110),
    hoverEffect: EFFECTS[p.hoverEffect] ?? 0,
    hoverRadius: Math.max(20, p.hoverRadius ?? 140),
    clickBurst: p.clickBurst ?? true,
    drift: DRIFTS[p.drift] ?? 0,
    driftSpeed: p.driftSpeed ?? 1,
    variation: Math.max(0, Math.round(p.variation ?? 0)),
    intro: p.intro ?? true,
    opacity: clamp(p.opacity ?? 1, 0, 1),
    lightMode: p.lightMode ?? false,
    paused: p.paused ?? false
  };
}

export function createColorHelper() {
  const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const cache = new Map();
  const parse = val => {
    if (cache.has(val)) return cache.get(val);
    let rgb = [1, 1, 1];
    if (probe) {
      probe.clearRect(0, 0, 1, 1);
      probe.fillStyle = '#ffffff'; probe.fillStyle = val;
      probe.fillRect(0, 0, 1, 1);
      const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
      rgb = [r / 255, g / 255, b / 255];
    }
    cache.set(val, rgb);
    return rgb;
  };
  const ink = rgb => {
    const lin = rgb.map(v => Math.pow(v, 2.2));
    const tone = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
    const depth = Math.min(1, 0.06 / Math.max(tone, 0.0001));
    return lin.map(v => Math.pow(v * depth, 1 / 2.2));
  };
  return { parse, ink };
}
