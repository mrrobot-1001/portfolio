"use client";

import { useRef, useState } from "react";
import { skills } from "@/data/profile";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Stack as a horizontal sequence of categories (desktop): vertical scroll drives
 * the track sideways; technologies stagger in as each panel arrives.
 */
export function Skills() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useMotion(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const wrap = q<HTMLElement>("[data-hwrap]")[0];
        const track = q<HTMLElement>("[data-htrack]")[0];
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const setHeight = () => {
          wrap.style.height = `${distance() + window.innerHeight}px`;
        };
        setHeight();
        ScrollTrigger.addEventListener("refreshInit", setHeight);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.min(skills.length - 1, Math.floor(self.progress * skills.length))),
          },
        });

        q<HTMLElement>("[data-panel]").forEach((panel) => {
          // Panels already on screen before the track moves reveal on vertical scroll.
          const onScreen = panel.offsetLeft < window.innerWidth * 0.85;
          gsap.from(panel.querySelectorAll("[data-item]"), {
            yPercent: 110,
            stagger: 0.05,
            duration: 0.8,
            scrollTrigger: onScreen
              ? { trigger: wrap, start: "top 55%", toggleActions: "play none none reverse" }
              : { trigger: panel, containerAnimation: tween, start: "left 85%", toggleActions: "play none none reverse" },
          });
          gsap.from(panel.querySelector("[data-panel-title]"), {
            xPercent: 20,
            ease: "none",
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "left 40%", scrub: true },
          });
        });

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", setHeight);
          wrap.style.height = "";
        };
      });

      mm.add(MQ.mobile, () => {
        q<HTMLElement>("[data-panel]").forEach((panel) => {
          gsap.from(panel.querySelectorAll("[data-item]"), {
            y: 20,
            autoAlpha: 0,
            stagger: 0.04,
            scrollTrigger: { trigger: panel, start: "top 80%", once: true },
          });
        });
      });
    },
    root,
  );

  return (
    <section ref={root} id="stack" aria-labelledby="stack-title" className="relative border-t border-line bg-paper">
      <div data-hwrap className="relative">
        <div className="exhibit:sticky exhibit:top-0 exhibit:flex exhibit:h-svh exhibit:flex-col exhibit:overflow-hidden exhibit:pt-[var(--nav-h)]">
          {/* Category rail */}
          <div className="frame flex items-center justify-between gap-6 pt-24 lg:pt-6">
            <SectionLabel index="04" title="Stack" />
            <ol className="t-label hidden items-center gap-2 exhibit:flex" aria-hidden>
              {skills.map((s, i) => (
                <li key={s.id} className={`flex items-center gap-2 transition-colors duration-300 ${i === active ? "text-ink" : "text-gray"}`}>
                  {s.label}
                  {i < skills.length - 1 && <span className="text-gray">→</span>}
                </li>
              ))}
            </ol>
          </div>

          <div
            data-htrack
            className="flex flex-col exhibit:flex-1 exhibit:flex-row exhibit:items-stretch exhibit:will-change-transform"
          >
            {/* Intro panel */}
            <div className="frame flex shrink-0 flex-col justify-end py-10 exhibit:w-[38vw] exhibit:py-12">
              <h2 id="stack-title" className="t-display text-[15vw] exhibit:text-[7vw]">
                What I work with
              </h2>
              <p className="mt-6 max-w-sm leading-relaxed text-gray">
                Tools I&apos;ve used in shipped projects, grouped by layer. No percentage bars: the projects above are the
                evidence.
              </p>
              <p className="t-label mt-8 hidden text-gray exhibit:block" aria-hidden>
                Keep scrolling →
              </p>
            </div>

            {skills.map((group, gi) => (
              <section
                key={group.id}
                data-panel
                aria-labelledby={`skill-${group.id}`}
                className="frame flex shrink-0 flex-col border-t border-line py-10 exhibit:w-[min(46vw,44rem)] exhibit:border-t-0 exhibit:border-l exhibit:py-12"
              >
                <div className="flex items-baseline justify-between">
                  <span className="t-label text-gray">04.{gi + 1}</span>
                  <span className="t-label text-gray">{String(group.items.length).padStart(2, "0")} items</span>
                </div>
                <h3 id={`skill-${group.id}`} data-panel-title className="t-display mt-6 text-[13vw] exhibit:text-[min(5.5vw,11svh)]">
                  {group.label}
                </h3>
                <p className="mt-3 max-w-xs text-gray exhibit:mb-6">{group.note}</p>
                <ul className="mt-8 grid grid-cols-1 border-t border-line sm:grid-cols-2 sm:gap-x-6 exhibit:mt-auto exhibit:grid-cols-1">
                  {group.items.map((item, ii) => (
                    <li key={item} className="overflow-hidden border-b border-line">
                      <span data-item className="flex items-baseline gap-4 py-2.5 exhibit:py-[min(0.8svh,0.55rem)]">
                        <span className="t-label w-6 text-gray">{String(ii + 1).padStart(2, "0")}</span>
                        <span className="font-display text-lg font-medium tracking-tight exhibit:text-[min(1.5vw,2.6svh)]">
                          {item}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <div aria-hidden className="hidden shrink-0 exhibit:block exhibit:w-[8vw]" />
          </div>
        </div>
      </div>
    </section>
  );
}
