import { course } from "./courses.js";
import { hasKana, toRomaji } from "./kana.js";
import { buildExercises, shuffle, tokens } from "./lessonContent.js";

// The practice steps on each homepage path (see trail.js), all built from the
// lesson's own words and sentences in courses.js so every language and topic
// gets them for free. They get harder level by level: more listening, fewer
// hints, then mixed challenges.

export const STEP_INFO = {
  lesson: { emoji: "⭐", name: "Lesson" },
  writing: { emoji: "✏️", name: "Writing" },
  grammar: { emoji: "📘", name: "Grammar" },
  speaking: { emoji: "🎤", name: "Speaking" },
  listening: { emoji: "👂", name: "Listening" },
  build: { emoji: "🧩", name: "Sentences" },
  meaning: { emoji: "💬", name: "Meaning" },
  review: { emoji: "🔁", name: "Review" },
  challenge: { emoji: "⚡", name: "Challenge" },
  final: { emoji: "🏆", name: "Final check" },
  chest: { emoji: "🎁", name: "Reward chest" },
  trophy: { emoji: "🏆", name: "Trophy" },
};

export const LEVELS = ["Basics", "Sentences", "Listen & review", "Mastery"];

// Every path, in order: 4 levels of 4 steps, each ending in a reward (20 in all).
export const PATH = [
  { mode: "lesson", level: 0 },
  { mode: "writing", variant: "words", level: 0 },
  { mode: "grammar", level: 0 },
  { mode: "speaking", variant: "words", level: 0 },
  { mode: "chest", level: 0 },

  { mode: "listening", variant: "pick", level: 1 },
  { mode: "writing", variant: "sentences", level: 1 },
  { mode: "build", level: 1 },
  { mode: "speaking", variant: "sentences", level: 1 },
  { mode: "chest", level: 1 },

  { mode: "review", level: 2 },
  { mode: "listening", variant: "dictation", level: 2 },
  { mode: "meaning", level: 2 },
  { mode: "grammar", variant: "again", level: 2 },
  { mode: "chest", level: 2 },

  { mode: "writing", variant: "pro", level: 3 },
  { mode: "speaking", variant: "all", level: 3 },
  { mode: "challenge", level: 3 },
  { mode: "final", level: 3 },
  { mode: "trophy", level: 3 },
].map((s, index) => ({ ...s, index, ...STEP_INFO[s.mode] }));

export const isReward = (mode) => mode === "chest" || mode === "trophy";

// Accent keys under the typing box, so beginners don't hunt for them.
export const ACCENT_KEYS = {
  es: ["á", "é", "í", "ó", "ú", "ñ", "ü", "¿", "¡"],
  fr: ["é", "è", "ê", "à", "â", "ç", "ô", "û", "ï"],
  de: ["ä", "ö", "ü", "ß"],
  it: ["à", "è", "é", "ì", "ò", "ù"],
  ja: [],
};

// ---------- Grammar tips ----------

const ARTICLES = {
  es: { options: ["el", "la"], words: ["el", "la"] },
  fr: { options: ["le", "la"], words: ["le", "la"] },
  it: { options: ["il", "la", "lo"], words: ["il", "la", "lo"] },
  de: { options: ["der", "die", "das"], words: ["der", "die", "das"] },
};

const TIPS = {
  es: {
    title: "El or la?",
    body: "Every Spanish noun is either masculine or feminine. Masculine words use el (the), feminine words use la.",
    extra: "Words ending in -o are usually masculine, words ending in -a usually feminine.",
  },
  fr: {
    title: "Le or la?",
    body: "Every French noun is masculine or feminine. Masculine words use le (the), feminine words use la.",
    extra: "Before a vowel, both become l': l'eau (the water).",
  },
  it: {
    title: "Il, lo or la?",
    body: "Italian nouns are masculine or feminine. Most masculine words use il, feminine words use la.",
    extra: "Masculine words starting with z or s + consonant use lo, and before a vowel it's l'.",
  },
  de: {
    title: "Der, die or das?",
    body: "German has three genders. Each noun uses der (masculine), die (feminine) or das (neuter) for 'the'.",
    extra: "There's no reliable rule, so learn each word together with its article.",
  },
  ja: {
    title: "Little words called particles",
    body: "Japanese uses small words after a noun to show its job in the sentence.",
    extra: "は (wa) marks the topic, を (o) marks what you want or do, が (ga) marks what exists or what you like, に (ni) marks a direction or place, and か at the end makes a question.",
  },
};

