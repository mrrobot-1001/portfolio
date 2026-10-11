import "server-only";
import { cache } from "react";
import { projectOverrides } from "@/data/projects";
import { getGithubData } from "@/lib/github";
import { isEligible, scoreRepo } from "@/lib/ranking";
import type { Project, ProjectCategory, ProjectOverride, Repo } from "@/lib/types";

const FEATURED_LIMIT = 6;
const ARCHIVE_LIMIT = 8;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function guessCategory(repo: Repo): ProjectCategory {
  const langs = Object.keys(repo.languages);
  if (repo.language === "Python" || langs.includes("Jupyter Notebook")) return "AI / ML";
  if (langs.includes("PLpgSQL") || /api|server|backend/i.test(repo.name)) return "Full Stack";
  if (repo.language === "TypeScript" || repo.language === "JavaScript") return "Frontend";
  return "Full Stack";
}

function normalise(repo: Repo, o: ProjectOverride | undefined): Project {
  const title = o?.title ?? repo.name.replace(/[-_]+/g, " ").trim();
  return {
    slug: o?.slug ?? slugify(repo.name),
    name: repo.name,
    title,
    description: o?.tagline ?? repo.description ?? "",
    technologies: o?.technologies ?? Object.keys(repo.languages).slice(0, 4),
    language: repo.language,
    githubUrl: repo.htmlUrl,
    liveUrl: o?.liveUrl !== undefined ? o.liveUrl : repo.homepage,
    extraLinks: o?.extraLinks ?? [],
    category: o?.category ?? guessCategory(repo),
    featured: Boolean(o?.featured),
    relevanceScore: scoreRepo(repo, o?.signals),
    year: o?.year ?? repo.createdAt.slice(0, 4),
    media: o?.media ?? [],
    caseStudy: o?.caseStudy ?? null,
  };
}

/**
 * GitHub repos → eligibility filter → ranking → overrides → normalised projects.
 * Cached per request so the page and metadata share one computation.
 */
export const getProjects = cache(async () => {
  const github = await getGithubData();
  const overrides = new Map(projectOverrides.map((o) => [o.repo.toLowerCase(), o]));

  const all = github.repos
    .filter((r) => {
      const o = overrides.get(r.name.toLowerCase());
      if (o?.hidden) return false;
      return o?.featured || isEligible(r);
    })
    .map((r) => {
      const o = overrides.get(r.name.toLowerCase());
      return { project: normalise(r, o), order: o?.order };
    });

  const featured = all
    .filter((p) => p.project.featured)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || b.project.relevanceScore - a.project.relevanceScore)
    .slice(0, FEATURED_LIMIT)
    .map((p) => p.project);

  const archive = all
    .filter((p) => !p.project.featured && p.project.description)
    .sort((a, b) => b.project.relevanceScore - a.project.relevanceScore)
    .slice(0, ARCHIVE_LIMIT)
    .map((p) => p.project);

  return { featured, archive, github };
});

export async function getProjectBySlug(slug: string) {
  const { featured } = await getProjects();
  return featured.find((p) => p.slug === slug) ?? null;
}
