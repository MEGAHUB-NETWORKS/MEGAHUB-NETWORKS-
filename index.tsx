import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(<App />);
  } catch (err) {
    console.error("Startup Error:", err);
    container.innerHTML = `<div style="color:white;text-align:center;padding:50px;font-family:sans-serif;">
      <h2 style="color:#f87171">System Error</h2>
      <p style="color:#94a3b8">${err instanceof Error ? err.message : 'Failed to load'}</p>
    </div>`;
  }
}