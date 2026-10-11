"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";

/**
 * ~1s editorial loader shown once per session. The page underneath is already
 * rendered and interactive-ready; a CSS failsafe hides this even without JS.
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const skip = document.documentElement.classList.contains("no-intro");
      if (skip) {
        markIntroDone();
        return;
      }
      el.style.animation = "none"; // JS is running; GSAP owns the exit now.

      const counter = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem("hr-intro", "1");
          } catch {}
          gsap.set(el, { display: "none" });
        },
      });
      tl.to(counter, {
        v: 100,
        duration: 0.9,
        ease: "power2.inOut",
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
        },
      })
        .to("[data-loader-row]", { yPercent: -110, duration: 0.6, ease: "expo.in", stagger: 0.04 }, "+=0.05")
        .add(markIntroDone, "-=0.15")
        .to(el, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "-=0.2");
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="loader fixed inset-0 z-[150] flex flex-col justify-between bg-ink p-[var(--gutter)] text-paper"
    >
      <div className="t-label flex justify-between overflow-hidden">
        <span data-loader-row className="block">Portfolio — 2026</span>
        <span data-loader-row className="block">India → Anywhere</span>
      </div>
      <div className="flex items-end justify-between gap-6 overflow-hidden">
        <p data-loader-row className="t-display text-[22vw] lg:text-[14vw]">
          H<span className="text-gray-dark">/</span>R
        </p>
        <p data-loader-row className="t-num pb-[1.5vw] text-[10vw] lg:text-[6vw]">
          <span ref={countRef}>000</span>
        </p>
      </div>
    </div>
  );
}
