import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoanStore } from '../store/loanStore';
import { useAuthStore } from '../store/authStore';
import { fetchLoans, fetchSchedule } from '../services/api';
import AmortizationChart from '../components/AmortizationChart';
import PayoffProjection from '../components/PayoffProjection';
import type { SchedulePeriod } from '../types';
import './LoanDetail.css';

export default function LoanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { loans, setLoans, setActiveLoanId, setSchedule: setStoreSchedule } = useLoanStore();
  const [schedule, setSchedule] = useState<SchedulePeriod[]>([]);
  const [loading, setLoading] = useState(true);

  const loan = loans.find((l) => l.id === id);

  useEffect(() => {
    if (user) {
      fetchLoans(user.id).then(setLoans).catch(() => {});
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!id) return;
    setActiveLoanId(id);
    setLoading(true);
    fetchSchedule(id)
      .then((data) => {
        setSchedule(data);
        setStoreSchedule(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!loan && !loading) {
    return (
      <div className="loan-detail-page">
        <div className="empty-state">
          <div className="empty-icon">?</div>
          <h3 className="empty-title">Loan not found</h3>
          <p className="empty-text">This loan may have been removed or doesn't exist.</p>
          <button className="btn btn--primary" onClick={() => navigate('/loans')}>
            View All Loans
          </button>
        </div>
      </div>
    );
  }

  if (loading || !loan) {
    return (
      <div className="loan-detail-page">
        <div className="detail-loading">
          <div className="loading-shimmer" style={{ height: 200, borderRadius: 16 }} />
          <div className="loading-shimmer" style={{ height: 300, borderRadius: 16, marginTop: 16 }} />
        </div>
      </div>
    );
  }

  const monthlyPayment = schedule.length > 0 ? Number(schedule[0].scheduled_payment) : 0;
  const totalInterest = schedule.reduce((s, p) => s + Number(p.interest_portion), 0);
  const nextPending = schedule.find((s) => s.status === 'pending');

  return (
    <div className="loan-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-hero">
        <div className="detail-hero-left">
          <div className="detail-hero-label">Loan Principal</div>
          <div className="detail-hero-amount">${Number(loan.principal).toLocaleString()}</div>
          <span className={`loan-badge loan-badge--${loan.status}`}>
            {loan.status === 'active' ? 'Active' : loan.status === 'paid_off' ? 'Paid Off' : 'Defaulted'}
          </span>
        </div>
        {nextPending && loan.status === 'active' && (
          <button
            className="btn btn--primary btn--large btn--glow"
            onClick={() => navigate('/payment/checkout')}
          >
            Pay ${Number(nextPending.scheduled_payment).toFixed(2)} →
          </button>
        )}
      </div>

      <div className="detail-metrics">
        <div className="detail-metric">
          <span className="detail-metric-label">Monthly Payment</span>
          <span className="detail-metric-value">${monthlyPayment.toFixed(2)}</span>
        </div>
        <div className="detail-metric">
          <span className="detail-metric-label">Interest Rate</span>
          <span className="detail-metric-value">{(Number(loan.annual_interest_rate) * 100).toFixed(2)}%</span>
        </div>
        <div className="detail-metric">
          <span className="detail-metric-label">Total Interest</span>
          <span className="detail-metric-value">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="detail-metric">
          <span className="detail-metric-label">Term</span>
          <span className="detail-metric-value">{loan.term_months} months</span>
        </div>
      </div>

      <div className="detail-content">
        {schedule.length > 0 && <AmortizationChart schedule={schedule} />}
        {schedule.length > 0 && <PayoffProjection schedule={schedule} />}
      </div>

      {schedule.length > 0 && (
        <div className="detail-schedule">
          <h2 className="section-title">Payment Schedule</h2>
          <div className="schedule-table-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Due Date</th>
                  <th>Payment</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((s) => (
                  <tr key={s.id} className={s.status === 'paid' ? 'row-paid' : ''}>
                    <td>{s.period}</td>
                    <td>{new Date(s.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>${Number(s.scheduled_payment).toFixed(2)}</td>
                    <td>${Number(s.principal_portion).toFixed(2)}</td>
                    <td>${Number(s.interest_portion).toFixed(2)}</td>
                    <td>${Number(s.remaining_balance).toFixed(2)}</td>
                    <td>
                      <span className={`schedule-status schedule-status--${s.status}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
