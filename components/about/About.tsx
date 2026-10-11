"use client";

import { useRef } from "react";
import { education, profile } from "@/data/profile";
import { gsap, MQ } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { GhostText } from "@/components/ui/GhostText";

const META = [
  { k: "Currently", v: `${education[0].degree} — AI, ${education[0].school.split(",")[0]}` },
  { k: "Background", v: `${education[1].degree}, ${education[1].school.split(",")[0]}` },
  { k: "Focus", v: "Full stack / AI" },
  { k: "Based in", v: profile.location },
  ...(profile.relocation ? [{ k: "Open to", v: "Relocation" }] : []),
];

export function About() {
  const root = useRef<HTMLElement>(null);

  useMotion(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.5 }, // stays above 3:1 contrast while unrevealed
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: "[data-statement]", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
      });
    },
    root,
  );

  const words = profile.about.statement.split(" ");

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="frame relative bg-paper pt-24 pb-24 lg:pt-36 lg:pb-32">
      <div className="grid-editorial gap-y-10">
        <div className="col-span-4 lg:col-span-3">
          <SectionLabel index="01" title="About" />
          <GhostText text="01" className="mt-6 hidden h-28 text-muted lg:block" />
        </div>

        <div className="col-span-4 lg:col-span-9">
          <h2 id="about-title" data-statement className="t-statement text-[9.5vw] uppercase lg:text-[5.4vw]">
            <span className="sr-only">{profile.about.statement}</span>
            <span aria-hidden>
              {words.map((w, i) => (
                <span key={i} data-word className="inline-block pr-[0.22em]">
                  {w}
                </span>
              ))}
            </span>
          </h2>

          <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-9 lg:gap-[var(--gutter)]">
            <Reveal className="space-y-5 text-lg leading-relaxed text-ink/85 lg:col-span-5 lg:text-xl">
              {profile.about.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>

            <Reveal as="dl" className="border-t border-line lg:col-span-4" stagger={0.05} y={14}>
              {META.map((m) => (
                <div key={m.k} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line py-3">
                  <dt className="t-label text-gray">{m.k}</dt>
                  <dd className="t-label text-ink">{m.v}</dd>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
