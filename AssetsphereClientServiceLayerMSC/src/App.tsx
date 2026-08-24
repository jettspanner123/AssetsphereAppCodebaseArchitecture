import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import ApplicationRouter from './Router/ApplicationRouter';
import TanstackQueryClientService from './Services/TanstackQueryClientService';
import ApplicationToasterSharedComponent from './Shared/Components/ApplicationToasterSharedComponent';

export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={TanstackQueryClientService.current.client}>
      <ApplicationToasterSharedComponent />
      <ApplicationRouter />
    </QueryClientProvider>
  );
}
