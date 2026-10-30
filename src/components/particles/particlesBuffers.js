/**
 * Particles WebGL2 VAO & Buffer Allocation
 */

import { MAX_LINES } from './particlesUtils.js';

export function createParticleBuffers(gl) {
  const corners = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, corners);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const positionBuffer = gl.createBuffer();
  const randomBuffer = gl.createBuffer();
  const colorBuffer = gl.createBuffer();

  const dotVao = gl.createVertexArray();
  gl.bindVertexArray(dotVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, corners);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const attach = (buf, loc, w) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, w, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(loc, 1);
  };
  attach(positionBuffer, 1, 3);
  attach(randomBuffer, 2, 4);
  attach(colorBuffer, 3, 3);

  const lineBuffer = gl.createBuffer();
  const lineData = new Float32Array(MAX_LINES * 8);
  const lineVao = gl.createVertexArray();
  gl.bindVertexArray(lineVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, corners);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, lineData.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 32, 0);
  gl.vertexAttribDivisor(1, 1);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 32, 16);
  gl.vertexAttribDivisor(2, 1);
  gl.bindVertexArray(null);

  return {
    dotVao, lineVao, lineData,
    buffers: { corners, position: positionBuffer, random: randomBuffer, color: colorBuffer, line: lineBuffer }
  };
}
