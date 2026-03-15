/**
 * Classification Accuracy Chart
 * Shows High Energy and Direct Control classification accuracy per energy type
 */

import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import type { EnergyBreakdown } from '../../types';

interface ClassificationChartProps {
  data: EnergyBreakdown[];
}

export function ClassificationChart({ data }: ClassificationChartProps) {
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
            label: 'High Energy',
            data: data.map((e) => e.highScore),
            backgroundColor: '#0284c7',
            borderColor: '#0284c7',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Direct Control',
            data: data.map((e) => e.controlScore),
            backgroundColor: '#7c3aed',
            borderColor: '#7c3aed',
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
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 11,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y}%`,
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
