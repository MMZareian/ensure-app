/**
 * Main Application Component
 *
 * Ensure Safety Knowledge Management System
 */

import { useState } from 'react';
import { OverviewTab } from './tabs/OverviewTab';
import { ScenariosTab } from './tabs/ScenariosTab';
import { ComparisonTab } from './tabs/ComparisonTab';
import { WorkersTab } from './tabs/WorkersTab';
import './styles.css';

type TabId = 'overview' | 'scenarios' | 'comparison' | 'workers';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedProject, setSelectedProject] = useState('p1');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'scenarios', label: 'Scenarios' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'workers', label: 'Workers' },
  ];

  return (
    <div className="ensure-root">
      {/* Top Navigation Bar */}
      <header className="topbar">
        <div className="topbar-logo">
          <div className="logo-icon">🛡</div>
          <div>
            <div className="logo-name">Ensure</div>
            <div className="logo-sub">Safety KMS</div>
          </div>
        </div>
        <div className="topbar-divider" />
        <nav className="topbar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="topbar-user">
          <div className="topbar-user-info">
            <div className="topbar-user-name">Project Manager</div>
            <div className="topbar-user-role">Admin</div>
          </div>
          <div className="topbar-user-avatar">PM</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {activeTab === 'overview' && (
          <OverviewTab selectedProject={selectedProject} onSelectProject={setSelectedProject} />
        )}
        {activeTab === 'scenarios' && <ScenariosTab selectedProject={selectedProject} />}
        {activeTab === 'comparison' && <ComparisonTab />}
        {activeTab === 'workers' && <WorkersTab selectedProject={selectedProject} />}
      </main>
    </div>
  );
}

export default App;
