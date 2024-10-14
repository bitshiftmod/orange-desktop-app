import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import GlobalStateProvider from "./store/GlobalStateProvider";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <GlobalStateProvider>
        <App />
      </GlobalStateProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
