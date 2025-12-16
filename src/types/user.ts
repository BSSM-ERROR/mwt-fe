export interface User {
  id: string;
  name: string | null;
  email: string | null;
  profile_image: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}
