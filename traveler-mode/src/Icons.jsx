export function FlameIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2 C13 7 19 9 19 15 A7 7 0 0 1 5 15 C5 11 8 9 8 6 C10 8 11 10 11 11 C12 9 12 5 12 2 Z" fill="currentColor" />
    </svg>
  );
}

export function GemIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z" fill="#1cb0f6" />
      <path d="M12 2 L21 7 L12 12 L3 7 Z" fill="#84d8ff" />
      <path d="M12 12 L21 7 V17 L12 22 Z" fill="#1899d6" />
    </svg>
  );
}

export function StarIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2.5 L14.8 8.6 L21.5 9.3 L16.5 13.8 L17.9 20.4 L12 17 L6.1 20.4 L7.5 13.8 L2.5 9.3 L9.2 8.6 Z" fill="currentColor" />
    </svg>
  );
}

export function LockIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M7 10 V7.5 A5 5 0 0 1 17 7.5 V10" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <rect x="4.5" y="10" width="15" height="11" rx="3" fill="currentColor" />
    </svg>
  );
}

export function EnergyIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 32 24" className={className} aria-hidden="true">
      <rect x="1" y="2" width="26" height="20" rx="5" fill="#9a4dff" />
      <rect x="3.5" y="4.5" width="21" height="15" rx="3" fill="#ce82ff" />
      <rect x="28" y="8.5" width="3" height="7" rx="1.5" fill="#ce82ff" />
      <path d="M16 5 L9 13.5 H13.5 L12 19 L19 10.5 H14.5 Z" fill="#fff" />
    </svg>
  );
}

export function PlaneGlyph({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M21.5 4.2 c.6-1.2-.5-2.3-1.7-1.7 L15 5 L5.5 2.5 L3.5 4.5 L11 8.5 L7.5 12 L4.5 11.5 L3 13 L6.5 15 L8.5 18.5 L10 17 L9.5 14 L13 10.5 L17 18 L19 16 L16.5 6.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CloseGlyph({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function RepeatIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <g fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 15 V12 a3 3 0 0 1 3-3 H24" />
        <path d="M20 4.5 L24.5 9 L20 13.5" />
        <path d="M26 17 V20 a3 3 0 0 1-3 3 H8" />
        <path d="M12 27.5 L7.5 23 L12 18.5" />
      </g>
    </svg>
  );
}

export function GuidebookIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="8" y="4" width="20" height="25" rx="3" fill="#fff" />
      <g fill="none" stroke="#00cd9c" strokeWidth="2.4" strokeLinecap="round">
        <path d="M13 11 H23 M13 16 H23 M13 21 H20" />
      </g>
      <g fill="#fff">
        <rect x="4" y="7" width="6" height="3" rx="1.5" />
        <rect x="4" y="13" width="6" height="3" rx="1.5" />
        <rect x="4" y="19" width="6" height="3" rx="1.5" />
      </g>
    </svg>
  );
}

export function ChestIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 64 56" className={className} aria-hidden="true">
      <rect x="4" y="22" width="56" height="30" rx="4" fill="#d6d6d6" />
      <path d="M4 22 V14 Q4 6 12 6 H52 Q60 6 60 14 V22 Z" fill="#e5e5e5" />
      <rect x="4" y="20" width="56" height="5" fill="#bdbdbd" />
      <rect x="10" y="10" width="44" height="3" rx="1.5" fill="#cfcfcf" />
      <rect x="10" y="32" width="44" height="3" rx="1.5" fill="#c4c4c4" />
      <rect x="10" y="41" width="44" height="3" rx="1.5" fill="#c4c4c4" />
      <rect x="4" y="6" width="9" height="46" rx="3" fill="#cfcfcf" />
      <rect x="51" y="6" width="9" height="46" rx="3" fill="#cfcfcf" />
      <rect x="25" y="20" width="14" height="12" rx="3" fill="#f2f2f2" />
      <circle cx="32" cy="26" r="2.5" fill="#bdbdbd" />
    </svg>
  );
}

