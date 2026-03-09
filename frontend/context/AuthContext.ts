import { createContext } from 'react';
import { User } from '../models/User';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: false,
  login: () => {},
  logout: () => {},
});