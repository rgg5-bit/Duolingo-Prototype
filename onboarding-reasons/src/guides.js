import { DESTINATIONS, loadTrip } from "../../traveler-mode/src/homeData.js";
import { course } from "./courses.js";
import { FACTS, factCountry } from "./facts.js";
import { getCity, getCountry } from "./speakers.js";

// "Prep like a local" traveler guides, per country (ids from speakers.js).
// Each guide: cultural norms, slang (word + meaning, read aloud in `speech`),
// signs of respect, do's and don'ts. Like facts.js and speakers.js, this is
// prototype content: have someone check it before presenting it as fact.
export const GUIDES = {
  spain: {
    speech: "es-ES",
    norms: [
      "Meals run late: lunch is around 2–3 p.m. and dinner often starts at 9 p.m. or later.",
      "Lingering at the table after a meal to talk (“la sobremesa”) is normal, so nobody will rush you out.",
      "In Barcelona, Catalan is an official language too, so you'll see signs and menus in Catalan.",
    ],
    slang: [
      { word: "¡Vale!", meaning: "OK, sounds good" },
      { word: "Guay", meaning: "Cool" },
      { word: "¡Qué pasada!", meaning: "That's amazing!" },
      { word: "Tío / tía", meaning: "Dude (between friends)" },
    ],
    respect: [
      "Say “Buenos días” or just “Buenas” when you walk into a shop, bar or elevator.",
      "Friends greet with two kisses on the cheek; a handshake is fine in formal settings.",
      "Use “usted” with older people and in formal situations until they invite you to say “tú”.",
    ],
    dos: [
      "Ask for the bill (“La cuenta, por favor”). It won't come until you do.",
      "Try the “menú del día” at lunch: several courses at a set price.",
      "Get a waiter's attention with “Perdone” or “Disculpe”.",
    ],
    donts: [
      "Don't plan on dinner at 6 p.m. Many kitchens aren't open yet.",
      "Don't over-tip. Rounding up or leaving some change is plenty.",
      "Don't walk around town in swimwear. Some cities, like Barcelona, can fine it.",
    ],
  },

  mexico: {
    speech: "es-MX",
    norms: [
      "The main meal (“la comida”) is eaten in the mid-afternoon, around 2–4 p.m.",
      "“Ahorita” can mean right now, in a bit, or much later. Ask if timing matters.",
      "A tip of about 10–15% is usual at sit-down restaurants.",
    ],
    slang: [
      { word: "¿Qué onda?", meaning: "What's up?" },
      { word: "¡Qué chido!", meaning: "How cool!" },
      { word: "Güey", meaning: "Dude (casual, between friends)" },
      { word: "¡Órale!", meaning: "Wow! / OK, let's go!" },
    ],
    respect: [
      "Greet everyone in the room when you arrive, not just the person you came to see.",
      "Say “¡Buen provecho!” to people who are eating, even strangers in a restaurant.",
      "Use “usted” with older people, and say “Con permiso” when you squeeze past someone.",
    ],
    dos: [
      "Carry small bills and coins for markets, street food and tips.",
      "Drink bottled or filtered water.",
      "Try street tacos from a busy stand. A line of locals is a good sign.",
    ],
    donts: [
      "Don't drink tap water.",
      "Don't flush toilet paper if there's a bin next to the toilet; older pipes can clog.",
      "Don't skip the greeting and jump straight to your question.",
    ],
  },

  argentina: {
    speech: "es-AR",
    norms: [
      "Dinner usually starts after 9 p.m., and restaurants fill up late.",
      "People say “vos” instead of “tú”: “¿Vos sos de acá?” (Are you from here?).",
      "Mate, a tea-like drink, is shared from one gourd and passed around the group.",
    ],
    slang: [
      { word: "Che", meaning: "Hey / buddy" },
      { word: "¡Bárbaro!", meaning: "Great!" },
      { word: "Re", meaning: "Really, very (“re lindo” = really nice)" },
      { word: "Laburo", meaning: "Work, a job" },
    ],
    respect: [
      "A kiss on the right cheek is a common hello, even between male friends.",
      "When someone hosts an asado (barbecue), thank the cook: “¡Un aplauso para el asador!”",
      "If you're offered mate, accept it. Sharing it is a sign of friendship.",
    ],
    dos: [
      "Pass the mate back to the person who serves it, not to your neighbor.",
      "Carry some cash. Some places offer a better price for paying in cash (“efectivo”).",
      "Try dulce de leche, empanadas and a steak at a parrilla.",
    ],
    donts: [
      "Don't say “gracias” when you're handed mate unless you want to stop: it means “no more for me”.",
      "Don't arrive exactly on time to a party. 15–30 minutes late is normal (but be on time for business).",
      "Don't joke about the Falklands / Malvinas. It's a sensitive topic.",
    ],
  },

  colombia: {
    speech: "es-CO",
    norms: [
      "Colombian Spanish is very polite: “¿Me regala un café?” (literally “will you gift me a coffee?”) is how you order.",
      "A “tinto” is a small black coffee, sold everywhere, often from street carts.",
      "Many people use “usted” even with friends and family.",
    ],
    slang: [
      { word: "Parce / parcero", meaning: "Buddy (especially in Medellín)" },
      { word: "¡Qué chévere!", meaning: "How cool!" },
      { word: "Bacano", meaning: "Cool, great" },
      { word: "¡Qué pena!", meaning: "Sorry! / How embarrassing!" },
    ],
    respect: [
      "Always start with “Buenos días” or “Buenas tardes” before asking for anything.",
      "Reply to “gracias” with “Con mucho gusto” (with pleasure).",
      "Use “usted” with people you don't know.",
    ],
    dos: [
      "Use registered taxis or ride apps, especially at night.",
      "Try an arepa and a fresh fruit juice from a local stand.",
      "Learn the saying “No dar papaya”: don't make yourself an easy target.",
    ],
    donts: [
      "Don't flash your phone or valuables in crowded places.",
      "Don't joke about drug lords or crime as a tourist. It's painful history for many.",
      "Don't skip greetings. Jumping straight to business feels rude.",
    ],
  },

  france: {
    speech: "fr-FR",
    norms: [
      "Say “Bonjour” when you walk into a shop. Skipping it can come across as rude.",
      "Many small restaurants serve lunch around 12–2 p.m., then close until dinner.",
      "Service is included in restaurant bills (“service compris”), so tipping is optional.",
    ],
    slang: [
      { word: "Ouais", meaning: "Yeah" },
      { word: "Sympa", meaning: "Nice, friendly" },
      { word: "Ça marche !", meaning: "OK, works for me!" },
      { word: "Bof", meaning: "Meh" },
    ],
    respect: [
      "Add “Madame” or “Monsieur”: “Bonjour, Madame.”",
      "Use “vous” with people you don't know; wait to be invited to use “tu”.",
      "Friends greet with “la bise”, kisses on the cheek. How many depends on the region.",
    ],
    dos: [
      "Ask for the bill (“L'addition, s'il vous plaît”). It won't come until you do.",
      "Keep your voice down on public transport and in restaurants.",
      "Start in French, even a little. People appreciate the effort.",
    ],
    donts: [
      "Don't open with English before saying “Bonjour”.",
      "Don't call a waiter “garçon”. Say “Monsieur” or “S'il vous plaît”.",
      "Don't use “tu” with strangers or shop staff.",
    ],
  },

  canada: {
    speech: "fr-CA",
    norms: [
      "In Québec, French is the official language, and signs are in French first.",
      "Tipping about 15–20% at restaurants is customary.",
      "Price tags usually don't include sales tax; it's added at the register.",
    ],
    slang: [
      { word: "Bienvenue", meaning: "You're welcome (as well as “welcome”)" },
      { word: "Magasiner", meaning: "To go shopping" },
      { word: "Le dépanneur", meaning: "Corner store" },
      { word: "Pantoute", meaning: "Not at all" },
    ],
    respect: [
      "Start in French. You'll often hear “Bonjour-hi!”, and you can choose either.",
      "Friends greet with a kiss on each cheek.",
      "Use “vous” with people you don't know.",
    ],
    dos: [
      "Try poutine, and maple taffy in winter.",
      "Dress in layers in winter. It can be very cold outside and warm inside.",
      "Say “Merci” and “Bonne journée” (have a good day) when leaving a shop.",
    ],
    donts: [
      "Don't assume Québécois French is “wrong” French. It's its own variety.",
      "Don't forget to add tax and tip when budgeting a meal.",
      "Don't call people from Québec simply “French”.",
    ],
  },

  italy: {
    speech: "it-IT",
    norms: [
      "Cappuccino is a breakfast drink. After a meal, order an espresso (“un caffè”).",
      "At many coffee bars you pay at the register first, then show your receipt at the counter.",
      "Restaurants often add a small per-person cover charge (“coperto”) to the bill.",
    ],
    slang: [
      { word: "Dai!", meaning: "Come on!" },
      { word: "Boh", meaning: "Dunno" },
      { word: "Magari!", meaning: "I wish! / If only!" },
      { word: "Allora…", meaning: "So… / Well…" },
    ],
    respect: [
      "Greet with “Buongiorno” (morning) or “Buonasera” (afternoon and evening).",
      "Use “Lei” with strangers and older people.",
      "Cover your shoulders and knees when visiting churches.",
    ],
    dos: [
      "Drink your coffee standing at the bar. It's often cheaper than sitting.",
      "Validate regional train tickets before boarding if they aren't dated.",
      "Ask the vendor before you pick up fruit and vegetables at a market.",
    ],
    donts: [
      "Don't sit on the Spanish Steps in Rome. You can be fined.",
      "Don't ask for parmesan on seafood pasta.",
      "Don't expect lunch at 11 a.m. or dinner at 6 p.m. in most restaurants.",
    ],
  },

  germany: {
    speech: "de-DE",
    norms: [
      "Most shops are closed on Sundays, so stock up on Saturday.",
      "Many bottles carry a deposit (“Pfand”) that you get back when you return them.",
      "Quiet hours (“Ruhezeit”) are taken seriously, especially at night and on Sundays.",
    ],
    slang: [
      { word: "Na?", meaning: "Hey, how's it going?" },
      { word: "Krass!", meaning: "Wow! / Intense!" },
      { word: "Alles klar", meaning: "All right / Got it" },
      { word: "Feierabend", meaning: "Time off after work" },
    ],
    respect: [
      "Be on time. Even a few minutes late deserves a quick message.",
      "Use “Sie” with strangers until they offer “du”.",
      "When toasting (“Prost!”), look the other person in the eye.",
    ],
    dos: [
      "Carry some cash. Smaller places may not take cards.",
      "Stand on the right on escalators so people can walk past.",
      "Return your bottles at the machines in supermarkets to get your Pfand back.",
    ],
    donts: [
      "Don't walk in the bike lanes. Cyclists come fast.",
      "Don't cross on a red light, especially near children.",
      "Don't make loud noise late at night or on Sundays.",
    ],
  },

  austria: {
    speech: "de-AT",
    norms: [
      "Most shops are closed on Sundays.",
      "In Viennese coffee houses, coffee comes with a glass of water, and staying for hours is fine.",
      "Titles matter: people may be addressed as “Frau Doktor” or “Herr Magister”.",
    ],
    slang: [
      { word: "Servus", meaning: "Hi / Bye (casual)" },
      { word: "Leiwand", meaning: "Great (Viennese)" },
      { word: "Baba", meaning: "Bye (Viennese, casual)" },
      { word: "Gemma!", meaning: "Let's go!" },
    ],
    respect: [
      "“Grüß Gott” is a common, friendly hello, especially outside Vienna.",
      "Use “Sie” with strangers until invited to use “du”.",
      "Be on time for appointments and tours.",
    ],
    dos: [
      "Linger over a coffee and cake in a traditional coffee house.",
      "Say “Mahlzeit!” around lunchtime. It's a common greeting.",
      "Carry some cash for small cafés and markets.",
    ],
    donts: [
      "Don't call Austrians German.",
      "Don't expect shops to be open on Sunday.",
      "Don't rush your waiter. Ask for the bill (“Zahlen, bitte!”).",
    ],
  },

  japan: {
    speech: "ja-JP",
    norms: [
      "Tipping isn't customary, and leaving extra money can confuse staff.",
      "On trains, phones stay on silent, and people avoid calls.",
      "Many homes and some restaurants ask you to take off your shoes at the entrance.",
    ],
    slang: [
      { word: "やばい", reading: "yabai", meaning: "Awesome, or terrible (depends on context)" },
      { word: "マジ?", reading: "maji?", meaning: "Seriously?" },
      { word: "すごい!", reading: "sugoi!", meaning: "Amazing!" },
      { word: "お疲れ様", reading: "otsukaresama", meaning: "Thanks for your hard work" },
    ],
    respect: [
      "Bow when greeting or thanking someone. A small nod is fine for visitors.",
      "Say “itadakimasu” before eating and “gochisōsama” after.",
      "Hand over and receive things (cards, money) with both hands. At the register, put money in the tray.",
    ],
    dos: [
      "Carry your trash with you. Public bins are rare.",
      "Line up in the marked spots on train platforms.",
      "Carry some cash. It's still common in smaller shops.",
    ],
    donts: [
      "Don't tip.",
      "Don't stick chopsticks upright in your rice. It's linked to funerals.",
      "Don't eat while walking in busy streets or temples.",
    ],
  },
};

