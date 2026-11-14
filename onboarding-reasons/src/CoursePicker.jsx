import { useRef, useState } from "react";
import { BackArrow, CloseIcon, DuoOwl } from "./Icons.jsx";
import { COURSES } from "./courses.js";
import { PRESSABLE } from "./styles.js";

// ---- Small flag / course icons (SVG so they render the same everywhere) ----

const stripes = (colors, vertical) =>
  colors.map((c, i) =>
    vertical ? (
      <rect key={i} x={(48 / colors.length) * i} y="0" width={48 / colors.length + 0.5} height="32" fill={c} />
    ) : (
      <rect key={i} x="0" y={(32 / colors.length) * i} width="48" height={32 / colors.length + 0.5} fill={c} />
    ),
  );

const cross = (bg, outer, inner) => (
  <>
    <rect width="48" height="32" fill={bg} />
    {inner ? (
      <>
        <rect x="12" y="0" width="10" height="32" fill={outer} />
        <rect x="0" y="11" width="48" height="10" fill={outer} />
        <rect x="14.5" y="0" width="5" height="32" fill={inner} />
        <rect x="0" y="13.5" width="48" height="5" fill={inner} />
      </>
    ) : (
      <>
        <rect x="13" y="0" width="7" height="32" fill={outer} />
        <rect x="0" y="12.5" width="48" height="7" fill={outer} />
      </>
    )}
  </>
);

const FLAGS = {
  es: (
    <>
      {stripes(["#ff4b4b", "#ffc800", "#ffc800", "#ff4b4b"])}
      <rect x="9" y="11" width="7" height="10" rx="2" fill="#ff4b4b" />
      <rect x="11" y="13" width="3" height="6" rx="1" fill="#ffc800" />
    </>
  ),
  fr: stripes(["#1cb0f6", "#f1f1f1", "#ff4b4b"], true),
  de: stripes(["#4b4b4b", "#ff4b4b", "#ffc800"]),
  it: stripes(["#58cc02", "#f1f1f1", "#ff4b4b"], true),
  ja: (
    <>
      <rect width="48" height="32" fill="#f1f1f1" />
      <circle cx="24" cy="16" r="8" fill="#ff4b4b" />
    </>
  ),
  zh: (
    <>
      <rect width="48" height="32" fill="#ff4b4b" />
      <path d="M10 6 l1.8 4.6 4.8.2-3.8 3 1.4 4.7-4.2-2.7-4.2 2.7 1.4-4.7-3.8-3 4.8-.2z" fill="#ffc800" />
      {[[20, 5], [23, 9], [23, 14], [20, 18]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" fill="#ffc800" />
      ))}
    </>
  ),
  ru: stripes(["#f1f1f1", "#1cb0f6", "#ff4b4b"]),
  ko: (
    <>
      <rect width="48" height="32" fill="#f1f1f1" />
      <path d="M24 9 a7 7 0 0 1 0 14 a3.5 3.5 0 0 1 0-7 a3.5 3.5 0 0 0 0-7z" fill="#1cb0f6" />
      <path d="M24 9 a7 7 0 0 0 0 14 a3.5 3.5 0 0 1 0-7 a3.5 3.5 0 0 0 0-7z" fill="#ff4b4b" />
      {[[9, 7], [39, 7], [9, 25], [39, 25]].map(([x, y]) => (
        <g key={`${x}${y}`} stroke="#4b4b4b" strokeWidth="1.4">
          <path d={`M${x - 3} ${y - 2} h6 M${x - 3} ${y} h6 M${x - 3} ${y + 2} h6`} />
        </g>
      ))}
    </>
  ),
  pt: (
    <>
      <rect width="48" height="32" fill="#58cc02" />
      <path d="M24 4 L42 16 L24 28 L6 16 Z" fill="#ffc800" />
      <circle cx="24" cy="16" r="6.5" fill="#1cb0f6" />
    </>
  ),
  sv: cross("#1cb0f6", "#ffc800"),
  no: cross("#ff4b4b", "#f1f1f1", "#1c5bd6"),
  tr: (
    <>
      <rect width="48" height="32" fill="#ff4b4b" />
      <circle cx="19" cy="16" r="8" fill="#f1f1f1" />
      <circle cx="21.5" cy="16" r="6.4" fill="#ff4b4b" />
      <path d="M30 13 l.9 2.4 2.6.1-2 1.6.7 2.5-2.2-1.4-2.2 1.4.7-2.5-2-1.6 2.6-.1z" fill="#f1f1f1" />
    </>
  ),
  pl: stripes(["#f1f1f1", "#ff4b4b"]),
  ga: stripes(["#58cc02", "#f1f1f1", "#ff9600"], true),
  el: (
    <>
      {stripes(["#1cb0f6", "#f1f1f1", "#1cb0f6", "#f1f1f1", "#1cb0f6", "#f1f1f1", "#1cb0f6", "#f1f1f1", "#1cb0f6"])}
      <rect width="18" height="18" fill="#1cb0f6" />
      <rect x="7" y="0" width="4" height="18" fill="#f1f1f1" />
      <rect x="0" y="7" width="18" height="4" fill="#f1f1f1" />
    </>
  ),
  nl: stripes(["#ff4b4b", "#f1f1f1", "#1c5bd6"]),
  uk: stripes(["#1cb0f6", "#ffc800"]),
};

