import type { CreditProfile } from '../types';
import './CreditScoreGauge.css';

interface Props {
  profile: CreditProfile;
}

function getScoreColor(score: number): string {
  if (score >= 750) return '#22C55E';
  if (score >= 670) return '#6C63FF';
  if (score >= 580) return '#F59E0B';
  return '#EF4444';
}

function getScoreLabel(score: number): string {
  if (score >= 750) return 'Excellent';
  if (score >= 670) return 'Good';
  if (score >= 580) return 'Fair';
  return 'Poor';
}

export default function CreditScoreGauge({ profile }: Props) {
  const score = profile.mock_credit_score ?? 650;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const pct = ((score - 300) / 550) * 100;

  const totalPayments = profile.on_time_payments + profile.late_payments + profile.missed_payments;
  const onTimeRate = totalPayments > 0 ? Math.round((profile.on_time_payments / totalPayments) * 100) : 0;

  return (
    <div className="gauge-card">
      <div className="gauge-visual">
        <div className="gauge-ring">
          <svg viewBox="0 0 120 120" className="gauge-svg">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#F0F1F4" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 327} 327`}
              transform="rotate(-90 60 60)"
              className="gauge-progress"
            />
          </svg>
          <div className="gauge-center">
            <div className="gauge-score" style={{ color }}>{score}</div>
            <div className="gauge-label">{label}</div>
          </div>
        </div>
      </div>

      <div className="gauge-stats">
        <div className="gauge-stat">
          <span className="gauge-stat-value gauge-stat--success">{profile.on_time_payments}</span>
          <span className="gauge-stat-label">On-time</span>
        </div>
        <div className="gauge-stat">
          <span className="gauge-stat-value gauge-stat--warning">{profile.late_payments}</span>
          <span className="gauge-stat-label">Late</span>
        </div>
        <div className="gauge-stat">
          <span className="gauge-stat-value gauge-stat--danger">{profile.missed_payments}</span>
          <span className="gauge-stat-label">Missed</span>
        </div>
        <div className="gauge-stat">
          <span className="gauge-stat-value">{onTimeRate}%</span>
          <span className="gauge-stat-label">On-time Rate</span>
        </div>
      </div>

      <div className="gauge-total">
        <span className="gauge-total-label">Total Paid</span>
        <span className="gauge-total-value">${Number(profile.total_paid).toLocaleString()}</span>
      </div>
    </div>
  );
}
