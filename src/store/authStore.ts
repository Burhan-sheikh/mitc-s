import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  isAdmin: () => boolean;
  isUser: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  isAdmin: () => get().user?.role === 'admin',
  isUser: () => {
    const role = get().user?.role;
    return role === 'user' || role === 'admin';
  }
}));