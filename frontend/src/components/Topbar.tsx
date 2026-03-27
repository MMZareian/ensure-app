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

  // Check if user has subscription_tier (for debugging)
  const isPremium = user.subscription_tier === 'premium';
  if (!user.subscription_tier) {
    console.warn('User subscription_tier is missing. User may need to re-login.');
  }

  return (
    <header className="topbar">
      <div className="topbar-logo">
        <img src="/Web_Logo.png" alt="Bridge" className="topbar-logo-image" />
        <div>
          <div className="logo-name">Bridge</div>
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
          <div className="topbar-user-name">
            {isPremium && <span className="premium-badge">⭐ </span>}
            {user.full_name}
            {isPremium && <span className="premium-text">PREMIUM</span>}
          </div>
          <div className="topbar-user-role">{user.company_name}</div>
        </div>
        <div className="topbar-user-avatar" title={`Logout (${user.username})`} onClick={onLogout} style={{ cursor: 'pointer' }}>
          {initials}
        </div>
      </div>
    </header>
  );
}
