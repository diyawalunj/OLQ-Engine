import { create } from 'zustand';

interface User {
  uid: string;
  email: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  showAuthModal: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setShowAuthModal: (show: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, // by default not logged in
  isLoading: true,
  showAuthModal: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setShowAuthModal: (show) => set({ showAuthModal: show }),
  logout: () => set({ user: null }),
}));
