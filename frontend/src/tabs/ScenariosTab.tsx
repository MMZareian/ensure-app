/**
 * Scenarios Tab - Browse and compare training scenarios
 */

import { useState, useEffect } from 'react';
import { projectsAPI } from '../api/client';
import type { ScenarioSummary } from '../types';
import { Pill } from '../components/Pill';

interface ScenariosTabProps {
  selectedProject: string;
}

export function ScenariosTab({ selectedProject }: ScenariosTabProps) {
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    projectsAPI
      .getScenarios(selectedProject)
      .then(setScenarios)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedProject]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading scenarios...</p>
      </div>
    );
  }

  if (!scenarios.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <p>No scenarios available for this project yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-title">
        <h1>Scenarios</h1>
        <p>{scenarios.length} scenarios available</p>
      </div>

      <div id="scenario-list">
        {scenarios.map((scenario) => {
          // Find worst and best energy types
          const sorted = [...scenario.energyBreakdown].sort((a, b) => a.identScore - b.identScore);
          const worst = sorted[0];
          const best = sorted[sorted.length - 1];

          return (
            <div key={scenario.id} className="card" style={{ marginBottom: 12, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{scenario.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    <span
                      style={{
                        fontSize: 10,
                        padding: '2px 8px',
                        borderRadius: 5,
                        fontWeight: 500,
                        background: 'rgba(99,102,241,0.08)',
                        color: '#6366f1',
                        border: '1px solid rgba(99,102,241,0.15)',
                      }}
                    >
                      {scenario.workerCount} workers
                    </span>
                    {worst && (
                      <span
                        style={{
                          fontSize: 10,
                          padding: '2px 8px',
                          borderRadius: 5,
                          fontWeight: 500,
                          background: 'rgba(220,38,38,0.07)',
                          color: '#dc2626',
                          border: '1px solid rgba(220,38,38,0.15)',
                        }}
                      >
                        ⚠ Weak: {worst.label} ({worst.identScore}%)
                      </span>
                    )}
                    {best && (
                      <span
                        style={{
                          fontSize: 10,
                          padding: '2px 8px',
                          borderRadius: 5,
                          fontWeight: 500,
                          background: 'rgba(22,163,74,0.07)',
                          color: '#16a34a',
                          border: '1px solid rgba(22,163,74,0.15)',
                        }}
                      >
                        ★ Best: {best.label} ({best.identScore}%)
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Pill value={scenario.avgScore} />
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>avg score</div>
                </div>
              </div>

              {/* Energy bar visualization */}
              <div style={{ display: 'flex', gap: 2, height: 5, borderRadius: 3, overflow: 'hidden', marginTop: 8 }}>
                {scenario.energyBreakdown.map((e) => (
                  <div
                    key={e.id}
                    style={{
                      flex: 1,
                      background: e.color,
                      opacity: e.identScore / 100 * 0.85 + 0.15,
                    }}
                    title={`${e.label}: ${e.identScore}%`}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 2, marginTop: 3 }}>
                {scenario.energyBreakdown.map((e) => (
                  <div key={e.id} style={{ flex: 1, fontSize: 10, textAlign: 'center' }}>
                    {e.icon}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
