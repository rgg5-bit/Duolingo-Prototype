// Beginner lesson content for each topic in lessons.js.
// `words`: four Italian ↔ English pairs. `phrases`: two short sentences the
// user builds from a word bank. Exercises are generated from these.
const CONTENT = {
  intro: {
    words: [
      ["ciao", "hi"],
      ["mi chiamo", "my name is"],
      ["sono", "I am"],
      ["piacere", "nice to meet you"],
    ],
    phrases: [
      ["Ciao, mi chiamo Marco.", "Hi, my name is Marco."],
      ["Piacere, sono Anna.", "Nice to meet you, I am Anna."],
    ],
  },
  greetings: {
    words: [
      ["buongiorno", "good morning"],
      ["buonasera", "good evening"],
      ["arrivederci", "goodbye"],
      ["grazie", "thank you"],
    ],
    phrases: [
      ["Buongiorno, come stai?", "Good morning, how are you?"],
      ["Sto bene, grazie.", "I am fine, thank you."],
    ],
  },
  cafe: {
    words: [
      ["il caffè", "the coffee"],
      ["l'acqua", "the water"],
      ["il cornetto", "the croissant"],
      ["per favore", "please"],
    ],
    phrases: [
      ["Un caffè, per favore.", "A coffee, please."],
      ["Vorrei un cornetto.", "I would like a croissant."],
    ],
  },
  restaurant: {
    words: [
      ["il conto", "the check"],
      ["il menù", "the menu"],
      ["il vino", "the wine"],
      ["il pane", "the bread"],
    ],
    phrases: [
      ["Il conto, per favore.", "The check, please."],
      ["Vorrei il menù.", "I would like the menu."],
    ],
  },
  directions: {
    words: [
      ["dov'è", "where is"],
      ["la stazione", "the station"],
      ["a destra", "to the right"],
      ["a sinistra", "to the left"],
    ],
    phrases: [
      ["Dov'è la stazione?", "Where is the station?"],
      ["Gira a sinistra.", "Turn left."],
    ],
  },
  hotel: {
    words: [
      ["la camera", "the room"],
      ["la chiave", "the key"],
      ["la prenotazione", "the reservation"],
      ["il bagno", "the bathroom"],
    ],
    phrases: [
      ["Ho una prenotazione.", "I have a reservation."],
      ["Dov'è la chiave?", "Where is the key?"],
    ],
  },
  shopping: {
    words: [
      ["quanto costa", "how much is it"],
      ["il negozio", "the shop"],
      ["la borsa", "the bag"],
      ["economico", "cheap"],
    ],
    phrases: [
      ["Quanto costa la borsa?", "How much is the bag?"],
      ["Il negozio è aperto.", "The shop is open."],
    ],
  },
  numbers: {
    words: [
      ["uno", "one"],
      ["due", "two"],
      ["tre", "three"],
      ["dieci", "ten"],
    ],
    phrases: [
      ["Ho due biglietti.", "I have two tickets."],
      ["Costa dieci euro.", "It costs ten euros."],
    ],
  },
  time: {
    words: [
      ["lunedì", "Monday"],
      ["oggi", "today"],
      ["domani", "tomorrow"],
      ["che ore sono", "what time is it"],
    ],
    phrases: [
      ["Oggi è lunedì.", "Today is Monday."],
      ["Sono le tre.", "It is three o'clock."],
    ],
  },
  family: {
    words: [
      ["la madre", "the mother"],
      ["il padre", "the father"],
      ["il fratello", "the brother"],
      ["la sorella", "the sister"],
    ],
    phrases: [
      ["Questa è mia madre.", "This is my mother."],
      ["Ho un fratello.", "I have a brother."],
    ],
  },
  hobbies: {
    words: [
      ["il calcio", "soccer"],
      ["la musica", "music"],
      ["leggere", "to read"],
      ["mi piace", "I like"],
    ],
    phrases: [
      ["Mi piace la musica.", "I like music."],
      ["Mi piace leggere.", "I like to read."],
    ],
  },
};

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
  return sentence.replace(/[.,!?]/g, "").split(/\s+/).filter(Boolean);
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
  const content = CONTENT[lessonId];
  const { words, phrases } = content;

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
      prompt: "Write this in Italian",
      english: en,
      italian: it,
      answer,
      bank: shuffle([...answer, ...distractors(answer, content)]),
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

// Say Italian text out loud where the browser supports it.
export function speak(text) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "it-IT";
    u.rate = 0.9;
    synth.speak(u);
  } catch {
    // No speech support: the lesson still works silently.
  }
}

const DONE_KEY = "duo-prototype:completed-lessons";

export function loadCompleted() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DONE_KEY));
    return Array.isArray(parsed) ? parsed.filter((id) => CONTENT[id]) : [];
  } catch {
    return [];
  }
}

export function saveCompleted(ids) {
  try {
    if (ids.length) localStorage.setItem(DONE_KEY, JSON.stringify(ids));
    else localStorage.removeItem(DONE_KEY);
  } catch {
    // Storage can be blocked (private mode); the in-memory state still works.
  }
}
