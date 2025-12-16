import { create } from "zustand";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
