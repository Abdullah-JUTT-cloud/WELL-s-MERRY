import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import "./index.css";

const Root = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
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
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
