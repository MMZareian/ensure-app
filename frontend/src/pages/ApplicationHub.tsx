/**
 * Application Hub - Shows available applications after login
 */
import { useState } from 'react';
import type { UserInfo } from '../types';

interface Application {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: 'active' | 'development';
}

const APPLICATIONS: Application[] = [
  {
    id: '1',
    name: 'Bridge',
    description: 'Safety Analytics Platform',
    logo: '/SafeWheel_Logo.png',
    status: 'active',
  },
  {
    id: '2',
    name: 'Overhead Crane Simulator',
    description: 'Training Simulation',
    logo: '/Crane_Logo.png',
    status: 'development',
  },
  {
    id: '3',
    name: 'SafeTalk',
    description: 'Communication & Collaboration',
    logo: '/SafeTalk_Logo.png',
    status: 'development',
  },
  {
    id: '4',
    name: 'Application 4',
    description: 'Coming Soon',
    logo: '/InDevelopment_Logo.png',
    status: 'development',
  },
  {
    id: '5',
    name: 'Application 5',
    description: 'Coming Soon',
    logo: '/InDevelopment_Logo.png',
    status: 'development',
  },
  {
    id: '6',
    name: 'Application 6',
    description: 'Coming Soon',
    logo: '/InDevelopment_Logo.png',
    status: 'development',
  },
];

interface ApplicationHubProps {
  user: UserInfo;
  onSelectApp: (appId: string) => void;
  onLogout: () => void;
}

export function ApplicationHub({ user, onSelectApp, onLogout }: ApplicationHubProps) {
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [showUnderDev, setShowUnderDev] = useState(false);
  const [selectedAppName, setSelectedAppName] = useState('');

  // Parse user's app access from JSON string
  const userAccess: string[] = user.app_access ? JSON.parse(user.app_access) : ['1'];

  const handleAppClick = (app: Application) => {
    // Check if user has access
    if (!userAccess.includes(app.id)) {
      setSelectedAppName(app.name);
      setShowAccessDenied(true);
      return;
    }

    // Check if app is under development
    if (app.status === 'development') {
      setSelectedAppName(app.name);
      setShowUnderDev(true);
      return;
    }

    // App is accessible and active
    onSelectApp(app.id);
  };

  return (
    <div className="app-hub-container">
      {/* Header */}
      <div className="app-hub-header">
        <div className="app-hub-logo">
          <img src="/Web_Logo.png" alt="Bridge Logo" className="hub-logo-image" />
          <div>
            <h1 className="hub-title">Bridge Platform</h1>
            <p className="hub-subtitle">Select an application to continue</p>
          </div>
        </div>

        <div className="app-hub-user">
          <div className="user-info">
            <div className="user-name">{user.full_name}</div>
            <div className="user-role">
              {user.role === 'super_admin' ? 'System Administrator' : user.company_name}
            </div>
          </div>
          <button onClick={onLogout} className="hub-logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Application Grid */}
      <div className="app-hub-content">
        <div className="app-grid">
          {APPLICATIONS.map((app) => {
            const hasAccess = userAccess.includes(app.id);
            const isActive = app.status === 'active';

            return (
              <div
                key={app.id}
                className={`app-card ${!hasAccess ? 'app-card-locked' : ''} ${
                  !isActive ? 'app-card-dev' : ''
                }`}
                onClick={() => handleAppClick(app)}
              >
                <div className="app-card-logo">
                  <img src={app.logo} alt={app.name} />
                </div>
                <h3 className={`app-card-title ${app.id === '2' ? 'crane-title' : ''}`}>
                  {app.name}
                </h3>
                <p className="app-card-description">{app.description}</p>

                {!hasAccess && (
                  <div className="app-card-badge locked-badge">
                    🔒 No Access
                  </div>
                )}

                {hasAccess && !isActive && (
                  <div className="app-card-badge dev-badge">
                    🚧 In Development
                  </div>
                )}

                {hasAccess && isActive && (
                  <div className="app-card-badge active-badge">
                    ✓ Active
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Access Denied Modal */}
      {showAccessDenied && (
        <div className="modal-overlay" onClick={() => setShowAccessDenied(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon error-icon">🔒</div>
            <h2 className="modal-title">Access Denied</h2>
            <p className="modal-message">
              You do not have permission to access <strong>{selectedAppName}</strong>.
            </p>
            <p className="modal-submessage">
              Please contact your system administrator to request access.
            </p>
            <button className="modal-btn" onClick={() => setShowAccessDenied(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Under Development Modal */}
      {showUnderDev && (
        <div className="modal-overlay" onClick={() => setShowUnderDev(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon dev-icon">🚧</div>
            <h2 className="modal-title">Under Development</h2>
            <p className="modal-message">
              <strong>{selectedAppName}</strong> is currently under development.
            </p>
            <p className="modal-submessage">
              This application will be available soon. Stay tuned!
            </p>
            <button className="modal-btn" onClick={() => setShowUnderDev(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
