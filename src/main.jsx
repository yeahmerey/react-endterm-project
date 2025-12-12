import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("✅ SW registered:", registration.scope);

        setInterval(() => {
          registration.update();
        }, 60000);
      })
      .catch((error) => {
        console.error("❌ SW registration failed:", error);
      });
  });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.log("🔄 New service worker activated");
    window.location.reload();
  });
}
