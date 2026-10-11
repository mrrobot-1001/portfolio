"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

type CursorState = { label: string | null };

/**
 * Desktop-only cursor: a small dot that expands into a label over interactive
 * targets. Labels come from `data-cursor` (view / explore / click / custom text);
 * external links get ↗ automatically. Disabled for touch and reduced motion.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>({ label: null });

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    document.documentElement.classList.add("has-cursor");

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    let visible = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
        visible = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const labelFor = (target: Element | null): string | null => {
      const hit = target?.closest<HTMLElement>("[data-cursor], a, button");
      if (!hit) return null;
      const explicit = hit.dataset.cursor;
      if (explicit) return explicit === "view" ? "View" : explicit === "explore" ? "Explore" : explicit === "click" ? "Click" : explicit;
      if (hit instanceof HTMLAnchorElement && hit.target === "_blank") return "↗";
      return "";
    };

    const over = (e: PointerEvent) => {
      const label = labelFor(e.target as Element);
      setState((prev) => (prev.label === label ? prev : { label }));
    };
    const leave = () => {
      gsap.to(el, { autoAlpha: 0, duration: 0.2 });
      visible = false;
    };
    const down = () => gsap.to(el, { scale: 0.8, duration: 0.15 });
    const up = () => gsap.to(el, { scale: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled]);

  if (!enabled) return null;

  const { label } = state;
  const hovering = label !== null;
  const hasText = Boolean(label);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none invisible fixed top-0 left-0 z-[200] opacity-0 mix-blend-difference"
    >
      <div
        className="t-label flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink transition-[width,height] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: hasText ? (label!.length > 2 ? "4.75rem" : "2.75rem") : hovering ? "2.25rem" : "0.5rem",
          height: hasText ? (label!.length > 2 ? "4.75rem" : "2.75rem") : hovering ? "2.25rem" : "0.5rem",
        }}
      >
        <span className={`transition-opacity duration-200 ${hasText ? "opacity-100" : "opacity-0"}`}>{label}</span>
      </div>
    </div>
  );
}
