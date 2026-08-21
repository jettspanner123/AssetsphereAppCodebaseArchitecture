import React from 'react';
import { Toaster } from 'sonner';
import ApplicationRouter from './Router/ApplicationRouter';

export default function App(): React.JSX.Element {
  return (
    <>
      <Toaster position="top-right" richColors />
      <ApplicationRouter />
    </>
  );
}
