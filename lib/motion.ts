"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Job = { run: () => void; cancelled: boolean };

const queue: Job[] = [];
let scheduled = false;

/** Element the reader landed on via a #hash, if they are still sitting on it. */
function anchoredTarget() {
  if (!location.hash) return null;
  let el: HTMLElement | null = null;
  try {
    el = document.querySelector<HTMLElement>(location.hash);
  } catch {
    return null;
  }
  if (!el) return null;
  const offset = el.getBoundingClientRect().top;
  return Math.abs(offset - parseFloat(getComputedStyle(el).scrollMarginTop || "0")) < 12 ? { el, offset } : null;
}

function flush() {
  scheduled = false;
  const jobs = queue.splice(0);
  if (!jobs.length) return;
  const anchor = anchoredTarget();
  for (const job of jobs) if (!job.cancelled) job.run();
  // One measurement pass for every trigger created in this batch.
  ScrollTrigger.refresh();
  // Setup can change layout above the anchor (e.g. the Stack track height); keep the reader in place.
  if (anchor) window.scrollTo(0, window.scrollY + anchor.el.getBoundingClientRect().top - anchor.offset);
}

function schedule(job: Job) {
  queue.push(job);
  if (scheduled) return;
  scheduled = true;
  const ric = window.requestIdleCallback;
  if (ric) ric(flush, { timeout: 900 });
  else window.setTimeout(flush, 120);
}

/**
 * Like useGSAP, but defers setup of below-the-fold animation to an idle
 * callback and batches it, so hydration isn't blocked by dozens of
 * ScrollTrigger measurements. Everything created inside is reverted on unmount.
 * Content must be fully visible before setup runs (start states are applied by GSAP).
 */
export function useMotion(setup: () => void | (() => void), scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  });

  useEffect(() => {
    let ctx: gsap.Context | undefined;
    let cleanup: void | (() => void);
    const job: Job = {
      cancelled: false,
      run: () => {
        ctx = gsap.context(() => {
          cleanup = setupRef.current();
        }, scope.current ?? undefined);
      },
    };
    schedule(job);
    return () => {
      job.cancelled = true;
      if (typeof cleanup === "function") cleanup();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are forwarded explicitly by the caller
  }, deps);
}
