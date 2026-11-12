import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ChestIcon,
  CloseGlyph,
  EnergyIcon,
  FlameIcon,
  GemIcon,
  GuidebookIcon,
  LockIcon,
  NavChat,
  NavHome,
  NavLeagues,
  NavMore,
  NavPractice,
  NavQuests,
  PeekerArt,
  PlaneGlyph,
  RepeatIcon,
  SleeperArt,
  StarIcon,
  WitchBadge,
} from "./Icons.jsx";
import {
  COURSES,
  DESTINATIONS,
  FLIGHT_TIMES,
  NODES,
  PATH_OFFSETS,
  STANDARD_UNIT,
  loadTrip,
  saveTrip,
  travelUnit,
} from "./homeData.js";
import TravelOnboarding from "./TravelOnboarding.jsx";

const NAV = [
  { label: "Learn", Icon: NavHome },
  { label: "Practice", Icon: NavPractice },
  { label: "Leagues", Icon: NavLeagues },
  { label: "Quests", Icon: NavQuests, dot: true },
  { label: "Chat", Icon: NavChat },
  { label: "More", Icon: NavMore, dot: true },
];

function Flag({ course, className = "" }) {
  const { flag, horizontal, dot } = course;
  return (
    <span
      aria-hidden="true"
      className={`relative flex overflow-hidden rounded-md ${horizontal ? "flex-col" : ""} ${className}`}
    >
      {flag.map((c, i) => (
        <span key={i} className="flex-1" style={{ background: c }} />
      ))}
      {dot && (
        <span
          className="absolute top-1/2 left-1/2 h-[45%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: dot }}
        />
      )}
      {/* light outline so white stripes don't vanish on the white page */}
      <span className="absolute inset-0 rounded-md ring-1 ring-black/5 ring-inset" />
    </span>
  );
}

function TravelModeButton({ on, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Turn off Traveler mode" : "Switch to Traveler mode"}
      title={on ? "Turn off Traveler mode" : "Switch to Traveler mode"}
      onClick={onToggle}
      className={`iridescent flex h-10 w-12 items-center justify-center rounded-xl border-2 border-b-4 bg-paper outline-none transition-[transform,color,border-color] duration-150 active:translate-y-[2px] active:border-b-2 focus-visible:ring-4 focus-visible:ring-macaw/30 ${
        on ? "is-on" : "border-swan text-macaw"
      }`}
    >
      <PlaneGlyph className="h-6 w-6" />
    </button>
  );
}

