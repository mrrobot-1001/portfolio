"use client";

import Image from "next/image";
import { useRef } from "react";
import { profile } from "@/data/profile";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { Magnetic } from "@/components/ui/Magnetic";
import portrait from "@/public/images/portrait/harsh-rana.jpg";

const STACK = ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Python", "PyTorch", "Docker"];

function Letters({ word }: { word: string }) {
  return (
    <span aria-hidden className="inline-flex overflow-hidden pb-[0.04em]">
      {word.split("").map((c, i) => (
        <span key={i} data-char className="inline-block">
          {c}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Intro: only when the loader actually played (first visit, motion allowed).
      const playIntro = !document.documentElement.classList.contains("no-intro");
      let cleanupIntro = () => {};
      if (playIntro) {
        gsap.set(q("[data-char]"), { yPercent: 105 });
        gsap.set(q("[data-portrait-clip]"), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(q("[data-portrait-img]"), { scale: 1.35 });
        gsap.set(q("[data-portrait-block]"), { autoAlpha: 0 });
        gsap.set(q("[data-intro]"), { autoAlpha: 0, y: 24 });
        cleanupIntro = onIntroDone(contextSafe!(() => {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          tl.to(q("[data-char]"), { yPercent: 0, duration: 1.3, stagger: 0.035 })
            .to(q("[data-portrait-clip]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }, 0.05)
            .to(q("[data-portrait-img]"), { scale: 1.12, duration: 1.8 }, 0.05)
            .to(q("[data-portrait-block]"), { autoAlpha: 1, duration: 0.8 }, 1.1)
            .to(q("[data-intro]"), { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.06 }, 0.45);
        }));
      }

      mm.add(MQ.motion, () => {
        if (!playIntro) gsap.set(q("[data-portrait-img]"), { scale: 1.12 });
      });

      // Scroll choreography, desktop: the sticky hero folds into the About section.
      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });
        tl.to(q("[data-line='first']"), { xPercent: -14, yPercent: -18 }, 0)
          .to(q("[data-line='last']"), { xPercent: 22, yPercent: -30 }, 0)
          .to(q("[data-name]"), { scale: 0.86, transformOrigin: "0% 0%" }, 0)
          .to(q("[data-portrait]"), { scale: 0.64, xPercent: -46, yPercent: 6, transformOrigin: "100% 0%" }, 0)
          .to(q("[data-portrait-img]"), { yPercent: -6 }, 0)
          .to(q("[data-portrait-block]"), { x: 34, y: 34 }, 0)
          .to(q("[data-meta]"), { autoAlpha: 0, y: -24 }, 0)
          .to(q("[data-headline]"), { scaleY: 0.82, yPercent: -10, transformOrigin: "0% 100%" }, 0.1)
          .to(q("[data-band]"), { y: -50, autoAlpha: 0, stagger: 0.04 }, 0.45)
          .to(q("[data-scroll-cue]"), { autoAlpha: 0 }, 0);
      });

      // Mobile: gentle parallax only.
      mm.add(MQ.mobile, () => {
        gsap.to(q("[data-portrait-img]"), {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: q("[data-portrait]")[0], start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      return () => cleanupIntro();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="relative lg:h-[185vh]">
      <div className="hairlines relative flex flex-col overflow-hidden bg-paper pt-[var(--nav-h)] lg:sticky lg:top-0 lg:h-svh">
        {/* Meta row */}
        <div data-meta className="frame grid-editorial t-label border-b border-line/15 py-3 text-gray">
          <p data-intro className="col-span-2 lg:col-span-3">
            {profile.openToWork ? (
              <span className="flex items-center gap-2 text-ink lg:hidden">
                <span className="status-dot" aria-hidden /> Open to work
              </span>
            ) : null}
            <span className={profile.openToWork ? "hidden lg:inline" : ""}>Portfolio ©2026</span>
          </p>
          <p data-intro className="col-span-2 text-right lg:col-span-3 lg:text-left">{profile.shortRole}</p>
          <p data-intro className="hidden lg:col-span-3 lg:block">
            Based in {profile.location}
            {profile.relocation && " — open to relocation"}
          </p>
          {profile.openToWork && (
            <p data-intro className="hidden items-center justify-end gap-2 text-ink lg:col-span-3 lg:flex">
              <span className="status-dot" aria-hidden /> Open to opportunities
            </p>
          )}
        </div>

        {/* Name + portrait */}
        <div className="frame relative grid-editorial flex-1 pt-6 lg:pt-[3svh]">
          <h1
            id="hero-title"
            data-name
            className="t-display pointer-events-none relative z-10 col-span-4 text-[25vw] text-paper mix-blend-difference lg:col-span-9 lg:text-[min(17.5vw,29svh)]"
          >
            <span className="sr-only text-ink">
              {profile.name}, {profile.role}
            </span>
            <span data-line="first" className="block will-change-transform">
              <Letters word={profile.firstName.toUpperCase()} />
            </span>
            <span
              data-line="last"
              className="block pl-[14vw] will-change-transform lg:pl-[25vw]"
            >
              <Letters word={profile.lastName.toUpperCase()} />
            </span>
          </h1>

          <div
            data-portrait
            className="group relative col-span-4 mt-[-12vw] ml-auto w-[78%] will-change-transform lg:absolute lg:top-[3svh] lg:right-[var(--gutter)] lg:mt-0 lg:w-auto lg:h-[min(46svh,36vw)] xl:h-[min(58svh,44vw)] lg:aspect-[4/5]"
            data-cursor="explore"
          >
            <span data-portrait-block aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 bg-ink lg:translate-x-4 lg:translate-y-4" />
            <div data-portrait-clip className="relative aspect-[4/5] h-full w-full overflow-hidden border border-line bg-muted lg:aspect-auto">
              <Image
                data-portrait-img
                src={portrait}
                alt="Portrait of Harsh Rana, arms crossed, outdoors"
                preload
                placeholder="blur"
                quality={80}
                sizes="(min-width: 1024px) 36vw, 78vw"
                className="duotone h-full w-full object-cover object-[50%_30%] will-change-transform"
              />
              <span className="t-label absolute bottom-2 left-2 bg-paper px-1.5 py-0.5 text-ink">Fig. 01 — H.R.</span>
            </div>
          </div>
        </div>

        {/* Bottom band */}
        <div className="frame grid-editorial gap-y-6 pt-10 pb-8 lg:items-end lg:pt-0 lg:pb-[4svh]">
          <div data-band className="col-span-4 lg:col-span-3">
            <p data-intro className="t-label mb-2 text-gray">
              (01) Role
            </p>
            <p data-intro className="font-display text-xl font-medium tracking-tight lg:text-2xl">
              {profile.role}
            </p>
            <ul data-intro className="t-label mt-3 flex flex-wrap gap-x-2 gap-y-1 text-gray" aria-label="Core stack">
              {STACK.map((s, i) => (
                <li key={s}>
                  {s}
                  {i < STACK.length - 1 && <span aria-hidden> ·</span>}
                </li>
              ))}
            </ul>
          </div>

          <div data-band className="col-span-4 lg:col-span-5">
            <p data-intro data-headline className="t-statement text-[11vw] uppercase will-change-transform lg:text-[min(4.6vw,7.4svh)]">
              {profile.headline.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </p>
          </div>

          <div data-band className="col-span-4 lg:col-span-4">
            <p data-intro className="mb-5 max-w-md text-[0.95rem] leading-relaxed text-gray">
              {profile.summary}
            </p>
            <div data-intro className="flex flex-wrap gap-2">
              <Magnetic>
                <a
                  href={profile.links.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-solid"
                  data-cursor="click"
                >
                  View resume <span className="arrow arrow-ne">↗</span>
                  <span className="sr-only">(PDF, opens in a new tab)</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="btn">
                  GitHub <span className="arrow arrow-ne">↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="btn">
                  LinkedIn <span className="arrow arrow-ne">↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Magnetic>
            </div>
            {profile.openToWork && (
              <p data-intro className="t-label mt-4 flex items-center gap-2 lg:hidden">
                <span className="status-dot" aria-hidden /> Open to opportunities · {profile.location}
                {profile.relocation && " → relocation"}
              </p>
            )}
          </div>
        </div>

        <p
          data-scroll-cue
          aria-hidden
          className="t-label absolute top-1/2 left-[calc(var(--gutter)/2)] hidden origin-left -rotate-90 text-gray xl:block"
        >
          Scroll ↓ to explore
        </p>
      </div>
    </section>
  );
}
