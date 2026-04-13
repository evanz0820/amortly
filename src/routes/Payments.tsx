import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoanStore } from '../store/loanStore';
import { useAuthStore } from '../store/authStore';
import { fetchPayments } from '../services/api';
import PaymentRow from '../components/PaymentRow';
import type { StripeStatus } from '../types';
import './Payments.css';

type Filter = 'all' | StripeStatus;

export default function Payments() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { payments, setPayments } = useLoanStore();
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (!user) return;
    fetchPayments(user.id).then(setPayments).catch(() => {});
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const sorted = [...payments].sort(
    (a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime()
  );
  const filtered = filter === 'all' ? sorted : sorted.filter((p) => p.stripe_status === filter);
  const totalPaid = payments
    .filter((p) => p.stripe_status === 'succeeded')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'succeeded', label: 'Succeeded' },
    { key: 'pending', label: 'Pending' },
    { key: 'failed', label: 'Failed' },
  ];

  return (
    <div className="payments-page">
      <div className="payments-header">
        <div>
          <h1 className="payments-title">Payments</h1>
          <p className="payments-subtitle">{payments.length} total transactions</p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate('/payment/checkout')}>
          Make Payment
        </button>
      </div>

      <div className="payments-summary-cards">
        <div className="payments-summary-card">
          <span className="payments-summary-label">Total Paid</span>
          <span className="payments-summary-value">${totalPaid.toLocaleString()}</span>
        </div>
        <div className="payments-summary-card">
          <span className="payments-summary-label">Transactions</span>
          <span className="payments-summary-value">{payments.length}</span>
        </div>
        <div className="payments-summary-card">
          <span className="payments-summary-label">Succeeded</span>
          <span className="payments-summary-value payments-summary--success">
            {payments.filter((p) => p.stripe_status === 'succeeded').length}
          </span>
        </div>
      </div>

      <div className="payments-filters">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`filter-chip ${filter === f.key ? 'filter-chip--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="payments-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">↗</div>
            <h3 className="empty-title">No payments found</h3>
            <p className="empty-text">
              {filter === 'all'
                ? 'Your payment history will appear here after your first payment.'
                : `No ${filter} payments.`}
            </p>
            {filter === 'all' && (
              <button className="btn btn--primary" onClick={() => navigate('/payment/checkout')}>
                Make a Payment
              </button>
            )}
          </div>
        ) : (
          filtered.map((p, i) => (
            <div key={p.id} style={{ animationDelay: `${i * 40}ms` }}>
              <PaymentRow payment={p} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
