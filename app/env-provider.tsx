'use client';

import { createContext, useContext } from 'react';

interface EnvVars {
  MODELSCOPE_API_TOKEN?: string;
}

const EnvContext = createContext<EnvVars>({});

export function EnvProvider({ children, env }: { children: React.ReactNode; env: EnvVars }) {
  return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;
}

export function useEnv() {
  return useContext(EnvContext);
}

// Make env available globally for the ModelScope service
if (typeof window !== 'undefined') {
  (window as any).ENV = (window as any).ENV || {};
}