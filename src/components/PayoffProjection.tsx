import type { SchedulePeriod } from '../types';
import './PayoffProjection.css';

interface Props {
  schedule: SchedulePeriod[];
}

export default function PayoffProjection({ schedule }: Props) {
  if (!schedule.length) return null;

  const paid = schedule.filter((s) => s.status === 'paid');
  const pending = schedule.filter((s) => s.status === 'pending');
  const totalPayments = schedule.length;
  const progressPct = totalPayments > 0 ? (paid.length / totalPayments) * 100 : 0;
  const totalInterest = schedule.reduce((sum, s) => sum + Number(s.interest_portion), 0);
  const totalPrincipal = schedule.reduce((sum, s) => sum + Number(s.principal_portion), 0);
  const lastPeriod = schedule[schedule.length - 1];
  const payoffDate = lastPeriod
    ? new Date(lastPeriod.due_date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '--';

  return (
    <div className="projection-card">
      <h3 className="projection-title">Payoff Projection</h3>

      <div className="projection-progress-section">
        <div className="projection-progress-labels">
          <span className="projection-progress-text">{paid.length} of {totalPayments} payments made</span>
          <span className="projection-progress-pct">{Math.round(progressPct)}%</span>
        </div>
        <div className="projection-bar">
          <div className="projection-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="projection-metrics">
        <div className="projection-metric">
          <span className="projection-metric-label">Remaining Payments</span>
          <span className="projection-metric-value">{pending.length}</span>
        </div>
        <div className="projection-metric">
          <span className="projection-metric-label">Total Interest</span>
          <span className="projection-metric-value">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="projection-metric">
          <span className="projection-metric-label">Total Principal</span>
          <span className="projection-metric-value">${totalPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="projection-metric">
          <span className="projection-metric-label">Payoff Date</span>
          <span className="projection-metric-value projection-metric--highlight">{payoffDate}</span>
        </div>
      </div>
    </div>
  );
}
