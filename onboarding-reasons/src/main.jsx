import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Home from "../../traveler-mode/src/Home.jsx";
import App from "./App.jsx";
import "./index.css";

// One app for both prototypes: the Traveler mode homepage first, and picking
// Italian in its course menu opens this onboarding flow.
function Root() {
  const [screen, setScreen] = useState("home");

  // The homepage is light and the onboarding is dark; match the page behind them.
  useEffect(() => {
    document.body.classList.toggle("light-page", screen === "home");
    window.scrollTo(0, 0);
  }, [screen]);

  return screen === "home" ? (
    <Home onStartItalian={() => setScreen("onboarding")} />
  ) : (
    <App onBack={() => setScreen("home")} />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
