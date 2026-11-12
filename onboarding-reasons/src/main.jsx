import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Home from "../../traveler-mode/src/Home.jsx";
import App from "./App.jsx";
import { setCourse } from "./courses.js";
import "./index.css";

// One app for both prototypes: the Traveler mode homepage first, and its
// Traveler mode button opens this onboarding in the homepage's selected language.
function Root() {
  const [screen, setScreen] = useState("home");

  // The homepage is light and the onboarding is dark; match the page behind them.
  useEffect(() => {
    document.body.classList.toggle("light-page", screen === "home");
    window.scrollTo(0, 0);
  }, [screen]);

  return screen === "home" ? (
    <Home
      onStartOnboarding={(courseId) => {
        setCourse(courseId);
        setScreen("onboarding");
      }}
    />
  ) : (
    <App onBack={() => setScreen("home")} />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
