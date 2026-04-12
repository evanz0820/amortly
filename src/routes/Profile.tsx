import { useEffect } from 'react';
import { useLoanStore } from '../store/loanStore';
import { fetchCreditProfile, fetchPayments } from '../services/api';
import CreditScoreGauge from '../components/CreditScoreGauge';
import PaymentRow from '../components/PaymentRow';
import './Profile.css';

const MOCK_USER_ID = '323ba38f-ae2c-4a01-9cf7-5642c87686be';

export default function Profile() {
  const { creditProfile, setCreditProfile, payments, setPayments } = useLoanStore();

  useEffect(() => {
    fetchCreditProfile(MOCK_USER_ID).then(setCreditProfile).catch(() => {});
    fetchPayments(MOCK_USER_ID).then(setPayments).catch(() => {});
  }, [setCreditProfile, setPayments]);

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime())
    .slice(0, 5);

  return (
    <div className="profile-page">
      <h1 className="profile-title">Credit Profile</h1>
      <p className="profile-subtitle">Track your mock credit score based on payment behavior.</p>

      <div className="profile-grid">
        <div className="profile-main">
          {creditProfile ? (
            <CreditScoreGauge profile={creditProfile} />
          ) : (
            <div className="profile-loading">
              <div className="loading-shimmer" style={{ height: 400 }} />
            </div>
          )}
        </div>

        <div className="profile-aside">
          <div className="profile-info-card">
            <h3 className="profile-info-title">How Your Score Works</h3>
            <div className="profile-info-items">
              <div className="profile-info-item">
                <span className="profile-info-bullet" style={{ background: 'var(--success)' }} />
                <div>
                  <strong>On-time payments</strong>
                  <p>Increase your score the most. Consistency is key.</p>
                </div>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-bullet" style={{ background: 'var(--warning)' }} />
                <div>
                  <strong>Late payments</strong>
                  <p>Slow your progress and signal risk to lenders.</p>
                </div>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-bullet" style={{ background: 'var(--danger)' }} />
                <div>
                  <strong>Missed payments</strong>
                  <p>Have the biggest negative impact. Avoid at all costs.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-ranges">
            <h3 className="profile-info-title">Score Ranges</h3>
            <div className="range-items">
              <div className="range-item">
                <span className="range-bar" style={{ background: '#22C55E' }} />
                <span className="range-label">750–850</span>
                <span className="range-name">Excellent</span>
              </div>
              <div className="range-item">
                <span className="range-bar" style={{ background: '#6C63FF' }} />
                <span className="range-label">670–749</span>
                <span className="range-name">Good</span>
              </div>
              <div className="range-item">
                <span className="range-bar" style={{ background: '#F59E0B' }} />
                <span className="range-label">580–669</span>
                <span className="range-name">Fair</span>
              </div>
              <div className="range-item">
                <span className="range-bar" style={{ background: '#EF4444' }} />
                <span className="range-label">300–579</span>
                <span className="range-name">Poor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {recentPayments.length > 0 && (
        <div className="profile-recent">
          <h2 className="section-title">Recent Payments</h2>
          {recentPayments.map((p) => (
            <PaymentRow key={p.id} payment={p} />
          ))}
        </div>
      )}
    </div>
  );
}
