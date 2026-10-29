export function DuoOwl({ className = "" }) {
  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden="true">
      {/* floor shadow */}
      <ellipse cx="60" cy="96" rx="46" ry="30" fill="#2b3a41" />

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

export function BookIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="9" y="9" width="44" height="48" rx="3" fill="#e5a400" />
      <rect x="9" y="9" width="40" height="48" rx="3" fill="#ffc800" />
      <rect x="45" y="11" width="5" height="44" rx="1" fill="#fff" />
      <path d="M16 4 H25 V18 L20.5 14.5 L16 18 Z" fill="#ff4b4b" />
      <text
        x="28"
        y="42"
        textAnchor="middle"
        fontFamily="Nunito, sans-serif"
        fontWeight="900"
        fontSize="22"
        fill="#a86d00"
      >
        1
      </text>
    </svg>
  );
}

export function CompassIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="29" fill="#1899d6" />
      <circle cx="32" cy="32" r="22" fill="#fff" />
      <g transform="rotate(45 32 32)">
        <path d="M32 13 L38 32 L26 32 Z" fill="#ff4b4b" />
        <path d="M26 32 L38 32 L32 49 Z" fill="#c4c4c4" />
      </g>
    </svg>
  );
}

export function ReasonIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M10 14 Q10 6 18 6 H46 Q54 6 54 14 V38 Q54 46 46 46 H28 L16 56 V46 Q10 46 10 38 Z"
        fill="#ce82ff"
      />
      <path
        d="M32 39 C20 31 18 26 18 22 C18 17.5 21.5 14.5 25.5 14.5 C28.5 14.5 30.8 16.3 32 18.5 C33.2 16.3 35.5 14.5 38.5 14.5 C42.5 14.5 46 17.5 46 22 C46 26 44 31 32 39 Z"
        fill="#fff"
      />
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

export function CloseIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
