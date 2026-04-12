import { create } from 'zustand';
import type { Loan, Payment, CreditProfile, SchedulePeriod } from '../types';

interface LoanStore {
  loans: Loan[];
  payments: Payment[];
  schedule: SchedulePeriod[];
  creditProfile: CreditProfile | null;
  activeLoanId: string | null;
  setLoans: (loans: Loan[]) => void;
  setPayments: (payments: Payment[]) => void;
  setSchedule: (schedule: SchedulePeriod[]) => void;
  setCreditProfile: (profile: CreditProfile) => void;
  setActiveLoanId: (id: string) => void;
}

export const useLoanStore = create<LoanStore>((set) => ({
  loans: [],
  payments: [],
  schedule: [],
  creditProfile: null,
  activeLoanId: null,
  setLoans: (loans) => set({ loans }),
  setPayments: (payments) => set({ payments }),
  setSchedule: (schedule) => set({ schedule }),
  setCreditProfile: (creditProfile) => set({ creditProfile }),
  setActiveLoanId: (activeLoanId) => set({ activeLoanId }),
}));
