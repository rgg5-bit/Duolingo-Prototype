import { useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, CloseIcon, DuoOwl, SpeakerIcon } from "./Icons.jsx";
import { course } from "./courses.js";
import { buildExercises, shuffle, speak } from "./lessonContent.js";
import { getLesson } from "./lessons.js";
import { ACCENT_KEYS, STEP_INFO, buildPractice, checkTyped, romajiFor, similarity } from "./practice.js";
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
  mode = "lesson", // which homepage path step (see PATH in practice.js)
  variant, // that step's flavor, e.g. writing "words" vs "pro"
  fade = true, // fade in over the page behind (off when opened straight from the path)
  onComplete,
  onNext,
  onClose,
}) {
  const lesson = getLesson(lessonId);
  const exercises = useMemo(
    () => (mode === "lesson" ? buildExercises(lessonId) : buildPractice(lessonId, mode, variant)),
    [lessonId, mode, variant],
  );

  const [queue, setQueue] = useState(exercises);
  const [pos, setPos] = useState(0);
  const [status, setStatus] = useState("answering"); // answering | correct | wrong
  const [picked, setPicked] = useState(null); // choice: the option text
  const [built, setBuilt] = useState([]); // build: indices into the word bank
  const [typed, setTyped] = useState(""); // type: what the user wrote
  const [spoken, setSpoken] = useState(null); // speak: { ok, note } once they've said it
  const [note, setNote] = useState(null); // a gentle extra line in the feedback banner
  const [solved, setSolved] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);
  const panelRef = useRef(null);

  const ex = queue[pos];
  const progress = solved / exercises.length;
  const ready =
    ex?.type === "choice"
      ? picked !== null
      : ex?.type === "build"
        ? built.length > 0
        : ex?.type === "type"
          ? typed.trim().length > 0
          : ex?.type === "tip"
            ? true
            : ex?.type === "speak"
              ? spoken !== null
              : false;

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

  function grade(correct, extra = null) {
    setStatus(correct ? "correct" : "wrong");
    setNote(extra);
    if (correct) {
      setSolved((n) => n + 1);
      if (ex.type === "build") speak(ex.sentence);
      if (ex.type === "type") speak(ex.answer);
      if (ex.speakAnswer) speak(ex.answer);
      if (ex.speakAnswerText) speak(ex.speakAnswerText);
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
    if (ex.type === "type") {
      const result = checkTyped(typed, ex.answer);
      grade(result.ok, result.ok ? result.note : result.romaji ? `In rōmaji: ${result.romaji}` : null);
    }
    if (ex.type === "tip") {
      // A tip card just needs reading: count it and move straight on.
      setSolved((n) => n + 1);
      next();
      return;
    }
    if (ex.type === "speak") grade(spoken.ok, spoken.note);
  }

  // "Can't speak right now": swap this and every later speaking question in this
  // practice for "type what you hear", so nothing needs a voice.
  function cantSpeak() {
    const quiet = (e) =>
      e.type === "speak"
        ? { type: "type", prompt: "Type what you hear", audio: true, answer: e.text, english: e.english, key: `${e.key}-quiet` }
        : e;
    setQueue((q) => q.map((e, i) => (i >= pos ? quiet(e) : e)));
    setSpoken(null);
    setTyped("");
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
    setTyped("");
    setSpoken(null);
    setNote(null);
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
      aria-label={mode === "lesson" ? `${lesson.label} lesson` : `${lesson.label} ${STEP_INFO[mode].name.toLowerCase()} practice`}
      className={`fixed inset-0 z-[60] flex justify-center overflow-y-auto bg-ink outline-none ${fade ? "animate-fade-in" : ""}`}
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
              {mode === "lesson" ? lesson.emoji : STEP_INFO[mode].emoji}{" "}
              {mode === "lesson" ? lesson.label : `${STEP_INFO[mode].name} · ${lesson.label}`}
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
              {ex.type === "type" && (
                <TypeExercise ex={ex} value={typed} locked={status !== "answering"} onChange={setTyped} onSubmit={check} />
              )}
              {ex.type === "tip" && <TipExercise ex={ex} />}
              {ex.type === "speak" && (
                <SpeakExercise
                  ex={ex}
                  result={spoken}
                  locked={status !== "answering"}
                  onResult={setSpoken}
                  onCantSpeak={cantSpeak}
                />
              )}
            </main>

            <Footer
              status={status}
              ex={ex}
              ready={ready}
              note={note}
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
      {ex.hint && (
        <p
          lang={course().id}
          className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-line px-4 py-3 text-[19px] font-extrabold text-snow"
        >
          {ex.speak && (
            <button
              type="button"
              aria-label="Listen"
              onClick={() => speak(ex.speak)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky text-ink outline-none focus-visible:ring-4 focus-visible:ring-sky/40"
            >
              <SpeakerIcon className="h-5 w-5" />
            </button>
          )}
          <span>{ex.hint}</span>
        </p>
      )}
      {ex.listen && (
        // Listening: no text, just the sound (normal or slow).
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            aria-label="Play the word"
            onClick={() => speak(ex.word)}
            className="flex h-20 w-20 items-center justify-center rounded-2xl border-b-[6px] border-sky-line bg-sky text-ink outline-none active:translate-y-[2px] active:border-b-2 focus-visible:ring-4 focus-visible:ring-sky/40"
          >
            <SpeakerIcon className="h-10 w-10" />
          </button>
          <button
            type="button"
            aria-label="Play it slowly"
            onClick={() => speakSlowly(ex.word)}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-b-4 border-line text-[24px] outline-none active:translate-y-[2px] active:border-b-2 focus-visible:ring-4 focus-visible:ring-sky/40"
          >
            🐢
          </button>
          <p className="text-[14px] font-bold text-fog">Tap to listen again</p>
        </div>
      )}
      {ex.word && !ex.listen && (
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
                // Course-language options: hear them as you tap (not English meanings).
                if (!ex.word && !ex.hint) speak(opt);
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

// Duo says the English; the learner writes it in the course language.
function DuoSays({ children }) {
  return (
    <div className="mt-5 flex items-start gap-3">
      <DuoOwl className="h-auto w-[72px] shrink-0" />
      <div className="relative rounded-2xl border-2 border-line px-4 py-3 text-[17px] font-bold text-snow">
        <span
          aria-hidden="true"
          className="absolute top-5 -left-[9px] h-4 w-4 rotate-45 border-b-2 border-l-2 border-line bg-ink"
        />
        {children}
      </div>
    </div>
  );
}

// Writing practice: type a word or short sentence. Accent keys, a two-level hint
// (first letters, then the full answer to copy) and forgiving checks keep it
// beginner-friendly. Japanese accepts rōmaji.
function TypeExercise({ ex, value, locked, onChange, onSubmit }) {
  const [hint, setHint] = useState(0); // 0 none, 1 first letters, 2 full answer
  const inputRef = useRef(null);
  const lang = course().id;
  const keys = ACCENT_KEYS[lang] ?? [];
  const romaji = romajiFor(ex.answer);
  const firstLetters = ex.answer
    .split(" ")
    .map((w) => w.replace(/[^\s.,!?¿¡。、？！]/gu, (c, i) => (i === 0 ? c : "_")))
    .join(" ");

  useEffect(() => {
    inputRef.current?.focus();
    if (ex.audio) speak(ex.answer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function insert(ch) {
    const el = inputRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + ch + value.slice(end));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + ch.length, start + ch.length);
    });
  }

  return (
    <>
      {ex.audio ? (
        // Dictation: hear it (normal or slow) and type it; the meaning is there as help.
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            aria-label="Play it again"
            onClick={() => speak(ex.answer)}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-b-[6px] border-sky-line bg-sky text-ink outline-none active:translate-y-[2px] active:border-b-2 focus-visible:ring-4 focus-visible:ring-sky/40"
          >
            <SpeakerIcon className="h-8 w-8" />
          </button>
          <button
            type="button"
            aria-label="Play it slowly"
            onClick={() => speakSlowly(ex.answer)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-b-4 border-line text-[22px] outline-none active:translate-y-[2px] active:border-b-2 focus-visible:ring-4 focus-visible:ring-sky/40"
          >
            🐢
          </button>
          <p className="text-[14px] font-bold text-fog">
            It means: <span className="text-snow">“{ex.english}”</span>
          </p>
        </div>
      ) : (
        <DuoSays>{ex.english}</DuoSays>
      )}

      <label htmlFor="type-answer" className="sr-only">
        Your answer
      </label>
      <textarea
        id="type-answer"
        ref={inputRef}
        rows={2}
        value={value}
        disabled={locked}
        lang={lang}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={romaji ? "Type in kana or rōmaji…" : `Type in ${course().name}…`}
        className="mt-5 w-full resize-none rounded-2xl border-2 border-line bg-panel/40 px-4 py-3 text-[18px] font-bold text-snow outline-none placeholder:text-muted focus:border-sky-line"
      />

      {keys.length > 0 && !locked && (
        <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Accent keys">
          {keys.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => insert(k)}
              className="h-9 min-w-9 rounded-lg border-2 border-b-4 border-line px-2 text-[16px] font-extrabold text-snow outline-none active:translate-y-[2px] active:border-b-2 focus-visible:ring-4 focus-visible:ring-sky/40"
            >
              {k}
            </button>
          ))}
        </div>
      )}

      {romaji && (
        <p className="mt-2 text-[13px] font-bold text-fog">
          No Japanese keyboard? Type it in rōmaji (English letters), like “arigatou” for ありがとう.
        </p>
      )}

      {!locked && ex.noHint && (
        <p className="mt-4 text-[13px] font-extrabold uppercase tracking-wide text-fog">💪 No hints this time. You've got this!</p>
      )}
      {!locked && !ex.noHint && (
        <div className="mt-4">
          {hint > 0 && (
            <p lang={lang} className="mb-2 rounded-xl bg-bee/15 px-3 py-2 text-[16px] font-extrabold tracking-wide text-snow">
              💡 {hint === 1 ? firstLetters : ex.answer}
              {hint === 2 && romaji && <span className="block text-[13px] font-bold text-fog">{romaji}</span>}
            </p>
          )}
          {hint < 2 && (
            <button
              type="button"
              onClick={() => setHint(hint + 1)}
              className="rounded-lg text-[14px] font-black uppercase tracking-wide text-sky outline-none hover:brightness-110 focus-visible:ring-4 focus-visible:ring-sky/40"
            >
              {hint === 0 ? "💡 Need a hint?" : "Show the whole answer"}
            </button>
          )}
        </div>
      )}
    </>
  );
}

// Grammar tip card, with examples from this lesson you can tap to hear.
function TipExercise({ ex }) {
  return (
    <div className="mt-5 rounded-2xl border-2 border-sky-line bg-panel px-4 py-4">
      <p className="text-[19px] font-black text-snow">📘 {ex.title}</p>
      <p className="mt-2 text-[16px] font-bold leading-snug text-snow">{ex.body}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {ex.examples.map(([word, en]) => (
          <li key={word}>
            <button
              type="button"
              onClick={() => speak(word)}
              className="flex w-full items-center gap-3 rounded-xl border-2 border-line bg-ink px-3 py-2 text-left outline-none hover:bg-panel/50 focus-visible:ring-4 focus-visible:ring-sky/40"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky text-ink">
                <SpeakerIcon className="h-5 w-5" />
              </span>
              <span lang={course().id} className="text-[17px] font-extrabold text-snow">
                {word}
              </span>
              <span className="ml-auto text-[14px] font-bold text-fog">{en}</span>
            </button>
          </li>
        ))}
      </ul>
      {ex.extra && <p className="mt-3 text-[14px] font-bold leading-snug text-fog">💡 {ex.extra}</p>}
    </div>
  );
}

const SpeechRecognitionApi = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

function speakSlowly(text) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = course().speech;
    u.rate = 0.55;
    synth.speak(u);
  } catch {
    // no speech support
  }
}

