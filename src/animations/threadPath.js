/**
 * Ultra-Smooth Left-Spine Thread Path Generator
 * Subtle, gentle organic flow (5-8px displacement, long wavelength) down the left edge.
 */

export function buildUnifiedThreadPath(w, h) {
  const isMobile = w < 640;
  const leftX = isMobile ? Math.max(w * 0.04, 16) : Math.max(w * 0.03, 24);
  const disp = isMobile ? 5 : 8;

  let fullD = `M ${leftX} 0 `;

  const wavelength = isMobile ? 550 : 750;
  const halfWave = wavelength / 2;
  const endY = Math.max(wavelength, h - 35);

  let currentY = 0;
  let waveIdx = 0;

  while (currentY < endY) {
    const nextY = Math.min(endY, currentY + halfWave);
    const segH = nextY - currentY;
    if (segH < 10) break;

    const direction = (waveIdx % 2 === 0) ? 1 : -1;
    const waveX = leftX + disp * direction;

    fullD += `C ${waveX.toFixed(1)} ${(currentY + segH * 0.35).toFixed(1)}, ${waveX.toFixed(1)} ${(currentY + segH * 0.65).toFixed(1)}, ${leftX} ${nextY.toFixed(1)} `;

    currentY = nextY;
    waveIdx++;
  }

  return {
    fullD,
    endY: currentY
  };
}
