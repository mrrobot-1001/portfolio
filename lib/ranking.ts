import type { RankSignals, Repo } from "@/lib/types";

/**
 * Heuristic weights for choosing which repositories to surface.
 * The score is never shown on the site; it only orders projects.
 */
export const WEIGHTS: RankSignals = {
  complexity: 0.2,
  usefulness: 0.2,
  completeness: 0.15,
  relevance: 0.2,
  documentation: 0.1,
  deployment: 0.1,
  originality: 0.05,
};

const TARGET_LANGUAGES = new Set(["TypeScript", "Python", "JavaScript", "Rust"]);
const TARGET_KEYWORDS =
  /\b(next\.?js|react|node|postgres|prisma|fastapi|pytorch|ml|ai|nlp|llm|api|docker|full[- ]?stack|model|platform)\b/i;
const TUTORIAL_PATTERN = /(tutorial|course|lab|final[-_ ]?project|sample|demo[-_ ]?site|testing|practice|leetcode|^src$)/i;
const BACKEND_LANGS = new Set(["Python", "PLpgSQL", "Rust", "Dockerfile", "Shell"]);

const clamp = (n: number) => Math.max(0, Math.min(1, n));

/** Infer 0–1 signals from repository metadata alone. */
export function inferSignals(repo: Repo): RankSignals {
  const langs = Object.keys(repo.languages);
  const desc = repo.description ?? "";
  const monthsSincePush = (Date.now() - new Date(repo.pushedAt).getTime()) / (1000 * 60 * 60 * 24 * 30);

  const complexity = clamp(
    Math.min(langs.length, 5) / 5 * 0.5 +
      (langs.some((l) => BACKEND_LANGS.has(l)) ? 0.25 : 0) +
      (repo.size > 500 ? 0.25 : repo.size > 50 ? 0.12 : 0),
  );
  const usefulness = clamp((desc.length > 40 ? 0.5 : desc ? 0.25 : 0) + (repo.homepage ? 0.3 : 0) + (repo.stars > 0 ? 0.2 : 0));
  const completeness = clamp((repo.size > 100 ? 0.5 : repo.size > 10 ? 0.25 : 0) + (desc ? 0.25 : 0) + (monthsSincePush < 12 ? 0.25 : 0));
  const relevance = clamp(
    (repo.language && TARGET_LANGUAGES.has(repo.language) ? 0.5 : 0) +
      (TARGET_KEYWORDS.test(`${repo.name} ${desc} ${repo.topics.join(" ")}`) ? 0.5 : 0),
  );
  const documentation = clamp(desc.length / 120);
  const deployment = repo.homepage ? 1 : 0;
  const originality = repo.fork || TUTORIAL_PATTERN.test(repo.name) ? 0 : 0.8;

  return { complexity, usefulness, completeness, relevance, documentation, deployment, originality };
}

/** Weighted 0–100 score. Overrides replace inferred signals key by key. */
export function scoreRepo(repo: Repo, overrides?: Partial<RankSignals>): number {
  const signals = { ...inferSignals(repo), ...overrides };
  let total = 0;
  for (const key of Object.keys(WEIGHTS) as (keyof RankSignals)[]) total += WEIGHTS[key] * signals[key];
  return Math.round(total * 100);
}

/** Repositories that should never be surfaced automatically. */
export function isEligible(repo: Repo): boolean {
  return !repo.fork && !repo.archived && repo.size > 0 && !TUTORIAL_PATTERN.test(repo.name);
}
