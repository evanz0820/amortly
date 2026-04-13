import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLoan } from '../services/api';
import { useLoanStore } from '../store/loanStore';
import { useAuthStore } from '../store/authStore';
import './NewLoan.css';

export default function NewLoan() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { loans, setLoans } = useLoanStore();
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [termMonths, setTermMonths] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const p = parseFloat(principal) || 0;
  const r = parseFloat(rate) || 0;
  const t = parseInt(termMonths, 10) || 0;

  // Live monthly payment preview
  const monthlyPayment = (() => {
    if (p <= 0 || r <= 0 || t <= 0) return 0;
    const mr = r / 100 / 12;
    return (p * mr) / (1 - Math.pow(1 + mr, -t));
  })();

  const totalCost = monthlyPayment * t;
  const totalInterest = totalCost - p;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (p <= 0 || r <= 0 || t <= 0) {
      setError('Please fill in all fields with valid values.');
      return;
    }

    setLoading(true);
    try {
      const loan = await createLoan({
        user_id: user!.id,
        principal: p,
        annual_interest_rate: r / 100,
        term_months: t,
        start_date: startDate,
      });
      setLoans([...loans, loan]);
      navigate('/dashboard');
    } catch {
      setError('Failed to create loan. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-loan-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="new-loan-layout">
        <div className="new-loan-form-card">
          <h1 className="new-loan-title">Simulate New Loan</h1>
          <p className="new-loan-subtitle">Set up loan parameters and see your amortization schedule.</p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="new-loan-form">
            <div className="form-group">
              <label className="form-label">Principal Amount</label>
              <div className="input-wrapper">
                <span className="input-prefix">$</span>
                <input
                  className="form-input form-input--prefixed"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="25,000"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Annual Rate</label>
                <div className="input-wrapper">
                  <input
                    className="form-input form-input--suffixed"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="5.5"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Term</label>
                <div className="input-wrapper">
                  <input
                    className="form-input form-input--suffixed"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="60"
                    value={termMonths}
                    onChange={(e) => setTermMonths(e.target.value)}
                  />
                  <span className="input-suffix">mo</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                className="form-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn--outline" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn--primary btn--large" disabled={loading}>
                {loading ? 'Creating...' : 'Create Loan'}
              </button>
            </div>
          </form>
        </div>

        <div className="new-loan-preview">
          <div className="preview-card">
            <h3 className="preview-title">Payment Preview</h3>
            {monthlyPayment > 0 ? (
              <>
                <div className="preview-hero">
                  <span className="preview-hero-label">Monthly Payment</span>
                  <span className="preview-hero-value">${monthlyPayment.toFixed(2)}</span>
                </div>
                <div className="preview-details">
                  <div className="preview-row">
                    <span>Total Cost</span>
                    <span className="preview-row-value">${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="preview-row">
                    <span>Total Interest</span>
                    <span className="preview-row-value">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="preview-row">
                    <span>Interest/Principal</span>
                    <span className="preview-row-value">{p > 0 ? ((totalInterest / p) * 100).toFixed(1) : 0}%</span>
                  </div>
                </div>
                <div className="preview-bar-section">
                  <div className="preview-bar-labels">
                    <span>Principal</span>
                    <span>Interest</span>
                  </div>
                  <div className="preview-bar">
                    <div
                      className="preview-bar-principal"
                      style={{ width: `${totalCost > 0 ? (p / totalCost) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="preview-empty">
                Enter loan details to see a payment preview.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