// Pronunciation practice: hear it (normal or slow), then say it. Uses the
// browser's speech recognition when available; otherwise (or if the mic is
// blocked) the learner says it out loud and taps "I said it". Never fails:
// a miss just invites another try.
function SpeakExercise({ ex, result, locked, onResult, onCantSpeak }) {
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState(null); // what recognition heard on the last try
  const [micError, setMicError] = useState(!SpeechRecognitionApi);
  const recRef = useRef(null);
  const romaji = romajiFor(ex.text);

  useEffect(() => {
    speak(ex.text);
    return () => recRef.current?.abort?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function listen() {
    if (!SpeechRecognitionApi || listening) return;
    try {
      const rec = new SpeechRecognitionApi();
      recRef.current = rec;
      rec.lang = course().speech;
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      rec.onresult = (e) => {
        const alts = [...e.results[0]].map((a) => a.transcript);
        const best = alts.reduce((b, a) => (similarity(a, ex.text) > similarity(b, ex.text) ? a : b), alts[0]);
        setHeard(best);
        // Japanese results often come back in kanji, so any clear try counts there.
        const ok = romaji ? best.trim().length > 0 : similarity(best, ex.text) >= 0.6;
        if (ok) onResult({ ok: true, note: `We heard: “${best}”. Sounds great!` });
      };
      rec.onerror = () => setMicError(true);
      rec.onend = () => setListening(false);
      setListening(true);
      rec.start();
    } catch {
      setMicError(true);
      setListening(false);
    }
  }

  const done = result?.ok;

  return (
    <>
      <div className="mt-6 flex flex-col items-center rounded-2xl border-2 border-line px-4 py-5 text-center">
        <p lang={course().id} className="text-[26px] font-black leading-tight text-snow">
          {ex.text}
        </p>
        {romaji && <p className="mt-1 text-[14px] font-bold text-fog">{romaji}</p>}
        <p className="mt-1 text-[15px] font-bold text-fog">“{ex.english}”</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => speak(ex.text)}
            className="flex items-center gap-2 rounded-xl border-2 border-b-4 border-sky-line bg-sky px-3 py-2 text-[14px] font-black text-ink outline-none active:translate-y-[2px] active:border-b-2 focus-visible:ring-4 focus-visible:ring-sky/40"
          >
            <SpeakerIcon className="h-5 w-5" /> Listen
          </button>
          <button
            type="button"
            onClick={() => speakSlowly(ex.text)}
            className="flex items-center gap-2 rounded-xl border-2 border-b-4 border-line px-3 py-2 text-[14px] font-black text-snow outline-none active:translate-y-[2px] active:border-b-2 focus-visible:ring-4 focus-visible:ring-sky/40"
          >
            🐢 Slower
          </button>
        </div>
      </div>

      {!locked && !done && (
        <div className="mt-5 flex flex-col items-center gap-3">
          {!micError && (
            <button
              type="button"
              onClick={listen}
              aria-label={listening ? "Listening…" : "Tap and say it"}
              className={`flex h-20 w-20 items-center justify-center rounded-full border-b-[6px] text-[34px] outline-none focus-visible:ring-4 focus-visible:ring-sky/40 ${
                listening ? "animate-pulse border-cardinal-dark bg-cardinal" : "border-owl-dark bg-owl"
              }`}
            >
              🎤
            </button>
          )}
          <p className="text-center text-[15px] font-bold text-fog">
            {micError
              ? "Say it out loud a few times, then tap the button below."
              : listening
                ? "Listening… say it now!"
                : heard
                  ? `We heard “${heard}”. Try again, slowly!`
                  : "Tap the mic and say it out loud."}
          </p>
          <button
            type="button"
            onClick={() => onResult({ ok: true, note: "Great practice! Saying it out loud really helps." })}
            className={`rounded-xl px-3 py-2 text-[14px] font-black uppercase tracking-wide outline-none focus-visible:ring-4 focus-visible:ring-sky/40 ${
              micError ? `${PRESSABLE} border-owl border-b-owl-dark bg-owl text-ink` : "text-sky hover:brightness-110"
            }`}
          >
            {micError ? "✅ I said it" : "Mic not working? I said it out loud"}
          </button>
          {/* In a library, on the bus…: swap to questions that don't need a voice. */}
          <button
            type="button"
            onClick={onCantSpeak}
            className={`mt-1 w-full rounded-2xl py-3 text-[14px] font-black uppercase tracking-wide text-fog outline-none hover:bg-panel/50 focus-visible:ring-4 focus-visible:ring-sky/40 ${PRESSABLE} border-line`}
          >
            🔇 Can't speak right now
          </button>
          <p className="-mt-1 text-center text-[12px] font-bold text-muted">
            You'll type what you hear instead, for the rest of this practice.
          </p>
        </div>
      )}

      {done && !locked && (
        <p className="mt-5 text-center text-[16px] font-black text-owl-dark">✅ Nice! Tap Check to continue.</p>
      )}
    </>
  );
}

function Footer({ status, ex, ready, note, onCheck, onContinue }) {
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
          {ex.type === "tip" ? "Got it" : "Check"}
        </button>
      </div>
    );
  }

  const correct = status === "correct";
  const answer = ex.type === "build" ? ex.sentence : ex.type === "speak" ? ex.text : ex.answer;
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
      {correct && note && <p className="mt-2 text-[15px] font-bold text-owl-dark">{note}</p>}
      {!correct && (
        <p className="mt-2 text-[16px] font-bold text-cardinal">
          Correct answer: <span lang={course().id} className="font-extrabold">{answer}</span>
          {note && <span className="block text-[14px]">{note}</span>}
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
