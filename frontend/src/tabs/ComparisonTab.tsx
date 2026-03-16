/**
 * Comparison Tab - Compare multiple projects with radar charts and tables
 */

import { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { projectsAPI, comparisonAPI } from '../api/client';
import type { Project, ComparisonProject } from '../types';
import { Pill } from '../components/Pill';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);


export function ComparisonTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [cmpProjects, setCmpProjects] = useState<string[]>(['p1', 'p2', 'p3', 'p4', 'p5']);
  const [cmpTableProjects, setCmpTableProjects] = useState<string[]>(['p1', 'p2', 'p3', 'p4', 'p5']);
  const [radarMode, setRadarMode] = useState<'ident' | 'high' | 'control'>('ident');
  const [radarData, setRadarData] = useState<ChartData<'radar'> | null>(null);
  const [tableData, setTableData] = useState<ComparisonProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Load projects on mount
  useEffect(() => {
    projectsAPI.getAll().then(setProjects).catch(console.error);
  }, []);

  // Load radar data when projects or mode changes
  useEffect(() => {
    if (cmpProjects.length === 0) return;

    const includeIndustry = cmpProjects.includes('industry');
    const projectIds = cmpProjects.filter((id) => id !== 'industry');

    comparisonAPI
      .getRadarData(projectIds, radarMode, includeIndustry)
      .then((data) => {
        setRadarData({
          labels: data.labels,
          datasets: data.datasets.map((ds) => ({
            ...ds,
            fill: true,
          })),
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [cmpProjects, radarMode]);

  // Load table data when table projects change
  useEffect(() => {
    if (cmpTableProjects.length === 0) return;

    const includeIndustry = cmpTableProjects.includes('industry');
    const projectIds = cmpTableProjects.filter((id) => id !== 'industry');

    comparisonAPI
      .getTableData(projectIds, includeIndustry)
      .then(setTableData)
      .catch(console.error);
  }, [cmpTableProjects]);

  function toggleCmpProject(pid: string) {
    setCmpProjects((prev) => {
      if (prev.includes(pid)) {
        // Don't allow removing if it's the last one
        return prev.length > 1 ? prev.filter((x) => x !== pid) : prev;
      } else {
        return [...prev, pid];
      }
    });
  }

  function toggleTableProject(pid: string) {
    setCmpTableProjects((prev) => {
      if (prev.includes(pid)) {
        return prev.filter((x) => x !== pid);
      } else {
        return [...prev, pid];
      }
    });
  }

  const radarLabels: Record<string, string> = {
    ident: 'Identification',
    high: 'High Energy',
    control: 'Direct Control',
  };

  const showRag = cmpProjects.includes('industry') && cmpProjects.length > 1;
  const firstPid = cmpProjects.find((id) => id !== 'industry');
  const firstProj = projects.find((p) => p.id === firstPid);

  // For RAG calculation, we'd need project averages - simplified for now
  const ragDelta = 5; // Placeholder

  return (
    <div>
      <div className="page-title" style={{ marginBottom: 16 }}>
        <h1>Comparison</h1>
        <p>Select projects to compare across energy metrics</p>
      </div>

      {/* Project Selection */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', marginBottom: 10 }}>
          Projects — select any to include in radar &amp; table
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {projects.map((p) => (
            <button
              key={p.id}
              className={`proj-chip${cmpProjects.includes(p.id) ? ' active' : ''}`}
              onClick={() => toggleCmpProject(p.id)}
            >
              {p.name} — {p.region}
            </button>
          ))}
          <button
            className={`proj-chip industry${cmpProjects.includes('industry') ? ' active' : ''}`}
            onClick={() => toggleCmpProject('industry')}
          >
            🌍 Industry Avg
          </button>
        </div>
      </div>

      {/* RAG Banner */}
      {showRag && (
        <div className={`rag-banner ${ragDelta >= 5 ? 'green' : ragDelta >= -5 ? 'amber' : 'red'}`} style={{ marginBottom: 18 }}>
          <div className="rag-dot" />
          <strong>{ragDelta >= 5 ? 'Leading' : ragDelta >= -5 ? 'On Par' : 'Trailing'}:</strong>&nbsp;
          {ragDelta >= 5
            ? `${firstProj?.name} scores ${ragDelta}% above Industry Average.`
            : ragDelta >= -5
            ? `${firstProj?.name} is within 5% of Industry Average.`
            : `${firstProj?.name} scores ${Math.abs(ragDelta)}% below Industry Average.`}
        </div>
      )}

      {/* Radar Chart */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>
            <h2>Radar Chart</h2>
            <p>
              {radarLabels[radarMode]} accuracy — {cmpProjects.length} project{cmpProjects.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          <div className="wheel-toggle" style={{ width: 'auto', minWidth: 280 }}>
            {[
              ['ident', '🎯 Identification'],
              ['high', '⚡ High Energy'],
              ['control', '🛡 Direct Control'],
            ].map(([m, lbl]) => (
              <button
                key={m}
                className={`wheel-toggle-btn${radarMode === m ? ' active' : ''}`}
                onClick={() => setRadarMode(m as 'ident' | 'high' | 'control')}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
        {loading || !radarData ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading chart...</p>
          </div>
        ) : (
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <Radar
              data={radarData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                  r: {
                    min: 0,
                    max: 100,
                    grid: { color: '#f1f5f9' },
                    angleLines: { color: '#f1f5f9' },
                    pointLabels: { font: { size: 10 }, color: '#64748b' },
                    ticks: { font: { size: 8 }, color: '#cbd5e1', backdropColor: 'transparent' },
                  },
                },
                plugins: {
                  legend: { labels: { font: { size: 11 }, boxWidth: 12 } },
                },
              }}
            />
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>
            <h2>Full Breakdown</h2>
            <p>Identification · High Energy · Direct Control — toggle projects to show/hide columns</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {projects.map((p) => (
              <button
                key={p.id}
                className={`proj-chip${cmpTableProjects.includes(p.id) ? ' active' : ''}`}
                onClick={() => toggleTableProject(p.id)}
              >
                {p.name}
              </button>
            ))}
            <button
              className={`proj-chip industry${cmpTableProjects.includes('industry') ? ' active' : ''}`}
              onClick={() => toggleTableProject('industry')}
            >
              🌍 Industry
            </button>
          </div>
        </div>
        {tableData.length ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: 500 }}>
              <thead>
                <tr className="thead-border">
                  <th>Energy Type</th>
                  {tableData.flatMap((tp, ti) => [
                    <th key={`${ti}-i`}>
                      {tp.name}
                      <br />
                      <span style={{ fontWeight: 400, color: '#94a3b8' }}>Ident.</span>
                    </th>,
                    <th key={`${ti}-h`}>
                      {tp.name}
                      <br />
                      <span style={{ fontWeight: 400, color: '#94a3b8' }}>High E.</span>
                    </th>,
                    <th key={`${ti}-c`}>
                      {tp.name}
                      <br />
                      <span style={{ fontWeight: 400, color: '#94a3b8' }}>D.Ctrl</span>
                    </th>,
                  ])}
                </tr>
              </thead>
              <tbody>
                {tableData[0]?.energyBreakdown.map((e, i) => (
                  <tr key={e.id} className={`${i % 2 === 0 ? 'tr-alt' : ''} tr-border`}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {e.icon} {e.label}
                    </td>
                    {tableData.flatMap((tp, ti) => {
                      const b = tp.energyBreakdown.find((x) => x.id === e.id);
                      return [
                        <td key={`${ti}-i`}>
                          <Pill value={b?.identScore ?? 0} />
                        </td>,
                        <td key={`${ti}-h`}>
                          <Pill value={b?.highScore ?? 0} />
                        </td>,
                        <td key={`${ti}-c`}>
                          <Pill value={b?.controlScore ?? 0} />
                        </td>,
                      ];
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state" style={{ padding: 24 }}>
            <p>Select at least one project above to see data.</p>
          </div>
        )}
      </div>
    </div>
  );
}
