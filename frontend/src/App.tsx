/**
 * Main Application Component with Authentication
 */
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Topbar } from './components/Topbar';
import { OverviewTab } from './tabs/OverviewTab';
import { ScenariosTab } from './tabs/ScenariosTab';
import { ComparisonTab } from './tabs/ComparisonTab';
import { WorkersTab } from './tabs/WorkersTab';
import './styles.css';

type Tab = 'overview' | 'scenarios' | 'comparison' | 'workers';

function MainApp() {
  const { isAuthenticated, user, login, logout, companyId } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedProject, setSelectedProject] = useState('p1');

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={login} />;
  }

  // Main dashboard (only shown when authenticated)
  return (
    <div className="ensure-root">
      <Topbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user!}
        onLogout={logout}
      />

      <div className="main">
        {activeTab === 'overview' && (
          <OverviewTab
            selectedProject={selectedProject}
            onProjectChange={setSelectedProject}
            companyId={companyId}
          />
        )}

        {activeTab === 'scenarios' && (
          <ScenariosTab
            selectedProject={selectedProject}
            onProjectChange={setSelectedProject}
            companyId={companyId}
          />
        )}

        {activeTab === 'comparison' && <ComparisonTab />}

        {activeTab === 'workers' && (
          <WorkersTab selectedProject={selectedProject} companyId={companyId} />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
