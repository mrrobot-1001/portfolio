import type { Project } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

/** Remaining public repos, ranked by the heuristic, as an editorial index. */
export function Archive({ projects, githubUrl }: { projects: Project[]; githubUrl: string }) {
  if (!projects.length) return null;
  return (
    <section aria-labelledby="archive-title" className="frame bg-ink pt-24 pb-28 text-paper lg:pt-32 lg:pb-36">
      <div className="grid-editorial items-end gap-y-4">
        <p className="t-label col-span-4 text-gray-dark lg:col-span-3">02.1 / Index</p>
        <h2 id="archive-title" className="t-display col-span-4 text-[11vw] lg:col-span-6 lg:text-[5vw]">
          More on GitHub
        </h2>
        <a
          href={`${githubUrl}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="t-label link-u col-span-4 justify-self-start lg:col-span-3 lg:justify-self-end"
        >
          All repositories <span className="arrow arrow-ne">↗</span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>

      <div className="t-label mt-12 hidden grid-cols-12 gap-[var(--gutter)] border-b border-paper/30 pb-3 text-gray-dark lg:grid">
        <span className="col-span-1">No.</span>
        <span className="col-span-3">Project</span>
        <span className="col-span-5">About</span>
        <span className="col-span-2">Stack</span>
        <span className="col-span-1 text-right">Year</span>
      </div>

      <Reveal as="ol" className="mt-6 border-t border-paper/30 lg:mt-0 lg:border-t-0" stagger={0.04} y={16}>
        {projects.map((p, i) => (
          <li key={p.slug} className="border-b border-paper/30">
            <a
              href={p.liveUrl ?? p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-[var(--gutter)] gap-y-2 py-5 transition-colors duration-300 hover:bg-paper hover:text-ink lg:grid-cols-12 lg:px-2"
            >
              <span className="t-label text-gray-dark group-hover:text-gray lg:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-xl font-medium tracking-tight uppercase transition-transform duration-500 group-hover:translate-x-2 lg:col-span-3 lg:text-2xl">
                {p.title}
              </span>
              <span className="t-label text-right lg:hidden" aria-hidden>
                ↗
              </span>
              <span className="col-span-3 col-start-2 text-sm leading-relaxed text-paper/75 group-hover:text-ink/75 lg:col-span-5 lg:col-start-auto">
                {p.description}
              </span>
              <span className="t-label col-span-3 col-start-2 text-gray-dark group-hover:text-gray lg:col-span-2 lg:col-start-auto">
                {p.technologies.slice(0, 3).join(" · ")}
              </span>
              <span className="t-label hidden text-right lg:col-span-1 lg:block">
                {p.year} <span className="arrow arrow-ne">↗</span>
              </span>
              <span className="sr-only">{p.liveUrl ? "(live demo, " : "(GitHub, "}opens in a new tab)</span>
            </a>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