// "NEW! Traveler mode" strip under the top bar; its notch points up at the Travel button.
function TravelBanner({ notchX, onOpen, onDismiss }) {
  return (
    <div className="relative mt-2 mb-3 animate-pop">
      <span
        aria-hidden="true"
        className="absolute -top-[6px] h-3.5 w-3.5 -translate-x-1/2 rotate-45 rounded-[3px] bg-macaw"
        style={{ left: notchX }}
      />
      <div className="relative flex items-center gap-2 rounded-2xl bg-macaw py-2.5 pr-2 pl-3.5 shadow-[0_4px_0_#1899d6]">
        <button type="button" onClick={onOpen} className="flex flex-1 items-center gap-2 text-left outline-none">
          <span className="rounded-md bg-bee px-1.5 py-0.5 text-[12px] font-black uppercase tracking-wide text-eel">
            New!
          </span>
          <span className="text-[15px] font-black uppercase tracking-wide text-white">Traveler mode</span>
          <span className="ml-auto text-[13px] font-extrabold text-white/90">Try it →</span>
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="rounded-lg p-1 text-white/80 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white"
        >
          <CloseGlyph className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function CoursesMenu({ onClose, onPick }) {
  const ref = useRef(null);
  useEffect(() => {
    // The parent also holds the flag button, so tapping it toggles instead of close-then-reopen.
    const onDown = (e) => !ref.current?.parentElement.contains(e.target) && onClose();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      className="absolute top-14 left-0 z-40 w-64 animate-pop rounded-2xl border-2 border-swan bg-paper p-2 shadow-xl"
    >
      <p className="px-3 pt-1 pb-2 text-[12px] font-black uppercase tracking-[0.1em] text-hare">My courses</p>
      {COURSES.map((c) => (
        <button
          key={c.id}
          type="button"
          role="menuitem"
          onClick={() => onPick(c)}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[16px] font-extrabold outline-none hover:bg-polar focus-visible:bg-polar ${
            c.id === "fr" ? "bg-[#ddf4ff] text-macaw" : "text-eel"
          }`}
        >
          <Flag course={c} className="h-6 w-8" />
          {c.name}
        </button>
      ))}
    </div>
  );
}

// Grey dashed ring that wraps the node you're currently on.
function ProgressRing() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="pointer-events-none absolute -inset-[17px] h-[calc(100%+34px)] w-[calc(100%+34px)]">
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#e5e5e5"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="52 18.7"
        transform="rotate(-62 50 50)"
      />
    </svg>
  );
}

function PathNode({ node }) {
  if (node.kind === "chest") {
    return (
      <>
        <ChestIcon className="h-[58px] w-[66px]" />
        <span className="sr-only">{node.label} (locked)</span>
      </>
    );
  }

  const done = node.kind === "done";
  const current = node.kind === "current";
  const locked = node.kind === "locked";

  const palette = done
    ? "bg-bee shadow-[0_8px_0_#e5a400]"
    : current
      ? "bg-turtle shadow-[0_8px_0_var(--color-turtle-dark)]"
      : "bg-swan shadow-[0_8px_0_#b7b7b7]";

  let content;
  if (done) {
    content = (
      <>
        <span aria-hidden="true" className="absolute top-2 left-4 h-11 w-3 -rotate-[35deg] rounded-full bg-white/40" />
        <StarIcon className="relative h-9 w-9 text-[#cd7900]" />
      </>
    );
  } else if (current) {
    content = <RepeatIcon className="h-9 w-9" />;
  } else {
    content = <LockIcon className="h-8 w-8 text-hare" />;
  }

  return (
    <span className="relative">
      {current && <ProgressRing />}
      <button
        type="button"
        aria-label={`${node.label}${locked ? " (locked)" : ""}`}
        className={`relative flex h-[60px] w-[70px] items-center justify-center overflow-hidden rounded-[50%] outline-none transition-transform active:translate-y-[6px] active:shadow-none focus-visible:ring-4 focus-visible:ring-macaw/30 ${palette}`}
      >
        {content}
      </button>
    </span>
  );
}

export default function Home() {
  const [trip, setTrip] = useState(loadTrip);
  const [onboarding, setOnboarding] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wash, setWash] = useState(0);
  const [toast, setToast] = useState(null);
  const [notchX, setNotchX] = useState(0);
  const toastTimer = useRef();
  const travelBtnRef = useRef(null);
  const mainRef = useRef(null);

  const travelMode = trip !== null;
  const unit = travelMode ? travelUnit(trip) : STANDARD_UNIT;
  const course = COURSES[0];

  function showToast(message) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Keep the banner's notch lined up under the Travel button.
  useLayoutEffect(() => {
    function place() {
      const btn = travelBtnRef.current?.getBoundingClientRect();
      const box = mainRef.current?.getBoundingClientRect();
      if (btn && box) setNotchX(btn.left + btn.width / 2 - box.left - 16);
    }
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [onboarding]);

  // Off → start the destination/flight onboarding. On → switch straight back.
  function toggleTravel() {
    setBannerOpen(false);
    if (!travelMode) {
      setOnboarding(true);
      window.scrollTo(0, 0);
      return;
    }
    setTrip(null);
    saveTrip(null);
    showToast("Back to your regular course");
  }

  function finishOnboarding(next) {
    setOnboarding(false);
    setTrip(next);
    saveTrip(next);
    window.scrollTo(0, 0);
    // Re-keying the wash restarts its sweep animation each time.
    setWash((n) => n + 1);
    const dest = DESTINATIONS.find((d) => d.id === next.destination);
    const when = FLIGHT_TIMES.find((f) => f.id === next.flight);
    showToast(`✈️ ${dest.city} ${when.short}. ${dest.cheer}`);
  }

  if (onboarding) {
    return <TravelOnboarding onClose={() => setOnboarding(false)} onDone={finishOnboarding} />;
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col bg-paper sm:border-x-2 sm:border-swan">
      {/* Top stats bar */}
      <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between bg-paper px-5">
        <div className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Switch course"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 items-center gap-2 rounded-xl px-1 outline-none hover:bg-polar focus-visible:ring-4 focus-visible:ring-macaw/30"
          >
            <Flag course={course} className="h-[22px] w-[30px]" />
            <span className="text-[17px] font-black text-eel">{course.xp}</span>
          </button>
          {menuOpen && (
            <CoursesMenu
              onClose={() => setMenuOpen(false)}
              onPick={(c) => {
                setMenuOpen(false);
                if (c.id !== "fr") showToast(`${c.name} isn't part of this demo`);
              }}
            />
          )}
        </div>

        <div ref={travelBtnRef}>
          <TravelModeButton on={travelMode} onToggle={toggleTravel} />
        </div>

        <span className="flex items-center gap-1.5 text-[17px] font-black text-hare" aria-label="0 day streak">
          <FlameIcon className="h-7 w-7 text-[#d3d3d3]" />0
        </span>
        <span className="flex items-center gap-1.5 text-[17px] font-black text-macaw" aria-label="1053 gems">
          <GemIcon className="h-7 w-7" />
          1053
        </span>
        <span className="flex items-center gap-1.5 text-[22px] font-black leading-none text-[#7b3fe4]" aria-label="Unlimited energy">
          <EnergyIcon className="h-6 w-8" />∞
        </span>
      </header>

      <main ref={mainRef} className="flex-1 px-4 pb-32">
        {bannerOpen && !travelMode && (
          <TravelBanner notchX={notchX} onOpen={toggleTravel} onDismiss={() => setBannerOpen(false)} />
        )}

        {/* Unit banner */}
        <section
          key={unit.title}
          className={`mt-1 flex animate-pop items-stretch overflow-hidden rounded-2xl border-b-4 ${
            travelMode ? "iridescent-banner border-whale" : "border-turtle-dark bg-turtle"
          }`}
        >
          <div className="flex-1 px-4 py-3.5">
            <p className="text-[15px] font-black uppercase tracking-[0.06em] text-white/75">{unit.section}</p>
            <h1 className="mt-0.5 text-[20px] font-extrabold leading-tight text-white">{unit.title}</h1>
          </div>
          <button
            type="button"
            aria-label="Guidebook"
            onClick={() => showToast("Opening the guidebook…")}
            className="flex w-[64px] items-center justify-center border-l-2 border-black/10 outline-none hover:bg-black/5"
          >
            <GuidebookIcon className="h-8 w-8" />
          </button>
        </section>

        {/* Lesson path */}
        <ol className="relative mt-6 flex flex-col">
          {NODES.map((node, i) => (
            <li
              key={i}
              className={`relative flex animate-pop justify-center ${
                node.kind === "current" ? "h-[104px] pt-5" : "h-[82px]"
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className="flex flex-col items-center"
                style={{ transform: `translateX(${PATH_OFFSETS[i % PATH_OFFSETS.length]}px)` }}
              >
                <PathNode node={node} />
              </div>

              {i === 0 && (
                <div className="absolute top-0 left-0 w-[62px]">
                  <WitchBadge className="w-full" />
                  <span className="absolute inset-x-0 bottom-[7px] text-center text-[13px] font-black text-white">
                    26 days
                  </span>
                </div>
              )}
              {i === 2 && <SleeperArt className="absolute top-1 right-0 w-[118px]" />}
              {i === 6 && <PeekerArt className="absolute top-8 left-1 w-[90px]" />}
            </li>
          ))}
        </ol>
      </main>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-[420px] justify-around border-t-2 border-swan bg-paper px-2 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:border-x-2">
        {NAV.map(({ label, Icon, dot }, i) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-current={i === 0 ? "page" : undefined}
            onClick={() => i && showToast("Only the Learn tab is in this demo")}
            className={`relative flex h-[50px] w-[50px] items-center justify-center rounded-xl border-2 outline-none ${
              i === 0 ? "border-[#84d8ff] bg-[#ddf4ff]" : "border-transparent hover:bg-polar"
            }`}
          >
            <Icon className="h-9 w-9" />
            {dot && (
              <span className="absolute right-1.5 bottom-1.5 h-3 w-3 rounded-full border-2 border-paper bg-[#ff4b4b]" />
            )}
          </button>
        ))}
      </nav>

      {wash > 0 && <div key={wash} aria-hidden="true" className="iridescent-wash pointer-events-none fixed inset-0 z-50" />}

      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed inset-x-0 bottom-24 z-40 mx-auto w-fit max-w-[calc(100%-32px)] animate-pop rounded-2xl bg-eel px-4 py-2.5 text-[15px] font-extrabold text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
