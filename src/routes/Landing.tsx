import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { enterDemo } = useAuthStore();

  const handleDemo = () => {
    enterDemo();
    navigate('/dashboard');
  };

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <div className="landing-brand-icon">A</div>
          <span className="landing-brand-name">Amortly</span>
        </div>
        <div className="landing-nav-actions">
          <button className="landing-btn landing-btn--ghost" onClick={() => navigate('/signin')}>
            Sign In
          </button>
          <button className="landing-btn landing-btn--primary" onClick={() => navigate('/signup')}>
            Get Started
          </button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-badge">Loan Management Made Simple</div>
          <h1 className="landing-headline">
            Take control of your
            <span className="landing-headline-accent"> loan repayments</span>
          </h1>
          <p className="landing-subheadline">
            Simulate loans, visualize amortization schedules, make real payments with Stripe,
            and track your credit score — all in one place.
          </p>
          <div className="landing-cta-group">
            <button className="landing-btn landing-btn--primary landing-btn--large" onClick={handleDemo}>
              Try the Demo
            </button>
            <button className="landing-btn landing-btn--outline landing-btn--large" onClick={() => navigate('/signup')}>
              Create Free Account
            </button>
          </div>
          <p className="landing-cta-note">No credit card required. Demo works instantly.</p>
        </div>

        <div className="landing-hero-visual">
          <div className="landing-card landing-card--1">
            <div className="landing-card-label">Total Outstanding</div>
            <div className="landing-card-value">$24,500</div>
            <div className="landing-card-sub">3 active loans</div>
          </div>
          <div className="landing-card landing-card--2">
            <div className="landing-card-label">Credit Score</div>
            <div className="landing-card-score">742</div>
            <div className="landing-card-badge">Good</div>
          </div>
          <div className="landing-card landing-card--3">
            <div className="landing-card-label">Next Payment</div>
            <div className="landing-card-value">$487.50</div>
            <div className="landing-card-sub">Due May 15</div>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <h2 className="landing-section-title">Everything you need</h2>
        <p className="landing-section-subtitle">Powerful tools to understand and manage your loans.</p>
        <div className="landing-features-grid">
          <div className="landing-feature">
            <div className="landing-feature-icon">◈</div>
            <h3>Loan Simulator</h3>
            <p>Create loan scenarios with custom principal, rate, and term. See your monthly payment instantly.</p>
          </div>
          <div className="landing-feature">
            <div className="landing-feature-icon">◎</div>
            <h3>Amortization Charts</h3>
            <p>Visualize how your balance decreases over time with interactive charts and full schedule tables.</p>
          </div>
          <div className="landing-feature">
            <div className="landing-feature-icon">↗</div>
            <h3>Real Payments</h3>
            <p>Make actual payments via Stripe. Track every transaction with detailed payment history.</p>
          </div>
          <div className="landing-feature">
            <div className="landing-feature-icon">◉</div>
            <h3>Credit Tracking</h3>
            <p>Watch your mock credit score change based on payment behavior. On-time payments boost your score.</p>
          </div>
        </div>
      </section>

      <section className="landing-cta-section">
        <div className="landing-cta-card">
          <h2>Ready to take control?</h2>
          <p>Start simulating loans and tracking your payments today.</p>
          <div className="landing-cta-group">
            <button className="landing-btn landing-btn--white landing-btn--large" onClick={handleDemo}>
              Try the Demo
            </button>
            <button className="landing-btn landing-btn--outline-white landing-btn--large" onClick={() => navigate('/signup')}>
              Sign Up Free
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <span>Amortly</span>
        <span>Built with React, FastAPI, and Stripe</span>
      </footer>
    </div>
  );
}
