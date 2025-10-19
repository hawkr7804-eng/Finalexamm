import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './index.css';


// Render the app with context providers
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);