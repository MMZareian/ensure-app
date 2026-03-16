/**
 * Scenarios Tab - Browse and compare training scenarios
 */

import { useState, useEffect } from 'react';
import { projectsAPI, scenariosAPI } from '../api/client';
import type { Project, ScenarioSummary, ScenarioDetail, ScenarioComparison } from '../types';
import { Pill } from '../components/Pill';
import { HazardIdentChart } from '../components/charts/HazardIdentChart';
import { ClassificationChart } from '../components/charts/ClassificationChart';
import { WorkerPerformanceTable } from '../components/WorkerPerformanceTable';
import { ScenarioComparisonView } from '../components/ScenarioComparisonView';

interface ScenariosTabProps {
  selectedProject: string;
  onProjectChange: (projectId: string) => void;
  companyId: string | null;
}

type ViewMode = 'browse' | 'compare';

export function ScenariosTab({ selectedProject, onProjectChange: _onProjectChange, companyId }: ScenariosTabProps) {
  const [mode, setMode] = useState<ViewMode>('browse');
  const [projects, setProjects] = useState<Project[]>([]);
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [scenarioDetail, setScenarioDetail] = useState<ScenarioDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Load projects filtered by company
  useEffect(() => {
    if (companyId) {
      projectsAPI.getAll(companyId).then(setProjects).catch(console.error);
    }
  }, [companyId]);

  // Load scenarios for selected project
  useEffect(() => {
    setLoading(true);
    setSelectedScenario(null);
    setScenarioDetail(null);
    projectsAPI
      .getScenarios(selectedProject)
      .then(setScenarios)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedProject]);

  // Load scenario detail when one is selected
  useEffect(() => {
    if (selectedScenario) {
      setLoading(true);
      scenariosAPI
        .getDetail(selectedScenario)
        .then(setScenarioDetail)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedScenario]);

  const handleModeChange = (newMode: ViewMode) => {
    setMode(newMode);
    setSelectedScenario(null);
    setScenarioDetail(null);
  };

  const handleBack = () => {
    setSelectedScenario(null);
    setScenarioDetail(null);
  };

  if (loading && !scenarioDetail) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading scenarios...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with mode toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div className="page-title" style={{ marginBottom: 0 }}>
          <h1>Scenarios {mode === 'compare' ? '— Compare' : ''}</h1>
          {mode === 'browse' && !selectedScenario && <p>{scenarios.length} scenarios available</p>}
        </div>
        <div className="wheel-toggle" style={{ width: 'auto', minWidth: 240 }}>
          <button
            className={`wheel-toggle-btn ${mode === 'browse' ? 'active' : ''}`}
            onClick={() => handleModeChange('browse')}
          >
            ▤ Browse
          </button>
          <button
            className={`wheel-toggle-btn ${mode === 'compare' ? 'active' : ''}`}
            onClick={() => handleModeChange('compare')}
          >
            ⇄ Compare
          </button>
        </div>
      </div>

      {/* Browse Mode */}
      {mode === 'browse' && (
        <>
          {selectedScenario && scenarioDetail ? (
            <ScenarioBrowseDetail
              scenario={scenarioDetail}
              onBack={handleBack}
            />
          ) : (
            <ScenarioBrowseList
              scenarios={scenarios}
              onSelectScenario={setSelectedScenario}
            />
          )}
        </>
      )}

      {/* Compare Mode */}
      {mode === 'compare' && (
        <ScenarioCompareMode
          projects={projects}
          companyId={companyId}
        />
      )}
    </div>
  );
}

// ============================================================================
// Browse List Component
// ============================================================================

interface ScenarioBrowseListProps {
  scenarios: ScenarioSummary[];
  onSelectScenario: (scenarioId: string) => void;
}

