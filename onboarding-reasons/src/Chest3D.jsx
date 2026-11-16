import { useId } from "react";

// A chunky 3D treasure chest for the homepage path: shaded wood, a domed lid,
// a side face for depth, gold straps and lock, and a glossy highlight.
//   state "locked" → grey, closed
//   state "open"   → ready to open: glowing halo + twinkling sparkles
//   state "done"   → opened: lid flipped back, coins and a gem inside

const PALETTES = {
  wood: { light: "#e0913d", mid: "#c26f22", dark: "#8f4c12", deep: "#6b360a" },
  gold: { light: "#fff1a1", mid: "#ffcf26", dark: "#d99a00", deep: "#a86f00" },
  greyWood: { light: "#d6d6d6", mid: "#bdbdbd", dark: "#9c9c9c", deep: "#828282" },
  greyGold: { light: "#f2f2f2", mid: "#dcdcdc", dark: "#b9b9b9", deep: "#9e9e9e" },
};

function Sparkle({ x, y, s = 1, delay = 0 }) {
  return (
    <path
      className="chest-twinkle"
      style={{ animationDelay: `${delay}ms`, transformOrigin: `${x}px ${y}px` }}
      d={`M${x} ${y - 5 * s} L${x + 1.4 * s} ${y - 1.4 * s} L${x + 5 * s} ${y} L${x + 1.4 * s} ${y + 1.4 * s} L${x} ${y + 5 * s} L${x - 1.4 * s} ${y + 1.4 * s} L${x - 5 * s} ${y} L${x - 1.4 * s} ${y - 1.4 * s} Z`}
      fill="#fff6c2"
    />
  );
}

