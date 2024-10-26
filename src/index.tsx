import App from "./App";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import { FamilyProvider } from "./context/FamilyContext";
import React from "react";
import ReactDOM from "react-dom/client";
import { UserProvider } from "./context/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <UserProvider>
    <FamilyProvider>
      <BrowserRouter> {/* Wrap the App in BrowserRouter */}
        <App />
      </BrowserRouter>
    </FamilyProvider>
  </UserProvider>
);