// For topics with few "the" words (greetings, numbers…): a word-order tip instead.
const ORDER_TIPS = {
  es: {
    title: "Building a sentence",
    body: "Simple Spanish sentences often follow the same order as English: who → action → what.",
    extra: "Questions start with ¿ and end with ?, like ¿Cómo estás?",
  },
  fr: {
    title: "Building a sentence",
    body: "Simple French sentences often follow the same order as English: who → action → what.",
    extra: "French puts a space before ? and !, like Comment ça va ?",
  },
  it: {
    title: "Building a sentence",
    body: "Italian often leaves out “I” and “you”, because the verb's ending already shows who's talking.",
    extra: "Sono Anna = I am Anna (no word for “I” needed).",
  },
  de: {
    title: "Building a sentence",
    body: "In a simple German sentence, the verb is the second idea.",
    extra: "All German nouns start with a capital letter, like der Bahnhof.",
  },
};

// Irregular cases that would confuse a first quiz (agua is feminine but takes "el").
const ARTICLE_EXCEPTIONS = ["el agua"];

const PARTICLES = ["は", "を", "が", "に", "か"];

// Mix articles in the examples (el café, la cuenta, el vino…) so both are shown.
function mixArticles(list) {
  const groups = {};
  list.forEach((x) => (groups[x.article] ??= []).push(x));
  const out = [];
  const keys = Object.keys(groups);
  for (let i = 0; out.length < list.length; i++) keys.forEach((k) => groups[k][i] && out.push(groups[k][i]));
  return out;
}

// "el café" → { article: "el", noun: "café" } (no elided l' words: too tricky for a first quiz)
function splitArticle(word, lang) {
  const set = ARTICLES[lang];
  if (!set) return null;
  const [first, ...rest] = word.split(" ");
  if (!set.words.includes(first.toLowerCase()) || !rest.length) return null;
  return { article: first.toLowerCase(), noun: rest.join(" ") };
}

function grammarExercises(lessonId, lesson) {
  const lang = course().id;
  const tip = TIPS[lang];
  const out = [];

  if (lang === "ja") {
    // Examples and quizzes from the lesson's sentences that contain a particle.
    const withParticle = lesson.phrases.filter(([ja]) => tokens(ja).some((t) => PARTICLES.includes(t)));
    out.push({ type: "tip", prompt: "Grammar tip", ...tip, examples: lesson.phrases.slice(0, 2) });
    withParticle.forEach(([ja, en]) => {
      const toks = tokens(ja);
      const idx = toks.findIndex((t) => PARTICLES.includes(t));
      const shown = toks.map((t, i) => (i === idx ? "___" : t)).join(" ");
      out.push({
        type: "choice",
        prompt: "Which little word fits?",
        hint: `${shown}  ·  “${en}”`,
        options: shuffle([toks[idx], ...PARTICLES.filter((p) => p !== toks[idx])].slice(0, 4)),
        answer: toks[idx],
        speakAnswerText: ja,
      });
    });
  } else {
    const withArticle = mixArticles(
      lesson.words
        .filter(([w]) => !ARTICLE_EXCEPTIONS.includes(w.toLowerCase()))
        .map(([w, en]) => ({ ...splitArticle(w, lang), word: w, en }))
        .filter((x) => x.article),
    );
    if (withArticle.length >= 2) {
      out.push({ type: "tip", prompt: "Grammar tip", ...tip, examples: withArticle.slice(0, 3).map((x) => [x.word, x.en]) });
    } else {
      out.push({ type: "tip", prompt: "Grammar tip", ...ORDER_TIPS[lang], examples: lesson.phrases.slice(0, 2) });
    }
    withArticle.slice(0, 3).forEach((x) => {
      if (withArticle.length < 2) return; // the word-order tip covers this lesson
      out.push({
        type: "choice",
        prompt: `Which word means “the” here?`,
        hint: `___ ${x.noun}  ·  “${x.en}”`,
        options: ARTICLES[lang].options,
        answer: x.article,
        speakAnswerText: x.word,
      });
    });
  }

  // Word order: put a sentence together (always works, any language).
  lesson.phrases.forEach(([sentence, en]) => {
    const answer = tokens(sentence);
    out.push({
      type: "build",
      prompt: "Put the words in the right order",
      english: en,
      sentence,
      answer,
      bank: shuffle(answer),
    });
  });

  return out;
}

