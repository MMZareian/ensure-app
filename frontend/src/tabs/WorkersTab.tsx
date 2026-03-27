/**
 * Workers Tab - Worker performance summary and trends with expandable cards
 */

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { projectsAPI, workersAPI } from '../api/client';
import type { Project, WorkerSummary, WorkerTrend } from '../types';
import { Pill } from '../components/Pill';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Worker card colors
const WK_COLORS = [
  '#0ea5e9', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444',
  '#ec4899', '#64748b', '#06b6d4', '#f97316', '#a855f7',
];

const WK_METRIC_COLORS = {
  ident: '#0ea5e9',
  high: '#f59e0b',
  control: '#8b5cf6',
};

interface WorkerCardProps {
  workerTrend: WorkerTrend;
}

function WorkerCard({ workerTrend }: WorkerCardProps) {
  const [open, setOpen] = useState(false);
  const { name, colorIndex, points } = workerTrend;
  const color = WK_COLORS[colorIndex % WK_COLORS.length];

  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('');

  if (!points.length) return null;

  // Calculate trend from first to latest scenario
  const firstScore = points[0]?.ident ?? 0;
  const lastScore = points[points.length - 1]?.ident ?? 0;
  const trendDelta = lastScore - firstScore;

  const trendEl =
    points.length < 2 ? null : trendDelta > 3 ? (
      <span style={{ color: '#16a34a', fontSize: 10, fontWeight: 600 }}>▲ +{trendDelta}%</span>
    ) : trendDelta < -3 ? (
      <span style={{ color: '#dc2626', fontSize: 10, fontWeight: 600 }}>▼ {trendDelta}%</span>
    ) : (
      <span style={{ color: '#d97706', fontSize: 10, fontWeight: 600 }}>
        → {trendDelta > 0 ? '+' : ''}
        {trendDelta}%
      </span>
    );

  // Chart data
  const chartData: ChartData<'line'> = {
    labels: points.map((t) => t.scenarioName),
    datasets: [
      {
        label: '🎯 Identification',
        data: points.map((t) => t.ident),
        borderColor: WK_METRIC_COLORS.ident,
        backgroundColor: WK_METRIC_COLORS.ident + '18',
        borderWidth: 2,
        pointBackgroundColor: WK_METRIC_COLORS.ident,
        pointRadius: 5,
        tension: 0.35,
        fill: false,
      },
      {
        label: '⚡ High Energy',
        data: points.map((t) => t.high),
        borderColor: WK_METRIC_COLORS.high,
        backgroundColor: WK_METRIC_COLORS.high + '18',
        borderWidth: 2,
        pointBackgroundColor: WK_METRIC_COLORS.high,
        pointRadius: 5,
        tension: 0.35,
        fill: false,
      },
      {
        label: '🛡 Direct Control',
        data: points.map((t) => t.control),
        borderColor: WK_METRIC_COLORS.control,
        backgroundColor: WK_METRIC_COLORS.control + '18',
        borderWidth: 2,
        pointBackgroundColor: WK_METRIC_COLORS.control,
        pointRadius: 5,
        tension: 0.35,
        fill: false,
      },
    ],
  };

  const latestPoint = points[points.length - 1];

  return (
    <div className={`wk-card${open ? ' open' : ''}`}>
      <div className="wk-card-header" onClick={() => setOpen((o) => !o)}>
        <div className="wk-card-left">
          <div className="wk-avatar" style={{ background: color }}>
            {initials}
          </div>
          <div>
            <div className="wk-name">{name}</div>
            <div className="wk-meta">
              {points.length} scenario{points.length !== 1 ? 's' : ''} · Latest:{' '}
              <Pill value={latestPoint?.ident ?? 0} /> {trendEl}
            </div>
          </div>
        </div>
        <div className="wk-card-pills">
          <span style={{ fontSize: 10, color: '#94a3b8' }}>⚡ {latestPoint?.high ?? 0}%</span>
          <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 6 }}>
            🛡 {latestPoint?.control ?? 0}%
          </span>
          <span className="wk-card-chevron">▼</span>
        </div>
      </div>
      {open && (
        <div className="wk-card-body">
          <div className="wk-chart-wrap">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: { font: { size: 10 }, boxWidth: 10, padding: 14 },
                  },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%`,
                    },
                  },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { font: { size: 9 }, color: '#94a3b8', maxRotation: 20 },
                  },
                  y: {
                    min: 0,
                    max: 100,
                    grid: { color: '#f1f5f9' },
                    ticks: {
                      font: { size: 9 },
                      color: '#94a3b8',
                      callback: (v) => v + '%',
                    },
                  },
                },
              }}
              height={180}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface WorkersTabProps {
  selectedProject: string;
  companyId: string | null;
}

export function WorkersTab({ selectedProject, companyId }: WorkersTabProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [wkProject, setWkProject] = useState(selectedProject);
  const [wkScenario, setWkScenario] = useState('all');
  const [workers, setWorkers] = useState<WorkerSummary[]>([]);
  const [workerTrends, setWorkerTrends] = useState<WorkerTrend[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load projects filtered by company (or all if super admin)
  useEffect(() => {
    const apiCall = companyId ? projectsAPI.getAll(companyId) : projectsAPI.getAll();
    apiCall.then(setProjects).catch(console.error);
  }, [companyId]);

  // Update wkProject when selectedProject changes
  useEffect(() => {
    setWkProject(selectedProject);
    setWkScenario('all');
  }, [selectedProject]);

  // Load scenarios and trends for selected project
  useEffect(() => {
    setLoading(true);
    Promise.all([
      projectsAPI.getScenarios(wkProject),
      workersAPI.getTrends(wkProject)
    ])
      .then(([scenariosData, trendsData]) => {
        setScenarios(scenariosData);
        setWorkerTrends(trendsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [wkProject]);

  // Load worker summary
  useEffect(() => {
    workersAPI
      .getSummary(wkProject, wkScenario)
      .then(setWorkers)
      .catch(console.error);
  }, [wkProject, wkScenario]);

  const currentProj = projects.find((p) => p.id === wkProject);
  const showTrends = scenarios.length >= 2;

  function handleSetProject(pid: string) {
    setWkProject(pid);
    setWkScenario('all');
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading workers...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-title" style={{ marginBottom: 16 }}>
        <h1>Workers</h1>
        <p>
          {currentProj?.name ?? 'Project'} · {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''} ·{' '}
          {wkScenario === 'all'
            ? 'All workers'
            : `${scenarios.find((s) => s.id === wkScenario)?.workers?.length ?? 0} workers in selected scenario`}
        </p>
      </div>

      {/* Project and Scenario Selection */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'end' }}>
          <div>
            <div
              style={{
                fontSize: 9,
                color: '#94a3b8',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Project
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {projects.map((p) => (
                <button
                  key={p.id}
                  className={`proj-chip${p.id === wkProject ? ' active' : ''}`}
                  onClick={() => handleSetProject(p.id)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 9,
                color: '#94a3b8',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Scenario <span style={{ fontWeight: 400, color: '#cbd5e1' }}>({scenarios.length})</span>
            </div>
            <select
              style={{
                width: '100%',
                padding: '7px 10px',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                fontSize: 12,
                fontFamily: 'inherit',
                color: '#0f172a',
                background: '#fff',
                cursor: 'pointer',
              }}
              value={wkScenario}
              onChange={(e) => setWkScenario(e.target.value)}
            >
              <option value="all">All scenarios</option>
              {scenarios.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Worker Summary Table */}
      <div className="card worker-aggregate" style={{ marginBottom: 18 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div className="worker-aggregate-title" style={{ marginBottom: 0 }}>
            Worker Summary — {wkScenario === 'all' ? 'All Scenarios' : scenarios.find((s) => s.id === wkScenario)?.name ?? ''}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>
            {wkScenario === 'all'
              ? 'Averages across all scenarios in project'
              : `${scenarios.find((s) => s.id === wkScenario)?.workers?.length ?? 0} workers`}
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr className="thead-border">
                <th>Worker</th>
                {wkScenario === 'all' && <th>Scenarios</th>}
                <th>Avg Ident.</th>
                <th>High Energy Acc.</th>
                <th>Direct Control Acc.</th>
              </tr>
            </thead>
            <tbody>
              {workers.length ? (
                workers.map((w, i) => (
                  <tr key={w.name} className={`${i % 2 === 0 ? 'tr-alt' : ''} tr-border`}>
                    <td style={{ fontWeight: 500 }}>{w.name}</td>
                    {wkScenario === 'all' && <td>{w.scenarioCount}</td>}
                    <td>
                      <Pill value={w.avgIdent} />
                    </td>
                    <td>
                      <Pill value={w.avgHigh} />
                    </td>
                    <td>
                      <Pill value={w.avgControl} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ color: '#94a3b8', padding: 20, textAlign: 'center' }}>
                    No workers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Over Time */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: '#0f172a' }}>
              Performance Over Time
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
              {showTrends
                ? 'Each scenario is a time point · Click a worker card to expand their chart'
                : 'Need at least 2 scenarios in a project to show trends'}
            </div>
          </div>
        </div>
        {showTrends ? (
          workerTrends.map((trend) => (
            <WorkerCard key={trend.name} workerTrend={trend} />
          ))
        ) : (
          <div className="empty-state" style={{ padding: 32 }}>
            <div className="empty-icon">📈</div>
            <p>Select a project with multiple scenarios to see trends.</p>
          </div>
        )}
      </div>
    </div>
  );
}
