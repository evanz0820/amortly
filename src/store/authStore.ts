import { create } from 'zustand';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: localStorage.getItem('amortly_token'),
  user: JSON.parse(localStorage.getItem('amortly_user') || 'null'),

  setAuth: (token, user) => {
    localStorage.setItem('amortly_token', token);
    localStorage.setItem('amortly_user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('amortly_token');
    localStorage.removeItem('amortly_user');
    set({ token: null, user: null });
  },

  isAuthenticated: () => !!get().token,
}));
