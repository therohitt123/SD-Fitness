import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import App from './App';
import './index.css';
export const serverURI = "https://sd-fitness-aewo.onrender.com" 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3200,
            style: {
              background: '#0f172a',
              color: '#e2e8f0',
              border: '1px solid #334155',
              fontSize: '12px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ecfdf5',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fef2f2',
              },
            },
          }}
        />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
