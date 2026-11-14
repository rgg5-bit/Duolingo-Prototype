import { loadTrip } from "../../traveler-mode/src/homeData.js";
import { course } from "./courses.js";
import { getCity } from "./speakers.js";

// Short, specific travel customs per country (ids from speakers.js), shown on the
// lesson finish screen and the homepage trail. Written as checkable customs
// rather than generalizations about people; have someone verify them before
// presenting, like the speaker estimates.
export const FACTS = {
  spain: [
    "Dinner in Spain often starts late, around 9 or 10 p.m.",
    "Many small shops close for a few hours in the afternoon, then reopen into the evening.",
    "Friends often greet each other with two kisses on the cheek.",
  ],
  france: [
    "Say “Bonjour” when you walk into a shop. Skipping it can come across as rude.",
    "Restaurant bills in France include service (“service compris”), so tipping is optional.",
    "On a crowded Paris Métro, people fold up the fold-down seats to make room.",
  ],
  italy: [
    "Cappuccino is mostly a breakfast drink. After a meal, an espresso is more usual.",
    "At many coffee bars you pay at the register first, then show your receipt at the counter.",
    "Restaurants often add a small per-person “coperto” (cover charge) to the bill.",
  ],
  germany: [
    "Most shops are closed on Sundays, so stock up on Saturday.",
    "Many bottles carry a deposit (“Pfand”) that you get back when you return them.",
    "On escalators, stand on the right so people can walk past on the left.",
  ],
  austria: [
    "Most shops are closed on Sundays.",
    "In Viennese coffee houses, coffee usually comes with a small glass of water.",
    "“Grüß Gott” is a common, friendly hello in much of Austria.",
  ],
  switzerland: [
    "Switzerland has four national languages: German, French, Italian and Romansh.",
    "Swiss trains are known for running on time, so be on the platform early.",
  ],
  belgium: [
    "Belgium has three official languages: Dutch, French and German.",
    "Brussels is officially bilingual, so street signs are in French and Dutch.",
  ],
  japan: [
    "Tipping isn't customary in Japan, and leaving extra money can confuse staff.",
    "On trains, people keep phones on silent and avoid phone calls.",
    "In Tokyo people stand on the left of escalators; in Osaka, usually on the right.",
    "Many homes and some restaurants ask you to take off your shoes at the entrance.",
  ],
  mexico: [
    "A tip of around 10–15% is common at sit-down restaurants in Mexico.",
    "The main meal (“la comida”) is often eaten in the mid-afternoon.",
    "Mexico City's metro has women-and-children-only cars at busy times.",
  ],
  usa: [
    "Tipping about 15–20% at sit-down restaurants is expected in the U.S.",
    "Price tags usually don't include sales tax; it's added at the register.",
  ],
  canada: [
    "In Québec, French is the official language, and signs are in French first.",
    "Tipping about 15–20% at restaurants is customary in Canada.",
  ],
  argentina: [
    "Dinner in Argentina often starts after 9 p.m.",
    "Sharing mate, a tea-like drink, from one gourd is a sign of friendship.",
  ],
  colombia: [
    "In Colombia, “¿Me regala…?” (literally “will you gift me…?”) is a polite way to ask for something in a shop.",
    "Colombia has two coastlines: the Caribbean and the Pacific.",
  ],
  peru: [
    "Around Cusco, many people also speak Quechua, the language of the Inca Empire.",
    "Cusco sits about 3,400 m (11,000 ft) up, so take it easy on your first day.",
  ],
  morocco: [
    "Haggling is normal in Moroccan markets (souks).",
    "French appears alongside Arabic on many signs and menus in Moroccan cities.",
    "When eating with your hands or passing food, use your right hand.",
  ],
  uk: [
    "Queues matter in the UK: always join the back of the line.",
    "On London Underground escalators, stand on the right.",
  ],
  portugal: [
    "Coffee in Portugal is usually a small, strong espresso called “uma bica” in Lisbon.",
  ],
  korea: ["In Korea, it's polite to pour drinks for others and let them pour for you."],
};

// The language's "home" country when there's no trip.
const HOME = { es: "spain", fr: "france", de: "germany", it: "italy", ja: "japan" };

const GENERIC = [
  "Learning to say “hello”, “please” and “thank you” goes a long way anywhere you travel.",
];

// The country facts should be about: the trip's city, else the language's home country.
export function factCountry() {
  const trip = loadTrip();
  const city = trip?.destination && getCity(trip.destination);
  return city?.country ?? HOME[course().id] ?? null;
}

export function factsFor(countryId = factCountry()) {
  return FACTS[countryId] ?? GENERIC;
}

export function randomFact(countryId = factCountry()) {
  const list = factsFor(countryId);
  return list[Math.floor(Math.random() * list.length)];
}
