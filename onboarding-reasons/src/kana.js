// Kana → rōmaji, so beginners can type Japanese answers in rōmaji
// ("kippu o kudasai" for きっぷ を ください). The Japanese lessons only use
// hiragana and katakana, so this covers everything they contain.

const BASE = {
  あ: "a", い: "i", う: "u", え: "e", お: "o",
  か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
  さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
  ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
  だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
  ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
  や: "ya", ゆ: "yu", よ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
  わ: "wa", を: "o", ん: "n",
  ぁ: "a", ぃ: "i", ぅ: "u", ぇ: "e", ぉ: "o",
  ゔ: "vu",
};

const SMALL_Y = { ゃ: "a", ゅ: "u", ょ: "o" };

// Katakana → hiragana (same sounds, offset by 0x60 in Unicode).
const toHiragana = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

function wordToRomaji(word) {
  const s = toHiragana(word);
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const next = s[i + 1];
    if (c === "っ") {
      // Small tsu doubles the next consonant: きっぷ → kippu.
      const r = next ? BASE[next] ?? "" : "";
      out += r.startsWith("ch") ? "t" : r[0] ?? "";
      continue;
    }
    if (c === "ー") {
      // Long-vowel mark repeats the previous vowel: コーヒー → koohii.
      const v = out.match(/[aeiou]$/)?.[0];
      out += v ?? "";
      continue;
    }
    if (next && SMALL_Y[next]) {
      // きゃ → kya, しゃ → sha, ちゃ → cha, じゃ → ja
      const r = BASE[c] ?? "";
      const stem = r.endsWith("i") ? r.slice(0, -1) : r;
      out += (/(sh|ch|j)$/.test(stem) ? stem : stem + "y") + SMALL_Y[next];
      i++;
      continue;
    }
    out += BASE[c] ?? c;
  }
  return out;
}

// Whole phrase; particles written as separate words read as wa / o / e.
export function toRomaji(text) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const bare = w.replace(/[。、？！?!.,]/g, "");
      if (bare === "は") return "wa";
      if (bare === "へ") return "e";
      return wordToRomaji(bare);
    })
    .join(" ");
}

export const hasKana = (s) => /[぀-ヿ]/.test(s);
