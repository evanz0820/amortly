export type LoanStatus = 'active' | 'paid_off' | 'defaulted';
export type PaymentType = 'regular' | 'extra' | 'partial';
export type ScheduleStatus = 'pending' | 'paid' | 'late' | 'skipped';
export type StripeStatus = 'succeeded' | 'pending' | 'failed';

export interface User {
  id: string;
  email: string;
  name: string;
  stripe_customer_id: string;
}

export interface Loan {
  id: string;
  user_id: string;
  principal: number;
  annual_interest_rate: number;
  term_months: number;
  start_date: string;
  status: LoanStatus;
  created_at: string;
}

export interface SchedulePeriod {
  id: string;
  loan_id: string;
  period: number;
  due_date: string;
  scheduled_payment: number;
  principal_portion: number;
  interest_portion: number;
  remaining_balance: number;
  status: ScheduleStatus;
}

export interface Payment {
  id: string;
  loan_id: string;
  schedule_id: string;
  user_id: string;
  amount: number;
  payment_type: PaymentType;
  stripe_payment_intent_id: string;
  stripe_status: StripeStatus;
  paid_at: string;
}

export interface CreditProfile {
  id: string;
  user_id: string;
  on_time_payments: number;
  late_payments: number;
  missed_payments: number;
  total_paid: number;
  mock_credit_score: number;
  last_updated: string;
}
