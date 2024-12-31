import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import for React 18+
import App from './App'; // Main App component
import './index.css'; // Custom styles

// Create the root container and render the App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
