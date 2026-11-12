import { useEffect, useRef, useState } from "react";
import { BackArrow, DuoOwl } from "./Icons.jsx";
import { DESTINATIONS, FLIGHT_TIMES } from "./homeData.js";

const STEPS = [
  { key: "destination", question: "Where is your next destination?" },
  { key: "flight", question: "When is your flight?" },
];

// Duolingo-style option card: white with a grey 3D edge, blue when picked.
function Option({ selected, onClick, children }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex w-full items-center gap-3.5 rounded-2xl border-2 border-b-4 px-4 py-3 text-left outline-none transition-colors active:translate-y-[2px] active:border-b-2 focus-visible:ring-4 focus-visible:ring-macaw/30 ${
        selected ? "border-[#84d8ff] bg-[#ddf4ff]" : "border-swan bg-paper hover:bg-polar"
      }`}
    >
      {children}
    </button>
  );
}

export default function TravelOnboarding({ onClose, onDone }) {
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState(null);
  const [flight, setFlight] = useState(null);
  const advanceTimer = useRef();
  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  const dest = DESTINATIONS.find((d) => d.id === destination);

  function pickDestination(id) {
    setDestination(id);
    // Let the blue "selected" state register before moving on.
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => setStep(1), 280);
  }

  function back() {
    clearTimeout(advanceTimer.current);
    if (step === 0) onClose();
    else setStep(0);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col bg-paper sm:border-x-2 sm:border-swan">
      {/* Back + progress */}
      <header className="sticky top-0 z-10 flex h-[68px] items-center gap-4 bg-paper px-4">
        <button
          type="button"
          aria-label={step === 0 ? "Back to home" : "Back"}
          onClick={back}
          className="rounded-lg p-1 text-hare outline-none hover:text-wolf focus-visible:ring-4 focus-visible:ring-macaw/30"
        >
          <BackArrow className="h-7 w-7" />
        </button>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
          className="h-4 flex-1 overflow-hidden rounded-full bg-swan"
        >
          <div
            className="relative h-full rounded-full bg-[#58cc02] transition-[width] duration-500 ease-out"
            style={{ width: `${((step + 1) / (STEPS.length + 1)) * 100}%` }}
          >
            <span className="absolute top-1 right-2 left-2 h-1 rounded-full bg-white/30" />
          </div>
        </div>
      </header>

      <main key={step} className="flex-1 px-4 pb-32">
        {/* Duo asks the question */}
        <div className="flex animate-pop items-end gap-2 pt-2">
          <DuoOwl className="h-[104px] w-[96px] shrink-0" />
          <div className="relative mb-9 rounded-2xl border-2 border-swan px-4 py-3">
            <span
              aria-hidden="true"
              className="absolute top-1/2 -left-[9px] h-4 w-4 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-swan bg-paper"
            />
            <h1 className="relative text-[18px] font-extrabold leading-snug text-eel">{STEPS[step].question}</h1>
          </div>
        </div>

        {step === 0 ? (
          <div role="radiogroup" aria-label={STEPS[0].question} className="mt-4 flex flex-col gap-3">
            {DESTINATIONS.map((d, i) => (
              <div key={d.id} className="animate-pop" style={{ animationDelay: `${i * 35}ms` }}>
                <Option selected={destination === d.id} onClick={() => pickDestination(d.id)}>
                  <span aria-hidden="true" className="text-[30px] leading-none">{d.flag}</span>
                  <span className="flex-1">
                    <span className={`block text-[17px] font-extrabold ${destination === d.id ? "text-macaw" : "text-eel"}`}>
                      {d.city}
                    </span>
                    <span className="block text-[14px] font-bold text-wolf">
                      {d.country} · {d.language}
                    </span>
                  </span>
                </Option>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="mt-3 flex items-center gap-2 text-[15px] font-bold text-wolf">
              <span aria-hidden="true" className="text-[20px]">{dest?.flag}</span>
              Flying to <span className="font-extrabold text-eel">{dest?.city}</span>
            </p>
            <div role="radiogroup" aria-label={STEPS[1].question} className="mt-3 flex flex-col gap-3">
              {FLIGHT_TIMES.map((f, i) => (
                <div key={f.id} className="animate-pop" style={{ animationDelay: `${i * 35}ms` }}>
                  <Option selected={flight === f.id} onClick={() => setFlight(f.id)}>
                    <span aria-hidden="true" className="text-[26px] leading-none">{f.emoji}</span>
                    <span className={`text-[17px] font-extrabold ${flight === f.id ? "text-macaw" : "text-eel"}`}>
                      {f.label}
                    </span>
                  </Option>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Continue only on the flight step; picking a destination advances on its own. */}
      {step === 1 && (
        <footer className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[420px] border-t-2 border-swan bg-paper px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:border-x-2">
          <button
            type="button"
            disabled={!flight}
            onClick={() => onDone({ destination, flight })}
            className="h-[50px] w-full rounded-2xl text-[16px] font-black uppercase tracking-[0.08em] outline-none transition-transform focus-visible:ring-4 focus-visible:ring-macaw/30 enabled:bg-[#58cc02] enabled:text-white enabled:shadow-[0_4px_0_#58a700] enabled:active:translate-y-[4px] enabled:active:shadow-none disabled:bg-swan disabled:text-hare"
          >
            Continue
          </button>
        </footer>
      )}
    </div>
  );
}
