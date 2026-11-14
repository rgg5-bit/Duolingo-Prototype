import { useEffect, useRef, useState } from "react";
import { REGIONS, REGION_ORDER } from "./destinations.js";
import { COUNTRIES, countryBox, getCity, getCountry, heat, percent } from "./speakers.js";
import { PRESSABLE } from "./styles.js";
import { ANTARCTICA, CLOUDS, LAND, WAVES, project } from "./worldShapes.js";

// Inline world map for "Where are you going?":
//   world → continent (country pins, colored by how many people speak the course
//   language) → country (city pins) → tap a city to pick it.
// Hovering (or tapping) a country or city shows its speaker share below the map.

const FLY_MS = 650;
const WAVE = "M-12 0 q6 -6 12 0 t12 0";
const ICE = { fill: "#e8f7fd", lip: "#b9dcea" };
const PIN = "M0 0 C-4 -6 -13 -10 -13 -19 A13 13 0 1 1 13 -19 C13 -10 4 -6 0 0 Z";

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function onKeys(handler) {
  return (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler();
    }
  };
}

function Bar({ value }) {
  const h = heat(value);
  return (
    <span className="mt-2 block h-3 overflow-hidden rounded-full bg-line" aria-hidden="true">
      <span
        className="block h-full rounded-full transition-[width] duration-300"
        style={{ width: `${Math.max(2, Math.min(100, value ?? 0))}%`, background: h.fill }}
      />
    </span>
  );
}

