import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
        <CartProvider>
          <App />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 2800,
              style: {
                background: "#0e0c08",
                color: "#f2d88a",
                fontFamily: "Jost, sans-serif",
                fontSize: "13.5px",
                letterSpacing: "0.02em",
                borderRadius: "3px",
                padding: "14px 20px",
              },
            }}
          />
        </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);