// Purple event badge ("26 days") that sits at the top-left of the path.
export function WitchBadge({ className = "" }) {
  return (
    <svg viewBox="0 0 64 68" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="witch-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8b7bff" />
          <stop offset="1" stopColor="#5f4bd8" />
        </linearGradient>
      </defs>
      <rect x="4" y="6" width="56" height="58" rx="12" fill="url(#witch-bg)" />
      <circle cx="50" cy="14" r="3" fill="#c9bfff" />
      <path d="M12 18 l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#c9bfff" />
      {/* face peeking under the hat */}
      <path d="M22 30 Q32 26 44 30 V42 H22 Z" fill="#ffb4a8" />
      <path d="M38 28 Q50 30 50 42 H40 Z" fill="#c873ff" />
      <ellipse cx="29" cy="36" rx="2.4" ry="2" fill="#3b2a7a" />
      <ellipse cx="37" cy="36" rx="2.4" ry="2" fill="#3b2a7a" />
      {/* hat */}
      <path d="M1 30 Q32 18 63 26 Q40 34 1 30 Z" fill="#3b2a7a" />
      <path d="M18 26 Q24 6 36 2 Q42 12 46 24 Z" fill="#3b2a7a" />
      <path d="M17 25 Q32 19 47 23 L46 27 Q32 23 18 29 Z" fill="#a68bff" />
      <circle cx="32" cy="24.5" r="3" fill="#fff" />
      <rect x="4" y="44" width="56" height="20" rx="0" fill="#3b2a7a" />
      <path d="M4 44 H60 V52 Q60 64 48 64 H16 Q4 64 4 52 Z" fill="#3b2a7a" />
    </svg>
  );
}

// Grey "locked" character lounging on a beanbag, with bees and stars.
export function SleeperArt({ className = "" }) {
  return (
    <svg viewBox="0 0 120 160" className={className} aria-hidden="true">
      {/* bees */}
      <g fill="#c4c4c4">
        <ellipse cx="44" cy="44" rx="7" ry="5" />
        <ellipse cx="80" cy="18" rx="7" ry="5" />
      </g>
      <g fill="#e5e5e5">
        <ellipse cx="41" cy="37" rx="3" ry="4" />
        <ellipse cx="46" cy="37" rx="3" ry="4" />
        <ellipse cx="77" cy="11" rx="3" ry="4" />
        <ellipse cx="82" cy="11" rx="3" ry="4" />
      </g>
      <g stroke="#8a8a8a" strokeWidth="1.5">
        <path d="M42 41 V48 M46 41 V48 M78 15 V22 M82 15 V22" />
      </g>
      {/* beanbag */}
      <ellipse cx="62" cy="112" rx="56" ry="28" fill="#e5e5e5" />
      {/* body */}
      <path d="M22 98 Q20 70 48 66 Q80 62 88 84 Q92 108 60 114 Q30 118 22 98 Z" fill="#c4c4c4" />
      <path d="M34 72 L52 104" stroke="#afafaf" strokeWidth="2" fill="none" />
      {/* legs */}
      <path d="M30 100 L20 122 Q18 128 24 128 L30 126 L40 104 Z" fill="#8a8a8a" />
      {/* head + hair */}
      <circle cx="86" cy="56" r="20" fill="#afafaf" />
      <g fill="#8a8a8a">
        <circle cx="76" cy="38" r="9" />
        <circle cx="88" cy="34" r="10" />
        <circle cx="100" cy="42" r="9" />
        <circle cx="104" cy="54" r="7" />
      </g>
      <path d="M86 52 Q92 50 97 54" stroke="#4b4b4b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M80 64 Q90 70 100 64 Q96 76 88 74 Q82 72 80 64 Z" fill="#6b6b6b" />
      {/* arm on chin */}
      <path d="M70 72 Q74 82 88 78" stroke="#afafaf" strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* stars */}
      <g fill="#e5e5e5">
        <path d="M38 140 l3 6 6.5 .8-4.8 4.4 1.3 6.5-6-3.3-6 3.3 1.3-6.5-4.8-4.4 6.5-.8z" />
        <path d="M62 146 l3 6 6.5 .8-4.8 4.4 1.3 6.5-6-3.3-6 3.3 1.3-6.5-4.8-4.4 6.5-.8z" />
        <path d="M86 140 l3 6 6.5 .8-4.8 4.4 1.3 6.5-6-3.3-6 3.3 1.3-6.5-4.8-4.4 6.5-.8z" />
      </g>
    </svg>
  );
}

