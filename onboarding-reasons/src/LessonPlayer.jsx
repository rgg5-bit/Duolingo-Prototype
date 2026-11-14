import { useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, CloseIcon, DuoOwl, SpeakerIcon } from "./Icons.jsx";
import { course } from "./courses.js";
import { buildExercises, shuffle, speak } from "./lessonContent.js";
import { getLesson } from "./lessons.js";
import { PRESSABLE } from "./styles.js";

const XP_PER_EXERCISE = 10;

// A short Duolingo-style lesson: multiple choice, matching pairs and
// word-bank sentences. Missed exercises come back at the end.
export default function LessonPlayer({
  lessonId,
  nextId,
  streakNote,
  fact, // optional "Did you know?" travel fact for the finish screen
  homeLabel = "Back home",
  onComplete,
  onNext,
  onClose,
}) {
  const lesson = getLesson(lessonId);
  const exercises = useMemo(() => buildExercises(lessonId), [lessonId]);

  const [queue, setQueue] = useState(exercises);
  const [pos, setPos] = useState(0);
  const [status, setStatus] = useState("answering"); // answering | correct | wrong
  const [picked, setPicked] = useState(null); // choice: the option text
  const [built, setBuilt] = useState([]); // build: indices into the word bank
  const [solved, setSolved] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);
  const panelRef = useRef(null);

  const ex = queue[pos];
  const progress = solved / exercises.length;
  const ready =
    ex?.type === "choice" ? picked !== null : ex?.type === "build" ? built.length > 0 : false;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.speechSynthesis?.cancel?.();
    };
  }, []);

  // Read the new word out loud when a "what does this mean?" card appears.
  useEffect(() => {
    if (ex?.speak && status === "answering") speak(ex.speak);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ex?.key]);

  function grade(correct) {
    setStatus(correct ? "correct" : "wrong");
    if (correct) {
      setSolved((n) => n + 1);
      if (ex.type === "build") speak(ex.sentence);
      if (ex.speakAnswer) speak(ex.answer);
    } else {
      setMistakes((n) => n + 1);
      // Try it again at the end of the lesson.
      setQueue((q) => [...q, { ...ex, key: `${ex.key}-retry${q.length}` }]);
    }
  }

  function check() {
    if (!ready || status !== "answering") return;
    if (ex.type === "choice") grade(picked === ex.answer);
    if (ex.type === "build") {
      const attempt = built.map((i) => ex.bank[i].toLowerCase());
      grade(attempt.join(" ") === ex.answer.map((t) => t.toLowerCase()).join(" "));
    }
  }

  function next() {
    if (pos + 1 >= queue.length) {
      setFinished(true);
      onComplete(lessonId);
      return;
    }
    setPos(pos + 1);
    setStatus("answering");
    setPicked(null);
    setBuilt([]);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && e.target === panelRef.current) {
      if (status === "answering") check();
      else next();
    }
  }

  const accuracy = Math.round((exercises.length / (exercises.length + mistakes)) * 100);

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label={`${lesson.label} lesson`}
      className="fixed inset-0 z-[60] flex justify-center overflow-y-auto bg-ink outline-none animate-fade-in"
    >
      <div className="flex min-h-full w-full max-w-[420px] flex-col sm:border-x-2 sm:border-line">
        {finished ? (
          <Finished
            lesson={lesson}
            xp={exercises.length * XP_PER_EXERCISE}
            accuracy={accuracy}
            streakNote={streakNote}
            fact={fact}
            nextLesson={nextId ? getLesson(nextId) : null}
            onNext={() => onNext(nextId)}
            onClose={onClose}
            homeLabel={homeLabel}
          />
        ) : (
          <>
            <header className="flex items-center gap-3 px-4 pt-5 pb-2">
              <button
                type="button"
                aria-label="Quit lesson"
                onClick={onClose}
                className="-ml-1 rounded-xl p-1.5 text-fog outline-none hover:text-snow focus-visible:ring-4 focus-visible:ring-sky/40"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
              <div
                className="h-4 flex-1 overflow-hidden rounded-full bg-line"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={exercises.length}
                aria-valuenow={solved}
              >
                <div
                  className="h-full rounded-full bg-owl transition-[width] duration-300"
                  style={{ width: `${Math.max(progress * 100, 4)}%` }}
                >
                  <div className="mx-2 mt-[3px] h-[4px] rounded-full bg-white/30" />
                </div>
              </div>
            </header>

            <p className="px-5 pt-1 text-[13px] font-extrabold uppercase tracking-wide text-fog">
              {lesson.emoji} {lesson.label}
              {pos >= exercises.length && <span className="text-cardinal"> · Review</span>}
            </p>

            <main key={ex.key} className="flex flex-1 flex-col overflow-y-auto px-5 pt-3 pb-4 animate-pop">
              <h2 className="text-[24px] font-black leading-tight text-snow">{ex.prompt}</h2>

              {ex.type === "choice" && (
                <ChoiceExercise ex={ex} picked={picked} locked={status !== "answering"} onPick={setPicked} />
              )}
              {ex.type === "build" && (
                <BuildExercise ex={ex} built={built} locked={status !== "answering"} onChange={setBuilt} />
              )}
              {ex.type === "match" && (
                <MatchExercise
                  ex={ex}
                  onMistake={() => setMistakes((n) => n + 1)}
                  onDone={() => {
                    setSolved((n) => n + 1);
                    setStatus("correct");
                  }}
                />
              )}
            </main>

            <Footer
              status={status}
              ex={ex}
              ready={ready}
              onCheck={check}
              onContinue={next}
            />
          </>
        )}
      </div>
    </div>
  );
}

