import { useState } from "react";
import { ChestIcon, LockIcon, RepeatIcon, StarIcon } from "../../traveler-mode/src/Icons.jsx";

// Homepage trail that splits into one path per picked lesson (see trail.js),
// drawn in the same style as the original green Duolingo path in Home.jsx:
// big round 3D nodes, a dashed ring on the node you're on, zigzag spacing,
// and a green banner per path. Light colors come from traveler-mode's traveler.css.

const NODE =
  "relative flex h-[60px] w-[70px] items-center justify-center overflow-hidden rounded-[50%] outline-none transition-transform active:translate-y-[6px] active:shadow-none focus-visible:ring-4 focus-visible:ring-macaw/30";

const PALETTE = {
  open: "bg-turtle shadow-[0_8px_0_var(--color-turtle-dark)]",
  done: "bg-bee shadow-[0_8px_0_#e5a400]",
  locked: "bg-swan shadow-[0_8px_0_#b7b7b7]",
};

const NAMES = { lesson: "Lesson", practice: "Practice", chest: "Reward chest" };

// Zigzag (px) per step; wider paths swing further, like the original.
const AMPLITUDE = { 1: 44, 2: 22, 3: 12 };
const ZIGZAG = [0, -1, -1.5];

// Grey dashed ring around the node you're on (same as the original path).
function ProgressRing() {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="pointer-events-none absolute -inset-[17px] h-[calc(100%+34px)] w-[calc(100%+34px)]"
    >
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

function StepNode({ step, lesson, current, onClick }) {
  const { kind, state } = step;
  const label = `${lesson.label}: ${NAMES[kind]}${state === "locked" ? " (locked)" : state === "done" ? " (done)" : ""}`;

  if (kind === "chest") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-macaw/30 ${
          state === "open" ? "animate-bob" : "opacity-60"
        }`}
      >
        <ChestIcon className="h-[58px] w-[66px]" />
      </button>
    );
  }

  let content;
  if (state === "done") {
    content = (
      <>
        <span aria-hidden="true" className="absolute top-2 left-4 h-11 w-3 -rotate-[35deg] rounded-full bg-white/40" />
        <StarIcon className="relative h-9 w-9 text-[#cd7900]" />
      </>
    );
  } else if (state === "open") {
    content = kind === "practice" ? <RepeatIcon className="h-9 w-9" /> : <StarIcon className="h-9 w-9 text-white" />;
  } else {
    content = <LockIcon className="h-8 w-8 text-hare" />;
  }

  return (
    <span className="relative">
      {current && <ProgressRing />}
      {current && kind === "lesson" && (
        <span
          aria-hidden="true"
          className="animate-bob absolute bottom-[calc(100%+24px)] left-1/2 z-10 -translate-x-1/2 rounded-xl border-2 border-swan bg-paper px-2.5 py-1 text-[13px] font-black uppercase tracking-wide text-turtle"
        >
          Start
          <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-swan bg-paper" />
        </span>
      )}
      <button type="button" onClick={onClick} aria-label={label} className={`${NODE} ${PALETTE[state]}`}>
        {content}
      </button>
    </span>
  );
}

// Travel-fact card above the paths ("Before you go to Japan…"), tap for another.
function FactCard({ facts, place }) {
  const [i, setI] = useState(() => Math.floor(Math.random() * facts.length));
  return (
    <div className="mb-5 flex items-start gap-3 rounded-2xl border-2 border-b-4 border-[#84d8ff] bg-[#ddf4ff] px-4 py-3">
      <span className="text-[24px] leading-none" aria-hidden="true">
        💡
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-black uppercase tracking-wide text-whale">
          {place ? `Before you go · ${place}` : "Did you know?"}
        </p>
        <p className="mt-1 text-[14px] font-bold leading-snug text-eel" aria-live="polite">
          {facts[i % facts.length]}
        </p>
        {facts.length > 1 && (
          <button
            type="button"
            onClick={() => setI((n) => n + 1)}
            className="mt-1.5 rounded-lg text-[12px] font-black uppercase tracking-wide text-macaw outline-none hover:text-whale focus-visible:ring-4 focus-visible:ring-macaw/30"
          >
            Another fact →
          </button>
        )}
      </div>
    </div>
  );
}

// "—— Choose your path ——" divider, like the section dividers in the app.
function Divider({ children }) {
  return (
    <div className="my-5 flex items-center gap-3" role="presentation">
      <span className="h-[2px] flex-1 bg-swan" />
      <span className="text-center text-[15px] font-black uppercase tracking-wide text-hare">{children}</span>
      <span className="h-[2px] flex-1 bg-swan" />
    </div>
  );
}

export default function BranchTrail({ trail, facts, factPlace, onPlay, onPickMore, showToast }) {
  const { branches, finishedLessons, allLessonsDone } = trail;
  const n = branches.length;
  const amp = AMPLITUDE[n] ?? 12;

  function tap(branch, step) {
    const name = `${branch.lesson.emoji} ${branch.lesson.label}`;
    if (step.kind === "lesson") return onPlay(branch.id, "lesson");
    if (step.kind === "practice") {
      if (step.state === "locked") return showToast(`Finish the ${branch.lesson.label} lesson first`);
      return onPlay(branch.id, "practice");
    }
    if (step.state === "locked") return showToast("Do the lesson and practice to open this chest");
    showToast(`🎁 ${name} chest opened! +20 gems`);
  }

  return (
    <section aria-label="Your learning paths" className="mt-6 animate-pop">
      {facts?.length > 0 && <FactCard facts={facts} place={factPlace} />}

      <Divider>Choose your path</Divider>
      <p className="-mt-3 mb-4 text-center text-[14px] font-bold text-wolf">
        {allLessonsDone
          ? "You finished every path. Nice!"
          : finishedLessons
            ? "Pick any path to keep going"
            : "Start with any lesson you picked"}
      </p>

      {/* One green path per picked lesson, side by side */}
      <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {branches.map((b, col) => {
          // The node you're on in this path: the first one that isn't done.
          const currentIdx = b.steps.findIndex((s) => s.kind !== "chest" && s.state === "open");
          const pathDone = b.steps[1].state === "done";
          // Alternate the swing so neighbouring paths curve away from each other.
          const side = n === 1 ? 1 : col < (n - 1) / 2 ? -1 : col > (n - 1) / 2 ? 1 : 0;
          return (
            <li key={b.id} className="flex animate-pop flex-col items-center" style={{ animationDelay: `${col * 80}ms` }}>
              {/* Path banner, styled like the green unit banner */}
              <div
                className={`flex w-full flex-col items-center rounded-2xl border-b-4 px-1.5 py-2 text-center ${
                  pathDone ? "border-[#e5a400] bg-bee" : "border-turtle-dark bg-turtle"
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-[0.08em] text-white/80">
                  {pathDone ? "Done ✓" : `Path ${col + 1}`}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[14px] font-extrabold leading-tight text-white">
                  <span aria-hidden="true">{b.lesson.emoji}</span>
                  <span>{b.lesson.label}</span>
                </span>
              </div>

              {/* Nodes, zigzagging down like the original path */}
              {/* Same row height in every path so they line up side by side; the top
                  margin leaves room for the START bubble above the first node. */}
              <ol className="mt-12 flex w-full flex-col items-center">
                {b.steps.map((step, i) => {
                  const current = i === currentIdx;
                  return (
                    <li key={step.kind} className="flex h-[104px] w-full justify-center pt-[20px]">
                      <div style={{ transform: `translateX(${ZIGZAG[i] * amp * (side || (i % 2 ? 1 : -1))}px)` }}>
                        <StepNode step={step} lesson={b.lesson} current={current} onClick={() => tap(b, step)} />
                      </div>
                    </li>
                  );
                })}
              </ol>
            </li>
          );
        })}
      </ol>

      {/* Paths rejoin: the end of the unit */}
      <Divider>{allLessonsDone ? "Unit complete" : "Finish your paths"}</Divider>
      <div className="flex flex-col items-center pb-4">
        <span className="relative">
          {allLessonsDone && <ProgressRing />}
          <button
            type="button"
            aria-label={allLessonsDone ? "Pick more lessons" : `More lessons (locked, ${finishedLessons} of ${n} done)`}
            onClick={() =>
              allLessonsDone
                ? onPickMore()
                : showToast(`Finish all ${n} lessons to unlock more (${finishedLessons}/${n} done)`)
            }
            className={`${NODE} ${allLessonsDone ? PALETTE.open : PALETTE.locked}`}
          >
            {allLessonsDone ? (
              <span className="text-[34px] font-black leading-none text-white">+</span>
            ) : (
              <LockIcon className="h-8 w-8 text-hare" />
            )}
          </button>
        </span>
        <p className="mt-5 text-[14px] font-extrabold text-wolf">
          {allLessonsDone ? "Pick more lessons" : `More lessons · ${finishedLessons}/${n}`}
        </p>
      </div>
    </section>
  );
}