// Grey character peeking up from the bottom-left of the path.
export function PeekerArt({ className = "" }) {
  return (
    <svg viewBox="0 0 110 110" className={className} aria-hidden="true">
      <path d="M0 110 Q4 84 30 80 H80 Q96 84 100 110 Z" fill="#c4c4c4" />
      <ellipse cx="52" cy="58" rx="32" ry="36" fill="#afafaf" />
      <g fill="#8a8a8a">
        <circle cx="30" cy="30" r="14" />
        <circle cx="50" cy="20" r="16" />
        <circle cx="72" cy="26" r="15" />
        <circle cx="84" cy="42" r="11" />
        <circle cx="24" cy="48" r="9" />
      </g>
      <circle cx="86" cy="58" r="6" fill="#afafaf" />
      <path d="M30 56 Q38 50 46 55 M56 55 Q64 50 72 56" stroke="#6b6b6b" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="40" cy="64" rx="6" ry="4" fill="#fff" />
      <ellipse cx="62" cy="64" rx="6" ry="4" fill="#fff" />
      <circle cx="41" cy="65" r="2.5" fill="#4b4b4b" />
      <circle cx="63" cy="65" r="2.5" fill="#4b4b4b" />
      <path d="M32 82 Q52 70 72 82 Q66 92 52 88 Q38 92 32 82 Z" fill="#6b6b6b" />
    </svg>
  );
}

// Bottom tab bar icons.
export function NavHome({ className = "" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M8 18 H32 V34 Q32 36 30 36 H10 Q8 36 8 34 Z" fill="#ffc800" />
      <path d="M4 19 L20 5 L36 19 Q37 21 35 22 L20 10 L5 22 Q3 21 4 19 Z" fill="#ff4b4b" />
      <path d="M20 5 L36 19 L33 21 L20 10 L7 21 L4 19 Z" fill="#ff4b4b" />
      <circle cx="20" cy="24" r="4.5" fill="#cd7900" />
      <rect x="16" y="28" width="8" height="8" rx="2" fill="#cd7900" />
    </svg>
  );
}

export function NavPractice({ className = "" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="5" y="6" width="30" height="30" rx="3" fill="#ffc800" />
      <rect x="10" y="11" width="20" height="20" rx="1" fill="#cd5f00" />
      <rect x="5" y="17" width="5" height="8" fill="#ffc800" />
      <rect x="30" y="17" width="5" height="8" fill="#ffc800" />
      <circle cx="20" cy="19" r="4" fill="#ffc800" />
      <rect x="18" y="20" width="4" height="7" rx="1" fill="#ffc800" />
      <circle cx="20" cy="19" r="1.6" fill="#cd5f00" />
    </svg>
  );
}

export function NavLeagues({ className = "" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M6 16 Q6 6 14 8 Q16 4 20 4 Q24 4 26 8 Q34 6 34 16 Q34 26 20 28 Q6 26 6 16 Z" fill="#7cc8d6" />
      <path d="M14 8 Q16 18 20 28 M26 8 Q24 18 20 28" stroke="#5aaab9" strokeWidth="2" fill="none" />
      <path d="M17 28 H23 L24 33 H16 Z" fill="#5aaab9" />
      <rect x="12" y="33" width="16" height="4" rx="2" fill="#4b8f9b" />
    </svg>
  );
}

export function NavQuests({ className = "" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M5 9 Q5 5 9 5 H31 Q35 5 35 9 V27 Q35 31 31 31 H22 L15 37 V31 H9 Q5 31 5 27 Z" fill="#ff86d0" />
      <path d="M20 26 C13 21 11 18 11 15 C11 12 13.5 10 16 10 C18 10 19.3 11 20 12.4 C20.7 11 22 10 24 10 C26.5 10 29 12 29 15 C29 18 27 21 20 26 Z" fill="#fff" />
    </svg>
  );
}

