import { useLayoutEffect, useRef, useState } from "react";
import { FlameIcon } from "./Icons.jsx";
import StreakPopover from "./StreakPopover.jsx";
import { practicedToday } from "./streak.js";

// The real streak for the homepage's top bar (replaces the sample "0"):
// flame + count, and tapping it opens the same streak panel as onboarding,
// in the homepage's light colors.
export default function HomeStreak({ streak, onAction }) {
  const [open, setOpen] = useState(false);
  const [arrowRight, setArrowRight] = useState(24);
  const btnRef = useRef(null);

  const variant = streak.hold ? "frozen" : practicedToday(streak) ? "lit" : "off";
  const count = streak.hold ? streak.hold.lost : streak.count;
  const color = { lit: "text-[#ff9600]", frozen: "text-macaw", off: "text-hare" }[variant];

  // Point the panel's arrow at the flame (the panel hangs off the header's right edge).
  useLayoutEffect(() => {
    if (!open) return;
    const btn = btnRef.current?.getBoundingClientRect();
    const header = btnRef.current?.closest("header")?.getBoundingClientRect();
    if (btn && header) setArrowRight(Math.max(12, header.right - (btn.left + btn.width / 2) - 8));
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={streak.hold ? `${count}-day streak on hold. Show streak info` : `${count}-day streak. Show streak info`}
        className={`flex items-center gap-1 rounded-xl px-1 py-1 text-[17px] font-black outline-none hover:bg-polar focus-visible:ring-4 focus-visible:ring-macaw/30 ${color} ${
          open ? "bg-polar" : ""
        }`}
      >
        <FlameIcon variant={variant} className="h-7 w-auto" />
        {count}
      </button>
      {open && (
        <StreakPopover
          light
          streak={streak}
          arrowRight={arrowRight}
          onClose={() => setOpen(false)}
          onAction={() => {
            setOpen(false);
            onAction();
          }}
        />
      )}
    </>
  );
}
