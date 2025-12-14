export interface User {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loadUserData: (user: User) => void;
  isAuthenticated: boolean;
}