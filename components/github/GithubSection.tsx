import type { GithubData } from "@/lib/types";
import { isEligible } from "@/lib/ranking";
import { GithubActivity, type ActivityProps } from "@/components/github/GithubActivity";
import { projectOverrides } from "@/data/projects";

const HIDDEN = new Set(projectOverrides.filter((o) => o.hidden).map((o) => o.repo.toLowerCase()));

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).toUpperCase();

const EVENT_VERB: Record<string, string> = {
  PushEvent: "Pushed to",
  CreateEvent: "Created",
  PullRequestEvent: "Pull request in",
  ReleaseEvent: "Released",
};

/** Prepares GitHub data on the server; the client part only animates it. */
export function GithubSection({ github, featuredRepos }: { github: GithubData; featuredRepos: string[] }) {
  const own = github.repos.filter(
    (r) => !HIDDEN.has(r.name.toLowerCase()) && (isEligible(r) || featuredRepos.includes(r.name)),
  );

  // Primary language per repo, counted by repositories rather than bytes:
  // committed build output would otherwise drown the signal.
  const counts = new Map<string, number>();
  for (const r of own) if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  const totalLang = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
  const languages = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, n]) => ({ name, share: Math.round((n / totalLang) * 100), repos: n }));

  let weeks: ActivityProps["weeks"] = null;
  if (github.contributions) {
    const all = github.contributions.weeks.flat().map(([, c]) => c).filter((c) => c > 0).sort((a, b) => a - b);
    const qt = (p: number) => all[Math.min(all.length - 1, Math.floor(all.length * p))] ?? 1;
    const [q1, q2, q3] = [qt(0.25), qt(0.5), qt(0.75)];
    weeks = github.contributions.weeks.map((w) =>
      w.map(([date, c]) => ({ date, count: c, level: c === 0 ? 0 : c <= q1 ? 1 : c <= q2 ? 2 : c <= q3 ? 3 : 4 })),
    );
  }

  const seen = new Set<string>();
  const events = github.events
    .filter((e) => {
      const key = `${e.type}:${e.repo}:${e.createdAt.slice(0, 10)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 6)
    .map((e) => ({
      verb: EVENT_VERB[e.type] ?? e.type,
      repo: e.repo.split("/")[1] ?? e.repo,
      url: `https://github.com/${e.repo}`,
      date: fmt(e.createdAt),
    }));

  const sinceYear = new Date(github.profile.createdAt).getUTCFullYear();

  return (
    <GithubActivity
      profileUrl={github.profile.htmlUrl}
      login={github.profile.login}
      stats={[
        { label: "Public repositories", value: github.profile.publicRepos },
        ...(github.contributions ? [{ label: "Contributions, last 12 months", value: github.contributions.total }] : []),
        { label: "Languages in use", value: Object.keys(github.languages).length },
        { label: "On GitHub since", value: sinceYear, plain: true },
      ]}
      languages={languages}
      weeks={weeks}
      events={events}
      updated={fmt(github.contributionsSource?.asOf ?? github.generatedAt)}
      source={github.contributionsSource?.source ?? github.source}
    />
  );
}
