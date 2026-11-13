import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Chrome offers installation once, sometimes before React has mounted: keep
// the offer so the « Installer » button can use it later.
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  (window as Window & { __installPrompt?: Event }).__installPrompt = event;
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
    // Hand the worker everything this first visit loaded (script, styles,
    // fonts) so the app opens offline without needing a second online visit.
    navigator.serviceWorker.ready.then((registration) => {
      window.setTimeout(() => {
        const urls = performance
          .getEntriesByType("resource")
          .map((entry) => entry.name)
          .filter((url) => url.startsWith(window.location.origin));
        registration.active?.postMessage({ type: "precache", urls });
      }, 2500);
    });
  });
}