function ScenarioBrowseList({ scenarios, onSelectScenario }: ScenarioBrowseListProps) {
  if (!scenarios.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <p>No scenarios available for this project yet.</p>
      </div>
    );
  }

  return (
    <div id="scenario-list">
      {scenarios.map((scenario) => {
        // Find worst and best energy types
        const sorted = [...scenario.energyBreakdown].sort((a, b) => a.identScore - b.identScore);
        const worst = sorted[0];
        const best = sorted[sorted.length - 1];

        return (
          <div
            key={scenario.id}
            className="card"
            style={{ marginBottom: 12, cursor: 'pointer' }}
            onClick={() => onSelectScenario(scenario.id)}
          >
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
  );
}

// ============================================================================
// Browse Detail Component
// ============================================================================

interface ScenarioBrowseDetailProps {
  scenario: ScenarioDetail;
  onBack: () => void;
}

function ScenarioBrowseDetail({ scenario, onBack }: ScenarioBrowseDetailProps) {
  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          marginBottom: 16,
          padding: '8px 16px',
          background: '#f1f5f9',
          border: '1px solid #cbd5e1',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 500,
          color: '#475569',
        }}
      >
        ← Back to scenarios
      </button>

      {/* Scenario header */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{scenario.name}</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>
              {scenario.workers.length} workers · {scenario.date}
            </p>
          </div>
          <Pill value={Math.round(scenario.workers.reduce((sum, w) => sum + w.score, 0) / scenario.workers.length)} />
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <div className="card">
          <div className="section-title">
            <h2>Hazard Identification</h2>
            <p>Items correctly identified per energy type</p>
          </div>
          <HazardIdentChart data={scenario.energyBreakdown} />
        </div>
        <div className="card">
          <div className="section-title">
            <h2>High Energy · Direct Control</h2>
            <p>Classification accuracy per energy type</p>
          </div>
          <ClassificationChart data={scenario.energyBreakdown} />
        </div>
      </div>

      {/* Worker performance table */}
      <div className="card">
        <div className="section-title">
          <h2>Worker Performance</h2>
          <p>Individual scores and hazard detection results</p>
        </div>
        <WorkerPerformanceTable workers={scenario.workers} energyBreakdown={scenario.energyBreakdown} />
      </div>
    </div>
  );
}

// ============================================================================
// Compare Mode Component
// ============================================================================

interface ScenarioCompareModeProps {
  projects: Project[];
  companyId: string | null;
}

function ScenarioCompareMode({ projects, companyId: _companyId }: ScenarioCompareModeProps) {
  const [projectA, setProjectA] = useState('');
  const [projectB, setProjectB] = useState('');
  const [scenariosA, setScenariosA] = useState<ScenarioSummary[]>([]);
  const [scenariosB, setScenariosB] = useState<ScenarioSummary[]>([]);
  const [scenarioA, setScenarioA] = useState('');
  const [scenarioB, setScenarioB] = useState('');
  const [comparison, setComparison] = useState<ScenarioComparison | null>(null);
  const [loading, setLoading] = useState(false);

  // Load scenarios for project A
  useEffect(() => {
    if (projectA) {
      projectsAPI.getScenarios(projectA).then(setScenariosA).catch(console.error);
    } else {
      setScenariosA([]);
    }
    setScenarioA('');
  }, [projectA]);

  // Load scenarios for project B
  useEffect(() => {
    if (projectB) {
      projectsAPI.getScenarios(projectB).then(setScenariosB).catch(console.error);
    } else {
      setScenariosB([]);
    }
    setScenarioB('');
  }, [projectB]);

  const handleCompare = async () => {
    if (!scenarioA || !scenarioB) return;
    setLoading(true);
    try {
      const result = await scenariosAPI.compare(scenarioA, scenarioB);
      setComparison(result);
    } catch (error) {
      console.error('Failed to compare scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCompare = scenarioA && scenarioB && scenarioA !== scenarioB;

  return (
    <div>
      {/* Selection card */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="section-title">
          <h2>Compare Two Scenarios</h2>
          <p>Select a project and scenario for each side, then click Compare</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16 }}>
          {/* Side A */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0284c7', marginBottom: 8 }}>
              Side A — Blue
            </div>
            <select
              value={projectA}
              onChange={(e) => setProjectA(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 13,
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                marginBottom: 12,
              }}
            >
              <option value="">Select project…</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              value={scenarioA}
              onChange={(e) => setScenarioA(e.target.value)}
              disabled={!projectA}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 13,
                border: '1px solid #cbd5e1',
                borderRadius: 6,
              }}
            >
              <option value="">Select scenario…</option>
              {scenariosA.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {scenarioA && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  background: 'rgba(2, 132, 199, 0.05)',
                  border: '1px solid rgba(2, 132, 199, 0.2)',
                  borderRadius: 6,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0284c7' }}>
                  {scenariosA.find((s) => s.id === scenarioA)?.name}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                  {scenariosA.find((s) => s.id === scenarioA)?.workerCount} workers · avg{' '}
                  <Pill value={scenariosA.find((s) => s.id === scenarioA)?.avgScore || 0} />
                </div>
              </div>
            )}
          </div>

          {/* Side B */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#dc2626', marginBottom: 8 }}>
              Side B — Red
            </div>
            <select
              value={projectB}
              onChange={(e) => setProjectB(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 13,
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                marginBottom: 12,
              }}
            >
              <option value="">Select project…</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              value={scenarioB}
              onChange={(e) => setScenarioB(e.target.value)}
              disabled={!projectB}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 13,
                border: '1px solid #cbd5e1',
                borderRadius: 6,
              }}
            >
              <option value="">Select scenario…</option>
              {scenariosB.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {scenarioB && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  background: 'rgba(220, 38, 38, 0.05)',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  borderRadius: 6,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: '#dc2626' }}>
                  {scenariosB.find((s) => s.id === scenarioB)?.name}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                  {scenariosB.find((s) => s.id === scenarioB)?.workerCount} workers · avg{' '}
                  <Pill value={scenariosB.find((s) => s.id === scenarioB)?.avgScore || 0} />
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={!canCompare || loading}
          style={{
            width: '100%',
            marginTop: 20,
            padding: '12px 24px',
            background: canCompare ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
            color: canCompare ? '#fff' : '#94a3b8',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: canCompare ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Comparing...' : 'Compare Scenarios'}
        </button>
      </div>

      {/* Comparison results */}
      {comparison && <ScenarioComparisonView comparison={comparison} />}
    </div>
  );
}
