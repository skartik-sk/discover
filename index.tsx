import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConvexProvider } from 'convex/react';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { convex } from './src/lib/convex';
import { wagmiConfig, queryClient } from './src/lib/appkit';
import { ToastProvider } from './src/components/Toast';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConvexProvider client={convex}>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ConvexProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
