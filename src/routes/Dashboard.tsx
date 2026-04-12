import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoanStore } from '../store/loanStore';
import { fetchLoans, fetchCreditProfile } from '../services/api';
import LoanCard from '../components/LoanCard';
import './Dashboard.css';

const MOCK_USER_ID = '323ba38f-ae2c-4a01-9cf7-5642c87686be';

export default function Dashboard() {
  const navigate = useNavigate();
  const { loans, creditProfile, setLoans, setCreditProfile } = useLoanStore();

  useEffect(() => {
    fetchLoans(MOCK_USER_ID).then(setLoans).catch(() => {});
    fetchCreditProfile(MOCK_USER_ID).then(setCreditProfile).catch(() => {});
  }, [setLoans, setCreditProfile]);

  const activeLoans = loans.filter((l) => l.status === 'active');
  const totalBalance = activeLoans.reduce((sum, l) => sum + Number(l.principal), 0);
  const nextDue = activeLoans[0];

  return (
    <div className="dashboard">
      <div className="dashboard-greeting">
        <h1 className="dashboard-title">Dashboard</h1>
        <button className="btn btn--primary" onClick={() => navigate('/loan/new')}>
          + New Loan
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card stat-card--hero">
          <div className="stat-card-inner">
            <span className="stat-label">Total Outstanding</span>
            <span className="stat-value stat-value--large">${totalBalance.toLocaleString()}</span>
          </div>
          <div className="stat-card-accent" />
        </div>

        <div className="stat-card">
          <span className="stat-label">Active Loans</span>
          <span className="stat-value">{activeLoans.length}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Credit Score</span>
          <span className="stat-value stat-value--score">
            {creditProfile?.mock_credit_score ?? '--'}
          </span>
        </div>
      </div>

      {nextDue && (
        <div className="dashboard-quickpay">
          <div className="quickpay-info">
            <span className="quickpay-label">Next payment due</span>
            <span className="quickpay-loan">${Number(nextDue.principal).toLocaleString()} loan</span>
          </div>
          <button className="btn btn--primary btn--glow" onClick={() => navigate(`/loan/${nextDue.id}`)}>
            Quick Pay →
          </button>
        </div>
      )}

      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Active Loans</h2>
          <button className="btn btn--ghost" onClick={() => navigate('/loans')}>
            View All →
          </button>
        </div>

        {activeLoans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◈</div>
            <h3 className="empty-title">No active loans</h3>
            <p className="empty-text">Simulate your first loan to get started.</p>
            <button className="btn btn--primary" onClick={() => navigate('/loan/new')}>
              + Simulate New Loan
            </button>
          </div>
        ) : (
          activeLoans.map((loan, i) => (
            <div key={loan.id} style={{ animationDelay: `${i * 60}ms` }}>
              <LoanCard loan={loan} onClick={() => navigate(`/loan/${loan.id}`)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
