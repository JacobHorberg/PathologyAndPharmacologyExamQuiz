import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./EksamenQuiz.jsx"; // point at your file
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);