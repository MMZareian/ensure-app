/**
 * Main Application Component with Authentication
 */
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { ApplicationHub } from './pages/ApplicationHub';
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
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  // CRITICAL: Reset all state when user changes (logout/new login)
  // This prevents data leakage between users on the same browser
  useEffect(() => {
    if (!isAuthenticated) {
      // User logged out - reset everything
      setActiveTab('overview');
      setSelectedProject('p1');
      setSelectedApp(null);
    }
  }, [isAuthenticated, user?.manager_id]);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={login} />;
  }

  // Show application hub if no app selected
  if (!selectedApp) {
    return (
      <ApplicationHub
        user={user!}
        onSelectApp={setSelectedApp}
        onLogout={logout}
      />
    );
  }

  // Main dashboard for App 1 (Ensure)
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
