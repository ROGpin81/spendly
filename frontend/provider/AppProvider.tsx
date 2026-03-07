import React from 'react';
import AuthProvider from './AuthProvider';

interface Props {
  children: React.ReactNode;
}

export default function AppProvider({ children }: Props) {
  return <AuthProvider>{children}</AuthProvider>;
}