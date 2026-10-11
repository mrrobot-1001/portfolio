export type Link = { label: string; href: string };

export type ProjectCategory =
  | "Full Stack"
  | "AI / ML"
  | "Desktop / AI"
  | "Frontend"
  | "Backend"
  | "Automation";

/** Raw repository shape shared by the live GitHub API layer and the JSON snapshot. */
export type Repo = {
  name: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  languages: Record<string, number>;
  topics: string[];
  stars: number;
  forks: number;
  fork: boolean;
  archived: boolean;
  size: number;
  pushedAt: string;
  createdAt: string;
};

export type GithubEvent = {
  type: string;
  repo: string;
  createdAt: string;
  commits: number | null;
  ref: string | null;
};

export type GithubData = {
  source: "live" | "snapshot";
  generatedAt: string;
  profile: {
    login: string;
    name: string | null;
    bio: string | null;
    avatarUrl: string;
    htmlUrl: string;
    publicRepos: number;
    followers: number;
    createdAt: string;
  };
  repos: Repo[];
  languages: Record<string, number>;
  /** weeks → days as [isoDate, count]; null when no token was available. */
  contributions: { total: number; weeks: [string, number][][] } | null;
  /** Where the calendar came from; it can be a snapshot even when the rest is live. */
  contributionsSource?: { source: "live" | "snapshot"; asOf: string };
  events: GithubEvent[];
};

/** 0–1 ratings for the ranking heuristic. Missing values are inferred from repo metadata. */
export type RankSignals = {
  complexity: number;
  usefulness: number;
  completeness: number;
  relevance: number;
  documentation: number;
  deployment: number;
  originality: number;
};

export type ProjectMedia =
  | { kind: "image"; src: string; alt: string; width: number; height: number }
  | { kind: "diagram"; nodes: string[]; caption: string };

export type CaseStudy = {
  problem: string;
  built: string;
  architecture: string[];
  features: string[];
  contribution: string;
  /** Only verifiable outcomes. Omit when there is nothing measurable to say. */
  result?: string;
};

/** Manual override for a GitHub repository. Every field is optional except `repo`. */
export type ProjectOverride = {
  repo: string;
  slug?: string;
  title?: string;
  tagline?: string;
  category?: ProjectCategory;
  technologies?: string[];
  liveUrl?: string | null;
  extraLinks?: Link[];
  featured?: boolean;
  /** Explicit position in Selected Work; otherwise ordered by score. */
  order?: number;
  year?: string;
  signals?: Partial<RankSignals>;
  media?: ProjectMedia[];
  caseStudy?: CaseStudy;
  hidden?: boolean;
};

/** Normalised project consumed by the UI. */
export type Project = {
  slug: string;
  name: string;
  title: string;
  description: string;
  technologies: string[];
  language: string | null;
  githubUrl: string;
  liveUrl: string | null;
  extraLinks: Link[];
  category: ProjectCategory;
  featured: boolean;
  relevanceScore: number;
  year: string;
  media: ProjectMedia[];
  caseStudy: CaseStudy | null;
};
