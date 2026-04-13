import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './TabLayout.css';

const tabs = [
  { to: '/dashboard', label: 'Dashboard', icon: '◎' },
  { to: '/loans', label: 'Loans', icon: '◈' },
  { to: '/payments', label: 'Payments', icon: '↗' },
  { to: '/profile', label: 'Profile', icon: '◉' },
];

export default function TabLayout() {
  const navigate = useNavigate();
  const { user, demoMode, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">A</div>
          <span className="brand-name">Amortly</span>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item--active' : ''}`
              }
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user.name}</span>
                <span className="sidebar-user-email">
                  {demoMode ? 'Demo Mode' : user.email}
                </span>
              </div>
            </div>
          )}
          {demoMode && (
            <button
              className="sidebar-signin-btn"
              onClick={() => { logout(); navigate('/signup'); }}
            >
              Create Account
            </button>
          )}
          <button className="sidebar-logout" onClick={handleLogout}>
            {demoMode ? 'Exit Demo' : 'Sign Out'}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
