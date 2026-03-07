import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import AppProvider from './provider/AppProvider';

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}