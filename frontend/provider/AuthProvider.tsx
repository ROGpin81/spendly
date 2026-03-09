import React, { useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User } from '../models/User';

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = (newToken: string, newUser: User) => {
    setLoading(true);
    setToken(newToken);
    setUser(newUser);
    setLoading(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}