/**
 * Single source of truth for personal facts shown on the site.
 * Everything here comes from Harsh's resume (Oct 2026) and GitHub profile.
 * Edit this file — not the components — to change copy.
 */

export const profile = {
  name: "Harsh Rana",
  firstName: "Harsh",
  lastName: "Rana",
  role: "Full Stack & AI Engineer",
  shortRole: "Full Stack / AI",
  headline: ["I build", "software", "that ships."],
  summary:
    "Full-stack and AI engineer. I take products from problem to architecture to a running deployment, across Next.js, Node, Python, PostgreSQL and PyTorch.",
  about: {
    statement:
      "I'm a full stack engineer who turns messy, real-world problems into products people actually use.",
    body: [
      "I work across frontend, backend, databases, machine learning and deployment. Most of what I build ends up in front of real users: a judging platform for a university showcase, an alumni network, multimodal and document-AI models served behind APIs.",
      "I care about the unglamorous parts too: authorization on every route, migrations that run before the app starts, rate limits, backups. That is the difference between a demo and a product.",
    ],
  },

  location: "India",
  relocation: true,
  /** Shown as the availability pill in hero/contact. Set to false to hide. */
  openToWork: true,
  availableFor: ["Full-time", "Internships"],
  roles: ["Software Engineering", "Full Stack", "AI / ML", "Product Engineering"],
  workModes: ["Remote", "Hybrid", "Onsite"],

  email: "harshtech007@outlook.com",
  links: {
    github: "https://github.com/mrrobot-1001",
    linkedin: "https://www.linkedin.com/in/harshrana1004",
    resume: "/resume.pdf",
    huggingface: "https://huggingface.co/mrrobot2610",
  },
  githubUsername: process.env.GITHUB_USERNAME || "mrrobot-1001",
} as const;

export type Experience = {
  period: string;
  start: string;
  org: string;
  role: string;
  tags: string[];
  location: string;
  points: string[];
};

export const experience: Experience[] = [
  {
    period: "May — Aug 2026",
    start: "2026",
    org: "Hack2skill",
    role: "Associate Program Manager (Intern)",
    tags: ["Programs", "Developer community", "AI"],
    location: "Remote",
    points: [
      "Ran Google's Build with AI programs (PromptWars, Build with AI Bootcamp) and UniHack by Unilog end to end.",
      "Owned scope, timelines and stakeholders; worked with outreach and marketing to drive participation.",
      "Planned and tracked delivery in Jira; coordinated documents and communication in Google Workspace.",
    ],
  },
  {
    period: "Jan — May 2026",
    start: "2026",
    org: "Bennett University",
    role: "Minister of Clubs & Chapters — Student Cabinet, School of CSET",
    tags: ["Leadership", "Operations"],
    location: "Greater Noida",
    points: ["Managed 24 clubs and more than 200 student leaders across the school."],
  },
  {
    period: "Sep — Dec 2025",
    start: "2025",
    org: "Bennett University",
    role: "Deputy Minister, Digital Infrastructure — Student Cabinet, School of CSET",
    tags: ["Product", "Full stack"],
    location: "Greater Noida",
    points: [
      "Designed and built the Project Showcase platform: submissions, voting, judge scoring and an audited admin panel.",
      "Ran the school's showcase of 139 student teams on it.",
    ],
  },
  {
    period: "Jan 2023 — Dec 2025",
    start: "2023",
    org: "Independent",
    role: "Full Stack & AI Developer",
    tags: ["Freelance", "Full stack", "AI"],
    location: "Remote",
    points: [
      "Designed, built and deployed full-stack and AI applications end to end, including REST APIs and RAG pipelines.",
      "Set up Docker and GitHub Actions CI/CD with automated tests; deployed to AWS and self-managed Linux servers.",
    ],
  },
  {
    period: "Mar — Aug 2022",
    start: "2022",
    org: "GreenBhumi NGO",
    role: "Technical Lead",
    tags: ["Team lead", "Dashboards"],
    location: "Remote",
    points: [
      "Led four developers building real-time analytics dashboards.",
      "Introduced code reviews and agile sprints to the team.",
    ],
  },
];

export const education = [
  {
    degree: "MCA",
    full: "Master of Computer Applications — Artificial Intelligence",
    school: "Bennett University, Greater Noida",
    period: "2025 — 2027",
    status: "Currently pursuing",
  },
  {
    degree: "BCA",
    full: "Bachelor of Computer Applications",
    school: "Disha College, Raipur",
    period: "2021 — 2024",
    status: "Completed",
  },
];

export const certifications = [
  "AWS Certified Machine Learning Engineer — Associate",
  "AWS Certified Cloud Practitioner",
  "AI Fluency — Anthropic",
  "Foundations of Project Management — Google",
];

export type SkillGroup = { id: string; label: string; note: string; items: string[] };

/** Only technologies backed by a repository or the resume. */
export const skills: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    note: "Interfaces that hold up on a phone and a 4K screen.",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML / CSS", "GSAP", "Tauri"],
  },
  {
    id: "backend",
    label: "Backend",
    note: "APIs with authorization on every route.",
    items: ["Node.js", "Next.js route handlers", "FastAPI", "REST APIs", "JWT sessions", "Role-based access", "Zod"],
  },
  {
    id: "database",
    label: "Database",
    note: "Schemas, migrations and transactions.",
    items: ["PostgreSQL", "Prisma", "Raw SQL", "Supabase", "MySQL", "DynamoDB"],
  },
  {
    id: "ai",
    label: "AI / ML",
    note: "Training models and serving them behind APIs.",
    items: ["Python", "PyTorch", "Hugging Face Transformers", "NLP", "Multimodal (CLIP)", "OCR", "ONNX", "LLM APIs", "RAG", "Ollama"],
  },
  {
    id: "cloud",
    label: "Cloud / Deploy",
    note: "From a Dockerfile to a running server.",
    items: ["Docker", "Docker Compose", "Linux (Ubuntu)", "Caddy", "Cloudflare Tunnel", "AWS", "Vercel", "GitHub Actions"],
  },
  {
    id: "tools",
    label: "Tools",
    note: "The everyday kit.",
    items: ["Git", "GitHub", "Jira", "Google Workspace", "Claude Code", "Rust (Tauri)"],
  },
];

/** "What I bring" — each claim points to evidence elsewhere on the page. */
export const signals = [
  {
    title: "Product thinking",
    body: "I start from the people using it. Project Showcase has four roles (students, teams, judges, admins), each with its own flow.",
    proof: "Project Showcase",
  },
  {
    title: "Full stack execution",
    body: "Schema, API, UI and deployment by the same pair of hands, with migrations that run before the app starts.",
    proof: "BUConnect",
  },
  {
    title: "Applied AI",
    body: "I've trained a multimodal Hindi meme classifier and built an OCR + NER document pipeline, both served through FastAPI.",
    proof: "Meme detection · IDP",
  },
  {
    title: "Shipping & operations",
    body: "My two live apps run on a server I manage: Docker Compose, Caddy, Cloudflare Tunnel and nightly backups.",
    proof: "Self-hosted stack",
  },
  {
    title: "Security by default",
    body: "Server-side authorization, rate limits keyed on the real client IP, upload type checks from file bytes, an admin audit log.",
    proof: "Showcase · BUConnect",
  },
  {
    title: "Ownership",
    body: "At Hack2skill I ran Google's Build with AI programs end to end; at university I led digital infrastructure for the student cabinet.",
    proof: "Experience",
  },
];
