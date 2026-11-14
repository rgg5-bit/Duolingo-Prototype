import { courseKey } from "./courses.js";
import { loadCompleted } from "./lessonContent.js";
import { getLesson, loadLessons } from "./lessons.js";

// The homepage trail branches into one path per lesson the user picked.
// Each path: Lesson → Practice → Reward chest. Paths are open from the start,
// so users choose which one to take next; the end of the trail unlocks once
// every path's lesson is done.

const PRACTICED_KEY = () => courseKey("duo-prototype:practiced-lessons");

export function loadPracticed() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PRACTICED_KEY()));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markPracticed(id) {
  const current = loadPracticed();
  if (current.includes(id)) return;
  try {
    localStorage.setItem(PRACTICED_KEY(), JSON.stringify([...current, id]));
  } catch {
    // Storage blocked: progress just isn't remembered.
  }
}

// null when no lessons are picked (the homepage keeps its sample path).
export function buildTrail() {
  const picked = loadLessons();
  if (!picked.length) return null;

  const done = loadCompleted();
  const practiced = loadPracticed();

  const branches = picked.map((id) => {
    const lessonDone = done.includes(id);
    const practiceDone = lessonDone && practiced.includes(id);
    return {
      id,
      lesson: getLesson(id),
      steps: [
        { kind: "lesson", state: lessonDone ? "done" : "open" },
        { kind: "practice", state: practiceDone ? "done" : lessonDone ? "open" : "locked" },
        { kind: "chest", state: practiceDone ? "open" : "locked" },
      ],
    };
  });

  return {
    branches,
    finishedLessons: branches.filter((b) => b.steps[0].state === "done").length,
    allLessonsDone: branches.every((b) => b.steps[0].state === "done"),
  };
}
