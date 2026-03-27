/**
 * Overview Tab - Project dashboard with KPIs and Energy Wheel
 */

import { useState, useEffect } from 'react';
import { projectsAPI } from '../api/client';
import type { Project, ProjectOverview } from '../types';
import { RagBanner } from '../components/RagBanner';
import { EnergyWheel } from '../components/EnergyWheel';

interface OverviewTabProps {
  selectedProject: string;
  onProjectChange: (projectId: string) => void;
  companyId: string | null;
}

export function OverviewTab({ selectedProject, onProjectChange, companyId }: OverviewTabProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [overview, setOverview] = useState<ProjectOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [wheelMode, setWheelMode] = useState<'ident' | 'high' | 'control'>('ident');

  // Load projects filtered by company (or all if super admin)
  useEffect(() => {
    // For super_admin (companyId = null), load all projects
    // For regular managers, load only company projects
    const apiCall = companyId ? projectsAPI.getAll(companyId) : projectsAPI.getAll();

    apiCall.then((projs) => {
      setProjects(projs);
      // Auto-select first project if current selection is not in list
      if (projs.length > 0 && !projs.find((p) => p.id === selectedProject)) {
        onProjectChange(projs[0].id);
      }
    }).catch(console.error);
  }, [companyId]);

  // Load overview when project changes
  useEffect(() => {
    setLoading(true);
    projectsAPI
      .getOverview(selectedProject)
      .then(setOverview)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedProject]);

  if (loading || !overview) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading overview...</p>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Scenarios Completed',
      value: overview.totalScenarios,
      sub: `${overview.totalSessions} total sessions`,
      color: '#6366f1',
    },
    {
      label: 'Workers Trained',
      value: overview.totalSessions,
      sub: 'Across all scenarios',
      color: '#0ea5e9',
    },
    {
      label: 'High-Energy Accuracy',
      value: `${overview.highAccAll}%`,
      sub: 'Avg across energy types',
      color: '#f59e0b',
    },
    {
      label: 'Direct Control Accuracy',
      value: `${overview.ctrlAccAll}%`,
      sub: 'Avg across energy types',
      color: '#10b981',
    },
  ];

  const wheelLegends = {
    ident: 'Segment length = Identification accuracy',
    high: 'Segment length = High Energy accuracy',
    control: 'Segment length = Direct Control accuracy',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="page-title" style={{ marginBottom: 0 }}>
          <h1>{overview.project.name}</h1>
          <p>
            {overview.totalScenarios} scenario{overview.totalScenarios !== 1 ? 's' : ''} · {overview.totalSessions} worker sessions ·
            Energy Wheel Safety Training
          </p>
        </div>
        <select className="ov-select" value={selectedProject} onChange={(e) => onProjectChange(e.target.value)}>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.region}
            </option>
          ))}
        </select>
      </div>

      <RagBanner score={overview.ragScore} />

      <div className="kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} className="card card-sm">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-sub" style={{ color: k.color }}>
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          className="card"
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 560,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', marginBottom: 8, alignSelf: 'flex-start' }}>Energy Wheel</div>
          <div className="wheel-toggle" style={{ width: '100%' }}>
            {[
              ['ident', '🎯 Identification'],
              ['high', '⚡ High Energy'],
              ['control', '🛡 Direct Control'],
            ].map(([m, lbl]) => (
              <button
                key={m}
                className={`wheel-toggle-btn${wheelMode === m ? ' active' : ''}`}
                onClick={() => setWheelMode(m as 'ident' | 'high' | 'control')}
              >
                {lbl}
              </button>
            ))}
          </div>
          <EnergyWheel breakdown={overview.energyBreakdown} mode={wheelMode} />
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6, textAlign: 'center' }}>{wheelLegends[wheelMode]}</div>
        </div>
      </div>
    </div>
  );
}
