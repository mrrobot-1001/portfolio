"use client";

import { useRef } from "react";
import { certifications, education, experience } from "@/data/profile";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

export function Experience() {
  const root = useRef<HTMLElement>(null);

  useMotion(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // The spine draws itself with scroll.
        gsap.fromTo(
          q("[data-spine]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: q("[data-timeline]")[0], start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
        // Nodes fill as the spine passes them; entries rise in once.
        q<HTMLElement>("[data-entry]").forEach((entry) => {
          entry.removeAttribute("data-on");
          ScrollTrigger.create({
            trigger: entry,
            start: "top 62%",
            end: "max",
            onEnter: () => entry.setAttribute("data-on", ""),
            onLeaveBack: () => entry.removeAttribute("data-on"),
          });
          gsap.from(entry.querySelectorAll("[data-rise]"), {
            y: 36,
            autoAlpha: 0,
            stagger: 0.06,
            scrollTrigger: { trigger: entry, start: "top 80%", once: true },
          });
        });
      });
      mm.add(MQ.reduced, () => {
        q<HTMLElement>("[data-entry]").forEach((e) => e.setAttribute("data-on", ""));
      });
    },
    root,
  );

  return (
    <section ref={root} id="experience" aria-labelledby="exp-title" className="frame bg-paper pt-28 pb-24 lg:pt-40 lg:pb-32">
      <div className="grid-editorial gap-y-12">
        <div className="col-span-4 lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
            <SectionLabel index="03" title="Experience" />
            <h2 id="exp-title" className="t-display mt-6 text-[14vw] lg:text-[6vw]">
              Where I&apos;ve worked
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-gray">
              Building products, leading small teams, and running programs for developer communities.
            </p>
          </div>
        </div>

        <ol data-timeline className="relative col-span-4 lg:col-span-8">
          <span aria-hidden className="absolute top-2 bottom-0 left-[5px] w-px bg-muted" />
          <span aria-hidden data-spine className="absolute top-2 bottom-0 left-[5px] w-px origin-top bg-ink" />
          {experience.map((e) => (
            <li
              key={`${e.org}-${e.role}`}
              data-entry
              data-on=""
              className="group/entry relative grid gap-y-3 pb-14 pl-10 last:pb-0 lg:grid-cols-8 lg:gap-x-[var(--gutter)] lg:pl-12"
            >
              <span
                aria-hidden
                className="absolute top-2 left-0 size-[11px] border border-ink bg-paper transition-colors duration-500 group-data-[on]/entry:bg-ink"
              />
              <p data-rise className="t-num text-5xl lg:col-span-2 lg:text-6xl">
                {e.start}
              </p>
              <div className="lg:col-span-6">
                <p data-rise className="t-label text-gray">
                  {e.period} · {e.location}
                </p>
                <h3 data-rise className="mt-2 font-display text-3xl font-semibold tracking-tight uppercase lg:text-4xl">
                  {e.org}
                </h3>
                <p data-rise className="mt-1 text-lg">{e.role}</p>
                <ul data-rise className="mt-3 flex flex-wrap gap-1.5" aria-label="Areas">
                  {e.tags.map((t) => (
                    <li key={t} className="chip text-gray">
                      {t}
                    </li>
                  ))}
                </ul>
                <ul data-rise className="mt-5 space-y-2 leading-relaxed text-ink/85">
                  {e.points.map((pt) => (
                    <li key={pt} className="grid grid-cols-[1.25rem_1fr]">
                      <span aria-hidden className="text-gray">—</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Education & certifications */}
      <div className="grid-editorial mt-28 gap-y-10 border-t border-line pt-6 lg:mt-36">
        <p className="t-label col-span-4 text-gray lg:col-span-4">03.1 / Education</p>
        <Reveal className="col-span-4 grid gap-px bg-line sm:grid-cols-2 lg:col-span-8" stagger={0.1}>
          {education.map((ed) => (
            <div key={ed.degree} className="flex min-h-56 flex-col bg-paper p-5 lg:p-7">
              <p className="t-label text-gray">{ed.status}</p>
              <p className="t-display mt-4 text-7xl lg:text-8xl">{ed.degree}</p>
              <p className="mt-4">{ed.full}</p>
              <p className="t-label mt-auto pt-6 text-gray">
                {ed.school} · {ed.period}
              </p>
            </div>
          ))}
        </Reveal>

        <p className="t-label col-span-4 text-gray lg:col-span-4">03.2 / Certifications</p>
        <Reveal as="ul" className="col-span-4 border-t border-line lg:col-span-8" stagger={0.05} y={12}>
          {certifications.map((c, i) => (
            <li key={c} className="grid grid-cols-[2.5rem_1fr] border-b border-line py-3">
              <span className="t-label pt-0.5 text-gray">{String(i + 1).padStart(2, "0")}</span>
              <span>{c}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
