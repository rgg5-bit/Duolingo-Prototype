import { courseKey } from "./courses.js";
import { loadCompleted } from "./lessonContent.js";
import { getLesson, loadLessons } from "./lessons.js";
import { PATH } from "./practice.js";

// The homepage trail branches into one path per lesson the user picked. Each
// path is 20 steps in 4 levels (PATH in practice.js), getting more advanced as
// you go. Every path's first step is open from the start, so users choose which
// one to take; after that each step unlocks when the one before it is done.
//
// Progress is saved as "how many steps of this path are done" per lesson.

const PROGRESS_KEY = () => courseKey("duo-prototype:path-progress");

function loadProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PROGRESS_KEY()));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

// Steps done on a lesson's path (the lesson itself counts as step 1).
export function progressOf(id, all = loadProgress(), completed = loadCompleted()) {
  return Math.max(all[id] ?? 0, completed.includes(id) ? 1 : 0);
}

// Mark step `index` of a lesson's path as done.
export function markStep(id, index) {
  const all = loadProgress();
  const next = Math.max(progressOf(id, all), index + 1);
  try {
    localStorage.setItem(PROGRESS_KEY(), JSON.stringify({ ...all, [id]: Math.min(next, PATH.length) }));
  } catch {
    // Storage blocked: progress just isn't remembered.
  }
}

// For "✓ Completed · 7/20 steps" labels.
export function stepsDone(id) {
  return progressOf(id);
}

// null when no lessons are picked (the homepage shows a setup card instead).
export function buildTrail() {
  const picked = loadLessons();
  if (!picked.length) return null;

  const all = loadProgress();
  const completed = loadCompleted();

  const branches = picked.map((id) => {
    const done = progressOf(id, all, completed);
    const steps = PATH.map((step) => ({
      ...step,
      kind: step.mode,
      state: step.index < done ? "done" : step.index === done ? "open" : "locked",
    }));
    return { id, lesson: getLesson(id), steps, done, complete: done >= PATH.length };
  });

  return {
    branches,
    finishedLessons: branches.filter((b) => b.done >= 1).length,
    allLessonsDone: branches.every((b) => b.done >= 1),
  };
}
