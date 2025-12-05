import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const PUBLISHABLE_KEY = "pk_test_Y29tcGxldGUtZG9scGhpbi0yNi5jbGVyay5hY2NvdW50cy5kZXYk";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const root = createRoot(rootElement);
root.render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    appearance={{
      baseTheme: dark,
      variables: {
        colorPrimary: '#00F0FF',
        colorBackground: '#111111',
        colorText: '#ffffff',
        colorInputBackground: '#000000',
        colorInputText: '#ffffff',
      }
    }}
  >
    <App />
  </ClerkProvider>
);