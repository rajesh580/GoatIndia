import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CartProvider } from './context/CartContext';
// IMPORT THIS
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';

// --- SET GLOBAL API BASE URL ---
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      {/* Use your Client ID here */}
      <GoogleOAuthProvider clientId="908400990651-vd48kmr5g1kid6lfgocv1ju9ihfgf22v.apps.googleusercontent.com">
        <CartProvider>
          <App />
        </CartProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);