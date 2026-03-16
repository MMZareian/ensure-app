/**
 * Scenario Comparison View
 * Displays side-by-side comparison of two scenarios
 */

import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import type { ScenarioComparison } from '../types';
import { Pill } from './Pill';

interface ScenarioComparisonViewProps {
  comparison: ScenarioComparison;
}

export function ScenarioComparisonView({ comparison }: ScenarioComparisonViewProps) {
  const { scA, scB, projA, projB, bdA, bdB, avgA, avgB } = comparison;

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        {/* Side A Summary */}
        <div
          className="card"
          style={{
            border: '2px solid rgba(2, 132, 199, 0.3)',
            background: 'rgba(2, 132, 199, 0.02)',
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0284c7', marginBottom: 4 }}>Side A — Blue</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{scA.name}</h3>
            <p style={{ fontSize: 11, color: '#64748b' }}>
              {projA.name} · {scA.workers.length} workers
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#64748b' }}>Average Score:</span>
            <Pill value={avgA} />
          </div>
        </div>

        {/* Side B Summary */}
        <div
          className="card"
          style={{
            border: '2px solid rgba(220, 38, 38, 0.3)',
            background: 'rgba(220, 38, 38, 0.02)',
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', marginBottom: 4 }}>Side B — Red</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{scB.name}</h3>
            <p style={{ fontSize: 11, color: '#64748b' }}>
              {projB.name} · {scB.workers.length} workers
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#64748b' }}>Average Score:</span>
            <Pill value={avgB} />
          </div>
        </div>
      </div>

      {/* Hazard Identification Comparison Chart */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="section-title">
          <h2>Hazard Identification Comparison</h2>
          <p>Items correctly identified per energy type</p>
        </div>
        <HazardIdentComparisonChart bdA={bdA} bdB={bdB} />
      </div>

      {/* Classification Accuracy Comparison Chart */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="section-title">
          <h2>Classification Accuracy Comparison</h2>
          <p>High Energy and Direct Control classification rates</p>
        </div>
        <ClassificationComparisonChart bdA={bdA} bdB={bdB} />
      </div>

      {/* Worker Performance Comparison Table */}
      <div className="card">
        <div className="section-title">
          <h2>Worker Performance Comparison</h2>
          <p>Individual worker scores across both scenarios</p>
        </div>
        <WorkerComparisonTable scA={scA} scB={scB} />
      </div>
    </div>
  );
}

// ============================================================================
// Hazard Identification Comparison Chart
// ============================================================================

interface HazardIdentComparisonChartProps {
  bdA: any[];
  bdB: any[];
}

function HazardIdentComparisonChart({ bdA, bdB }: HazardIdentComparisonChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !bdA.length || !bdB.length) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: bdA.map((e) => e.label),
        datasets: [
          {
            label: 'Side A (Blue)',
            data: bdA.map((e) => e.identScore),
            backgroundColor: 'rgba(2, 132, 199, 0.7)',
            borderColor: '#0284c7',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Side B (Red)',
            data: bdB.map((e) => e.identScore),
            backgroundColor: 'rgba(220, 38, 38, 0.7)',
            borderColor: '#dc2626',
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
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const y = (context.parsed as { y: number } | null)?.y ?? 0;
                return `${context.dataset.label}: ${y}%`;
              },
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
  }, [bdA, bdB]);

  return (
    <div style={{ position: 'relative', height: '250px', width: '100%' }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

// ============================================================================
// Classification Accuracy Comparison Chart
// ============================================================================

interface ClassificationComparisonChartProps {
  bdA: any[];
  bdB: any[];
}

function ClassificationComparisonChart({ bdA, bdB }: ClassificationComparisonChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !bdA.length || !bdB.length) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Calculate average high energy and direct control for each side
    const avgHighEnergyA = bdA.reduce((sum, e) => sum + e.highScore, 0) / bdA.length;
    const avgDirectControlA = bdA.reduce((sum, e) => sum + e.controlScore, 0) / bdA.length;
    const avgHighEnergyB = bdB.reduce((sum, e) => sum + e.highScore, 0) / bdB.length;
    const avgDirectControlB = bdB.reduce((sum, e) => sum + e.controlScore, 0) / bdB.length;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['High Energy', 'Direct Control'],
        datasets: [
          {
            label: 'Side A (Blue)',
            data: [avgHighEnergyA, avgDirectControlA],
            backgroundColor: 'rgba(2, 132, 199, 0.7)',
            borderColor: '#0284c7',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Side B (Red)',
            data: [avgHighEnergyB, avgDirectControlB],
            backgroundColor: 'rgba(220, 38, 38, 0.7)',
            borderColor: '#dc2626',
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
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const y = (context.parsed as { y: number } | null)?.y ?? 0;
                return `${context.dataset.label}: ${y.toFixed(1)}%`;
              },
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
  }, [bdA, bdB]);

  return (
    <div style={{ position: 'relative', height: '250px', width: '100%' }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

// ============================================================================
// Worker Comparison Table
// ============================================================================

interface WorkerComparisonTableProps {
  scA: any;
  scB: any;
}

function WorkerComparisonTable({ scA, scB }: WorkerComparisonTableProps) {
  // Combine and sort workers by name
  const allWorkerNames = new Set([
    ...scA.workers.map((w: any) => w.name),
    ...scB.workers.map((w: any) => w.name),
  ]);
  const sortedNames = Array.from(allWorkerNames).sort();

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
            <th
              style={{
                textAlign: 'left',
                padding: '12px 8px',
                fontWeight: 600,
                color: '#475569',
              }}
            >
              Worker Name
            </th>
            <th
              style={{
                textAlign: 'center',
                padding: '12px 8px',
                fontWeight: 600,
                color: '#0284c7',
              }}
            >
              Side A Score
            </th>
            <th
              style={{
                textAlign: 'center',
                padding: '12px 8px',
                fontWeight: 600,
                color: '#dc2626',
              }}
            >
              Side B Score
            </th>
            <th
              style={{
                textAlign: 'center',
                padding: '12px 8px',
                fontWeight: 600,
                color: '#475569',
              }}
            >
              Difference
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedNames.map((name, idx) => {
            const workerA = scA.workers.find((w: any) => w.name === name);
            const workerB = scB.workers.find((w: any) => w.name === name);
            const scoreA = workerA?.score || null;
            const scoreB = workerB?.score || null;
            const diff = scoreA !== null && scoreB !== null ? scoreB - scoreA : null;

            return (
              <tr
                key={name}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  background: idx % 2 === 0 ? '#fff' : '#f8fafc',
                }}
              >
                <td style={{ padding: '10px 8px', fontWeight: 500, color: '#0f172a' }}>{name}</td>
                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                  {scoreA !== null ? <Pill value={scoreA} /> : <span style={{ color: '#cbd5e1' }}>—</span>}
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                  {scoreB !== null ? <Pill value={scoreB} /> : <span style={{ color: '#cbd5e1' }}>—</span>}
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                  {diff !== null ? (
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        background: diff > 0 ? 'rgba(22, 163, 74, 0.1)' : diff < 0 ? 'rgba(220, 38, 38, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                        color: diff > 0 ? '#16a34a' : diff < 0 ? '#dc2626' : '#64748b',
                      }}
                    >
                      {diff > 0 ? '+' : ''}
                      {diff}
                    </span>
                  ) : (
                    <span style={{ color: '#cbd5e1' }}>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary */}
      <div style={{ marginTop: 16, padding: 12, background: '#f8fafc', borderRadius: 6 }}>
        <div style={{ fontSize: 11, color: '#64748b' }}>
          <strong>Note:</strong> Positive differences (green) indicate improvement in Side B compared to Side A. Negative
          differences (red) indicate decline.
        </div>
      </div>
    </div>
  );
}
