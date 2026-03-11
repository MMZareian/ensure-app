/**
 * Topbar Component - Navigation and user info
 */
import type { UserInfo } from '../types';

type Tab = 'overview' | 'scenarios' | 'comparison' | 'workers';

interface TopbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  user: UserInfo;
  onLogout: () => void;
}

export function Topbar({ activeTab, onTabChange, user, onLogout }: TopbarProps) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'scenarios', label: 'Scenarios' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'workers', label: 'Workers' },
  ];

  // Get initials from full name
  const initials = user.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
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
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="topbar-user">
        <div className="topbar-user-info">
          <div className="topbar-user-name">{user.full_name}</div>
          <div className="topbar-user-role">{user.company_name}</div>
        </div>
        <div className="topbar-user-avatar" title={`Logout (${user.username})`} onClick={onLogout} style={{ cursor: 'pointer' }}>
          {initials}
        </div>
      </div>
    </header>
  );
}
