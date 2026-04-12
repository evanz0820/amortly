import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { createPaymentIntent } from '../services/api';
import { useLoanStore } from '../store/loanStore';
import { stripePromise } from '../services/stripe';
import './Checkout.css';

const MOCK_USER_ID = '323ba38f-ae2c-4a01-9cf7-5642c87686be';

function CheckoutForm({ amount, dueDate }: { amount: number; dueDate: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/dashboard' },
    });
    setLoading(false);
    if (error) {
      alert(`Payment failed: ${error.message}`);
    } else {
      alert('Payment successful. Your payment has been recorded.');
      navigate(-1);
    }
  };

  return (
    <div className="checkout-form">
      <div className="checkout-amount-section">
        <span className="checkout-amount-label">Amount Due</span>
        <span className="checkout-amount">${amount.toFixed(2)}</span>
        <span className="checkout-due">Due {new Date(dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>

      <div className="checkout-stripe-element">
        <PaymentElement />
      </div>

      <button
        className="btn btn--primary btn--large btn--full"
        onClick={handlePay}
        disabled={loading || !stripe}
      >
        {loading ? (
          <span className="btn-loading">Processing...</span>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>

      <div className="checkout-secure">
        Secured by Stripe. Your payment info is encrypted.
      </div>
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { activeLoanId, schedule } = useLoanStore();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const nextPending = schedule.find((s) => s.status === 'pending');

  useEffect(() => {
    if (!activeLoanId || !nextPending) return;
    createPaymentIntent({
      loan_id: activeLoanId,
      schedule_id: nextPending.id,
      user_id: MOCK_USER_ID,
      amount: nextPending.scheduled_payment,
      payment_type: 'regular',
    }).then((res) => setClientSecret(res.client_secret));
  }, [activeLoanId, nextPending?.id]);

  return (
    <div className="checkout-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="checkout-layout">
        <div className="checkout-card">
          <h1 className="checkout-title">Make a Payment</h1>

          {!nextPending ? (
            <div className="checkout-empty">
              <div className="empty-icon">✓</div>
              <h3>All caught up!</h3>
              <p>No payments due right now.</p>
              <button className="btn btn--outline" onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </button>
            </div>
          ) : !clientSecret ? (
            <div className="checkout-loading">
              <div className="loading-shimmer" style={{ height: 300, borderRadius: 12 }} />
            </div>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm amount={nextPending.scheduled_payment} dueDate={nextPending.due_date} />
            </Elements>
          )}
        </div>

        <div className="checkout-sidebar">
          <div className="checkout-summary-card">
            <h3 className="checkout-summary-title">Payment Summary</h3>
            {nextPending && (
              <div className="checkout-summary-rows">
                <div className="checkout-summary-row">
                  <span>Payment #</span>
                  <span>{schedule.indexOf(nextPending) + 1} of {schedule.length}</span>
                </div>
                <div className="checkout-summary-row">
                  <span>Principal</span>
                  <span>${Number(nextPending.principal_portion).toFixed(2)}</span>
                </div>
                <div className="checkout-summary-row">
                  <span>Interest</span>
                  <span>${Number(nextPending.interest_portion).toFixed(2)}</span>
                </div>
                <div className="checkout-summary-row checkout-summary-row--total">
                  <span>Total</span>
                  <span>${Number(nextPending.scheduled_payment).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
