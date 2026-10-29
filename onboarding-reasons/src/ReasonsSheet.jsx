import { useEffect, useRef, useState } from "react";
import { PRESSABLE } from "./styles.js";
import { CheckIcon, CloseIcon } from "./Icons.jsx";
import { getDestination } from "./destinations.js";
import { REASONS } from "./reasons.js";
import TravelMap from "./TravelMap.jsx";

const CLOSE_MS = 200;

export default function ReasonsSheet({ initial, onSave, onClose }) {
  const [ids, setIds] = useState(initial?.ids ?? []);
  const [other, setOther] = useState(initial?.other ?? "");
  const [trips, setTrips] = useState(initial?.trips ?? []);
  const [mapOpen, setMapOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef(null);
  const otherRef = useRef(null);
  const mapOpenRef = useRef(false);
  mapOpenRef.current = mapOpen;

  const canContinue = ids.length > 0;

  // Animate out, then hand control back to the parent.
  function dismiss(after = onClose) {
    if (closing) return;
    setClosing(true);
    setTimeout(after, CLOSE_MS);
  }

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (e) => {
      // The travel map handles its own Escape while it's open.
      if (e.key === "Escape" && !mapOpenRef.current) dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(id) {
    // Picking Travel jumps straight to the map so users can choose destinations.
    if (id === "travel" && !ids.includes("travel")) setMapOpen(true);
    setIds((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      if (id === "other" && next.includes("other")) {
        requestAnimationFrame(() => otherRef.current?.focus());
      }
      return next;
    });
  }

  function handleContinue() {
    if (!canContinue) return;
    // Keep the user's picks in the order they appear in the list.
    const ordered = REASONS.map((r) => r.id).filter((id) => ids.includes(id));
    const text = ordered.includes("other") ? other.trim() : "";
    const chosenTrips = ordered.includes("travel") ? trips : [];
    dismiss(() => onSave({ ids: ordered, other: text, trips: chosenTrips }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className={`absolute inset-0 bg-black/60 ${closing ? "animate-fade-out" : "animate-fade-in"}`}
        onClick={() => dismiss()}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reasons-title"
        tabIndex={-1}
        className={`relative flex max-h-[90dvh] w-full max-w-[420px] flex-col rounded-t-3xl border-2 border-b-0 border-line bg-ink outline-none ${
          closing ? "animate-sheet-down" : "animate-sheet-up"
        }`}
      >
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-line" aria-hidden="true" />

        <div className="flex items-start gap-3 px-5 pt-3 pb-2">
          <div className="flex-1">
            <h2 id="reasons-title" className="text-[22px] font-black leading-tight text-snow">
              Why are you learning Italian?
            </h2>
            <p className="mt-1 text-[15px] font-bold text-fog">Pick all that apply.</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => dismiss()}
            className="-mr-1 rounded-xl p-2 text-fog outline-none hover:text-snow focus-visible:ring-4 focus-visible:ring-sky/40"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <ul className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-5 pt-2 pb-4">
          {REASONS.map((r) => {
            const selected = ids.includes(r.id);
            return (
              <li key={r.id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  onClick={() => toggle(r.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left ${PRESSABLE} ${
                    selected ? "border-sky-line bg-panel" : "border-line hover:bg-panel/50"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[24px] ${
                      selected ? "bg-sky/15" : "bg-panel"
                    }`}
                    aria-hidden="true"
                  >
                    {r.emoji}
                  </span>
                  <span
                    className={`flex-1 text-[16px] font-extrabold leading-snug ${
                      selected ? "text-sky" : "text-snow"
                    }`}
                  >
                    {r.label}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 ${
                      selected ? "border-sky bg-sky text-ink" : "border-line text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </span>
                </button>

                {r.id === "travel" && selected && (
                  <button
                    type="button"
                    onClick={() => setMapOpen(true)}
                    className="mt-2.5 flex w-full animate-pop items-center gap-3 rounded-2xl border-2 border-dashed border-sky-line px-4 py-3 text-left outline-none hover:bg-panel/50 focus-visible:ring-4 focus-visible:ring-sky/40"
                  >
                    <span className="text-[22px]" aria-hidden="true">
                      🗺️
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] font-extrabold leading-snug text-snow">
                      {trips.length
                        ? trips.map((t) => `${getDestination(t).emoji} ${getDestination(t).name}`).join(", ")
                        : "Pick where you're going"}
                    </span>
                    <span className="shrink-0 text-[13px] font-extrabold uppercase tracking-wide text-sky">
                      {trips.length ? "Change" : "Open map"}
                    </span>
                  </button>
                )}

                {r.id === "other" && selected && (
                  <div className="mt-2.5 animate-pop">
                    <label htmlFor="other-reason" className="sr-only">
                      Tell us your reason
                    </label>
                    <input
                      ref={otherRef}
                      id="other-reason"
                      type="text"
                      maxLength={40}
                      value={other}
                      onChange={(e) => setOther(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                      placeholder="Tell us more (optional)"
                      className="w-full rounded-2xl border-2 border-line bg-panel px-4 py-3 text-[16px] font-bold text-snow placeholder:text-muted outline-none focus:border-sky-line"
                    />
                    <p className="mt-1 pr-1 text-right text-[12px] font-bold text-muted">
                      {other.length}/40
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="border-t-2 border-line px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className={`w-full rounded-2xl py-3.5 text-[16px] font-black uppercase tracking-[0.08em] ${
              canContinue
                ? `${PRESSABLE} border-owl border-b-owl-dark bg-owl text-ink hover:brightness-105`
                : "cursor-not-allowed border-2 border-b-4 border-line bg-line text-muted"
            }`}
          >
            Continue
          </button>
          {initial && (
            <button
              type="button"
              onClick={() => dismiss(() => onSave(null))}
              className="mt-3 w-full rounded-xl py-1.5 text-[14px] font-extrabold uppercase tracking-wide text-fog outline-none hover:text-snow focus-visible:ring-4 focus-visible:ring-sky/40"
            >
              Clear my answers
            </button>
          )}
        </div>
      </div>

      {/* Rendered outside the animated panel so `fixed` stays relative to the viewport. */}
      {mapOpen && (
        <TravelMap
          initial={trips}
          onDone={(next) => {
            setTrips(next);
            setMapOpen(false);
          }}
          onClose={() => setMapOpen(false)}
        />
      )}
    </div>
  );
}
