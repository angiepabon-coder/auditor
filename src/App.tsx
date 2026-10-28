import React,{useEffect,useState} from 'react';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/common/AppShell';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import {removeDemoData} from './lib/removeDemoData';
removeDemoData();

export default function App() {
  const [evidenceVersion,setEvidenceVersion]=useState(0);
  useEffect(()=>{const update=()=>setEvidenceVersion(v=>v+1);window.addEventListener('ce-private-evidence-updated',update);return()=>window.removeEventListener('ce-private-evidence-updated',update);},[]);
  return (
    <ErrorBoundary>
      <AppProvider key={evidenceVersion}>
        <AppShell />
      </AppProvider>
    </ErrorBoundary>
  );
}