export function NavChat({ className = "" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M5 9 Q5 5 9 5 H31 Q35 5 35 9 V25 Q35 29 31 29 H18 L10 36 V29 H9 Q5 29 5 25 Z" fill="#1cb0f6" />
    </svg>
  );
}

export function NavMore({ className = "" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="16" fill="#ce82ff" />
      <circle cx="13" cy="20" r="2.4" fill="#fff" />
      <circle cx="20" cy="20" r="2.4" fill="#fff" />
      <circle cx="27" cy="20" r="2.4" fill="#fff" />
    </svg>
  );
}

export function DuoOwl({ className = "" }) {
  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden="true">
      {/* floor shadow */}
      <ellipse cx="60" cy="120" rx="40" ry="6" fill="#e5e5e5" />

      {/* body with ear tufts */}
      <path
        d="M20 34 Q18 12 36 16 L48 24 Q60 20 72 24 L84 16 Q102 12 100 34 L102 84 Q102 116 60 116 Q18 116 18 84 Z"
        fill="#58cc02"
      />
      <path d="M36 16 L48 24 Q40 26 30 30 Q26 20 36 16 Z" fill="#89e219" />
      <path d="M84 16 L72 24 Q80 26 90 30 Q94 20 84 16 Z" fill="#89e219" />
      <ellipse cx="60" cy="92" rx="28" ry="20" fill="#89e219" />

      {/* eyes */}
      <ellipse cx="43" cy="54" rx="15" ry="16" fill="#fff" />
      <ellipse cx="77" cy="54" rx="15" ry="16" fill="#fff" />
      <ellipse cx="45" cy="57" rx="6.5" ry="9" fill="#4b4b4b" />
      <ellipse cx="75" cy="57" rx="6.5" ry="9" fill="#4b4b4b" />
      <circle cx="47" cy="53" r="2" fill="#fff" />
      <circle cx="77" cy="53" r="2" fill="#fff" />
      {/* calm half-closed lids */}
      <path
        d="M26 34 H94 V45 Q86 43 77 43 Q68 43 62 45 H58 Q52 43 43 43 Q34 43 26 45 Z"
        fill="#58cc02"
      />

      {/* beak */}
      <path d="M53 66 Q60 62 67 66 Q64 76 60 78 Q56 76 53 66 Z" fill="#ff9600" />
      <path d="M53 66 Q60 62 67 66 Q60 70 53 66 Z" fill="#ffc800" />

      {/* feet */}
      <ellipse cx="47" cy="117" rx="8" ry="4" fill="#ff9600" />
      <ellipse cx="73" cy="117" rx="8" ry="4" fill="#ff9600" />

      {/* clipboard */}
      <g transform="rotate(-10 34 96)">
        <rect x="16" y="76" width="34" height="40" rx="3" fill="#b5662a" />
        <rect x="19" y="80" width="28" height="33" rx="2" fill="#cf7a35" />
        <rect x="27" y="72" width="12" height="7" rx="2" fill="#afafaf" />
      </g>
      <ellipse cx="44" cy="98" rx="8" ry="6" fill="#58a700" />

      {/* pencil */}
      <g transform="rotate(38 90 88)">
        <rect x="85" y="62" width="11" height="34" rx="1.5" fill="#ffc800" />
        <rect x="85" y="62" width="4" height="34" fill="#ffde59" />
        <rect x="85" y="55" width="11" height="8" rx="2" fill="#ff86d0" />
        <rect x="85" y="62" width="11" height="3" fill="#d4d4d4" />
        <path d="M85 96 L96 96 L90.5 106 Z" fill="#f5d6a8" />
        <path d="M88.6 102.5 L92.4 102.5 L90.5 106 Z" fill="#4b4b4b" />
      </g>
      <ellipse cx="82" cy="94" rx="8" ry="6" fill="#58a700" />
    </svg>
  );
}

export function BackArrow({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M20 12H5M11 5l-7 7 7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
