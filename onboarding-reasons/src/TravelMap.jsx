import { useEffect, useRef, useState } from "react";
import { BackArrow, CheckIcon, DuoOwl } from "./Icons.jsx";
import {
  COURSE_LANGUAGE,
  DESTINATIONS,
  REGIONS,
  REGION_ORDER,
  getDestination,
  languagesFor,
  tripPhrase,
} from "./destinations.js";
import { PRESSABLE } from "./styles.js";
import { ANTARCTICA, CLOUDS, LAND, WAVES, project } from "./worldShapes.js";

const CLOSE_MS = 200;
const FLY_MS = 700;

// Map pin, drawn in screen pixels with its tip at (0, 0).
const PIN = "M0 0 C-5 -8 -17 -13 -17 -25 A17 17 0 1 1 17 -25 C17 -13 5 -8 0 0 Z";
const WAVE = "M-12 0 q6 -6 12 0 t12 0";
const ICE = { fill: "#e8f7fd", lip: "#b9dcea" };

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function activate(handler) {
  return (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler();
    }
  };
}

export default function TravelMap({ initial, onDone, onClose }) {
  const [picked, setPicked] = useState(initial ?? []);
  const [region, setRegion] = useState("world");
  const [vb, setVb] = useState(REGIONS.world.vb);
  const [flying, setFlying] = useState(false);
  const [hoverId, setHoverId] = useState(null);
  const [closing, setClosing] = useState(false);
  const [frameW, setFrameW] = useState(356);
  const vbRef = useRef(vb);
  const rafRef = useRef();
  const snapRef = useRef();
  const frameRef = useRef(null);
  const panelRef = useRef(null);
  const regionRef = useRef(region);
  regionRef.current = region;

  // Pins and labels are sized in screen pixels, so track the frame's width.
  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => setFrameW(entry.contentRect.width));
    ro.observe(frameRef.current);
    return () => ro.disconnect();
  }, []);

  // Animate the SVG viewBox from wherever the camera is to the region's box.
  function flyTo(next) {
    if (next === regionRef.current) return;
    setRegion(next);
    setHoverId(null);
    cancelAnimationFrame(rafRef.current);
    clearTimeout(snapRef.current);

    const from = vbRef.current;
    const to = REGIONS[next].vb;
    const duration = reducedMotion() ? 0 : FLY_MS;
    const start = performance.now();
    setFlying(true);

    const land = () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(snapRef.current);
      vbRef.current = to;
      setVb(to);
      setFlying(false);
    };
    const step = (now) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1;
      if (t >= 1) return land();
      const e = easeInOut(t);
      const v = from.map((f, i) => f + (to[i] - f) * e);
      vbRef.current = v;
      setVb(v);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    // Browsers pause animation frames in background tabs; make sure we still arrive.
    snapRef.current = setTimeout(land, duration + 150);
  }

  function dismiss(after = onClose) {
    if (closing) return;
    setClosing(true);
    setTimeout(after, CLOSE_MS);
  }

  // Escape zooms back out to the world first, then closes the map.
  useEffect(() => {
    const prevFocus = document.activeElement;
    panelRef.current?.focus();
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (regionRef.current !== "world") flyTo("world");
      else dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(snapRef.current);
      prevFocus?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id) =>
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const unitsPerPx = vb[2] / frameW;
  const lip = 4 * unitsPerPx;
  const languages = languagesFor(picked);
  const countIn = (r) => picked.filter((id) => getDestination(id).region === r).length;
  const regionDests = DESTINATIONS.filter((d) => d.region === region);
  const showPins = region !== "world" && !flying;
  const hovered = hoverId && getDestination(hoverId);

  const duoSays = picked.length
    ? `Ooh, ${tripPhrase(picked)}! Let's pack your phrasebook!`
    : region === "world"
      ? "Where are you headed? Tap a continent to explore!"
      : `Tap a pin to pick your stops in ${REGIONS[region].name}!`;

  return (
    <div className="fixed inset-0 z-[60] flex justify-center">
      <div className={`absolute inset-0 bg-black/60 ${closing ? "animate-fade-out" : "animate-fade-in"}`} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-title"
        tabIndex={-1}
        className={`relative flex h-dvh w-full max-w-[420px] flex-col bg-ink outline-none sm:border-x-2 sm:border-line ${
          closing ? "animate-sheet-down" : "animate-sheet-up"
        }`}
      >
        <header className="flex h-14 shrink-0 items-center gap-2 px-4">
          <button
            type="button"
            aria-label="Back to reasons"
            onClick={() => dismiss()}
            className="-ml-2 rounded-xl p-2 text-fog outline-none hover:text-snow focus-visible:ring-4 focus-visible:ring-sky/40"
          >
            <BackArrow className="h-7 w-7" />
          </button>
          <h2 id="map-title" className="text-[19px] font-black text-snow">
            Where are you traveling?
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {/* Duo */}
          <div className="flex items-center gap-3">
            <div key={`owl-${duoSays}`} className="w-16 shrink-0 animate-hop">
              <DuoOwl className="h-auto w-full" />
            </div>
            <div
              key={duoSays}
              role="status"
              aria-live="polite"
              className="relative flex-1 animate-pop rounded-2xl border-2 border-line px-3.5 py-2.5 text-[15px] font-bold leading-snug text-snow"
            >
              <span
                aria-hidden="true"
                className="absolute top-1/2 -left-[8px] h-3.5 w-3.5 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-line bg-ink"
              />
              {duoSays}
            </div>
          </div>

          {/* Region tabs */}
          <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pt-1 pb-2 [scrollbar-width:none]">
            {["world", ...REGION_ORDER].map((r) => {
              const active = region === r;
              const count = r === "world" ? picked.length : countIn(r);
              return (
                <button
                  key={r}
                  type="button"
                  aria-pressed={active}
                  onClick={() => flyTo(r)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-[14px] font-extrabold whitespace-nowrap ${PRESSABLE} ${
                    active ? "border-sky-line bg-panel text-sky" : "border-line text-snow hover:bg-panel/50"
                  }`}
                >
                  {r === "world" ? "🌍 World" : REGIONS[r].short ?? REGIONS[r].name}
                  {count > 0 && r !== "world" && (
                    <span className="rounded-full bg-owl px-1.5 text-[11px] font-black text-ink">{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Map */}
          <div
            ref={frameRef}
            className="relative mt-2 aspect-[8/5] overflow-hidden rounded-3xl border-2 border-b-[5px] border-[#1287bf] bg-[#1cb0f6]"
          >
            <svg
              viewBox={vb.join(" ")}
              className="absolute inset-0 h-full w-full select-none"
              role="group"
              aria-label={`Map of ${REGIONS[region].name}`}
            >
              <rect x="-2000" y="-2000" width="5000" height="5000" fill="#1cb0f6" />

              {WAVES.map(([x, y], i) => (
                <path
                  key={i}
                  d={WAVE}
                  transform={`translate(${x} ${y}) scale(${unitsPerPx})`}
                  fill="none"
                  stroke="#84d8ff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}

              <path d={ANTARCTICA} transform={`translate(0 ${lip})`} fill={ICE.lip} />
              <path d={ANTARCTICA} fill={ICE.fill} />

              {/* All the darker "lips" first, then the land on top, for a chunky 3D look. */}
              {LAND.map((s, i) => (
                <path
                  key={`lip-${i}`}
                  d={s.d}
                  transform={`translate(0 ${lip})`}
                  fill={s.ice ? ICE.lip : REGIONS[s.region].lip}
                />
              ))}
              {LAND.map((s, i) => (
                <path
                  key={`land-${i}`}
                  d={s.d}
                  fill={s.ice ? ICE.fill : REGIONS[s.region].fill}
                  className={s.region === region ? "" : "map-land"}
                  onClick={() => flyTo(s.region)}
                />
              ))}

              {region === "world" && (
                <g className="animate-fade-in">
                  {CLOUDS.map(([x, y, k], i) => (
                    <g key={i} transform={`translate(${x} ${y}) scale(${k})`} fill="#fff" opacity="0.9">
                      <circle cx="-22" cy="4" r="14" />
                      <circle cx="0" cy="-4" r="20" />
                      <circle cx="22" cy="4" r="14" />
                      <rect x="-36" y="4" width="72" height="14" rx="7" />
                    </g>
                  ))}

                  <path
                    id="flight-path"
                    d="M345 372 Q485 300 625 372"
                    fill="none"
                    stroke="#fff"
                    strokeOpacity="0.75"
                    strokeWidth="3"
                    strokeDasharray="10 12"
                    strokeLinecap="round"
                  />
                  <g>
                    <animateMotion dur="7s" repeatCount="indefinite" rotate="auto">
                      <mpath href="#flight-path" />
                    </animateMotion>
                    <text transform="rotate(45)" fontSize="30" textAnchor="middle" dominantBaseline="central">
                      ✈️
                    </text>
                  </g>

                  {REGION_ORDER.map((r) => {
                    const [x, y] = project(REGIONS[r].label);
                    const label = (REGIONS[r].short ?? REGIONS[r].name).toUpperCase();
                    const count = countIn(r);
                    const w = label.length * 8 + 26 + (count ? 22 : 0);
                    return (
                      <g key={r} transform={`translate(${x} ${y}) scale(${unitsPerPx})`}>
                      <g className="map-chip" onClick={() => flyTo(r)}>
                        <rect x={-w / 2} y={-10} width={w} height={26} rx={13} fill="#b9c8cf" />
                        <rect x={-w / 2} y={-13} width={w} height={26} rx={13} fill="#fff" />
                        <text
                          x={count ? -11 : 0}
                          y={0.5}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="12"
                          fontWeight="900"
                          letterSpacing="0.06em"
                          fill="#131f24"
                        >
                          {label}
                        </text>
                        {count > 0 && (
                          <>
                            <circle cx={w / 2 - 14} cy={0} r={9} fill="#58cc02" />
                            <text
                              x={w / 2 - 14}
                              y={0.5}
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize="11"
                              fontWeight="900"
                              fill="#fff"
                            >
                              {count}
                            </text>
                          </>
                        )}
                      </g>
                      </g>
                    );
                  })}
                </g>
              )}

              {showPins && (
                <g key={region} className="animate-fade-in">
                  {[...regionDests]
                    .sort((a, b) => a.y - b.y)
                    .map((d) => {
                      const selected = picked.includes(d.id);
                      return (
                        <g key={d.id} transform={`translate(${d.x} ${d.y}) scale(${unitsPerPx})`}>
                          <g
                            role="checkbox"
                            tabIndex={0}
                            aria-checked={selected}
                            aria-label={`${d.name}, ${d.city}. Languages: ${d.languages.join(", ")}`}
                            className="map-pin"
                            onClick={() => toggle(d.id)}
                            onKeyDown={activate(() => toggle(d.id))}
                            onMouseEnter={() => setHoverId(d.id)}
                            onMouseLeave={() => setHoverId(null)}
                            onFocus={() => setHoverId(d.id)}
                            onBlur={() => setHoverId(null)}
                          >
                            <ellipse cx="0" cy="1" rx="9" ry="3.5" fill="#000" opacity="0.25" />
                            <path d={PIN} transform="translate(0 3)" fill={selected ? "#58a700" : "#b9c8cf"} />
                            <path d={PIN} fill={selected ? "#58cc02" : "#fff"} />
                            <circle className="pin-ring" cx="0" cy="-25" r="21" fill="none" stroke="#131f24" strokeWidth="3" />
                            <text x="0" y="-24" textAnchor="middle" dominantBaseline="central" fontSize="18">
                              {d.emoji}
                            </text>
                            {selected && (
                              <g transform="translate(14 -40)">
                                <circle r="8" fill="#fff" />
                                <path
                                  d="M-4 0 l2.8 3 l5 -6"
                                  fill="none"
                                  stroke="#58a700"
                                  strokeWidth="2.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            )}
                          </g>
                        </g>
                      );
                    })}

                  {hovered && hovered.region === region && (
                    <g transform={`translate(${hovered.x} ${hovered.y}) scale(${unitsPerPx})`} pointerEvents="none">
                      <rect
                        x={-(hovered.name.length * 7 + 20) / 2}
                        y="-75"
                        width={hovered.name.length * 7 + 20}
                        height="24"
                        rx="12"
                        fill="#131f24"
                      />
                      <text
                        x="0"
                        y="-62.5"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="12"
                        fontWeight="900"
                        fill="#fff"
                      >
                        {hovered.name}
                      </text>
                    </g>
                  )}
                </g>
              )}
            </svg>

            {region !== "world" && (
              <button
                type="button"
                onClick={() => flyTo("world")}
                className="absolute top-2.5 left-2.5 rounded-xl border-2 border-b-4 border-[#b9c8cf] bg-white px-2.5 py-1 text-[13px] font-black text-ink outline-none active:translate-y-[2px] active:border-b-2 focus-visible:ring-4 focus-visible:ring-ink/40"
              >
                🌍 World
              </button>
            )}
          </div>

          {/* Destination list for the current region */}
          {region === "world" ? (
            <p className="mt-4 text-center text-[15px] font-bold text-fog">
              👆 Tap a continent to find your destination.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-2">
              {regionDests.map((d) => {
                const selected = picked.includes(d.id);
                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={selected}
                      onClick={() => toggle(d.id)}
                      onMouseEnter={() => setHoverId(d.id)}
                      onMouseLeave={() => setHoverId(null)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left ${PRESSABLE} ${
                        selected ? "border-sky-line bg-panel" : "border-line hover:bg-panel/50"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[22px] ${
                          selected ? "bg-sky/15" : "bg-panel"
                        }`}
                        aria-hidden="true"
                      >
                        {d.emoji}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[16px] font-extrabold ${selected ? "text-sky" : "text-snow"}`}>
                          {d.name}
                        </span>
                        <span className="block truncate text-[13px] font-bold text-fog">
                          {d.city} · {d.languages.join(", ")}
                        </span>
                      </span>
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 ${
                          selected ? "border-sky bg-sky text-ink" : "border-line text-transparent"
                        }`}
                        aria-hidden="true"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t-2 border-line px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {languages.length > 0 ? (
            <div className="mb-3">
              <p className="text-[12px] font-extrabold uppercase tracking-wide text-fog">
                Duo will tailor travel lessons in
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {languages.map((lang) => {
                  const course = lang === COURSE_LANGUAGE;
                  return (
                    <span
                      key={lang}
                      className={`rounded-full border-2 px-2.5 py-0.5 text-[13px] font-extrabold ${
                        course ? "border-owl text-owl" : "border-line text-snow"
                      }`}
                    >
                      🗣️ {lang}
                      {course && " · your course"}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="mb-3 text-[14px] font-bold text-fog">
              Pick one or more places, and we'll match your lessons to the languages spoken there.
            </p>
          )}
          <button
            type="button"
            disabled={!picked.length}
            onClick={() => dismiss(() => onDone(picked))}
            className={`w-full rounded-2xl py-3.5 text-[16px] font-black uppercase tracking-[0.08em] ${
              picked.length
                ? `${PRESSABLE} border-owl border-b-owl-dark bg-owl text-ink hover:brightness-105`
                : "cursor-not-allowed border-2 border-b-4 border-line bg-line text-muted"
            }`}
          >
            {picked.length ? `Save ${picked.length} ${picked.length === 1 ? "stop" : "stops"}` : "Pick a destination"}
          </button>
        </div>
      </div>
    </div>
  );
}