const SUBJECT_ICONS = {
  music: (
    <>
      <rect width="48" height="32" rx="6" fill="#ce82ff" />
      <path d="M20 8 L32 6 V20 a3.5 3.5 0 1 1-2.5-3.3 V11 L22.5 12.3 V22 a3.5 3.5 0 1 1-2.5-3.3 Z" fill="#f1f1f1" />
    </>
  ),
  math: (
    <>
      <rect width="48" height="32" rx="6" fill="#1cb0f6" />
      <g stroke="#f1f1f1" strokeWidth="2.6" strokeLinecap="round">
        <path d="M14 10 h7 M17.5 6.5 v7 M27 10 h7 M14 20 h7 M14 24 h7 M28 19 l5 5 M33 19 l-5 5" />
      </g>
    </>
  ),
  chess: (
    <>
      <rect width="48" height="32" rx="6" fill="#00cd9c" />
      <path d="M16 7 h4 v3 h3 V7 h2 v3 h3 V7 h4 v7 h-16z M18 16 h12 v4 H18z M15 22 h18 v4 H15z" fill="#f1f1f1" />
    </>
  ),
};

// ---- Course list (order follows the real app) ----

const SECTIONS = [
  {
    id: "new",
    title: "New Courses",
    items: [
      { id: "music", name: "Music" },
      { id: "math", name: "Math" },
      { id: "chess", name: "Chess" },
    ],
  },
  {
    id: "languages",
    title: "For English speakers",
    items: [
      { id: "es", name: "Spanish" },
      { id: "fr", name: "French" },
      { id: "de", name: "German" },
      { id: "it", name: "Italian" },
      { id: "ja", name: "Japanese" },
      { id: "zh", name: "Chinese" },
      { id: "ru", name: "Russian" },
      { id: "ko", name: "Korean" },
      { id: "pt", name: "Portuguese" },
      { id: "sv", name: "Swedish" },
      { id: "no", name: "Norwegian" },
      { id: "tr", name: "Turkish" },
      { id: "pl", name: "Polish" },
      { id: "ga", name: "Irish" },
      { id: "el", name: "Greek" },
      { id: "nl", name: "Dutch" },
      { id: "uk", name: "Ukrainian" },
    ],
  },
];

// Courses with real lessons in this prototype.
const available = (id) => Boolean(COURSES[id]);

