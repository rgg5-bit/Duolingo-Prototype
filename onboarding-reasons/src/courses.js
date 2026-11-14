// Every language the onboarding can run in. The combined build picks one from
// the homepage's course menu (see main.jsx); on its own, the app runs Italian.
//
// Per course: `samples` is the taste phrase shown in the lesson picker, and
// `content` is each lesson's four word pairs and two sentences to build
// (see lessonContent.js). Japanese sentences are split with spaces so they can
// be built from word tiles.
export const COURSES = {
  it: {
    id: "it",
    name: "Italian",
    country: "Italy",
    speech: "it-IT",
    samples: {
      intro: "Ciao, mi chiamo…",
      greetings: "Buongiorno! Arrivederci!",
      cafe: "Un cappuccino, per favore.",
      restaurant: "Il conto, per favore.",
      directions: "Dov'è la stazione?",
      transport: "Un biglietto, per favore.",
      hotel: "Ho una prenotazione.",
      shopping: "Quanto costa?",
      numbers: "Uno, due, tre…",
      time: "Che ore sono?",
      family: "Questa è mia madre.",
      hobbies: "Mi piace il calcio.",
    },
    content: {
      intro: {
        words: [["ciao", "hi"], ["mi chiamo", "my name is"], ["sono", "I am"], ["piacere", "nice to meet you"]],
        phrases: [["Ciao, mi chiamo Marco.", "Hi, my name is Marco."], ["Piacere, sono Anna.", "Nice to meet you, I am Anna."]],
      },
      greetings: {
        words: [["buongiorno", "good morning"], ["buonasera", "good evening"], ["arrivederci", "goodbye"], ["grazie", "thank you"]],
        phrases: [["Buongiorno, come stai?", "Good morning, how are you?"], ["Sto bene, grazie.", "I am fine, thank you."]],
      },
      cafe: {
        words: [["il caffè", "the coffee"], ["l'acqua", "the water"], ["il cornetto", "the croissant"], ["per favore", "please"]],
        phrases: [["Un caffè, per favore.", "A coffee, please."], ["Vorrei un cornetto.", "I would like a croissant."]],
      },
      restaurant: {
        words: [["il conto", "the check"], ["il menù", "the menu"], ["il vino", "the wine"], ["il pane", "the bread"]],
        phrases: [["Il conto, per favore.", "The check, please."], ["Vorrei il menù.", "I would like the menu."]],
      },
      directions: {
        words: [["dov'è", "where is"], ["la stazione", "the station"], ["a destra", "to the right"], ["a sinistra", "to the left"]],
        phrases: [["Dov'è la stazione?", "Where is the station?"], ["Gira a sinistra.", "Turn left."]],
      },
      transport: {
        words: [["il biglietto", "the ticket"], ["la metro", "the metro"], ["l'autobus", "the bus"], ["il taxi", "the taxi"]],
        phrases: [["Un biglietto, per favore.", "A ticket, please."], ["Dov'è la fermata dell'autobus?", "Where is the bus stop?"]],
      },
      hotel: {
        words: [["la camera", "the room"], ["la chiave", "the key"], ["la prenotazione", "the reservation"], ["il bagno", "the bathroom"]],
        phrases: [["Ho una prenotazione.", "I have a reservation."], ["Dov'è la chiave?", "Where is the key?"]],
      },
      shopping: {
        words: [["quanto costa", "how much is it"], ["il negozio", "the shop"], ["la borsa", "the bag"], ["economico", "cheap"]],
        phrases: [["Quanto costa la borsa?", "How much is the bag?"], ["Il negozio è aperto.", "The shop is open."]],
      },
      numbers: {
        words: [["uno", "one"], ["due", "two"], ["tre", "three"], ["dieci", "ten"]],
        phrases: [["Ho due biglietti.", "I have two tickets."], ["Costa dieci euro.", "It costs ten euros."]],
      },
      time: {
        words: [["lunedì", "Monday"], ["oggi", "today"], ["domani", "tomorrow"], ["che ore sono", "what time is it"]],
        phrases: [["Oggi è lunedì.", "Today is Monday."], ["Sono le tre.", "It is three o'clock."]],
      },
      family: {
        words: [["la madre", "the mother"], ["il padre", "the father"], ["il fratello", "the brother"], ["la sorella", "the sister"]],
        phrases: [["Questa è mia madre.", "This is my mother."], ["Ho un fratello.", "I have a brother."]],
      },
      hobbies: {
        words: [["il calcio", "soccer"], ["la musica", "music"], ["leggere", "to read"], ["mi piace", "I like"]],
        phrases: [["Mi piace la musica.", "I like music."], ["Mi piace leggere.", "I like to read."]],
      },
    },
  },

  fr: {
    id: "fr",
    name: "French",
    country: "France",
    speech: "fr-FR",
    samples: {
      intro: "Bonjour, je m'appelle…",
      greetings: "Bonjour ! Au revoir !",
      cafe: "Un café, s'il vous plaît.",
      restaurant: "L'addition, s'il vous plaît.",
      directions: "Où est la gare ?",
      transport: "Un billet, s'il vous plaît.",
      hotel: "J'ai une réservation.",
      shopping: "Combien ça coûte ?",
      numbers: "Un, deux, trois…",
      time: "Quelle heure est-il ?",
      family: "C'est ma mère.",
      hobbies: "J'aime le football.",
    },
    content: {
      intro: {
        words: [["bonjour", "hello"], ["salut", "hi"], ["je m'appelle", "my name is"], ["je suis", "I am"]],
        phrases: [["Bonjour, je m'appelle Marco.", "Hello, my name is Marco."], ["Salut, je suis Anna.", "Hi, I am Anna."]],
      },
      greetings: {
        words: [["bonjour", "good morning"], ["bonsoir", "good evening"], ["au revoir", "goodbye"], ["merci", "thank you"]],
        phrases: [["Bonjour, comment ça va ?", "Good morning, how are you?"], ["Ça va bien, merci.", "I am fine, thank you."]],
      },
      cafe: {
        words: [["le café", "the coffee"], ["l'eau", "the water"], ["le croissant", "the croissant"], ["s'il vous plaît", "please"]],
        phrases: [["Un café, s'il vous plaît.", "A coffee, please."], ["Je voudrais un croissant.", "I would like a croissant."]],
      },
      restaurant: {
        words: [["l'addition", "the check"], ["la carte", "the menu"], ["le vin", "the wine"], ["le pain", "the bread"]],
        phrases: [["L'addition, s'il vous plaît.", "The check, please."], ["Je voudrais la carte.", "I would like the menu."]],
      },
      directions: {
        words: [["où est", "where is"], ["la gare", "the station"], ["à droite", "to the right"], ["à gauche", "to the left"]],
        phrases: [["Où est la gare ?", "Where is the station?"], ["Tournez à gauche.", "Turn left."]],
      },
      transport: {
        words: [["le billet", "the ticket"], ["le métro", "the metro"], ["le bus", "the bus"], ["le taxi", "the taxi"]],
        phrases: [["Un billet, s'il vous plaît.", "A ticket, please."], ["Où est l'arrêt de bus ?", "Where is the bus stop?"]],
      },
      hotel: {
        words: [["la chambre", "the room"], ["la clé", "the key"], ["la réservation", "the reservation"], ["la salle de bain", "the bathroom"]],
        phrases: [["J'ai une réservation.", "I have a reservation."], ["Où est la clé ?", "Where is the key?"]],
      },
      shopping: {
        words: [["combien", "how much"], ["le magasin", "the shop"], ["le sac", "the bag"], ["pas cher", "cheap"]],
        phrases: [["Combien coûte le sac ?", "How much is the bag?"], ["Le magasin est ouvert.", "The shop is open."]],
      },
      numbers: {
        words: [["un", "one"], ["deux", "two"], ["trois", "three"], ["dix", "ten"]],
        phrases: [["J'ai deux billets.", "I have two tickets."], ["Ça coûte dix euros.", "It costs ten euros."]],
      },
      time: {
        words: [["lundi", "Monday"], ["aujourd'hui", "today"], ["demain", "tomorrow"], ["quelle heure est-il", "what time is it"]],
        phrases: [["Aujourd'hui, c'est lundi.", "Today is Monday."], ["Il est trois heures.", "It is three o'clock."]],
      },
      family: {
        words: [["la mère", "the mother"], ["le père", "the father"], ["le frère", "the brother"], ["la sœur", "the sister"]],
        phrases: [["C'est ma mère.", "This is my mother."], ["J'ai un frère.", "I have a brother."]],
      },
      hobbies: {
        words: [["le football", "soccer"], ["la musique", "music"], ["lire", "to read"], ["j'aime", "I like"]],
        phrases: [["J'aime la musique.", "I like music."], ["J'aime lire.", "I like to read."]],
      },
    },
  },

  es: {
    id: "es",
    name: "Spanish",
    country: "Spain",
    speech: "es-ES",
    samples: {
      intro: "Hola, me llamo…",
      greetings: "¡Buenos días! ¡Adiós!",
      cafe: "Un café, por favor.",
      restaurant: "La cuenta, por favor.",
      directions: "¿Dónde está la estación?",
      transport: "Un billete, por favor.",
      hotel: "Tengo una reserva.",
      shopping: "¿Cuánto cuesta?",
      numbers: "Uno, dos, tres…",
      time: "¿Qué hora es?",
      family: "Esta es mi madre.",
      hobbies: "Me gusta el fútbol.",
    },
    content: {
      intro: {
        words: [["hola", "hi"], ["me llamo", "my name is"], ["soy", "I am"], ["mucho gusto", "nice to meet you"]],
        phrases: [["Hola, me llamo Marco.", "Hi, my name is Marco."], ["Mucho gusto, soy Anna.", "Nice to meet you, I am Anna."]],
      },
      greetings: {
        words: [["buenos días", "good morning"], ["buenas tardes", "good afternoon"], ["adiós", "goodbye"], ["gracias", "thank you"]],
        phrases: [["Buenos días, ¿cómo estás?", "Good morning, how are you?"], ["Estoy bien, gracias.", "I am fine, thank you."]],
      },
      cafe: {
        words: [["el café", "the coffee"], ["el agua", "the water"], ["el cruasán", "the croissant"], ["por favor", "please"]],
        phrases: [["Un café, por favor.", "A coffee, please."], ["Quiero un cruasán.", "I want a croissant."]],
      },
      restaurant: {
        words: [["la cuenta", "the check"], ["el menú", "the menu"], ["el vino", "the wine"], ["el pan", "the bread"]],
        phrases: [["La cuenta, por favor.", "The check, please."], ["Quiero el menú.", "I want the menu."]],
      },
      directions: {
        words: [["dónde está", "where is"], ["la estación", "the station"], ["a la derecha", "to the right"], ["a la izquierda", "to the left"]],
        phrases: [["¿Dónde está la estación?", "Where is the station?"], ["Gira a la izquierda.", "Turn left."]],
      },
      transport: {
        words: [["el billete", "the ticket"], ["el metro", "the metro"], ["el autobús", "the bus"], ["el taxi", "the taxi"]],
        phrases: [["Un billete, por favor.", "A ticket, please."], ["¿Dónde está la parada de autobús?", "Where is the bus stop?"]],
      },
      hotel: {
        words: [["la habitación", "the room"], ["la llave", "the key"], ["la reserva", "the reservation"], ["el baño", "the bathroom"]],
        phrases: [["Tengo una reserva.", "I have a reservation."], ["¿Dónde está la llave?", "Where is the key?"]],
      },
      shopping: {
        words: [["cuánto cuesta", "how much is it"], ["la tienda", "the shop"], ["el bolso", "the bag"], ["barato", "cheap"]],
        phrases: [["¿Cuánto cuesta el bolso?", "How much is the bag?"], ["La tienda está abierta.", "The shop is open."]],
      },
      numbers: {
        words: [["uno", "one"], ["dos", "two"], ["tres", "three"], ["diez", "ten"]],
        phrases: [["Tengo dos billetes.", "I have two tickets."], ["Cuesta diez euros.", "It costs ten euros."]],
      },
      time: {
        words: [["lunes", "Monday"], ["hoy", "today"], ["mañana", "tomorrow"], ["qué hora es", "what time is it"]],
        phrases: [["Hoy es lunes.", "Today is Monday."], ["Son las tres.", "It is three o'clock."]],
      },
      family: {
        words: [["la madre", "the mother"], ["el padre", "the father"], ["el hermano", "the brother"], ["la hermana", "the sister"]],
        phrases: [["Esta es mi madre.", "This is my mother."], ["Tengo un hermano.", "I have a brother."]],
      },
      hobbies: {
        words: [["el fútbol", "soccer"], ["la música", "music"], ["leer", "to read"], ["me gusta", "I like"]],
        phrases: [["Me gusta la música.", "I like music."], ["Me gusta leer.", "I like to read."]],
      },
    },
  },

  de: {
    id: "de",
    name: "German",
    country: "Germany",
    speech: "de-DE",
    samples: {
      intro: "Hallo, ich heiße…",
      greetings: "Guten Morgen! Tschüss!",
      cafe: "Einen Kaffee, bitte.",
      restaurant: "Die Rechnung, bitte.",
      directions: "Wo ist der Bahnhof?",
      transport: "Eine Fahrkarte, bitte.",
      hotel: "Ich habe eine Reservierung.",
      shopping: "Wie viel kostet das?",
      numbers: "Eins, zwei, drei…",
      time: "Wie spät ist es?",
      family: "Das ist meine Mutter.",
      hobbies: "Ich spiele gern Fußball.",
    },
    content: {
      intro: {
        words: [["hallo", "hi"], ["ich heiße", "my name is"], ["ich bin", "I am"], ["freut mich", "nice to meet you"]],
        phrases: [["Hallo, ich heiße Marco.", "Hi, my name is Marco."], ["Freut mich, ich bin Anna.", "Nice to meet you, I am Anna."]],
      },
      greetings: {
        words: [["guten Morgen", "good morning"], ["guten Abend", "good evening"], ["tschüss", "goodbye"], ["danke", "thank you"]],
        phrases: [["Guten Morgen, wie geht's?", "Good morning, how are you?"], ["Mir geht's gut, danke.", "I am fine, thank you."]],
      },
      cafe: {
        words: [["der Kaffee", "the coffee"], ["das Wasser", "the water"], ["das Croissant", "the croissant"], ["bitte", "please"]],
        phrases: [["Einen Kaffee, bitte.", "A coffee, please."], ["Ich möchte ein Croissant.", "I would like a croissant."]],
      },
      restaurant: {
        words: [["die Rechnung", "the check"], ["die Speisekarte", "the menu"], ["der Wein", "the wine"], ["das Brot", "the bread"]],
        phrases: [["Die Rechnung, bitte.", "The check, please."], ["Ich möchte die Speisekarte.", "I would like the menu."]],
      },
      directions: {
        words: [["wo ist", "where is"], ["der Bahnhof", "the station"], ["rechts", "to the right"], ["links", "to the left"]],
        phrases: [["Wo ist der Bahnhof?", "Where is the station?"], ["Biegen Sie links ab.", "Turn left."]],
      },
      transport: {
        words: [["die Fahrkarte", "the ticket"], ["die U-Bahn", "the subway"], ["der Bus", "the bus"], ["das Taxi", "the taxi"]],
        phrases: [["Eine Fahrkarte, bitte.", "A ticket, please."], ["Wo ist die Bushaltestelle?", "Where is the bus stop?"]],
      },
      hotel: {
        words: [["das Zimmer", "the room"], ["der Schlüssel", "the key"], ["die Reservierung", "the reservation"], ["das Bad", "the bathroom"]],
        phrases: [["Ich habe eine Reservierung.", "I have a reservation."], ["Wo ist der Schlüssel?", "Where is the key?"]],
      },
      shopping: {
        words: [["wie viel", "how much"], ["der Laden", "the shop"], ["die Tasche", "the bag"], ["billig", "cheap"]],
        phrases: [["Wie viel kostet die Tasche?", "How much is the bag?"], ["Der Laden ist offen.", "The shop is open."]],
      },
      numbers: {
        words: [["eins", "one"], ["zwei", "two"], ["drei", "three"], ["zehn", "ten"]],
        phrases: [["Ich habe zwei Tickets.", "I have two tickets."], ["Das kostet zehn Euro.", "It costs ten euros."]],
      },
      time: {
        words: [["Montag", "Monday"], ["heute", "today"], ["morgen", "tomorrow"], ["wie spät ist es", "what time is it"]],
        phrases: [["Heute ist Montag.", "Today is Monday."], ["Es ist drei Uhr.", "It is three o'clock."]],
      },
      family: {
        words: [["die Mutter", "the mother"], ["der Vater", "the father"], ["der Bruder", "the brother"], ["die Schwester", "the sister"]],
        phrases: [["Das ist meine Mutter.", "This is my mother."], ["Ich habe einen Bruder.", "I have a brother."]],
      },
      hobbies: {
        words: [["Fußball", "soccer"], ["die Musik", "music"], ["lesen", "to read"], ["ich mag", "I like"]],
        phrases: [["Ich mag Musik.", "I like music."], ["Ich lese gern.", "I like to read."]],
      },
    },
  },

  ja: {
    id: "ja",
    name: "Japanese",
    country: "Japan",
    speech: "ja-JP",
    samples: {
      intro: "こんにちは、わたしは…です。",
      greetings: "おはよう！さようなら！",
      cafe: "コーヒーをください。",
      restaurant: "おかいけいをおねがいします。",
      directions: "えきはどこですか？",
      transport: "きっぷをください。",
      hotel: "よやくがあります。",
      shopping: "いくらですか？",
      numbers: "いち、に、さん…",
      time: "いまなんじですか？",
      family: "これははははです。",
      hobbies: "サッカーがすきです。",
    },
    content: {
      intro: {
        words: [["こんにちは", "hello"], ["わたし", "I / me"], ["です", "am / is"], ["はじめまして", "nice to meet you"]],
        phrases: [["こんにちは わたし は マルコ です。", "Hello, I am Marco."], ["はじめまして アンナ です。", "Nice to meet you, I am Anna."]],
      },
      greetings: {
        words: [["おはよう", "good morning"], ["こんばんは", "good evening"], ["さようなら", "goodbye"], ["ありがとう", "thank you"]],
        phrases: [["おげんき です か？", "How are you?"], ["げんき です ありがとう。", "I am fine, thank you."]],
      },
      cafe: {
        words: [["コーヒー", "coffee"], ["みず", "water"], ["クロワッサン", "croissant"], ["ください", "please give me"]],
        phrases: [["コーヒー を ください。", "A coffee, please."], ["クロワッサン を ください。", "A croissant, please."]],
      },
      restaurant: {
        words: [["おかいけい", "the check"], ["メニュー", "the menu"], ["ワイン", "wine"], ["パン", "bread"]],
        phrases: [["おかいけい を おねがいします。", "The check, please."], ["メニュー を ください。", "The menu, please."]],
      },
      directions: {
        words: [["どこ", "where"], ["えき", "station"], ["みぎ", "right"], ["ひだり", "left"]],
        phrases: [["えき は どこ です か？", "Where is the station?"], ["ひだり に まがって ください。", "Please turn left."]],
      },
      transport: {
        words: [["きっぷ", "ticket"], ["ちかてつ", "subway"], ["バス", "bus"], ["タクシー", "taxi"]],
        phrases: [["きっぷ を ください。", "A ticket, please."], ["バスてい は どこ です か？", "Where is the bus stop?"]],
      },
      hotel: {
        words: [["へや", "room"], ["かぎ", "key"], ["よやく", "reservation"], ["トイレ", "bathroom"]],
        phrases: [["よやく が あります。", "I have a reservation."], ["かぎ は どこ です か？", "Where is the key?"]],
      },
      shopping: {
        words: [["いくら", "how much"], ["みせ", "shop"], ["かばん", "bag"], ["やすい", "cheap"]],
        phrases: [["この かばん は いくら です か？", "How much is this bag?"], ["みせ は あいて います。", "The shop is open."]],
      },
      numbers: {
        words: [["いち", "one"], ["に", "two"], ["さん", "three"], ["じゅう", "ten"]],
        phrases: [["チケット が にまい あります。", "I have two tickets."], ["じゅう ユーロ です。", "It is ten euros."]],
      },
      time: {
        words: [["げつようび", "Monday"], ["きょう", "today"], ["あした", "tomorrow"], ["なんじ", "what time"]],
        phrases: [["きょう は げつようび です。", "Today is Monday."], ["さんじ です。", "It is three o'clock."]],
      },
      family: {
        words: [["はは", "my mother"], ["ちち", "my father"], ["あに", "my older brother"], ["あね", "my older sister"]],
        phrases: [["これ は はは です。", "This is my mother."], ["あに が います。", "I have an older brother."]],
      },
      hobbies: {
        words: [["サッカー", "soccer"], ["おんがく", "music"], ["どくしょ", "reading"], ["すき", "like"]],
        phrases: [["おんがく が すき です。", "I like music."], ["どくしょ が すき です。", "I like reading."]],
      },
    },
  },
};

let active = COURSES.it;

export function course() {
  return active;
}

export function setCourse(id) {
  active = COURSES[id] ?? COURSES.it;
}

// Answers and progress are saved per course. Italian keeps the original keys so
// earlier demo data still loads.
export function courseKey(base) {
  return active.id === "it" ? base : `${base}:${active.id}`;
}
