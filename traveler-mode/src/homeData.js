// Courses shown in the flag dropdown. Only French is "active" in this demo.
export const COURSES = [
  { id: "fr", name: "French", flag: ["#1cb0f6", "#ffffff", "#ff4b4b"], xp: 6 },
  { id: "es", name: "Spanish", flag: ["#ff4b4b", "#ffc800", "#ff4b4b"], horizontal: true },
  { id: "it", name: "Italian", flag: ["#58cc02", "#ffffff", "#ff4b4b"] },
  { id: "de", name: "German", flag: ["#4b4b4b", "#ff4b4b", "#ffc800"], horizontal: true },
  { id: "ja", name: "Japanese", flag: ["#ffffff"], dot: "#ff4b4b" },
];

// Unit banner text.
export const UNIT = { section: "SECTION 1, UNIT 3", title: "Talk about your family" };

// Node "kind" drives styling: done → gold coin, current → practice node with a
// progress ring, locked → grey.
export const NODES = [
  { kind: "done", label: "Completed lesson" },
  { kind: "current", label: "Practice" },
  { kind: "locked", label: "Lesson" },
  { kind: "locked", label: "Lesson" },
  { kind: "locked", label: "Lesson" },
  { kind: "chest", label: "Reward chest" },
  { kind: "locked", label: "Unit review" },
];

// Zig-zag offsets (px) for the winding lesson path, matching the real app.
export const PATH_OFFSETS = [0, -44, -66, -44, 0, 44, 66];