function CourseIcon({ id }) {
  const art = FLAGS[id] ?? SUBJECT_ICONS[id];
  return (
    <svg viewBox="0 0 48 32" className="h-[38px] w-[50px] shrink-0 overflow-hidden rounded-lg" aria-hidden="true">
      {art}
    </svg>
  );
}

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-7 w-7 text-fog transition-transform duration-200 ${open ? "" : "rotate-180"}`}
      aria-hidden="true"
    >
      <path d="M5 15l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// "What would you like to learn?": the first screen of the combined app.
export default function CoursePicker({ initial, onContinue, onBack, onClose }) {
  const [picked, setPicked] = useState(available(initial) ? initial : null);
  const [open, setOpen] = useState({ new: true, languages: true });
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  function pick(item) {
    if (!available(item.id)) {
      clearTimeout(toastTimer.current);
      setToast(`${item.name} isn't in this prototype yet. Try Spanish, French, German, Italian or Japanese!`);
      toastTimer.current = setTimeout(() => setToast(null), 2600);
      return;
    }
    setPicked(item.id);
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[420px] flex-col bg-ink sm:border-x-2 sm:border-line">
      <header className="flex h-16 shrink-0 items-center px-4">
        {onBack ? (
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="-ml-1 rounded-xl p-1.5 text-fog outline-none hover:text-snow focus-visible:ring-4 focus-visible:ring-sky/40"
          >
            <BackArrow className="h-7 w-7" />
          </button>
        ) : onClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-ml-1 rounded-xl p-1.5 text-fog outline-none hover:text-snow focus-visible:ring-4 focus-visible:ring-sky/40"
          >
            <CloseIcon className="h-7 w-7" />
          </button>
        )}
      </header>

      {/* Duo asks */}
      <section className="flex shrink-0 items-center gap-4 px-4 pb-5">
        <div className="w-[96px] shrink-0 animate-hop">
          <DuoOwl className="h-auto w-full" />
        </div>
        <div className="relative flex-1 animate-pop rounded-2xl border-2 border-line px-4 py-3 text-[18px] font-bold leading-snug text-snow">
          <span
            aria-hidden="true"
            className="absolute top-1/2 -left-[9px] h-4 w-4 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-line bg-ink"
          />
          <h1>What would you like to learn?</h1>
        </div>
      </section>

      {/* Course list */}
      <main className="flex-1 overflow-y-auto border-t-2 border-line px-4 pb-6">
        {SECTIONS.map((section) => (
          <section key={section.id} aria-labelledby={`sec-${section.id}`}>
            <button
              type="button"
              id={`sec-${section.id}`}
              aria-expanded={open[section.id]}
              onClick={() => setOpen((o) => ({ ...o, [section.id]: !o[section.id] }))}
              className="flex w-full items-center justify-between pt-6 pb-4 text-left outline-none focus-visible:ring-4 focus-visible:ring-sky/40"
            >
              <span className="text-[20px] font-black text-snow">{section.title}</span>
              <Chevron open={open[section.id]} />
            </button>

            {open[section.id] && (
              <ul role="radiogroup" aria-label={section.title} className="flex flex-col gap-3">
                {section.items.map((item) => {
                  const selected = picked === item.id;
                  const ready = available(item.id);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-disabled={!ready}
                        onClick={() => pick(item)}
                        className={`flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left ${PRESSABLE} ${
                          selected ? "border-sky-line bg-panel" : "border-line hover:bg-panel/50"
                        }`}
                      >
                        <CourseIcon id={item.id} />
                        <span
                          className={`flex-1 text-[19px] font-extrabold ${
                            selected ? "text-sky" : ready ? "text-snow" : "text-snow/60"
                          }`}
                        >
                          {item.name}
                        </span>
                        {!ready && (
                          <span className="rounded-md bg-line px-1.5 py-0.5 text-[11px] font-black tracking-[0.06em] text-fog">
                            SOON
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </main>

      <footer className="shrink-0 border-t-2 border-line px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={!picked}
          onClick={() => picked && onContinue(picked)}
          className={`w-full rounded-2xl py-3.5 text-[16px] font-black uppercase tracking-[0.08em] ${
            picked
              ? `${PRESSABLE} border-owl border-b-owl-dark bg-owl text-ink hover:brightness-105`
              : "cursor-not-allowed border-2 border-b-4 border-line bg-line text-muted"
          }`}
        >
          Continue
        </button>
      </footer>

      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed inset-x-0 bottom-28 z-40 mx-auto w-fit max-w-[calc(100%-32px)] animate-pop rounded-2xl border-2 border-line bg-panel px-4 py-2.5 text-center text-[15px] font-extrabold text-snow shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
