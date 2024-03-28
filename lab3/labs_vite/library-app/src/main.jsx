import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import DbContextProvider from "./context/DbContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DbContextProvider>
      <App />
    </DbContextProvider>
  </React.StrictMode>
);
