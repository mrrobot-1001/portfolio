import "server-only";
import snapshot from "@/data/github-snapshot.json";
import { profile } from "@/data/profile";
import type { GithubData, GithubEvent, Repo } from "@/lib/types";

const REVALIDATE = 60 * 60 * 24; // one day
const API = "https://api.github.com";

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "harsh-rana-portfolio",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: headers(),
    next: { revalidate: REVALIDATE, tags: ["github"] },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`GitHub ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

type ApiRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  private: boolean;
  size: number;
  pushed_at: string;
  created_at: string;
};

async function fetchContributions(login: string): Promise<GithubData["contributions"]> {
  if (!process.env.GITHUB_TOKEN) return null;
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`;
  const res = await fetch(`${API}/graphql`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ query, variables: { login } }),
    next: { revalidate: REVALIDATE, tags: ["github"] },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const json = await res.json();
  const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) return null;
  return {
    total: cal.totalContributions,
    weeks: cal.weeks.map((w: { contributionDays: { date: string; contributionCount: number }[] }) =>
      w.contributionDays.map((d) => [d.date, d.contributionCount] as [string, number]),
    ),
  };
}

const fallback: GithubData = { ...(snapshot as unknown as Omit<GithubData, "source">), source: "snapshot" };

/**
 * Live GitHub data, revalidated daily. Any failure (rate limit, network,
 * missing token) falls back to the committed snapshot so the page never breaks.
 * Per-repo language breakdowns come from the snapshot to keep requests low.
 */
export async function getGithubData(): Promise<GithubData> {
  const login = profile.githubUsername;
  try {
    const [user, apiRepos, rawEvents, liveContributions] = await Promise.all([
      get<{ login: string; name: string | null; bio: string | null; avatar_url: string; html_url: string; public_repos: number; followers: number; created_at: string }>(`/users/${login}`),
      get<ApiRepo[]>(`/users/${login}/repos?per_page=100&sort=pushed`),
      get<{ type: string; repo: { name: string }; created_at: string; payload?: { commits?: unknown[]; size?: number; ref?: string } }[]>(
        `/users/${login}/events/public?per_page=30`,
      ).catch(() => []),
      fetchContributions(login).catch(() => null),
    ]);

    const snapLangs = new Map(fallback.repos.map((r) => [r.name, r.languages]));
    const repos: Repo[] = apiRepos
      .filter((r) => !r.private)
      .map((r) => ({
        name: r.name,
        description: r.description,
        htmlUrl: r.html_url,
        homepage: r.homepage || null,
        language: r.language,
        languages: snapLangs.get(r.name) ?? (r.language ? { [r.language]: r.size } : {}),
        topics: r.topics ?? [],
        stars: r.stargazers_count,
        forks: r.forks_count,
        fork: r.fork,
        archived: r.archived,
        size: r.size,
        pushedAt: r.pushed_at,
        createdAt: r.created_at,
      }));

    const languages: Record<string, number> = {};
    for (const r of repos.filter((r) => !r.fork)) {
      for (const [k, v] of Object.entries(r.languages)) languages[k] = (languages[k] ?? 0) + v;
    }

    const events: GithubEvent[] = rawEvents
      .filter((e) => ["PushEvent", "CreateEvent", "PullRequestEvent", "ReleaseEvent"].includes(e.type))
      .slice(0, 12)
      .map((e) => ({
        type: e.type,
        repo: e.repo.name,
        createdAt: e.created_at,
        commits: e.payload?.commits?.length ?? e.payload?.size ?? null,
        ref: e.payload?.ref ?? null,
      }));

    return {
      source: "live",
      generatedAt: new Date().toISOString(),
      profile: {
        login: user.login,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        htmlUrl: user.html_url,
        publicRepos: user.public_repos,
        followers: user.followers,
        createdAt: user.created_at,
      },
      repos,
      languages,
      contributions: liveContributions ?? fallback.contributions,
      contributionsSource: liveContributions
        ? { source: "live", asOf: new Date().toISOString() }
        : { source: "snapshot", asOf: fallback.generatedAt },
      events: events.length ? events : fallback.events,
    };
  } catch {
    return fallback;
  }
}
