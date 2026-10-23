import React from 'react';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/common/AppShell';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import {removeDemoData} from './lib/removeDemoData';
removeDemoData();

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </ErrorBoundary>
  );
}

