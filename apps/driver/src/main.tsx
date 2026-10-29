import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const isProd = typeof import.meta !== 'undefined' && Boolean((import.meta as any).env?.PROD);
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && isProd) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service Worker registration warning:', err);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