// ---------- Exercise makers (all from the lesson's words and sentences) ----------

const typeIt = ([target, en], { hints = true } = {}) => ({
  type: "type",
  prompt: `Type this ${target.trim().includes(" ") ? "sentence" : "word"} in ${course().name}`,
  english: en,
  answer: target,
  noHint: !hints,
});

// Hear it, type it (no text shown; the meaning is there as help).
const dictation = ([target, en], { hints = true } = {}) => ({
  type: "type",
  prompt: "Type what you hear",
  audio: true,
  english: en,
  answer: target,
  noHint: !hints,
});

const sayIt = ([target, en], prompt = "Listen, then say it") => ({ type: "speak", prompt, text: target, english: en });

// Hear a word, pick what it means.
const listenPick = ([target, en], words) => ({
  type: "choice",
  prompt: "What did you hear?",
  listen: true,
  word: target,
  speak: target,
  options: shuffle(words.map(([, e]) => e)),
  answer: en,
});

// Build a sentence from a word bank (with a few extra words to skip).
function buildIt([target, en], lesson) {
  const answer = tokens(target);
  const extras = shuffle(
    [...new Set(lesson.words.flatMap(([w]) => tokens(w)))].filter((t) => !answer.includes(t)),
  ).slice(0, 3);
  return {
    type: "build",
    prompt: `Write this in ${course().name}`,
    english: en,
    sentence: target,
    answer,
    bank: shuffle([...answer, ...extras]),
  };
}

// Read (and hear) a sentence, pick its meaning from sentences in other lessons.
function meaningOf([target, en], lessonId) {
  const others = Object.entries(course().content)
    .filter(([id]) => id !== lessonId)
    .flatMap(([, c]) => c.phrases.map(([, e]) => e))
    .filter((e) => e !== en);
  return {
    type: "choice",
    prompt: "What does this mean?",
    hint: target,
    speak: target,
    options: shuffle([en, ...shuffle(others).slice(0, 2)]),
    answer: en,
  };
}

