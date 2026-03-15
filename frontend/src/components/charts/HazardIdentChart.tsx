/**
 * Hazard Identification Chart
 * Shows percentage of items correctly identified per energy type
 */

import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import type { EnergyBreakdown } from '../../types';

interface HazardIdentChartProps {
  data: EnergyBreakdown[];
}

export function HazardIdentChart({ data }: HazardIdentChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    // Destroy previous chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: data.map((e) => e.label),
        datasets: [
          {
            label: 'Identification Rate',
            data: data.map((e) => e.identScore),
            backgroundColor: data.map((e) => e.color),
            borderColor: data.map((e) => e.color),
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y}% identified correctly`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`,
            },
            grid: {
              color: '#f1f5f9',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ position: 'relative', height: '200px', width: '100%' }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
