/**
 * Energy Wheel Canvas Visualization
 *
 * A circular chart showing performance across 10 energy types
 */

import { useEffect, useRef } from 'react';
import type { EnergyBreakdown } from '../types';

interface EnergyWheelProps {
  breakdown: EnergyBreakdown[];
  mode: 'ident' | 'high' | 'control';
}

export function EnergyWheel({ breakdown, mode }: EnergyWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = 480;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const rMax = size * 0.34;
    const rMin = size * 0.10;
    const n = breakdown.length;

    // Determine which score to use
    const scoreKey = mode === 'ident' ? 'identScore' : mode === 'high' ? 'highScore' : 'controlScore';

    // Draw each segment
    breakdown.forEach((energy, i) => {
      const a0 = (i / n) * 2 * Math.PI - Math.PI / 2;
      const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
      const score = energy[scoreKey] / 100;
      const ro = rMin + (rMax - rMin) * score;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(cx + rMin * Math.cos(a0), cy + rMin * Math.sin(a0));
      ctx.lineTo(cx + ro * Math.cos(a0), cy + ro * Math.sin(a0));
      ctx.arc(cx, cy, ro, a0, a1);
      ctx.lineTo(cx + rMin * Math.cos(a1), cy + rMin * Math.sin(a1));
      ctx.arc(cx, cy, rMin, a1, a0, true);
      ctx.closePath();
      ctx.fillStyle = energy.color + 'cc';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      const mid = (a0 + a1) / 2;
      const lx = cx + (rMax + 44) * Math.cos(mid);
      const ly = cy + (rMax + 44) * Math.sin(mid);
      ctx.font = '600 11px DM Sans, sans-serif';
      ctx.fillStyle = '#334155';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(energy.label, lx, ly - 7);
      ctx.font = '700 11px DM Sans, sans-serif';
      ctx.fillStyle = energy.color;
      ctx.fillText(Math.round(score * 100) + '%', lx, ly + 8);
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(cx, cy, rMin - 1, 0, 2 * Math.PI);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw center text
    ctx.font = '600 11px DM Sans, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const centerLabel = mode === 'ident' ? ['Hazard', 'Ident.'] : mode === 'high' ? ['High', 'Energy'] : ['Direct', 'Control'];
    ctx.fillText(centerLabel[0], cx, cy - 8);
    ctx.fillText(centerLabel[1], cx, cy + 8);
  }, [breakdown, mode]);

  return <canvas ref={canvasRef} width={480} height={480} />;
}
