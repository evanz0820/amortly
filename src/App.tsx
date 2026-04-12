import { Routes, Route, Navigate } from 'react-router-dom';
import TabLayout from './components/TabLayout';
import Dashboard from './routes/Dashboard';
import Loans from './routes/Loans';
import Payments from './routes/Payments';
import Profile from './routes/Profile';
import LoanDetail from './routes/LoanDetail';
import NewLoan from './routes/NewLoan';
import Checkout from './routes/Checkout';

export default function App() {
  return (
    <Routes>
      <Route element={<TabLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
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
