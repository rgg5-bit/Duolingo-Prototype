import { BackArrow, SpeakerIcon } from "./Icons.jsx";
import { guideFor, guidePlace } from "./guides.js";

// "Prep like a local": the Traveler guide for the trip's destination, opened
// from the guidebook button on the homepage's unit banner.

const SECTIONS = [
  { id: "norms", emoji: "🧭", title: "Cultural norms", tint: "#ddf4ff", line: "#84d8ff", ink: "#1899d6" },
  { id: "slang", emoji: "💬", title: "Slang words", tint: "#f3e6ff", line: "#d9b3ff", ink: "#9a4fd6" },
  { id: "respect", emoji: "🙏", title: "Signs of respect", tint: "#fff4d1", line: "#ffd966", ink: "#cd7900" },
  { id: "dos", emoji: "✅", title: "Do's", tint: "#e9fbd9", line: "#a5ed6e", ink: "#58a700" },
  { id: "donts", emoji: "🚫", title: "Don'ts", tint: "#ffe5e5", line: "#ffb2b2", ink: "#ea2b2b" },
];

function speak(text, lang) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.9;
    synth.speak(u);
  } catch {
    // No speech support: the word is still on screen.
  }
}

function jumpTo(id) {
  document.getElementById(`guide-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionCard({ section, children }) {
  return (
    <section
      id={`guide-${section.id}`}
      aria-labelledby={`guide-${section.id}-title`}
      className="scroll-mt-[132px] animate-pop overflow-hidden rounded-2xl border-2 border-b-4"
      style={{ borderColor: section.line }}
    >
      <h2
        id={`guide-${section.id}-title`}
        className="flex items-center gap-2.5 px-4 py-3 text-[17px] font-black uppercase tracking-wide"
        style={{ background: section.tint, color: section.ink }}
      >
        <span aria-hidden="true" className="text-[22px] leading-none">
          {section.emoji}
        </span>
        {section.title}
      </h2>
      <div className="bg-paper px-4 py-3">{children}</div>
    </section>
  );
}

function TipList({ items, marker }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((tip) => (
        <li key={tip} className="flex gap-3 text-[15px] font-bold leading-snug text-eel">
          <span aria-hidden="true" className="mt-px shrink-0 text-[15px]">
            {marker}
          </span>
          <span>{tip}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TravelerGuide({ onBack }) {
  const place = guidePlace();
  const guide = guideFor(place.countryId);
  const where = place.city ? `${place.city}, ${place.country}` : place.country;
  const byId = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col bg-paper sm:border-x-2 sm:border-swan">
      {/* Top bar + section shortcuts */}
      <header className="sticky top-0 z-20 bg-paper">
        <div className="flex h-[60px] items-center gap-2 px-3">
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="rounded-lg p-1 text-hare outline-none hover:text-wolf focus-visible:ring-4 focus-visible:ring-macaw/30"
          >
            <BackArrow className="h-7 w-7" />
          </button>
          <p className="flex-1 text-center text-[14px] font-black uppercase tracking-[0.1em] text-hare">Traveler guide</p>
          <span className="w-9" aria-hidden="true" />
        </div>
        <nav
          aria-label="Guide sections"
          className="flex gap-2 overflow-x-auto border-b-2 border-swan px-4 pb-3"
          style={{ scrollbarWidth: "none" }}
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpTo(s.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-b-4 border-swan px-3 py-1.5 text-[13px] font-extrabold text-wolf outline-none hover:bg-polar focus-visible:ring-4 focus-visible:ring-macaw/30 active:translate-y-[2px] active:border-b-2"
            >
              <span aria-hidden="true">{s.emoji}</span>
              {s.title}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex flex-col gap-5 px-4 pt-4 pb-12">
        {/* Hero */}
        <div className="iridescent-banner animate-pop rounded-2xl border-b-4 border-whale px-5 py-5 text-white">
          <h1 className="text-[30px] font-black leading-tight">Prep like a local</h1>
          <p className="mt-1 flex items-center gap-2 text-[17px] font-extrabold text-white/95">
            <span aria-hidden="true" className="text-[22px] leading-none">
              {place.emoji}
            </span>
            {where || "Your next trip"}
          </p>
          <p className="mt-2 text-[14px] font-bold leading-snug text-white/85">
            {guide.general
              ? "Travel basics, plus a few words to try. Tap a word to hear it."
              : "How people do things here, words you'll hear, and what to avoid. Tap a word to hear it."}
          </p>
        </div>

        <SectionCard section={byId.norms}>
          <TipList items={guide.norms} marker="•" />
        </SectionCard>

        <SectionCard section={byId.slang}>
          <ul className="flex flex-col gap-2.5">
            {guide.slang.map(({ word, reading, meaning }) => (
              <li key={word}>
                <button
                  type="button"
                  onClick={() => speak(word, guide.speech)}
                  aria-label={`${word}${reading ? ` (${reading})` : ""}: ${meaning}. Play`}
                  className="flex w-full items-center gap-3 rounded-xl border-2 border-b-4 border-swan px-3 py-2.5 text-left outline-none hover:bg-polar focus-visible:ring-4 focus-visible:ring-macaw/30 active:translate-y-[2px] active:border-b-2"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-macaw text-white">
                    <SpeakerIcon className="h-5 w-5" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span lang={guide.speech} className="text-[17px] font-black text-eel">
                      {word}
                      {reading && <span className="ml-2 text-[14px] font-bold text-hare">{reading}</span>}
                    </span>
                    <span className="text-[14px] font-bold text-wolf">{meaning}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard section={byId.respect}>
          <TipList items={guide.respect} marker="🤝" />
        </SectionCard>

        <SectionCard section={byId.dos}>
          <TipList items={guide.dos} marker="✔️" />
        </SectionCard>

        <SectionCard section={byId.donts}>
          <TipList items={guide.donts} marker="✖️" />
        </SectionCard>

        <button
          type="button"
          onClick={onBack}
          className="mt-1 w-full rounded-2xl border-2 border-b-4 border-[#58a700] bg-[#58cc02] py-3.5 text-[16px] font-black uppercase tracking-[0.08em] text-white outline-none hover:brightness-105 focus-visible:ring-4 focus-visible:ring-macaw/30 active:translate-y-[2px] active:border-b-2"
        >
          Back to my lessons
        </button>
      </main>
    </div>
  );
}
