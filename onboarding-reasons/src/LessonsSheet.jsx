import { useEffect, useMemo, useRef, useState } from "react";
import { PRESSABLE } from "./styles.js";
import { CloseIcon } from "./Icons.jsx";
import { course } from "./courses.js";
import { LESSONS, MAX_LESSONS, lessonSample, suggestedLessons } from "./lessons.js";

const CLOSE_MS = 200;

export default function LessonsSheet({ initial, reasonIds, onSave, onClose }) {
  // Kept in the order the user picked them: the first pick is the first lesson.
  const [ids, setIds] = useState(initial ?? []);
  const [closing, setClosing] = useState(false);
  const [limitHint, setLimitHint] = useState(false);
  const panelRef = useRef(null);

  const suggested = useMemo(() => suggestedLessons(reasonIds), [reasonIds]);
  // Suggested lessons float to the top; the rest keep their usual order.
  const ordered = useMemo(
    () => [
      ...suggested.map((id) => LESSONS.find((l) => l.id === id)),
      ...LESSONS.filter((l) => !suggested.includes(l.id)),
    ],
    [suggested],
  );

  const full = ids.length >= MAX_LESSONS;
  const canContinue = ids.length > 0;

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
      if (e.key === "Escape") dismiss();
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
    // Functional update so rapid taps never work from a stale list.
    setIds((cur) => {
      if (cur.includes(id)) {
        setLimitHint(false);
        return cur.filter((x) => x !== id);
      }
      if (cur.length >= MAX_LESSONS) {
        setLimitHint(true);
        return cur;
      }
      return [...cur, id];
    });
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
        aria-labelledby="lessons-title"
        tabIndex={-1}
        className={`relative flex max-h-[90dvh] w-full max-w-[420px] flex-col rounded-t-3xl border-2 border-b-0 border-line bg-ink outline-none ${
          closing ? "animate-sheet-down" : "animate-sheet-up"
        }`}
      >
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-line" aria-hidden="true" />

        <div className="flex items-start gap-3 px-5 pt-3 pb-2">
          <div className="flex-1">
            <h2 id="lessons-title" className="text-[22px] font-black leading-tight text-snow">
              What do you want to learn first?
            </h2>
            <p className="mt-1 text-[15px] font-bold text-fog">
              Pick up to {MAX_LESSONS}. We'll teach them in the order you choose.
            </p>
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
          {ordered.map((l) => {
            const position = ids.indexOf(l.id);
            const selected = position !== -1;
            const dimmed = full && !selected;
            return (
              <li key={l.id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  aria-disabled={dimmed}
                  onClick={() => toggle(l.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left ${PRESSABLE} ${
                    selected ? "border-sky-line bg-panel" : "border-line hover:bg-panel/50"
                  } ${dimmed ? "opacity-50" : ""}`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[24px] ${
                      selected ? "bg-sky/15" : "bg-panel"
                    }`}
                    aria-hidden="true"
                  >
                    {l.emoji}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span
                        className={`text-[16px] font-extrabold leading-snug ${
                          selected ? "text-sky" : "text-snow"
                        }`}
                      >
                        {l.label}
                      </span>
                      {suggested.includes(l.id) && (
                        <span className="rounded-md bg-grape/20 px-1.5 py-0.5 text-[11px] font-black tracking-[0.06em] text-grape">
                          FOR YOU
                        </span>
                      )}
                    </span>
                    <span lang={course().id} className="text-[14px] font-bold italic text-fog">
                      “{lessonSample(l.id)}”
                    </span>
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 text-[15px] font-black ${
                      selected ? "border-sky bg-sky text-ink" : "border-line text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    {selected ? position + 1 : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="border-t-2 border-line px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <p
            role="status"
            className={`mb-3 text-center text-[14px] font-extrabold ${limitHint ? "text-grape" : "text-fog"}`}
          >
            {limitHint
              ? `You can pick ${MAX_LESSONS}. Unselect one to swap it.`
              : `${ids.length} of ${MAX_LESSONS} picked`}
          </p>
          <button
            type="button"
            onClick={() => canContinue && dismiss(() => onSave(ids))}
            disabled={!canContinue}
            className={`w-full rounded-2xl py-3.5 text-[16px] font-black uppercase tracking-[0.08em] ${
              canContinue
                ? `${PRESSABLE} border-owl border-b-owl-dark bg-owl text-ink hover:brightness-105`
                : "cursor-not-allowed border-2 border-b-4 border-line bg-line text-muted"
            }`}
          >
            Continue
          </button>
          {initial?.length > 0 && (
            <button
              type="button"
              onClick={() => dismiss(() => onSave([]))}
              className="mt-3 w-full rounded-xl py-1.5 text-[14px] font-extrabold uppercase tracking-wide text-fog outline-none hover:text-snow focus-visible:ring-4 focus-visible:ring-sky/40"
            >
              Clear my picks
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
