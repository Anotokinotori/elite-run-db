import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import RootApp from "./RootApp";
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <RootApp />
    </StrictMode>,
  );
}