export default function Chest3D({ state = "locked", className = "" }) {
  const uid = useId().replace(/:/g, "");
  const locked = state === "locked";
  const opened = state === "done";
  const wood = locked ? PALETTES.greyWood : PALETTES.wood;
  const gold = locked ? PALETTES.greyGold : PALETTES.gold;
  const id = (n) => `${n}-${uid}`;

  return (
    <svg viewBox="0 0 84 80" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id("front")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={wood.light} />
          <stop offset="1" stopColor={wood.mid} />
        </linearGradient>
        <linearGradient id={id("side")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={wood.dark} />
          <stop offset="1" stopColor={wood.deep} />
        </linearGradient>
        <linearGradient id={id("lid")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={wood.light} />
          <stop offset="0.55" stopColor={wood.mid} />
          <stop offset="1" stopColor={wood.dark} />
        </linearGradient>
        <linearGradient id={id("gold")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={gold.light} />
          <stop offset="0.5" stopColor={gold.mid} />
          <stop offset="1" stopColor={gold.dark} />
        </linearGradient>
        <radialGradient id={id("glow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff3a0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd84a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("inside")} cx="0.5" cy="0.6" r="0.6">
          <stop offset="0" stopColor="#ffe88a" />
          <stop offset="0.5" stopColor="#7a3f0c" />
          <stop offset="1" stopColor="#3e1d04" />
        </radialGradient>
      </defs>

      {/* glow behind a chest that's ready to open */}
      {state === "open" && <ellipse cx="40" cy="42" rx="40" ry="36" fill={`url(#${id("glow")})`} className="chest-glow" />}

      {/* ground shadow */}
      <ellipse cx="42" cy="73" rx="32" ry="5.5" fill="#000" opacity={locked ? 0.12 : 0.2} />

      {opened && (
        <>
          {/* lid flipped back, seen from inside */}
          <path d="M20 31 L16 12 Q16 4 26 3 L58 1 Q70 1 72 10 L74 26 Z" fill={wood.deep} />
          <path d="M22 30 L19 13 Q19 7 27 6 L57 4 Q67 4 69 11 L71 26 Z" fill={wood.dark} />
          <path d="M42 5 L44 30" stroke={gold.dark} strokeWidth="6" />
          {/* glowing inside */}
          <path d="M12 40 L60 40 L72 32 L24 32 Z" fill={`url(#${id("inside")})`} />
        </>
      )}

      {/* body: side face for depth, then the front */}
      <path d="M60 40 L72 32 L72 62 L60 70 Z" fill={`url(#${id("side")})`} />
      <rect x="12" y="40" width="48" height="30" rx="3" fill={`url(#${id("front")})`} />
      {/* wood planks */}
      <path d="M12 50 H60 M12 60 H60" stroke={wood.dark} strokeWidth="1.5" opacity="0.5" />
      <path d="M60 50 L72 42 M60 60 L72 52" stroke={wood.deep} strokeWidth="1.5" opacity="0.6" />
      {/* bottom trim */}
      <path d="M12 66 H60 V70 H15 Q12 70 12 67 Z" fill={gold.dark} opacity="0.85" />
      <path d="M60 66 L72 58 L72 62 L60 70 Z" fill={gold.deep} opacity="0.85" />

      {/* gold corner straps */}
      <rect x="12" y="40" width="5" height="30" fill={`url(#${id("gold")})`} />
      <rect x="55" y="40" width="5" height="30" fill={`url(#${id("gold")})`} />
      <path d="M67 35.3 L72 32 L72 62 L67 65.3 Z" fill={gold.deep} />

      {!opened && (
        <>
          {/* domed lid: side, then front */}
          <path d="M60 40 V28 Q60 16 52 12 L62 6 Q72 10 72 22 V32 Z" fill={`url(#${id("side")})`} />
          <path d="M12 40 V28 Q12 12 36 12 Q60 12 60 28 V40 Z" fill={`url(#${id("lid")})`} />
          {/* lid's top edge running back */}
          <path d="M36 12 Q52 11 52 12 L62 6 Q48 5 40 6 Z" fill={wood.light} opacity="0.8" />
          {/* lid straps */}
          <path d="M12 40 V28 Q12 14 17 13 L17 40 Z" fill={`url(#${id("gold")})`} />
          <path d="M55 40 V15 Q60 19 60 28 V40 Z" fill={`url(#${id("gold")})`} />
          <path d="M67 35.3 V12 Q72 16 72 22 V32 Z" fill={gold.deep} />
          {/* glossy highlight */}
          <path d="M20 22 Q24 16 34 15" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity={locked ? 0.35 : 0.55} />
          {/* rim where lid meets body */}
          <rect x="12" y="38" width="48" height="4" fill={gold.dark} />
          <path d="M60 38 L72 30 L72 34 L60 42 Z" fill={gold.deep} />
        </>
      )}

      {/* lock plate with keyhole */}
      <g>
        <rect x="29" y={opened ? 41 : 34} width="14" height="15" rx="3.5" fill={`url(#${id("gold")})`} stroke={gold.deep} strokeWidth="1.5" />
        <circle cx="36" cy={opened ? 46.5 : 39.5} r="2.2" fill={locked ? "#8a8a8a" : wood.deep} />
        <path d={`M35 ${opened ? 47.5 : 40.5} h2 l0.8 5 h-3.6 Z`} fill={locked ? "#8a8a8a" : wood.deep} />
      </g>

      {opened && (
        <>
          {/* treasure inside */}
          <ellipse cx="30" cy="36" rx="5.5" ry="3" fill={gold.mid} stroke={gold.dark} strokeWidth="1" />
          <ellipse cx="42" cy="34.5" rx="5.5" ry="3" fill={gold.light} stroke={gold.dark} strokeWidth="1" />
          <ellipse cx="54" cy="35.5" rx="5" ry="2.8" fill={gold.mid} stroke={gold.dark} strokeWidth="1" />
          <path d="M44 27 L49 31 L44 37 L39 31 Z" fill="#4fd1ff" stroke="#1899d6" strokeWidth="1" />
          <path d="M44 27 L46 31 L44 37" fill="#9be7ff" opacity="0.7" />
          <Sparkle x={24} y={24} s={0.9} />
          <Sparkle x={62} y={22} s={0.8} delay={400} />
        </>
      )}

      {state === "open" && (
        <>
          <Sparkle x={8} y={22} delay={0} />
          <Sparkle x={76} y={14} s={0.8} delay={350} />
          <Sparkle x={70} y={46} s={0.7} delay={700} />
          <Sparkle x={10} y={56} s={0.6} delay={1000} />
        </>
      )}
    </svg>
  );
}
