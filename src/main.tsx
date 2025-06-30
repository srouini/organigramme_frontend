import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import { FlowProvider } from "./context/FlowContext";
import { AxiosProvider } from "./context/AxiosContext.tsx";

const queryClient = new QueryClient();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <AxiosProvider>
      <QueryClientProvider client={queryClient}>
        <FlowProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </FlowProvider>
      </QueryClientProvider>
      </AxiosProvider>
    </Router>
  </React.StrictMode>
);