export function buildPractice(lessonId, mode, variant) {
  const lesson = course().content[lessonId];
  const { words, phrases } = lesson;
  let list;

  switch (mode) {
    case "writing":
      list =
        variant === "words"
          ? [typeIt(words[0]), typeIt(words[1]), typeIt(words[2]), typeIt(words[3])]
          : variant === "pro"
            ? [typeIt(words[3], { hints: false }), typeIt(phrases[0], { hints: false }), typeIt(phrases[1], { hints: false })]
            : [typeIt(words[0]), typeIt(phrases[0]), typeIt(phrases[1])];
      break;
    case "grammar": {
      const g = grammarExercises(lessonId, lesson);
      // Second time round: skip the tip card, shuffle the questions.
      list = variant === "again" ? shuffle(g.filter((e) => e.type !== "tip")) : g;
      break;
    }
    case "speaking":
      list =
        variant === "words"
          ? [sayIt(words[0]), sayIt(words[1]), sayIt(words[2])]
          : variant === "sentences"
            ? [sayIt(words[3]), sayIt(phrases[0], "Now a whole sentence"), sayIt(phrases[1], "One more sentence")]
            : [sayIt(words[0]), sayIt(words[2]), sayIt(phrases[0], "Now a whole sentence"), sayIt(phrases[1], "One more sentence")];
      break;
    case "listening":
      list =
        variant === "dictation"
          ? [dictation(words[1]), dictation(phrases[0]), dictation(phrases[1])]
          : [listenPick(words[0], words), listenPick(words[1], words), listenPick(words[2], words), listenPick(words[3], words)];
      break;
    case "build":
      list = [buildIt(phrases[0], lesson), buildIt(phrases[1], lesson), typeIt(words[2])];
      break;
    case "meaning":
      list = [meaningOf(phrases[0], lessonId), meaningOf(phrases[1], lessonId), listenPick(words[3], words)];
      break;
    case "review":
      list = shuffle(buildExercises(lessonId));
      break;
    case "challenge":
      list = [
        dictation(phrases[0], { hints: false }),
        meaningOf(phrases[1], lessonId),
        buildIt(phrases[1], lesson),
        listenPick(words[2], words),
        typeIt(words[0], { hints: false }),
      ];
      break;
    case "final":
      list = [
        typeIt(phrases[0], { hints: false }),
        dictation(phrases[1], { hints: false }),
        meaningOf(phrases[0], lessonId),
        buildIt(phrases[0], lesson),
        sayIt(phrases[1], "Last one: say it!"),
        listenPick(words[1], words),
      ];
      break;
    default:
      list = buildExercises(lessonId);
  }
  return list.map((ex, i) => ({ ...ex, key: `${lessonId}-${mode}-${variant ?? ""}-${i}` }));
}

// ---------- Forgiving answer checks ----------

const stripAccents = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const clean = (s) =>
  s
    .toLowerCase()
    .replace(/[.,!?¿¡。、？！…"“”'’]/g, (m) => (m === "'" || m === "’" ? "'" : " "))
    .replace(/\s+/g, " ")
    .trim();
// Long vowels typed either way (koohii / kohi / kōhī) count the same.
const looseRomaji = (s) =>
  stripAccents(s).replace(/[\s']/g, "").replace(/ou/g, "o").replace(/([aeiou])\1+/g, "$1");

function distance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

// Typed answer → { ok, note }. Accents and one small typo still pass, with a note.
export function checkTyped(typed, answer) {
  const t = clean(typed);
  const a = clean(answer);
  if (!t) return { ok: false };
  if (t === a) return { ok: true };

  if (hasKana(answer)) {
    // Japanese: kana or rōmaji both fine.
    const tr = hasKana(t) ? looseRomaji(toRomaji(t)) : looseRomaji(t);
    const ar = looseRomaji(toRomaji(answer));
    if (tr === ar) return { ok: true, note: hasKana(t) ? null : `In kana: ${answer}` };
    if (distance(tr, ar) <= 1) return { ok: true, note: `Almost! It's ${toRomaji(answer)} (${answer})` };
    return { ok: false, romaji: toRomaji(answer) };
  }

  if (stripAccents(t) === stripAccents(a)) return { ok: true, note: `Watch the accents: ${answer}` };
  const allowed = a.length > 12 ? 2 : 1;
  if (distance(stripAccents(t), stripAccents(a)) <= allowed) return { ok: true, note: `Small typo! It's ${answer}` };
  return { ok: false };
}

// How close a heard phrase is to the target (0–1), ignoring accents and punctuation.
export function similarity(heard, target) {
  const a = stripAccents(clean(heard)).replace(/\s/g, "");
  const b = stripAccents(clean(target)).replace(/\s/g, "");
  if (!a || !b) return 0;
  return 1 - distance(a, b) / Math.max(a.length, b.length);
}

export function romajiFor(text) {
  return hasKana(text) ? toRomaji(text) : null;
}
