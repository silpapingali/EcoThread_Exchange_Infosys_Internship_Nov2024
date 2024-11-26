import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Import the App component
import "./index.css"; // Global styles (optional)

// Render the App component into the root element
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
