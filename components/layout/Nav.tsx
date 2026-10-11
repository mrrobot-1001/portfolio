"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { scrollToTarget, useLenis } from "@/components/providers/SmoothScroll";

export const SECTIONS = [
  { id: "about", index: "01", label: "About" },
  { id: "work", index: "02", label: "Work" },
  { id: "experience", index: "03", label: "Experience" },
  { id: "stack", index: "04", label: "Stack" },
  { id: "contact", index: "05", label: "Contact" },
] as const;

/**
 * Fixed editorial navigation. Transparent over the hero, then a solid bar with a
 * hairline border and a live scroll percentage. On sub-pages (`home={false}`)
 * section links point back to the homepage anchors.
 */
export function Nav({ home = true }: { home?: boolean }) {
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const pctRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (pctRef.current) pctRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!home) return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [home]);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const behind = [...document.querySelectorAll<HTMLElement>("body > main, body > footer, #main, footer")];
    behind.forEach((el) => el.setAttribute("inert", ""));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      behind.forEach((el) => el.removeAttribute("inert"));
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setOpen(false);
    if (!home) return;
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    scrollToTarget(lenis, el);
    history.replaceState(null, "", `#${id}`);
    // Move focus for keyboard and screen reader users without a second jump.
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };

  const href = (id: string) => (home ? `#${id}` : `/#${id}`);
  const solid = scrolled || !home;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid ? "border-b border-line bg-paper/92 backdrop-blur-[6px]" : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav aria-label="Primary" className="frame flex h-[var(--nav-h)] items-center justify-between gap-6">
          <a
            href={home ? "#top" : "/"}
            onClick={(e) => {
              if (!home) return;
              e.preventDefault();
              scrollToTarget(lenis, 0);
            }}
            className="t-label flex items-center gap-3 font-medium"
            aria-label={`${profile.name}, back to top`}
          >
            <span className="inline-block size-2 bg-ink" aria-hidden />
            {profile.name}
          </a>

          <ol className="hidden items-center gap-7 lg:flex">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={href(s.id)}
                  onClick={(e) => go(e, s.id)}
                  aria-current={active === s.id ? "location" : undefined}
                  className="t-label group relative flex gap-1.5 py-2"
                >
                  <span className={`transition-colors ${active === s.id ? "text-ink" : "text-gray"}`}>{s.index}</span>
                  <span className="link-u">{s.label}</span>
                  <span
                    aria-hidden
                    className={`absolute -bottom-px left-0 h-px bg-ink transition-[width] duration-500 ${active === s.id ? "w-full" : "w-0"}`}
                  />
                </a>
              </li>
            ))}
          </ol>

          <div className="flex items-center gap-4 sm:gap-6">
            <span className="t-label hidden text-gray tabular-nums md:inline" aria-hidden>
              <span ref={pctRef}>000</span>%
            </span>
            <a
              href={profile.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="t-label link-u font-medium"
              data-cursor="↗"
            >
              Resume <span className="arrow arrow-ne">↗</span>
              <span className="sr-only">(PDF, opens in a new tab)</span>
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="t-label -mr-2 flex min-h-11 items-center px-2 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
        <span
          ref={barRef}
          aria-hidden
          className="absolute bottom-[-1px] left-0 h-px w-full origin-left bg-steel"
          style={{ transform: "scaleX(0)" }}
        />
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col bg-paper pt-[var(--nav-h)] transition-[clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
        inert={!open}
      >
        <ol className="frame flex flex-1 flex-col justify-center border-t border-line">
          {SECTIONS.map((s) => (
            <li key={s.id} className="border-b border-line">
              <a href={href(s.id)} onClick={(e) => go(e, s.id)} className="flex items-baseline gap-4 py-4">
                <span className="t-label text-gray">{s.index}</span>
                <span className="t-display text-[13vw] leading-none">{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="frame t-label flex flex-wrap gap-x-6 gap-y-3 py-6">
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href={`mailto:${profile.email}`}>Email ↗</a>
        </div>
      </div>
    </>
  );
}