export default function TripMap({ lang, langName, value, onChange }) {
  const selected = value ? getCity(value) : null;
  const [region, setRegion] = useState(selected ? getCountry(selected.country).region : "world");
  const [countryId, setCountryId] = useState(selected?.country ?? null);
  const country = countryId ? getCountry(countryId) : null;
  const [vb, setVb] = useState(() => (country ? countryBox(country) : REGIONS[region].vb));
  const [flying, setFlying] = useState(false);
  const [hover, setHover] = useState(null); // { kind: "country" | "city", id }
  const [frameW, setFrameW] = useState(356);
  const vbRef = useRef(vb);
  const rafRef = useRef();
  const snapRef = useRef();
  const frameRef = useRef(null);

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => setFrameW(entry.contentRect.width));
    ro.observe(frameRef.current);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      clearTimeout(snapRef.current);
    };
  }, []);

  function flyTo(to) {
    cancelAnimationFrame(rafRef.current);
    clearTimeout(snapRef.current);
    const from = vbRef.current;
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
    snapRef.current = setTimeout(land, duration + 150); // background tabs pause animation frames
  }

  function showWorld() {
    setRegion("world");
    setCountryId(null);
    setHover(null);
    flyTo(REGIONS.world.vb);
  }
  function showRegion(r) {
    setRegion(r);
    setCountryId(null);
    setHover(null);
    flyTo(REGIONS[r].vb);
  }
  function showCountry(c) {
    setRegion(c.region);
    setCountryId(c.id);
    setHover(null);
    flyTo(countryBox(c));
  }
  function pickCity(city) {
    const c = getCountry(city.country);
    onChange({ id: city.id, city: city.name, country: c.name });
  }

  const unitsPerPx = vb[2] / frameW;
  const lip = 4 * unitsPerPx;
  const regionCountries = COUNTRIES.filter((c) => c.region === region);
  const showCountryPins = region !== "world" && !country && !flying;
  const showCityPins = country && !flying;

  // What the info card describes: whatever's hovered, else the open country, else the pick.
  const focus =
    hover?.kind === "city"
      ? { kind: "city", item: getCity(hover.id) }
      : hover?.kind === "country"
        ? { kind: "country", item: getCountry(hover.id) }
        : country
          ? { kind: "country", item: country }
          : selected
            ? { kind: "city", item: selected }
            : null;
  const focusValue = focus?.item.speak[lang];

  const hint =
    region === "world"
      ? "Tap a continent to start exploring."
      : country
        ? `Tap a city in ${country.name} to choose it.`
        : `Hover or tap a country to see how many people speak ${langName}.`;

  return (
    <div>
      {/* Breadcrumbs */}
      <nav aria-label="Map location" className="mb-2 flex flex-wrap items-center gap-1.5 text-[14px] font-extrabold">
        <button
          type="button"
          onClick={showWorld}
          className={`rounded-lg px-2 py-1 outline-none focus-visible:ring-4 focus-visible:ring-sky/40 ${
            region === "world" ? "bg-panel text-sky" : "text-fog hover:text-snow"
          }`}
        >
          🌍 World
        </button>
        {region !== "world" && (
          <>
            <span className="text-muted" aria-hidden="true">›</span>
            <button
              type="button"
              onClick={() => showRegion(region)}
              className={`rounded-lg px-2 py-1 outline-none focus-visible:ring-4 focus-visible:ring-sky/40 ${
                country ? "text-fog hover:text-snow" : "bg-panel text-sky"
              }`}
            >
              {REGIONS[region].name}
            </button>
          </>
        )}
        {country && (
          <>
            <span className="text-muted" aria-hidden="true">›</span>
            <span className="rounded-lg bg-panel px-2 py-1 text-sky">
              {country.emoji} {country.name}
            </span>
          </>
        )}
      </nav>

      {/* Map */}
      <div
        ref={frameRef}
        className="relative aspect-[8/5] overflow-hidden rounded-3xl border-2 border-b-[5px] border-[#1287bf] bg-[#1cb0f6]"
      >
        <svg
          viewBox={vb.join(" ")}
          className="absolute inset-0 h-full w-full select-none"
          role="group"
          aria-label={country ? `Map of ${country.name}` : `Map of ${REGIONS[region].name}`}
          onMouseLeave={() => setHover(null)}
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
              opacity={country && !s.ice ? 0.85 : 1}
              className={s.ice || s.region === region ? "" : "map-land"}
              onClick={() => !s.ice && s.region !== region && showRegion(s.region)}
            />
          ))}

          {/* World: continent chips */}
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
              {REGION_ORDER.map((r) => {
                const [x, y] = project(REGIONS[r].label);
                const label = (REGIONS[r].short ?? REGIONS[r].name).toUpperCase();
                const w = label.length * 8 + 26;
                return (
                  <g key={r} transform={`translate(${x} ${y}) scale(${unitsPerPx})`}>
                    <g
                      className="map-chip"
                      role="button"
                      tabIndex={0}
                      aria-label={`Zoom into ${REGIONS[r].name}`}
                      onClick={() => showRegion(r)}
                      onKeyDown={onKeys(() => showRegion(r))}
                    >
                      <rect x={-w / 2} y={-10} width={w} height={26} rx={13} fill="#b9c8cf" />
                      <rect x={-w / 2} y={-13} width={w} height={26} rx={13} fill="#fff" />
                      <text y={0.5} textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="900" letterSpacing="0.06em" fill="#131f24">
                        {label}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          )}

          {/* Continent: country pins with their speaker share */}
          {showCountryPins && (
            <g key={`countries-${region}`} className="animate-fade-in">
              {[...regionCountries]
                .sort((a, b) => a.y - b.y)
                .map((c) => {
                  const v = c.speak[lang];
                  const h = heat(v);
                  const hovered = hover?.kind === "country" && hover.id === c.id;
                  const pct = percent(v);
                  const w = pct.length * 8 + 34;
                  return (
                    <g key={c.id} transform={`translate(${c.x} ${c.y}) scale(${unitsPerPx * (hovered ? 1.15 : 1)})`}>
                      <g
                        role="button"
                        tabIndex={0}
                        aria-label={`${c.name}: about ${pct} speak ${langName}. Show cities`}
                        className="map-pin"
                        onClick={() => showCountry(c)}
                        onKeyDown={onKeys(() => showCountry(c))}
                        onMouseEnter={() => setHover({ kind: "country", id: c.id })}
                        onFocus={() => setHover({ kind: "country", id: c.id })}
                        onBlur={() => setHover(null)}
                      >
                        <path d="M-6 -2 L0 6 L6 -2 Z" fill={h.lip} />
                        <rect x={-w / 2} y={-22} width={w} height={24} rx={12} fill={h.lip} />
                        <rect x={-w / 2} y={-25} width={w} height={24} rx={12} fill={h.fill} stroke={hovered ? "#131f24" : "none"} strokeWidth="2.5" />
                        <text x={-w / 2 + 14} y={-12.5} textAnchor="middle" dominantBaseline="central" fontSize="14">
                          {c.emoji}
                        </text>
                        <text x={10} y={-12.5} textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="900" fill={h.text}>
                          {pct}
                        </text>
                      </g>
                    </g>
                  );
                })}
              {/* name tag for the hovered country */}
              {hover?.kind === "country" && getCountry(hover.id).region === region && (() => {
                const c = getCountry(hover.id);
                const w = c.name.length * 7 + 20;
                return (
                  <g transform={`translate(${c.x} ${c.y}) scale(${unitsPerPx})`} pointerEvents="none">
                    <rect x={-w / 2} y={-56} width={w} height={22} rx={11} fill="#131f24" />
                    <text y={-44.5} textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="900" fill="#fff">
                      {c.name}
                    </text>
                  </g>
                );
              })()}
            </g>
          )}

          {/* Country: city pins */}
          {showCityPins && (
            <g key={`cities-${country.id}`} className="animate-fade-in">
              {[...country.cities]
                .sort((a, b) => a.y - b.y)
                .map((city) => {
                  const v = city.speak[lang];
                  const h = heat(v);
                  const isPick = value === city.id;
                  const hovered = hover?.kind === "city" && hover.id === city.id;
                  const label = `${city.name} · ${percent(v)}`;
                  const w = label.length * 6.6 + 18;
                  return (
                    <g key={city.id} transform={`translate(${city.x} ${city.y}) scale(${unitsPerPx * (hovered ? 1.12 : 1)})`}>
                      <g
                        role="radio"
                        tabIndex={0}
                        aria-checked={isPick}
                        aria-label={`${city.name}: about ${percent(v)} speak ${langName}`}
                        className="map-pin"
                        onClick={() => pickCity(city)}
                        onKeyDown={onKeys(() => pickCity(city))}
                        onMouseEnter={() => setHover({ kind: "city", id: city.id })}
                        onFocus={() => setHover({ kind: "city", id: city.id })}
                        onBlur={() => setHover(null)}
                      >
                        <ellipse cx="0" cy="1" rx="7" ry="2.8" fill="#000" opacity="0.25" />
                        <path d={PIN} transform="translate(0 2.5)" fill={isPick ? "#46a302" : h.lip} />
                        <path d={PIN} fill={isPick ? "#58cc02" : h.fill} stroke={hovered ? "#131f24" : "none"} strokeWidth="2.5" />
                        <circle cx="0" cy="-19" r="5" fill="#fff" />
                        <rect x={-w / 2} y={-55} width={w} height={20} rx={10} fill={isPick ? "#58cc02" : "#131f24"} />
                        <text y={-44.5} textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="900" fill="#fff">
                          {isPick ? `✓ ${label}` : label}
                        </text>
                      </g>
                    </g>
                  );
                })}
            </g>
          )}
        </svg>

        {/* Legend */}
        {region !== "world" && (
          <div className="pointer-events-none absolute right-2 bottom-2 flex gap-1 rounded-lg bg-ink/75 px-1.5 py-1 text-[10px] font-black text-white">
            {[["50%+", 60], ["10%+", 20], ["1%+", 5], ["<1%", 0]].map(([t, v]) => (
              <span key={t} className="flex items-center gap-0.5">
                <span className="h-2 w-2 rounded-full" style={{ background: heat(v).fill }} />
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info card: what's hovered / open / picked */}
      <div className="mt-3 min-h-[92px] rounded-2xl border-2 border-line px-4 py-3" aria-live="polite">
        {focus ? (
          <>
            <p className="flex items-center gap-2 text-[17px] font-black text-snow">
              <span aria-hidden="true">{focus.kind === "country" ? focus.item.emoji : "📍"}</span>
              {focus.kind === "city" ? `${focus.item.name}, ${getCountry(focus.item.country).name}` : focus.item.name}
              {focus.kind === "city" && value === focus.item.id && (
                <span className="rounded-md bg-owl px-1.5 py-0.5 text-[11px] font-black tracking-[0.06em] text-ink">
                  YOUR TRIP
                </span>
              )}
            </p>
            <p className="mt-1 text-[15px] font-bold text-fog">
              <span className="text-[20px] font-black" style={{ color: heat(focusValue).fill === "#e5e5e5" ? "#8fa3ad" : heat(focusValue).fill }}>
                ≈{percent(focusValue)}
              </span>{" "}
              of people {focus.kind === "city" ? "here" : "in this country"} speak {langName}
            </p>
            <Bar value={focusValue} />
            <p className="mt-1.5 text-[12px] font-bold text-muted">
              {heat(focusValue).label} · rough estimate (native + fluent speakers)
            </p>
          </>
        ) : (
          <p className="pt-2 text-center text-[15px] font-bold text-fog">👆 {hint}</p>
        )}
      </div>

      {/* Same choices as a list, for touch and keyboard */}
      {region !== "world" && (
        <>
          <p className="mt-4 mb-2 text-[13px] font-extrabold uppercase tracking-wide text-fog">
            {country ? `Cities in ${country.name}` : `Countries in ${REGIONS[region].name}`}
          </p>
          <ul className="flex flex-col gap-2">
            {(country ? country.cities : regionCountries).map((item) => {
              const v = item.speak[lang];
              const h = heat(v);
              const isPick = country && value === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    role={country ? "radio" : undefined}
                    aria-checked={country ? isPick : undefined}
                    onClick={() => (country ? pickCity(item) : showCountry(item))}
                    onMouseEnter={() => setHover({ kind: country ? "city" : "country", id: item.id })}
                    onMouseLeave={() => setHover(null)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left ${PRESSABLE} ${
                      isPick ? "border-sky-line bg-panel" : "border-line hover:bg-panel/50"
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-panel text-[20px]" aria-hidden="true">
                      {country ? "📍" : item.emoji}
                    </span>
                    <span className={`min-w-0 flex-1 truncate text-[16px] font-extrabold ${isPick ? "text-sky" : "text-snow"}`}>
                      {item.name}
                    </span>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[13px] font-black"
                      style={{ background: h.fill, color: h.text }}
                    >
                      {percent(v)}
                    </span>
                    <span className="shrink-0 text-[13px] font-black text-fog" aria-hidden="true">
                      {country ? (isPick ? "✓" : "") : "›"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
