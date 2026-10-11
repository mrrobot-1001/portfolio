"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Project } from "@/lib/types";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { scrollToTarget, useLenis } from "@/components/providers/SmoothScroll";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectMedia } from "@/components/projects/ProjectMedia";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Selected work as a "digital exhibition".
 * Desktop: a sticky stage; scroll progress swaps projects with transform-only
 * mask reveals (no clip-path or layout animation per frame).
 * Mobile / reduced motion / no JS: a plain vertical sequence.
 */
export function Work({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLElement>(null);
  const stTrigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const n = projects.length;

  useMotion(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Section curtain: the dark panel widens to full bleed as it arrives.
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q("[data-curtain]"),
          { clipPath: "inset(0% 4% 0% 4%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 20%", scrub: true },
          },
        );
      });

      mm.add(MQ.desktop, () => {
        const articles = q<HTMLElement>("[data-project]");
        articles.forEach((a, i) => {
          if (i === 0) return;
          gsap.set(a.querySelectorAll("[data-text]"), { opacity: 0, y: 70 });
          gsap.set(a.querySelector("[data-mask]"), { yPercent: 101 });
          gsap.set(a.querySelector("[data-mask-inner]"), { yPercent: -101, scale: 1.15, transformOrigin: "50% 100%" });
          gsap.set(a.querySelector("[data-num]"), { yPercent: 100 });
          a.style.visibility = "visible"; // hidden by CSS until these start states exist
        });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: q("[data-track]")[0],
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            onUpdate: (self) => setActive(Math.min(n - 1, Math.round(self.progress * (n - 1)))),
          },
        });
        stTrigger.current = tl.scrollTrigger ?? null;

        for (let i = 1; i < n; i++) {
          const prev = articles[i - 1];
          const next = articles[i];
          const at = i - 1 + 0.25; // dwell before each change
          tl.to(prev.querySelectorAll("[data-text]"), { opacity: 0, y: -60, stagger: 0.03, duration: 0.45 }, at)
            .to(prev.querySelector("[data-num]"), { yPercent: -100, duration: 0.5 }, at)
            .to(prev.querySelector("[data-media]"), { scale: 0.88, yPercent: -4, autoAlpha: 0.35, duration: 0.7 }, at)
            .to(next.querySelector("[data-mask]"), { yPercent: 0, duration: 0.7 }, at)
            .to(next.querySelector("[data-mask-inner]"), { yPercent: 0, scale: 1, duration: 0.7 }, at)
            .to(next.querySelector("[data-num]"), { yPercent: 0, duration: 0.5 }, at + 0.15)
            .to(next.querySelectorAll("[data-text]"), { opacity: 1, y: 0, stagger: 0.04, duration: 0.5 }, at + 0.25);
        }
        tl.to({}, { duration: 0.25 });
        const st = tl.scrollTrigger;
        if (st) setActive(Math.min(n - 1, Math.round(st.progress * (n - 1))));

        return () => {
          stTrigger.current = null;
          setActive(0);
        };
      });

      mm.add(MQ.mobile, () => {
        q<HTMLElement>("[data-project]").forEach((a) => {
          gsap.from(a.querySelector("[data-mask-inner]"), {
            scale: 1.2,
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: a, start: "top bottom", end: "center center", scrub: true },
          });
          gsap.from(a.querySelectorAll("[data-text]"), {
            y: 30,
            autoAlpha: 0,
            stagger: 0.06,
            scrollTrigger: { trigger: a, start: "top 75%", once: true },
          });
        });
      });

      // Media tilt toward the pointer (desktop pointers only).
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const cleanups = q<HTMLElement>("[data-tilt]").map((el) => {
          const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3.out" });
          const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3.out" });
          gsap.set(el, { transformPerspective: 1400 });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 6);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
          };
          const reset = () => {
            rx(0);
            ry(0);
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", reset);
          return () => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", reset);
          };
        });
        return () => cleanups.forEach((c) => c());
      });
    },
    root, [n],
  );

  /** Jump the exhibition to project i (pager and keyboard focus). */
  const goTo = (i: number) => {
    const st = stTrigger.current;
    if (!st) return false;
    const y = st.start + ((st.end - st.start) * i) / Math.max(1, n - 1);
    scrollToTarget(lenis, y);
    return true;
  };

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="relative">
      <div data-curtain className="bg-ink text-paper">
        <header className="frame grid-editorial gap-y-6 pt-24 pb-16 lg:pt-36 lg:pb-20">
          <div className="col-span-4 lg:col-span-3">
            <SectionLabel index="02" title="Selected work" className="text-gray-dark" />
          </div>
          <div className="col-span-4 lg:col-span-9">
            <h2 id="work-title" className="t-display text-[15vw] lg:text-[9vw]">
              Things I&apos;ve <span className="text-steel">shipped</span>
            </h2>
            <p className="mt-6 max-w-xl text-gray-dark lg:text-lg">
              {n} projects picked from my GitHub: what each one solves and how it is built. Open any of them for the full
              case study.
            </p>
          </div>
        </header>

        <div data-track className="relative exhibit:h-[calc(var(--n)*100svh)]" style={{ "--n": n } as React.CSSProperties}>
          <div className="exhibit:sticky exhibit:top-0 exhibit:h-svh exhibit:overflow-hidden">
            {projects.map((p, i) => (
              <article
                key={p.slug}
                data-project
                aria-labelledby={`p-${p.slug}`}
                onFocusCapture={() => {
                  if (active !== i) goTo(i);
                }}
                className={`frame grid-editorial relative gap-y-6 border-t border-paper/20 py-12 exhibit:absolute exhibit:inset-0 exhibit:items-center exhibit:border-0 exhibit:pt-[calc(var(--nav-h)+2rem)] exhibit:pb-24 ${i > 0 ? "exhibit:invisible" : ""} ${active === i ? "" : "exhibit:pointer-events-none"}`}
                style={{ zIndex: i + 1 }}
              >
                {/* Text column */}
                <div className="col-span-4 flex flex-col lg:col-span-5 lg:pr-6">
                  <div className="flex items-end gap-4">
                    <span className="overflow-hidden" aria-hidden>
                      <span data-num className="t-num block text-[22vw] lg:text-[min(11vw,16svh)]">
                        {pad(i + 1)}
                      </span>
                    </span>
                    <span data-text className="t-label pb-3 text-gray-dark">
                      / {pad(n)}
                    </span>
                  </div>
                  <p data-text className="t-label mt-6 flex flex-wrap gap-x-4 text-gray-dark">
                    <span>{p.category}</span>
                    <span>{p.year}</span>
                  </p>
                  <h3 data-text id={`p-${p.slug}`} className="group mt-3">
                    <Link
                      href={`/work/${p.slug}`}
                      data-cursor="view"
                      className="t-display block text-[13vw] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 lg:text-[min(5.6vw,10svh)]"
                    >
                      {p.title}
                    </Link>
                  </h3>
                  <p data-text className="mt-5 max-w-md leading-relaxed text-paper/80">
                    {p.description}
                  </p>
                  <ul data-text className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
                    {p.technologies.map((t) => (
                      <li key={t} className="chip border-paper/40 text-paper/90">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div data-text className="t-label mt-8 flex flex-wrap gap-x-6 gap-y-3">
                    <Link href={`/work/${p.slug}`} className="link-u text-paper">
                      Case study <span className="arrow arrow-e">→</span>
                    </Link>
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="link-u text-paper">
                      GitHub <span className="arrow arrow-ne">↗</span>
                      <span className="sr-only">: {p.title} source (opens in a new tab)</span>
                    </a>
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="link-u text-paper">
                        Live <span className="arrow arrow-ne">↗</span>
                        <span className="sr-only">: {p.title} demo (opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Media column */}
                <div className="col-span-4 -order-1 lg:order-none lg:col-span-7">
                  <div data-media className="relative will-change-transform">
                    <div data-mask className="overflow-hidden will-change-transform">
                      <div data-mask-inner className="will-change-transform">
                        <Link
                          href={`/work/${p.slug}`}
                          data-cursor="view"
                          tabIndex={-1}
                          aria-hidden
                          className="block"
                        >
                          <div
                            data-tilt
                            className="relative aspect-[16/10] w-full overflow-hidden border border-paper/30 bg-[#111110] exhibit:max-h-[68svh]"
                          >
                            <ProjectMedia media={p.media[0]} title={p.title} sizes="(min-width: 1024px) 56vw, 92vw" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Pager — always visible on the desktop stage; also a keyboard path through the sequence. */}
            <nav
              aria-label="Selected work"
              className="frame absolute inset-x-0 bottom-0 z-50 hidden border-t border-paper/20 bg-ink exhibit:block"
            >
              <ol className="t-label flex h-14 items-stretch">
                {projects.map((p, i) => (
                  <li key={p.slug} className="relative flex-1">
                    <a
                      href={`/work/${p.slug}`}
                      onClick={(e) => {
                        if (goTo(i)) e.preventDefault();
                      }}
                      aria-current={active === i ? "step" : undefined}
                      aria-label={`${pad(i + 1)}: ${p.title}`}
                      className={`flex h-full items-center gap-3 pr-3 transition-colors duration-300 ${active === i ? "text-paper" : "text-gray-dark hover:text-paper"}`}
                    >
                      <span>{pad(i + 1)}</span>
                      <span className="hidden truncate xl:inline">{p.title}</span>
                    </a>
                    <span
                      aria-hidden
                      className={`absolute top-[-1px] left-0 h-px bg-steel transition-[width] duration-500 ${active >= i ? "w-[calc(100%-0.75rem)]" : "w-0"}`}
                    />
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
