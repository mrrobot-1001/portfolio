"use client";

/** Coordinates the loader → hero hand-off without a shared React context. */
const EVENT = "hr:intro-done";

declare global {
  interface Window {
    __hrIntroDone?: boolean;
  }
}

export function markIntroDone() {
  window.__hrIntroDone = true;
  document.documentElement.classList.add("no-intro");
  window.dispatchEvent(new Event(EVENT));
}

/** Calls `cb` once the intro has finished (immediately if it already has). Returns a cleanup. */
export function onIntroDone(cb: () => void) {
  if (window.__hrIntroDone) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}
