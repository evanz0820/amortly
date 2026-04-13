import axios from 'axios';
import type { Loan, Payment, CreditProfile, SchedulePeriod } from '../types';

const BASE_URL = 'https://amortly-api.fly.dev';

const api = axios.create({ baseURL: BASE_URL });

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('amortly_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const signUp = async (payload: {
  email: string;
  password: string;
  name: string;
}): Promise<{ token: string; user: { id: string; email: string; name: string } }> => {
  const res = await api.post('/auth/signup', payload);
  return res.data;
};

export const signIn = async (payload: {
  email: string;
  password: string;
}): Promise<{ token: string; user: { id: string; email: string; name: string } }> => {
  const res = await api.post('/auth/signin', payload);
  return res.data;
};

export const fetchMe = async (): Promise<{ id: string; email: string; name: string }> => {
  const res = await api.get('/auth/me');
  return res.data;
};

// Loans
export const fetchLoans = async (userId: string): Promise<Loan[]> => {
  const res = await api.get(`/loans?user_id=${userId}`);
  return res.data;
};

export const createLoan = async (payload: {
  user_id: string;
  principal: number;
  annual_interest_rate: number;
  term_months: number;
  start_date: string;
}): Promise<Loan> => {
  const res = await api.post('/loans/', payload);
  return res.data;
};

export const fetchSchedule = async (loanId: string): Promise<SchedulePeriod[]> => {
  const res = await api.get(`/loans/${loanId}/schedule`);
  return res.data;
};

// Payments
export const fetchPayments = async (userId: string): Promise<Payment[]> => {
  const res = await api.get(`/payments?user_id=${userId}`);
  return res.data;
};

export const fetchCreditProfile = async (userId: string): Promise<CreditProfile> => {
  const res = await api.get(`/credit-profile/${userId}`);
  return res.data;
};

export const createPaymentIntent = async (payload: {
  loan_id: string;
  schedule_id: string;
  user_id: string;
  amount: number;
  payment_type: string;
}): Promise<{ client_secret: string }> => {
  const res = await api.post('/payments/intent', payload);
  return res.data;
};
