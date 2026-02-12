// src/main.jsx
// Application entry point - renders the root React component with all providers

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // React Router for navigation
import App from "./App.jsx";
import { AuthWrapper } from "./context/AuthContext.jsx"; // Auth context provider
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthWrapper>
        <App />
      </AuthWrapper>
    </BrowserRouter>
  </React.StrictMode>,
);
