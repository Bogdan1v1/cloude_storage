import { create } from 'zustand';
import { authApi } from './api/auth';

interface User {
  id: number;
  email: string;
  fullName: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token') || null,
  user: null,

  setToken: (token: string) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  setUser: (user: User) => {
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },

  fetchUser: async () => {
    try {
      const { data } = await authApi.getMe();
      set({ user: data });
    } catch (err) {
      console.error("Помилка отримання профілю:", err);
      // @ts-expect-error axios error typing
      if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          set({ token: null, user: null });
      }
    }
  },
}));