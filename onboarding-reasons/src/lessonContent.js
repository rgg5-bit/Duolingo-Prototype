import { course, courseKey } from "./courses.js";

// Beginner lesson content for each topic in lessons.js comes from the active
// course (courses.js): four word pairs and two sentences the user builds from a
// word bank. Exercises are generated from these.
const content = (lessonId) => course().content[lessonId];

export function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// "Ciao, mi chiamo Marco." → ["Ciao", "mi", "chiamo", "Marco"]
export function tokens(sentence) {
  return sentence.replace(/[.,!?¿¡。、？！]/g, "").split(/\s+/).filter(Boolean);
}

// Distractor words for a word bank: words from the rest of the lesson that
// aren't already in the answer.
function distractors(answer, content, count = 3) {
  const used = new Set(answer.map((t) => t.toLowerCase()));
  const pool = [
    ...content.phrases.flatMap(([it]) => tokens(it)),
    ...content.words.flatMap(([it]) => tokens(it)),
  ].filter((t) => {
    const key = t.toLowerCase();
    if (used.has(key)) return false;
    used.add(key);
    return true;
  });
  return shuffle(pool).slice(0, count);
}

// Six exercises per lesson: learn two words, match all four, build a
// sentence, recall a word from English, then build a second sentence.
export function buildExercises(lessonId) {
  const lesson = content(lessonId);
  const { words, phrases } = lesson;

  const choice = ([it, en]) => ({
    type: "choice",
    prompt: "What does this mean?",
    word: it,
    speak: it,
    options: shuffle(words.map(([, e]) => e)),
    answer: en,
  });

  const reverse = ([it, en]) => ({
    type: "choice",
    prompt: `How do you say “${en}”?`,
    options: shuffle(words.map(([i]) => i)),
    answer: it,
    speakAnswer: true,
  });

  const build = ([it, en]) => {
    const answer = tokens(it);
    return {
      type: "build",
      prompt: `Write this in ${course().name}`,
      english: en,
      sentence: it,
      answer,
      bank: shuffle([...answer, ...distractors(answer, lesson)]),
    };
  };

  return [
    choice(words[0]),
    choice(words[1]),
    { type: "match", prompt: "Tap the matching pairs", pairs: words },
    build(phrases[0]),
    reverse(words[2]),
    build(phrases[1]),
  ].map((ex, i) => ({ ...ex, key: `${lessonId}-${i}` }));
}

// Say text in the course language out loud where the browser supports it.
export function speak(text) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = course().speech;
    u.rate = 0.9;
    synth.speak(u);
  } catch {
    // No speech support: the lesson still works silently.
  }
}

const DONE_KEY = () => courseKey("duo-prototype:completed-lessons");

export function loadCompleted() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DONE_KEY()));
    return Array.isArray(parsed) ? parsed.filter((id) => content(id)) : [];
  } catch {
    return [];
  }
}

export function saveCompleted(ids) {
  try {
    if (ids.length) localStorage.setItem(DONE_KEY(), JSON.stringify(ids));
    else localStorage.removeItem(DONE_KEY());
  } catch {
    // Storage can be blocked (private mode); the in-memory state still works.
  }
}
