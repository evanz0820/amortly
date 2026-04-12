import type { Payment } from '../types';
import './PaymentRow.css';

interface Props {
  payment: Payment;
}

export default function PaymentRow({ payment }: Props) {
  const statusMap: Record<string, { label: string; className: string }> = {
    succeeded: { label: 'Paid', className: 'status--success' },
    pending: { label: 'Pending', className: 'status--warning' },
    failed: { label: 'Failed', className: 'status--danger' },
  };

  const status = statusMap[payment.stripe_status] ?? statusMap.pending;
  const date = payment.paid_at
    ? new Date(payment.paid_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '--';

  const typeLabel =
    payment.payment_type === 'extra'
      ? 'Extra'
      : payment.payment_type === 'partial'
        ? 'Partial'
        : 'Regular';

  return (
    <div className="payment-row">
      <div className="payment-row-left">
        <div className={`payment-icon ${status.className}`}>$</div>
        <div className="payment-info">
          <span className="payment-info-amount">${Number(payment.amount).toFixed(2)}</span>
          <span className="payment-info-date">{date}</span>
        </div>
      </div>
      <div className="payment-row-right">
        <span className="payment-type-badge">{typeLabel}</span>
        <span className={`payment-status ${status.className}`}>{status.label}</span>
      </div>
    </div>
  );
}
