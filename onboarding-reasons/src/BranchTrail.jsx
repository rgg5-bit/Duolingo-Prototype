import { ChestIcon, LockIcon, RepeatIcon, StarIcon } from "../../traveler-mode/src/Icons.jsx";

// Homepage trail that splits into one path per picked lesson (see trail.js).
// Light Duolingo colors come from traveler-mode's traveler.css.

const NODE = "relative flex h-[56px] w-[64px] items-center justify-center overflow-hidden rounded-[50%] outline-none transition-transform active:translate-y-[6px] active:shadow-none focus-visible:ring-4 focus-visible:ring-macaw/30";

const PALETTE = {
  open: "bg-turtle shadow-[0_7px_0_var(--color-turtle-dark)]",
  done: "bg-bee shadow-[0_7px_0_#e5a400]",
  locked: "bg-swan shadow-[0_7px_0_#b7b7b7]",
};

const CAPTION = { lesson: "Lesson", practice: "Practice", chest: "Reward" };

function StepNode({ step, lesson, onClick }) {
  const { kind, state } = step;
  const label = `${lesson.label}: ${CAPTION[kind]}${state === "locked" ? " (locked)" : state === "done" ? " (done)" : ""}`;

  if (kind === "chest") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-macaw/30 ${
          state === "open" ? "animate-bob" : "opacity-50 grayscale"
        }`}
      >
        <ChestIcon className="h-[52px] w-[60px]" />
      </button>
    );
  }

  let icon;
  if (state === "locked") icon = <LockIcon className="h-7 w-7 text-hare" />;
  else if (kind === "practice") icon = <RepeatIcon className="h-8 w-8" />;
  else
    icon = (
      <StarIcon className={`relative h-8 w-8 ${state === "done" ? "text-[#cd7900]" : "text-white"}`} />
    );

  return (
    <span className="relative">
      {kind === "lesson" && state === "open" && (
        <span
          aria-hidden="true"
          className="animate-bob absolute bottom-[calc(100%+12px)] left-1/2 z-10 -translate-x-1/2 rounded-lg border-2 border-swan bg-paper px-2 py-0.5 text-[12px] font-black uppercase tracking-wide text-turtle"
        >
          Start
          <span className="absolute -bottom-[6px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-swan bg-paper" />
        </span>
      )}
      <button type="button" onClick={onClick} aria-label={label} className={`${NODE} ${PALETTE[state]}`}>
        {state === "done" && (
          <span aria-hidden="true" className="absolute top-2 left-3.5 h-9 w-2.5 -rotate-[35deg] rounded-full bg-white/40" />
        )}
        {icon}
      </button>
    </span>
  );
}

// Curvy dashed connectors: `from` and `to` are x positions in % of the width.
function Connectors({ lines, height = 44 }) {
  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className="block w-full"
      style={{ height }}
      aria-hidden="true"
    >
      {lines.map(({ from, to, active }, i) => (
        <path
          key={i}
          d={`M${from} 0 C${from} ${height / 2}, ${to} ${height / 2}, ${to} ${height}`}
          fill="none"
          stroke={active ? "#58cc02" : "#e5e5e5"}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="1 11"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export default function BranchTrail({ trail, onPlay, onPickMore, showToast }) {
  const { branches, finishedLessons, allLessonsDone } = trail;
  const n = branches.length;
  const center = (i) => ((i + 0.5) / n) * 100;

  function tap(branch, step) {
    const name = `${branch.lesson.emoji} ${branch.lesson.label}`;
    if (step.kind === "lesson") return onPlay(branch.id, "lesson");
    if (step.kind === "practice") {
      if (step.state === "locked") return showToast(`Finish the ${branch.lesson.label} lesson first`);
      return onPlay(branch.id, "practice");
    }
    if (step.state === "locked") return showToast(`Do the lesson and practice to open this chest`);
    showToast(`🎁 ${name} chest opened! +20 gems`);
  }

  return (
    <section aria-label="Your learning paths" className="mt-6 animate-pop">
      {/* Fork */}
      <div className="text-center">
        <p className="text-[18px] font-black text-eel">
          <span aria-hidden="true">🔀</span> Choose your path
        </p>
        <p className="mt-0.5 text-[14px] font-bold text-wolf">
          {allLessonsDone
            ? "You finished every path. Nice!"
            : finishedLessons
              ? "Pick any path to keep going"
              : "Start with any lesson you picked"}
        </p>
      </div>
      <Connectors lines={branches.map((b, i) => ({ from: 50, to: center(i), active: b.steps[0].state === "done" }))} />

      {/* One column per picked lesson */}
      <ol className="grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {branches.map((b) => {
          const started = b.steps[0].state === "done";
          return (
            <li key={b.id} className="flex flex-col items-center">
              <div
                className={`flex w-[min(110px,100%)] flex-col items-center rounded-2xl border-2 px-1.5 py-2 text-center ${
                  started ? "border-bee bg-[#fff7d6]" : "border-swan bg-paper"
                }`}
              >
                <span className="text-[26px] leading-none" aria-hidden="true">
                  {b.lesson.emoji}
                </span>
                <span className="mt-1 text-[13px] font-black leading-tight text-eel">{b.lesson.label}</span>
              </div>

              <div className="relative mt-11 flex flex-col items-center gap-9">
                {/* the path line behind this column's nodes */}
                <span
                  aria-hidden="true"
                  className="absolute top-6 bottom-6 left-1/2 w-0 -translate-x-1/2 border-l-[5px] border-dotted border-swan"
                />
                {b.steps.map((step) => (
                  <div key={step.kind} className="relative flex flex-col items-center">
                    <StepNode step={step} lesson={b.lesson} onClick={() => tap(b, step)} />
                    <span className="mt-2.5 rounded-md bg-paper px-1 text-[12px] font-extrabold text-wolf">
                      {CAPTION[step.kind]}
                    </span>
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Paths rejoin */}
      <Connectors
        lines={branches.map((b, i) => ({ from: center(i), to: 50, active: b.steps[0].state === "done" }))}
      />
      <div className="flex justify-center pb-4">
        <button
          type="button"
          onClick={() =>
            allLessonsDone
              ? onPickMore()
              : showToast(`Finish all ${n} lessons to unlock more (${finishedLessons}/${n} done)`)
          }
          className={`flex items-center gap-2 rounded-2xl border-2 border-b-4 px-5 py-3 text-[15px] font-black uppercase tracking-wide outline-none transition-transform active:translate-y-[2px] active:border-b-2 focus-visible:ring-4 focus-visible:ring-macaw/30 ${
            allLessonsDone ? "border-[#58a700] bg-[#58cc02] text-white" : "border-swan bg-polar text-hare"
          }`}
        >
          {allLessonsDone ? "➕ Pick more lessons" : `🔒 More lessons · ${finishedLessons}/${n}`}
        </button>
      </div>
    </section>
  );
}
