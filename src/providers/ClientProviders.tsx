'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactQueryProvider } from './QueryClientProvider';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
    </SessionProvider>
  );
}
