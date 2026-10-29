import { useEffect, useRef, useState } from "react";
import { BackArrow, BookIcon, CompassIcon, DuoOwl, ReasonIcon } from "./Icons.jsx";
import ReasonsSheet from "./ReasonsSheet.jsx";
import { duoLine, getReason, loadSelection, saveSelection } from "./reasons.js";
import { PRESSABLE } from "./styles.js";

const START_OPTIONS = [
  {
    id: "scratch",
    title: "Learning Italian for the first time?",
    subtitle: "Start from scratch!",
    Icon: BookIcon,
    badge: "RECOMMENDED",
    toast: "Starting Unit 1 from scratch…",
  },
  {
    id: "placement",
    title: "Already know some Italian?",
    subtitle: "Let's find your starting point!",
    Icon: CompassIcon,
    toast: "Loading your placement test…",
  },
];

export default function App() {
  const [selection, setSelection] = useState(loadSelection);
  const [startChoice, setStartChoice] = useState("scratch");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  const line = duoLine(selection);

  function showToast(message) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function handleSave(next) {
    setSelection(next);
    saveSelection(next);
    setSheetOpen(false);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col px-4 pb-8 sm:border-x-2 sm:border-line">
      <header className="flex h-16 items-center">
        <button
          type="button"
          aria-label="Back"
          onClick={() => showToast("Back isn't part of this demo")}
          className="-ml-2 rounded-xl p-2 text-fog hover:text-snow focus-visible:ring-4 focus-visible:ring-sky/40 outline-none"
        >
          <BackArrow className="h-7 w-7" />
        </button>
      </header>

      {/* Duo + speech bubble */}
      <section className="mt-4 flex items-center gap-4">
        <div key={`owl-${line}`} className="w-[104px] shrink-0 animate-hop">
          <DuoOwl className="h-auto w-full" />
        </div>
        <div
          key={line}
          role="status"
          aria-live="polite"
          className="relative flex-1 animate-pop rounded-2xl border-2 border-line px-4 py-3 text-[17px] font-bold leading-snug text-snow"
        >
          <span
            aria-hidden="true"
            className="absolute top-1/2 -left-[9px] h-4 w-4 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-line bg-ink"
          />
          {line}
        </div>
      </section>

      {/* Options */}
      <section className="mt-auto flex flex-col gap-4 pt-12">
        {START_OPTIONS.map(({ id, title, subtitle, Icon, badge, toast: message }) => {
          const selected = startChoice === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setStartChoice(id);
                showToast(message);
              }}
              className={`relative flex items-center gap-5 rounded-2xl px-5 py-5 text-left ${PRESSABLE} ${
                selected ? "border-sky-line bg-panel" : "border-line hover:bg-panel/50"
              }`}
            >
              {badge && (
                <span className="absolute -top-3.5 -right-1.5 rounded-lg bg-sky px-2.5 py-1 text-[13px] font-black tracking-[0.08em] text-ink">
                  {badge}
                </span>
              )}
              <Icon className="h-16 w-16 shrink-0" />
              <span className="flex flex-col gap-1.5">
                <span className={`text-[19px] font-black leading-tight ${selected ? "text-sky" : "text-snow"}`}>
                  {title}
                </span>
                <span className={`text-[15px] font-bold ${selected ? "text-sky" : "text-snow/90"}`}>
                  {subtitle}
                </span>
              </span>
            </button>
          );
        })}

        {/* New feature: why are you learning? */}
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-haspopup="dialog"
          className={`relative mt-2 flex items-center gap-5 rounded-2xl border-dashed px-5 py-4 text-left ${PRESSABLE} ${
            selection ? "border-solid border-grape/70 bg-grape/10" : "border-line hover:bg-panel/50"
          }`}
        >
          <span className="absolute -top-3.5 -right-1.5 rounded-lg bg-grape px-2.5 py-1 text-[13px] font-black tracking-[0.08em] text-ink">
            {selection ? "SAVED" : "NEW"}
          </span>
          <ReasonIcon className="h-14 w-14 shrink-0" />
          <span className="flex min-w-0 flex-col gap-1.5">
            <span className="text-[18px] font-black leading-tight text-snow">
              Why are you learning Italian?
            </span>
            {selection ? (
              <>
                <span className="flex flex-wrap gap-1.5">
                  {selection.ids.map((id) => {
                    const r = getReason(id);
                    const label = id === "other" && selection.other ? selection.other : r.chip;
                    return (
                      <span
                        key={id}
                        className="max-w-full truncate rounded-full border-2 border-line bg-ink px-2.5 py-0.5 text-[13px] font-extrabold text-snow"
                      >
                        {r.emoji} {label}
                      </span>
                    );
                  })}
                </span>
                <span className="text-[13px] font-extrabold uppercase tracking-wide text-grape">
                  Tap to edit
                </span>
              </>
            ) : (
              <span className="text-[15px] font-bold text-fog">
                Tell Duo so we can personalize your lessons
              </span>
            )}
          </span>
        </button>
      </section>

      {sheetOpen && (
        <ReasonsSheet
          initial={selection}
          onSave={handleSave}
          onClose={() => setSheetOpen(false)}
        />
      )}

      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed inset-x-0 bottom-6 z-40 mx-auto w-fit max-w-[calc(100%-32px)] animate-pop rounded-2xl border-2 border-line bg-panel px-4 py-2.5 text-[15px] font-extrabold text-snow shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
