import type { Loan } from '../types';
import './LoanCard.css';

interface Props {
  loan: Loan;
  onClick: () => void;
}

export default function LoanCard({ loan, onClick }: Props) {
  const monthlyRate = loan.annual_interest_rate;
  const rateDisplay = (monthlyRate * 100).toFixed(2);

  return (
    <div className="loan-card" onClick={onClick}>
      <div className="loan-card-header">
        <div className="loan-card-amount">${loan.principal.toLocaleString()}</div>
        <span className={`loan-badge loan-badge--${loan.status}`}>
          {loan.status === 'active' ? 'Active' : loan.status === 'paid_off' ? 'Paid Off' : 'Defaulted'}
        </span>
      </div>
      <div className="loan-card-details">
        <div className="loan-detail">
          <span className="loan-detail-label">Rate</span>
          <span className="loan-detail-value">{rateDisplay}%</span>
        </div>
        <div className="loan-detail-divider" />
        <div className="loan-detail">
          <span className="loan-detail-label">Term</span>
          <span className="loan-detail-value">{loan.term_months}mo</span>
        </div>
        <div className="loan-detail-divider" />
        <div className="loan-detail">
          <span className="loan-detail-label">Started</span>
          <span className="loan-detail-value">
            {new Date(loan.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
      <div className="loan-card-footer">
        <span className="loan-card-view">View Details →</span>
      </div>
    </div>
  );
}