function ChoiceExercise({ ex, picked, locked, onPick }) {
  return (
    <>
      {ex.word && (
        <button
          type="button"
          onClick={() => speak(ex.word)}
          className="mt-6 flex w-fit items-center gap-3 rounded-2xl border-2 border-line px-4 py-3 outline-none hover:bg-panel/50 focus-visible:ring-4 focus-visible:ring-sky/40"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky text-ink">
            <SpeakerIcon className="h-6 w-6" />
          </span>
          <span lang={course().id} className="text-[22px] font-extrabold text-snow">
            {ex.word}
          </span>
        </button>
      )}
      <div className="mt-6 grid grid-cols-1 gap-3">
        {ex.options.map((opt, i) => {
          const selected = picked === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={locked}
              aria-pressed={selected}
              onClick={() => {
                onPick(opt);
                if (!ex.word) speak(opt); // course-language options: hear them as you tap
              }}
              className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left ${PRESSABLE} ${
                selected ? "border-sky-line bg-panel" : "border-line hover:bg-panel/50"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 text-[13px] font-black ${
                  selected ? "border-sky text-sky" : "border-line text-fog"
                }`}
              >
                {i + 1}
              </span>
              <span
                lang={ex.word ? "en" : course().id}
                className={`text-[17px] font-extrabold ${selected ? "text-sky" : "text-snow"}`}
              >
                {opt}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

const TILE = "rounded-xl border-2 border-b-4 px-3 py-2 text-[17px] font-extrabold";

function BuildExercise({ ex, built, locked, onChange }) {
  return (
    <>
      <div className="mt-5 flex items-start gap-3">
        <DuoOwl className="h-auto w-[72px] shrink-0" />
        <div className="relative rounded-2xl border-2 border-line px-4 py-3 text-[17px] font-bold text-snow">
          <span
            aria-hidden="true"
            className="absolute top-5 -left-[9px] h-4 w-4 rotate-45 border-b-2 border-l-2 border-line bg-ink"
          />
          {ex.english}
        </div>
      </div>

      {/* Answer line */}
      <div className="mt-5 flex min-h-[112px] flex-wrap content-start gap-2 border-y-2 border-line py-3">
        {built.map((i) => (
          <button
            key={i}
            type="button"
            disabled={locked}
            onClick={() => onChange(built.filter((x) => x !== i))}
            lang={course().id}
            className={`${TILE} border-line bg-ink text-snow outline-none focus-visible:ring-4 focus-visible:ring-sky/40`}
          >
            {ex.bank[i]}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {ex.bank.map((word, i) => {
          const used = built.includes(i);
          return (
            <button
              key={i}
              type="button"
              disabled={locked || used}
              onClick={() => {
                onChange([...built, i]);
                speak(word);
              }}
              lang={course().id}
              className={`${TILE} outline-none focus-visible:ring-4 focus-visible:ring-sky/40 ${
                used ? "border-line bg-line text-transparent" : "border-line bg-ink text-snow hover:bg-panel/50"
              }`}
            >
              {word}
            </button>
          );
        })}
      </div>
    </>
  );
}

function MatchExercise({ ex, onMistake, onDone }) {
  const left = useMemo(() => shuffle(ex.pairs.map(([it]) => it)), [ex]);
  const right = useMemo(() => shuffle(ex.pairs.map(([, en]) => en)), [ex]);
  const answerFor = useMemo(() => Object.fromEntries(ex.pairs), [ex]);

  const [sel, setSel] = useState({ it: null, en: null });
  const [matched, setMatched] = useState([]); // course-language words matched so far
  const [wrong, setWrong] = useState(null); // { it, en } flashing red

  function pick(side, value) {
    if (wrong) return;
    const next = { ...sel, [side]: sel[side] === value ? null : value };
    if (side === "it") speak(value);
    if (next.it && next.en) {
      if (answerFor[next.it] === next.en) {
        const done = [...matched, next.it];
        setMatched(done);
        if (done.length === ex.pairs.length) setTimeout(onDone, 250);
      } else {
        onMistake();
        setWrong(next);
        setTimeout(() => setWrong(null), 600);
      }
      setSel({ it: null, en: null });
      return;
    }
    setSel(next);
  }

  const tile = (side, value) => {
    const isMatched = side === "it" ? matched.includes(value) : matched.some((it) => answerFor[it] === value);
    const isSel = sel[side] === value;
    const isWrong = wrong?.[side] === value;
    return (
      <button
        key={value}
        type="button"
        disabled={isMatched}
        lang={side === "it" ? course().id : side}
        onClick={() => pick(side, value)}
        className={`min-h-[56px] rounded-2xl px-3 py-2 text-[16px] font-extrabold ${PRESSABLE} ${
          isMatched
            ? "border-line text-muted opacity-50"
            : isWrong
              ? "animate-shake border-cardinal bg-cardinal/15 text-cardinal"
              : isSel
                ? "border-sky-line bg-panel text-sky"
                : "border-line text-snow hover:bg-panel/50"
        }`}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="mt-8 grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-3">{left.map((v) => tile("it", v))}</div>
      <div className="flex flex-col gap-3">{right.map((v) => tile("en", v))}</div>
    </div>
  );
}

function Footer({ status, ex, ready, onCheck, onContinue }) {
  if (status === "answering") {
    // Matching finishes on its own, so it has no Check button.
    if (ex.type === "match") return <div className="h-[104px] border-t-2 border-line" />;
    return (
      <div className="border-t-2 border-line px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onCheck}
          disabled={!ready}
          className={`w-full rounded-2xl py-3.5 text-[16px] font-black uppercase tracking-[0.08em] ${
            ready
              ? `${PRESSABLE} border-owl border-b-owl-dark bg-owl text-ink hover:brightness-105`
              : "cursor-not-allowed border-2 border-b-4 border-line bg-line text-muted"
          }`}
        >
          Check
        </button>
      </div>
    );
  }

  const correct = status === "correct";
  const answer = ex.type === "build" ? ex.sentence : ex.answer;
  return (
    <div
      role="status"
      className={`animate-rise px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] ${
        correct ? "bg-owl/15" : "bg-cardinal/15"
      }`}
    >
      <div className={`flex items-center gap-3 ${correct ? "text-owl" : "text-cardinal"}`}>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${correct ? "bg-owl" : "bg-cardinal"} text-ink`}
        >
          {correct ? <CheckIcon className="h-5 w-5" /> : <CloseIcon className="h-5 w-5" />}
        </span>
        <span className="text-[22px] font-black">{correct ? "Nice job!" : "Not quite"}</span>
      </div>
      {!correct && (
        <p className="mt-2 text-[16px] font-bold text-cardinal">
          Correct answer: <span lang={course().id} className="font-extrabold">{answer}</span>
          <span className="block text-[14px] opacity-80">You'll see this one again at the end.</span>
        </p>
      )}
      <button
        type="button"
        autoFocus
        onClick={onContinue}
        className={`mt-4 w-full rounded-2xl py-3.5 text-[16px] font-black uppercase tracking-[0.08em] text-ink hover:brightness-105 ${PRESSABLE} ${
          correct ? "border-owl border-b-owl-dark bg-owl" : "border-cardinal border-b-cardinal-dark bg-cardinal"
        }`}
      >
        Continue
      </button>
    </div>
  );
}

function Finished({ lesson, xp, accuracy, streakNote, fact, nextLesson, onNext, onClose, homeLabel }) {
  return (
    <div className="flex flex-1 flex-col items-center px-5 pt-16 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center animate-pop">
      <div className="w-[140px] animate-hop">
        <DuoOwl className="h-auto w-full" />
      </div>
      <h2 className="mt-6 text-[28px] font-black text-bee">Lesson complete!</h2>
      <p className="mt-2 text-[16px] font-bold text-fog">
        You finished {lesson.emoji} {lesson.label}.
      </p>
      {streakNote && (
        <p className="mt-4 rounded-full border-2 border-line px-4 py-1.5 text-[16px] font-black text-[#ff9600]">
          {streakNote}
        </p>
      )}

      <div className="mt-8 grid w-full grid-cols-2 gap-3">
        <Stat label="Total XP" value={xp} color="bee" />
        <Stat label="Accuracy" value={`${accuracy}%`} color="owl" />
      </div>

      {fact && (
        <div className="mt-5 w-full rounded-2xl border-2 border-sky-line bg-sky/10 px-4 py-3 text-left">
          <p className="text-[13px] font-black uppercase tracking-wide text-sky">💡 Did you know?</p>
          <p className="mt-1 text-[15px] font-bold leading-snug text-snow">{fact}</p>
        </div>
      )}

      <div className="mt-auto flex w-full flex-col gap-3 pt-8">
        {nextLesson && (
          <button
            type="button"
            autoFocus
            onClick={onNext}
            className={`w-full rounded-2xl py-3.5 text-[16px] font-black uppercase tracking-[0.06em] text-ink hover:brightness-105 ${PRESSABLE} border-owl border-b-owl-dark bg-owl`}
          >
            Next: {nextLesson.emoji} {nextLesson.label}
          </button>
        )}
        <button
          type="button"
          autoFocus={!nextLesson}
          onClick={onClose}
          className={`w-full rounded-2xl py-3.5 text-[16px] font-black uppercase tracking-[0.08em] ${PRESSABLE} ${
            nextLesson
              ? "border-line bg-ink text-sky hover:bg-panel/50"
              : "border-owl border-b-owl-dark bg-owl text-ink hover:brightness-105"
          }`}
        >
          {homeLabel}
        </button>
      </div>
    </div>
  );
}

const STAT_COLORS = {
  bee: { border: "border-bee", head: "bg-bee", text: "text-bee" },
  owl: { border: "border-owl", head: "bg-owl", text: "text-owl" },
};

function Stat({ label, value, color }) {
  const c = STAT_COLORS[color];
  return (
    <div className={`overflow-hidden rounded-2xl border-2 ${c.border}`}>
      <div className={`py-1 text-[13px] font-black uppercase tracking-wide text-ink ${c.head}`}>{label}</div>
      <div className={`bg-ink py-3 text-[22px] font-black ${c.text}`}>{value}</div>
    </div>
  );
}
