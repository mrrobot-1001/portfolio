"use client";

import { useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

export type ActivityProps = {
  profileUrl: string;
  login: string;
  stats: { label: string; value: number; plain?: boolean }[];
  languages: { name: string; share: number; repos: number }[];
  weeks: { date: string; count: number; level: number }[][] | null;
  events: { verb: string; repo: string; url: string; date: string }[];
  updated: string;
  source: "live" | "snapshot";
};

const LEVEL = ["bg-muted", "bg-[#a9a9a3]", "bg-[#6b6b67]", "bg-[#2e2e2c]", "bg-ink"];
const LEVEL_FILL = ["#d8d7d1", "#a9a9a3", "#6b6b67", "#2e2e2c", "#0a0a0a"];
const CELL = 11;
const GAP = 3;

/** The year as one SVG with a path per intensity level (5 nodes instead of ~370). */
function Calendar({ weeks }: { weeks: NonNullable<ActivityProps["weeks"]> }) {
  const paths = ["", "", "", "", ""];
  const step = CELL + GAP;
  weeks.forEach((w, wi) =>
    w.forEach((d, di) => {
      paths[d.level] += `M${wi * step} ${di * step}h${CELL}v${CELL}h-${CELL}z`;
    }),
  );
  const total = weeks.flat().reduce((a, d) => a + d.count, 0);
  const active = weeks.flat().filter((d) => d.count > 0).length;
  return (
    <svg
      data-cal
      role="img"
      aria-label={`Contribution calendar: ${total} contributions on ${active} days over the last ${weeks.length} weeks`}
      viewBox={`0 0 ${weeks.length * step - GAP} ${7 * step - GAP}`}
      className="block h-auto w-full min-w-[540px]"
    >
      {paths.map((d, i) => (d ? <path key={i} d={d} fill={LEVEL_FILL[i]} /> : null))}
    </svg>
  );
}

export function GithubActivity({ profileUrl, login, stats, languages, weeks, events, updated, source }: ActivityProps) {
  const root = useRef<HTMLElement>(null);

  useMotion(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Counters tick up from zero; final values are in the server HTML.
        q<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          const plain = el.dataset.plain === "1";
          const obj = { v: plain ? target - 6 : 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onUpdate: () => {
              el.textContent = plain ? String(Math.round(obj.v)) : Math.round(obj.v).toLocaleString("en-US");
            },
          });
        });
        gsap.fromTo(
          q("[data-cal]"),
          { clipPath: "inset(0% 100% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "power2.inOut",
            scrollTrigger: { trigger: q("[data-grid]")[0], start: "top 85%", once: true },
          },
        );
        gsap.from(q("[data-bar]"), {
          scaleX: 0,
          transformOrigin: "0% 50%",
          stagger: 0.08,
          duration: 1.2,
          scrollTrigger: { trigger: q("[data-langs]")[0], start: "top 85%", once: true },
        });
      });
    },
    root,
  );

  return (
    <section ref={root} id="activity" aria-labelledby="gh-title" className="frame border-t border-line bg-paper pt-24 pb-28 lg:pt-32 lg:pb-36">
      <div className="grid-editorial items-end gap-y-6">
        <div className="col-span-4 lg:col-span-3">
          <SectionLabel index="04.7" title="Code / Activity" />
        </div>
        <h2 id="gh-title" className="t-display col-span-4 text-[13vw] lg:col-span-6 lg:text-[6vw]">
          On GitHub
        </h2>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn col-span-4 justify-self-start lg:col-span-3 lg:justify-self-end"
        >
          @{login} <span className="arrow arrow-ne">↗</span>
          <span className="sr-only">GitHub profile (opens in a new tab)</span>
        </a>
      </div>

      {/* Stats */}
      <dl className="mt-14 grid grid-cols-2 border-t border-l border-line lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex min-h-36 flex-col justify-between border-r border-b border-line p-4 lg:p-6">
            <dt className="t-label text-gray">{s.label}</dt>
            <dd className="t-num mt-6 text-5xl lg:text-7xl" data-count={s.value} data-plain={s.plain ? "1" : undefined}>
              {s.plain ? s.value : s.value.toLocaleString("en-US")}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid-editorial mt-14 gap-y-14">
        {/* Contribution grid */}
        <div className="col-span-4 lg:col-span-8">
          <p className="t-label mb-4 flex justify-between text-gray">
            <span>Contributions — 12 months to {updated}</span>
            <span>
              {source === "live" ? "Live" : `Snapshot · ${updated}`}
            </span>
          </p>
          {weeks ? (
            <figure>
              <div data-grid role="region" className="overflow-x-auto pb-2" tabIndex={0} aria-label="Contribution calendar, scrollable">
                <Calendar weeks={weeks} />
              </div>
              <figcaption className="t-label mt-3 flex items-center gap-2 text-gray">
                Less
                {LEVEL.map((c) => (
                  <span key={c} aria-hidden className={`size-[9px] ${c}`} />
                ))}
                More
              </figcaption>
            </figure>
          ) : (
            <p className="border border-line p-6 text-gray">
              The contribution calendar appears when a GitHub token is configured on the server.{" "}
              <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="link-u text-ink">
                View it on GitHub ↗
              </a>
            </p>
          )}
        </div>

        {/* Languages */}
        <div data-langs className="col-span-4 lg:col-span-4">
          <p className="t-label mb-4 text-gray">Primary language, by repository</p>
          <ul className="space-y-3">
            {languages.map((l) => (
              <li key={l.name}>
                <div className="t-label flex justify-between">
                  <span>{l.name}</span>
                  <span className="text-gray">
                    {l.repos} {l.repos === 1 ? "repo" : "repos"} · {l.share}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 bg-muted">
                  <div data-bar className="h-full bg-ink" style={{ width: `${l.share}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent activity */}
        {events.length > 0 && (
          <div className="col-span-4 lg:col-span-12">
            <p className="t-label mb-4 text-gray">Recent public activity</p>
            <ol className="border-t border-line">
              {events.map((e, i) => (
                <li key={i} className="border-b border-line">
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-[1fr_auto] gap-x-4 py-3 transition-colors hover:bg-ink hover:text-paper sm:grid-cols-[9rem_1fr_auto] lg:px-2"
                  >
                    <span className="t-label hidden text-gray group-hover:text-gray-dark sm:block">{e.date}</span>
                    <span>
                      <span className="text-gray group-hover:text-gray-dark">{e.verb} </span>
                      <span className="font-medium">{e.repo}</span>
                    </span>
                    <span className="t-label">
                      <span className="sm:hidden">{e.date} </span>↗
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
