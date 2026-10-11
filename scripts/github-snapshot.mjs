#!/usr/bin/env node
/**
 * Writes data/github-snapshot.json — the offline fallback used when the
 * GitHub API is unreachable at build/revalidate time.
 *
 *   GITHUB_TOKEN=... npm run snapshot          (token enables the contribution calendar)
 *   npm run snapshot                           (falls back to `gh auth token` if available)
 */
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const USERNAME = process.env.GITHUB_USERNAME || "mrrobot-1001";
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execSync("gh auth token", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return undefined;
  }
}

const TOKEN = token();
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "harsh-rana-portfolio",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function rest(p) {
  const res = await fetch(`https://api.github.com${p}`, { headers });
  if (!res.ok) throw new Error(`${p}: ${res.status}`);
  return res.json();
}

async function main() {
  const user = await rest(`/users/${USERNAME}`);
  // /users/:u/repos only returns public repositories, even with a token.
  const repos = await rest(`/users/${USERNAME}/repos?per_page=100&sort=pushed`);

  const publicRepos = repos.filter((r) => !r.private);
  const languages = {};
  for (const r of publicRepos.filter((r) => !r.fork)) {
    const langs = await rest(`/repos/${USERNAME}/${r.name}/languages`).catch(() => ({}));
    r.languages = langs;
    for (const [k, v] of Object.entries(langs)) languages[k] = (languages[k] || 0) + v;
  }

  let contributions = null;
  if (TOKEN) {
    const q = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`;
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({ query: q, variables: { login: USERNAME } }),
    });
    const json = await res.json();
    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (cal) {
      contributions = {
        total: cal.totalContributions,
        weeks: cal.weeks.map((w) => w.contributionDays.map((d) => [d.date, d.contributionCount])),
      };
    }
  }

  const events = await rest(`/users/${USERNAME}/events/public?per_page=30`).catch(() => []);

  const snapshot = {
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
    repos: publicRepos.map((r) => ({
      name: r.name,
      description: r.description,
      htmlUrl: r.html_url,
      homepage: r.homepage || null,
      language: r.language,
      languages: r.languages || {},
      topics: r.topics || [],
      stars: r.stargazers_count,
      forks: r.forks_count,
      fork: r.fork,
      archived: r.archived,
      size: r.size,
      pushedAt: r.pushed_at,
      createdAt: r.created_at,
    })),
    languages,
    contributions,
    events: events
      .filter((e) => ["PushEvent", "CreateEvent", "PullRequestEvent", "ReleaseEvent"].includes(e.type))
      .slice(0, 12)
      .map((e) => ({
        type: e.type,
        repo: e.repo.name,
        createdAt: e.created_at,
        commits: e.payload?.commits?.length ?? e.payload?.size ?? null,
        ref: e.payload?.ref ?? null,
      })),
  };

  writeFileSync(path.join(root, "data/github-snapshot.json"), JSON.stringify(snapshot, null, 2) + "\n");
  console.log(
    `snapshot: ${snapshot.repos.length} public repos, ${Object.keys(languages).length} languages, ` +
      `${contributions ? contributions.total + " contributions" : "no contribution calendar (no token)"}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
