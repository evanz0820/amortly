import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoanStore } from '../store/loanStore';
import { useAuthStore } from '../store/authStore';
import { fetchLoans } from '../services/api';
import LoanCard from '../components/LoanCard';
import type { LoanStatus } from '../types';
import './Loans.css';

type Filter = 'all' | LoanStatus;

export default function Loans() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { loans, setLoans } = useLoanStore();
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (!user) return;
    fetchLoans(user.id).then(setLoans).catch(() => {});
  }, [user, setLoans]);

  const filtered = filter === 'all' ? loans : loans.filter((l) => l.status === filter);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'paid_off', label: 'Paid Off' },
    { key: 'defaulted', label: 'Defaulted' },
  ];

  return (
    <div className="loans-page">
      <div className="loans-header">
        <h1 className="loans-title">Loans</h1>
        <button className="btn btn--primary" onClick={() => navigate('/loan/new')}>
          + New Loan
        </button>
      </div>

      <div className="loans-filters">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`filter-chip ${filter === f.key ? 'filter-chip--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            {f.key !== 'all' && (
              <span className="filter-count">
                {loans.filter((l) => l.status === f.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="loans-summary">
        <span className="loans-summary-text">
          {filtered.length} loan{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◈</div>
          <h3 className="empty-title">No loans found</h3>
          <p className="empty-text">
            {filter === 'all'
              ? 'Create your first loan simulation to get started.'
              : `No ${filter.replace('_', ' ')} loans.`}
          </p>
          {filter === 'all' && (
            <button className="btn btn--primary" onClick={() => navigate('/loan/new')}>
              + Simulate New Loan
            </button>
          )}
        </div>
      ) : (
        <div className="loans-list">
          {filtered.map((loan, i) => (
            <div key={loan.id} style={{ animationDelay: `${i * 50}ms` }}>
              <LoanCard loan={loan} onClick={() => navigate(`/loan/${loan.id}`)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
