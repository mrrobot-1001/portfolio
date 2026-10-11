import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { getProjectBySlug, getProjects } from "@/lib/projects";
import { profile } from "@/data/profile";

export const revalidate = 86400;

export async function generateStaticParams() {
  const { featured } = await getProjects();
  return featured.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const title = `${project.title} — case study`;
  return {
    title,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: `${title} — ${profile.name}`, description: project.description, url: `/work/${project.slug}`, type: "article" },
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

function Block({ index, title, children }: { index: number; title: string; children: React.ReactNode }) {
  return (
    <section className="grid-editorial gap-y-4 border-t border-line pt-5 pb-14 lg:pb-20" aria-labelledby={`cs-${index}`}>
      <h2 id={`cs-${index}`} className="t-label col-span-4 flex gap-3 text-gray lg:col-span-3">
        <span>{pad(index)}</span>
        <span>{title}</span>
      </h2>
      <Reveal className="col-span-4 lg:col-span-9" y={18}>
        {children}
      </Reveal>
    </section>
  );
}

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const { featured } = await getProjects();
  const index = featured.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = featured[index];
  const next = featured[(index + 1) % featured.length];
  const cs = project.caseStudy;

  const links = [
    { label: "Source on GitHub", href: project.githubUrl },
    ...(project.liveUrl ? [{ label: "Live demo", href: project.liveUrl }] : []),
    ...project.extraLinks.map((l) => ({ label: l.label, href: l.href })),
  ];

  let n = 0;
  return (
    <>
      <Nav home={false} />
      <main id="main" className="bg-paper">
        <article>
          <header className="frame pt-[calc(var(--nav-h)+2.5rem)] lg:pt-[calc(var(--nav-h)+4rem)]">
            <div className="t-label flex flex-wrap items-center justify-between gap-4 text-gray">
              <Link href="/#work" className="link-u text-ink">
                <span aria-hidden>←</span> All work
              </Link>
              <span>
                Case {pad(index + 1)} / {pad(featured.length)} · {project.category} · {project.year}
              </span>
            </div>
            <Reveal className="mt-10 lg:mt-16" y={40}>
              <h1 className="t-display text-[16vw] lg:text-[10vw]">{project.title}</h1>
              <p className="mt-6 max-w-3xl text-xl leading-snug lg:text-3xl lg:leading-tight">{project.description}</p>
            </Reveal>

            <dl className="t-label mt-12 grid grid-cols-2 border-t border-line lg:grid-cols-4">
              <div className="border-b border-line py-3 pr-4">
                <dt className="text-gray">Year</dt>
                <dd className="mt-1">{project.year}</dd>
              </div>
              <div className="border-b border-line py-3 pr-4">
                <dt className="text-gray">Category</dt>
                <dd className="mt-1">{project.category}</dd>
              </div>
              <div className="col-span-2 border-b border-line py-3">
                <dt className="text-gray">Links</dt>
                <dd className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
                  {links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link-u">
                      {l.label} <span className="arrow arrow-ne">↗</span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </header>

          {project.media[0] && (
            <div className="frame mt-12">
              <div
                className={`relative w-full overflow-hidden border border-line ${project.media[0].kind === "image" ? "aspect-[16/9]" : "aspect-[4/5] sm:aspect-[16/9]"}`}
                data-cursor="explore"
              >
                <ProjectMedia media={project.media[0]} title={project.title} sizes="100vw" preload tone="dark" />
              </div>
            </div>
          )}

          <div className="frame mt-20 lg:mt-28">
            {cs && (
              <>
                <Block index={++n} title="Problem">
                  <p className="t-statement text-3xl lg:text-5xl">{cs.problem}</p>
                </Block>
                <Block index={++n} title="What I built">
                  <p className="max-w-3xl text-lg leading-relaxed lg:text-xl">{cs.built}</p>
                </Block>
                <Block index={++n} title="Technology">
                  <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                    {project.technologies.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </Block>
                <Block index={++n} title="Architecture">
                  <ol className="border-t border-line">
                    {cs.architecture.map((a, i) => (
                      <li key={a} className="grid grid-cols-[3rem_1fr] border-b border-line py-4 leading-relaxed">
                        <span className="t-label pt-1 text-gray">{pad(i + 1)}</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ol>
                </Block>
                <Block index={++n} title="Key features">
                  <ul className="grid gap-px bg-line sm:grid-cols-2">
                    {cs.features.map((f) => (
                      <li key={f} className="bg-paper py-4 pr-4 leading-relaxed sm:p-5">
                        {f}
                      </li>
                    ))}
                  </ul>
                </Block>
                <Block index={++n} title="My contribution">
                  <p className="max-w-3xl text-lg leading-relaxed lg:text-xl">{cs.contribution}</p>
                </Block>
                {cs.result && (
                  <Block index={++n} title="Result">
                    <p className="t-statement text-3xl lg:text-5xl">{cs.result}</p>
                  </Block>
                )}
              </>
            )}

            {project.media.length > 1 && (
              <Block index={++n} title="Screens">
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.media.slice(1).map((m, i) => (
                    <div key={i} className="relative aspect-[16/10] overflow-hidden border border-line">
                      <ProjectMedia media={m} title={project.title} sizes="(min-width: 640px) 40vw, 92vw" tone="light" />
                    </div>
                  ))}
                </div>
              </Block>
            )}
          </div>
        </article>

        <nav aria-label="Next project" className="bg-ink text-paper">
          <Link href={`/work/${next.slug}`} className="frame group block py-16 lg:py-24" data-cursor="view">
            <span className="t-label text-gray-dark">Next case — {pad(((index + 1) % featured.length) + 1)}</span>
            <span className="t-display mt-4 flex items-baseline gap-4 text-[14vw] lg:text-[9vw]">
              <span className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4">
                {next.title}
              </span>
              <span aria-hidden className="arrow arrow-e text-steel">
                →
              </span>
            </span>
          </Link>
        </nav>
      </main>
      <Footer />
    </>
  );
}
