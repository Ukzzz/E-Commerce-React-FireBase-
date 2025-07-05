// Importing necessary libraries and components
import React from 'react'; // React core library
import ReactDOM from 'react-dom/client'; // React DOM for modern root API
import App from './App'; // Main App component
import { BrowserRouter } from 'react-router-dom'; // Enables routing (for navigating between pages)
import { CartProvider } from './contexts/CartContext'; // Cart context provider
import { AuthProvider } from './contexts/AuthContext'; // Auth context provider

// Create a root element from the div with id 'root' in index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component with context and routing wrappers
root.render(
  <BrowserRouter> {/* Enables URL-based navigation (routing) */}
    <AuthProvider> {/* Provides user authentication context to all children */}
      <CartProvider> {/* Provides cart context (items, add/remove functions) */}
        <App /> {/* Main component that includes all routes and UI */}
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
