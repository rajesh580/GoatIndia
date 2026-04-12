import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CartProvider } from './context/CartContext';
// IMPORT THIS
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';

// Use an explicit API URL only when configured.
// Otherwise keep requests relative so CRA proxy works in development
// and same-origin requests work in production.
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      {/* Use your Client ID here */}
      <GoogleOAuthProvider clientId="419864524696-jfi9851ie8eup6bgjs7b9s4qmdi12jh6.apps.googleusercontent.com">
        <CartProvider>
          <App />
        </CartProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
