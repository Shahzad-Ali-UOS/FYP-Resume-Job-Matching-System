import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
// 🚀 1. Import the Google OAuth Provider
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "761044792810-4ek431vprml9u5m032abjvmd4bl00mpt.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 🚀 3. Wrap App in the Provider so Login.jsx can use the Google button */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);