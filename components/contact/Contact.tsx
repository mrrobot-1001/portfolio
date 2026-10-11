"use client";

import { useRef, useState } from "react";
import { profile } from "@/data/profile";
import { gsap, MQ } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Magnetic } from "@/components/ui/Magnetic";

const LINES = ["Let's", "build", "something."];

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useMotion(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-cline]", root.current).forEach((el, i) => {
          gsap.fromTo(
            el,
            { xPercent: i % 2 ? -18 : 18 },
            {
              xPercent: 0,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 15%", scrub: true },
            },
          );
        });
      });
    },
    root,
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const links = [
    { label: "GitHub", href: profile.links.github },
    { label: "LinkedIn", href: profile.links.linkedin },
    { label: "Resume", href: profile.links.resume, note: "PDF" },
  ];

  return (
    <section ref={root} id="contact" aria-labelledby="contact-title" className="overflow-hidden bg-ink pt-24 pb-16 text-paper lg:pt-36">
      <div className="frame">
        <SectionLabel index="05" title="Contact" className="text-gray-dark" />
        <h2 id="contact-title" className="t-display mt-10 text-[19vw] lg:text-[15.5vw]">
          {LINES.map((l, i) => (
            <span key={l} data-cline className={`block will-change-transform ${i === 1 ? "pl-[12vw] text-steel" : ""}`}>
              {l}
            </span>
          ))}
        </h2>
      </div>

      <div className="frame grid-editorial mt-20 gap-y-12 border-t border-paper/25 pt-8 lg:mt-28">
        <div className="col-span-4 lg:col-span-6">
          <p className="t-label text-gray-dark">Email — fastest reply</p>
          <p className="mt-4 font-display text-[7.4vw] font-medium tracking-tight break-all lg:text-[3.4vw]">
            <a href={`mailto:${profile.email}`} className="link-u" data-cursor="click">
              {profile.email}
            </a>
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Magnetic>
              <a href={`mailto:${profile.email}`} className="btn btn-solid !border-paper !bg-paper !text-ink">
                Write to me <span className="arrow arrow-ne">↗</span>
              </a>
            </Magnetic>
            <Magnetic>
              <button type="button" onClick={copy} className="btn" data-cursor="click">
                {copied ? "Copied ✓" : "Copy email"}
              </button>
            </Magnetic>
            <span role="status" className="sr-only">
              {copied ? "Email address copied to clipboard" : ""}
            </span>
          </div>
        </div>

        <ul className="col-span-4 border-t border-paper/25 lg:col-span-3 lg:border-t-0">
          {links.map((l) => (
            <li key={l.label} className="border-b border-paper/25">
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline justify-between py-4 lg:py-5"
              >
                <span className="font-display text-2xl font-medium tracking-tight uppercase transition-transform duration-500 group-hover:translate-x-2">
                  {l.label}
                </span>
                <span className="t-label text-gray-dark">
                  {l.note && <span className="mr-2">{l.note}</span>}
                  <span className="arrow arrow-ne">↗</span>
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>

        <dl className="t-label col-span-4 space-y-4 lg:col-span-3">
          {profile.openToWork && (
            <div className="flex items-center gap-2 text-paper">
              <span className="status-dot" aria-hidden />
              <dt className="sr-only">Status</dt>
              <dd>Open to opportunities</dd>
            </div>
          )}
          <div>
            <dt className="text-gray-dark">Based in</dt>
            <dd className="mt-1">
              {profile.location}
              {profile.relocation && " — open to relocation"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-dark">Available for</dt>
            <dd className="mt-1">{profile.availableFor.join(" · ")}</dd>
          </div>
          <div>
            <dt className="text-gray-dark">Roles</dt>
            <dd className="mt-1">{profile.roles.join(" · ")}</dd>
          </div>
          <div>
            <dt className="text-gray-dark">Work mode</dt>
            <dd className="mt-1">{profile.workModes.join(" · ")}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