// Everyday words for countries without their own guide, in the course language.
const BASICS = {
  es: { speech: "es-ES", words: [["Hola", "Hello"], ["Por favor", "Please"], ["Gracias", "Thank you"], ["Perdón", "Excuse me / Sorry"]] },
  fr: { speech: "fr-FR", words: [["Bonjour", "Hello"], ["S'il vous plaît", "Please"], ["Merci", "Thank you"], ["Pardon", "Excuse me / Sorry"]] },
  it: { speech: "it-IT", words: [["Ciao", "Hi / Bye"], ["Per favore", "Please"], ["Grazie", "Thank you"], ["Scusi", "Excuse me"]] },
  de: { speech: "de-DE", words: [["Hallo", "Hello"], ["Bitte", "Please"], ["Danke", "Thank you"], ["Entschuldigung", "Excuse me / Sorry"]] },
  ja: { speech: "ja-JP", words: [["こんにちは", "Hello", "konnichiwa"], ["お願いします", "Please", "onegaishimasu"], ["ありがとう", "Thank you", "arigatō"], ["すみません", "Excuse me / Sorry", "sumimasen"]] },
};

function fallbackGuide(countryId) {
  const basics = BASICS[course().id] ?? BASICS.es;
  return {
    speech: basics.speech,
    general: true,
    norms: FACTS[countryId] ?? [
      "Look up opening hours before you go. Many places close earlier or on different days than at home.",
      "Watch what locals do on transport and in restaurants, and follow their lead.",
    ],
    slang: basics.words.map(([word, meaning, reading]) => ({ word, meaning, reading })),
    respect: [
      "Learn to say hello, please and thank you. It goes a long way.",
      "Greet shop staff when you walk in.",
      "Dress modestly when visiting religious sites.",
    ],
    dos: [
      "Carry a little local cash for small purchases.",
      "Ask before taking photos of people.",
      "Try the local food, especially where locals are eating.",
    ],
    donts: [
      "Don't assume everyone speaks English. Try the local language first.",
      "Don't be loud on public transport.",
      "Don't leave valuables in sight in crowded places.",
    ],
  };
}

// Where the guide is for: the trip's city and country, else the course's home country.
export function guidePlace() {
  const trip = loadTrip();
  const city = trip?.destination && getCity(trip.destination);
  const dest = trip?.destination && DESTINATIONS.find((d) => d.id === trip.destination);
  const countryId = factCountry();
  const country = getCountry(countryId);
  return {
    countryId,
    country: country?.name ?? trip?.country ?? dest?.country ?? "",
    emoji: country?.emoji ?? dest?.flag ?? "🌍",
    city: city?.name ?? trip?.city ?? dest?.city ?? null,
  };
}

export function guideFor(countryId) {
  // Canada's guide is about French-speaking Québec, so it's only for the French course.
  if (countryId === "canada" && course().id !== "fr") return fallbackGuide(countryId);
  return GUIDES[countryId] ?? fallbackGuide(countryId);
}
