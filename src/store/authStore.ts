import { create } from 'zustand';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  token: string | null;
  user: AuthUser | null;
  demoMode: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  enterDemo: () => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const DEMO_USER: AuthUser = {
  id: 'demo-user-00000000-0000-0000-0000-000000000000',
  email: 'demo@amortly.app',
  name: 'Demo User',
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: localStorage.getItem('amortly_token'),
  user: JSON.parse(localStorage.getItem('amortly_user') || 'null'),
  demoMode: localStorage.getItem('amortly_demo') === 'true',

  setAuth: (token, user) => {
    localStorage.setItem('amortly_token', token);
    localStorage.setItem('amortly_user', JSON.stringify(user));
    localStorage.removeItem('amortly_demo');
    set({ token, user, demoMode: false });
  },

  enterDemo: () => {
    localStorage.setItem('amortly_demo', 'true');
    localStorage.setItem('amortly_user', JSON.stringify(DEMO_USER));
    localStorage.removeItem('amortly_token');
    set({ token: null, user: DEMO_USER, demoMode: true });
  },

  logout: () => {
    localStorage.removeItem('amortly_token');
    localStorage.removeItem('amortly_user');
    localStorage.removeItem('amortly_demo');
    set({ token: null, user: null, demoMode: false });
  },

  isAuthenticated: () => !!get().token || get().demoMode,
}));
