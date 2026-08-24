import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import ApplicationRouter from './Router/ApplicationRouter';
import TanstackQueryClientService from './Services/TanstackQueryClientService';

export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={TanstackQueryClientService.current.client}>
      <Toaster position="top-right" richColors />
      <ApplicationRouter />
    </QueryClientProvider>
  );
}
