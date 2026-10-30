/**
 * Particles WebGL2 Drawing Pass
 */

import { MAX_BURSTS, BURST_SECONDS } from './particlesUtils.js';
import { rebuildCloud, rotationOf, offsetOf } from './particlesCloud.js';
import { buildLines } from './particlesLines.js';

export function renderParticles(gl, dots, lines, dotVao, lineVao, lineData, buffers, cloud, screen, state, pointer, bursts, view, s, colorHelper, canvas) {
  rebuildCloud(gl, cloud, screen, buffers, s, colorHelper);
  const matrix = rotationOf(state, s);
  const [ox, oy, oz] = offsetOf(state);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  if (s.connections) {
    const lineCount = buildLines(cloud, screen, lineData, view, s, matrix, state, pointer, bursts);
    if (lineCount) {
      gl.useProgram(lines.program);
      gl.bindVertexArray(lineVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.line);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, lineData.subarray(0, lineCount * 8));
      gl.uniform2f(lines.uniforms.uView, view.width, view.height);
      gl.uniform1f(lines.uniforms.uRatio, view.ratio);
      gl.uniform1f(lines.uniforms.uWidth, 1);
      gl.uniform1f(lines.uniforms.uOpacity, s.opacity);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, lineCount);
    }
  }

  const u = dots.uniforms;
  const packedBursts = new Float32Array(MAX_BURSTS * 4);
  let burstCount = 0;
  for (let i = bursts.length - 1; i >= 0 && burstCount < MAX_BURSTS; i--) {
    packedBursts.set([bursts[i].x, bursts[i].y, bursts[i].age / BURST_SECONDS, 1], burstCount * 4);
    burstCount++;
  }

  gl.useProgram(dots.program);
  gl.bindVertexArray(dotVao);
  gl.uniformMatrix3fv(u.uRotation, false, matrix);
  gl.uniform3f(u.uOffset, ox, oy, oz);
  gl.uniform1f(u.uSpread, s.spread);
  gl.uniform1f(u.uTime, state.clock);
  gl.uniform1f(u.uCamera, s.camera);
  gl.uniform1f(u.uAspect, view.width / view.height);
  gl.uniform2f(u.uView, view.width, view.height);
  gl.uniform1f(u.uRatio, view.ratio);
  gl.uniform1f(u.uSize, s.size);
  gl.uniform1f(u.uRandomness, s.randomness);
  gl.uniform1f(u.uBlur, s.depthOfField * 14);
  gl.uniform1f(u.uFocus, s.camera + 14);
  gl.uniform1f(u.uGlow, s.lightMode ? s.glow * 0.3 : s.glow);
  gl.uniform1f(u.uTwinkle, s.twinkle);
  gl.uniform1i(u.uShape, s.shape);
  gl.uniform1i(u.uDrift, s.drift);
  gl.uniform1f(u.uTravel, state.travel);
  gl.uniform4f(u.uPointer, pointer.sx, pointer.sy, pointer.active, s.hoverRadius);
  gl.uniform1i(u.uEffect, s.hoverEffect);
  gl.uniform1f(u.uStrength, s.hoverFactor);
  gl.uniform4fv(u.uBursts, packedBursts);
  gl.uniform1i(u.uBurstCount, burstCount);
  gl.uniform1f(u.uReveal, state.reveal);
  gl.uniform1f(u.uSoft, s.soft ? 0.2 : 0);
  gl.uniform1f(u.uShimmer, s.lightMode ? 0 : 1);
  gl.uniform1f(u.uOpacity, s.opacity);
  gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, cloud.count);
  gl.bindVertexArray(null);
}
