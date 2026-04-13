import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import TabLayout from './components/TabLayout';
import Landing from './routes/Landing';
import Dashboard from './routes/Dashboard';
import Loans from './routes/Loans';
import Payments from './routes/Payments';
import Profile from './routes/Profile';
import LoanDetail from './routes/LoanDetail';
import NewLoan from './routes/NewLoan';
import Checkout from './routes/Checkout';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';

function RequireAccess({ children }: { children: React.ReactNode }) {
  const { token, demoMode } = useAuthStore();
  if (!token && !demoMode) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const { token, demoMode } = useAuthStore();
  if (token || demoMode) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RedirectIfAuth><Landing /></RedirectIfAuth>} />
      <Route path="/signin" element={<RedirectIfAuth><SignIn /></RedirectIfAuth>} />
      <Route path="/signup" element={<RedirectIfAuth><SignUp /></RedirectIfAuth>} />

      <Route element={<RequireAccess><TabLayout /></RequireAccess>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/loan/new" element={<NewLoan />} />
        <Route path="/loan/:id" element={<LoanDetail />} />
        <Route path="/payment/checkout" element={<Checkout />} />
      </Route>
    </Routes>
  );
}
