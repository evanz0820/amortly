import { NavLink, Outlet } from 'react-router-dom';
import './TabLayout.css';

const tabs = [
  { to: '/dashboard', label: 'Dashboard', icon: '◎' },
  { to: '/loans', label: 'Loans', icon: '◈' },
  { to: '/payments', label: 'Payments', icon: '↗' },
  { to: '/profile', label: 'Profile', icon: '◉' },
];

export default function TabLayout() {

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
          <div className="sidebar-footer-text">Amortly v1.0</div>
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
