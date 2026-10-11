import type { ProjectOverride } from "@/lib/types";

/**
 * Manual overrides layered on top of GitHub data.
 *
 * - Repos listed here with `featured: true` appear in Selected Work.
 * - Everything else is ranked automatically from GitHub metadata
 *   (see lib/ranking.ts) and fills the archive list.
 * - `signals` corrects the heuristic where metadata misleads
 *   (e.g. a strong project with a boilerplate README).
 * - Case-study copy is sourced from each repository's README.
 *   No metric appears here unless the README states it.
 */
export const projectOverrides: ProjectOverride[] = [
  {
    repo: "projectshowcasefullstack",
    slug: "project-showcase",
    title: "Project Showcase",
    tagline:
      "Judging platform for a university project showcase: team submissions, per-category voting, judge scoring, winners and an audited admin panel.",
    category: "Full Stack",
    technologies: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Tailwind CSS", "Docker", "Caddy"],
    featured: true,
    order: 1,
    year: "2025",
    signals: { complexity: 0.95, usefulness: 1, completeness: 0.95, relevance: 1, documentation: 1, deployment: 1, originality: 0.9 },
    media: [
      { kind: "image", src: "/images/work/showcase-banner.jpg", alt: "Project Showcase: projects grid on desktop with mobile home and leaderboard", width: 1600, height: 900 },
      { kind: "image", src: "/images/work/showcase-desktop-projects.jpg", alt: "All projects page with category filters", width: 1280, height: 800 },
      { kind: "image", src: "/images/work/showcase-desktop-judge.jpg", alt: "Judge panel scoring six criteria", width: 1280, height: 800 },
      { kind: "image", src: "/images/work/showcase-desktop-admin.jpg", alt: "Admin panel with audit log", width: 1280, height: 800 },
    ],
    caseStudy: {
      problem:
        "The Student Cabinet of the School of CSET at Bennett University needed one place to run its project showcase: teams submitting work, students voting, judges scoring, and organisers announcing winners without spreadsheets.",
      built:
        "A full-stack platform with four distinct roles. Students browse and vote, team leaders submit and manage projects, judges score six criteria, and admins moderate, rank results and announce 1st/2nd/3rd per category.",
      architecture: [
        "Next.js 16 App Router with proxy.ts route guards; every API route re-checks the session on the server.",
        "PostgreSQL 16 with plain parameterised SQL and an idempotent schema applied by a one-shot migrate job.",
        "Separate signed JWT cookies for students, judges and admin (httpOnly, Secure, SameSite=Lax), bcrypt hashes.",
        "Docker Compose on a self-managed Ubuntu server behind Caddy and a Cloudflare Tunnel; Caddy serves uploads directly.",
      ],
      features: [
        "Up to two votes per category, enforced server-side inside a locked transaction",
        "Judge scoring on innovation, pitching, presentation, creativity, functionality and scalability",
        "Live leaderboard (overall and per category) and a winners page",
        "Admin audit log recording before/after values for every change",
        "Rate limits keyed on Cloudflare's CF-Connecting-IP; brute-force protection on admin login",
        "Upload hardening: image format detected from the file's bytes",
      ],
      contribution:
        "Built it end to end as Deputy Minister of Digital Infrastructure: data model, API, UI, security model and the server it runs on.",
      result: "Used to run the school's showcase of 139 student teams.",
    },
  },
  {
    repo: "Buconnect",
    slug: "buconnect",
    title: "BUConnect",
    tagline:
      "Alumni and student network: posts, mutual connections, one-to-one messaging and notifications, built mobile-first.",
    category: "Full Stack",
    technologies: ["Next.js 16", "TypeScript", "PostgreSQL", "Prisma", "Zod", "Docker"],
    featured: true,
    order: 2,
    year: "2025",
    signals: { complexity: 0.9, usefulness: 0.9, completeness: 0.95, relevance: 1, documentation: 1, deployment: 1, originality: 0.8 },
    media: [
      { kind: "image", src: "/images/work/buconnect-banner.jpg", alt: "BUConnect: feed on desktop with mobile feed and chat", width: 1600, height: 900 },
      { kind: "image", src: "/images/work/buconnect-desktop-messages.jpg", alt: "Messaging on desktop", width: 1280, height: 800 },
      { kind: "image", src: "/images/work/buconnect-desktop-network.jpg", alt: "Network directory with filters", width: 1280, height: 800 },
    ],
    caseStudy: {
      problem:
        "Students and alumni had no shared space to find each other, keep in touch and ask for help. Most of them would only use it from a phone.",
      built:
        "A social network with a feed, a searchable directory of students and alumni, mutual connections, one-to-one messaging and notifications, with a mobile-first layout.",
      architecture: [
        "Next.js 16 App Router with route handlers for auth, posts, connections, messages and notifications.",
        "PostgreSQL 16 with Prisma ORM and versioned migrations; a one-shot migrate container runs before the app starts.",
        "JWT session in an httpOnly cookie (jose), bcrypt hashes, Zod validation on write endpoints.",
        "Docker Compose on a self-managed server: Caddy reverse proxy, Cloudflare Tunnel, database never exposed outside the Docker network.",
      ],
      features: [
        "Connections stored in both directions inside one transaction; mutual requests connect instantly",
        "Conversations with unread counts and live refresh; chat can start from any profile",
        "Comments load on demand so long feeds don't fire a request per post",
        "Bottom tab bar on phones, 44px touch targets, safe-area aware layout",
        "Authorization on every route; registration cannot self-assign admin",
      ],
      contribution: "Designed and built the whole product, including the data model, API, UI and deployment.",
    },
  },
  {
    repo: "Negative-Meme-detection--hindi-",
    slug: "hindi-meme-detection",
    title: "Hindi Meme Moderation",
    tagline:
      "Multimodal model that flags negative or harmful Hindi memes by fusing CLIP vision features with IndicBERT text features.",
    category: "AI / ML",
    technologies: ["PyTorch", "CLIP ViT-L/14", "IndicBERT", "EasyOCR", "FastAPI"],
    extraLinks: [{ label: "Model on Hugging Face", href: "https://huggingface.co/mrrobot2610/negative-meme-detection-hindi" }],
    featured: true,
    order: 3,
    year: "2025",
    signals: { complexity: 0.95, usefulness: 0.8, completeness: 0.85, relevance: 0.9, documentation: 0.95, deployment: 0.6, originality: 0.9 },
    media: [
      { kind: "diagram", nodes: ["Meme image", "EasyOCR · hi + en", "CLIP ViT-L/14 ⟷ IndicBERT", "Attention fusion · 512-d", "Classifier → is_negative"], caption: "Inference pipeline" },
    ],
    caseStudy: {
      problem:
        "Harmful memes in Hindi mix image and text, so text-only or image-only filters miss them. Most moderation models are trained on English.",
      built:
        "A vision-language classifier. OCR extracts Hindi and English text, CLIP encodes the image, IndicBERT encodes the text, and an attention-based fusion layer feeds a small classifier.",
      architecture: [
        "EasyOCR for bilingual (Hindi + English) text extraction.",
        "CLIP ViT-L/14 vision encoder (1024-d) and IndicBERT text encoder (768-d).",
        "Attention fusion to 512-d, then a 256→128→2 classifier head.",
        "FastAPI inference service with a small web frontend; trained weights published on Hugging Face.",
      ],
      features: [
        "A meme counts as negative if it is negative in sentiment, vulgar, or abusive",
        "Three learning-rate experiments, tracked with TensorBoard",
        "POST /predict returns is_negative, confidence and the extracted OCR text",
      ],
      contribution: "Designed the architecture, trained and evaluated the model, and built the API and frontend.",
      result: "Best run reached an 83.9% validation F1 score (learning rate 3e-5, 47 epochs).",
    },
  },
  {
    repo: "IDP-machine-learning",
    slug: "document-processing",
    title: "Document Intelligence",
    tagline:
      "Intelligent document processing: OCR, document classification and NER that turn invoices, receipts and forms into structured JSON.",
    category: "AI / ML",
    technologies: ["Python", "PyTorch", "DistilBERT", "MiniLM", "OCR", "ONNX", "FastAPI", "Next.js"],
    featured: true,
    order: 4,
    year: "2025",
    signals: { complexity: 0.9, usefulness: 0.9, completeness: 0.8, relevance: 0.9, documentation: 0.95, deployment: 0.5, originality: 0.75 },
    media: [
      { kind: "diagram", nodes: ["PDF / image", "OpenCV preprocessing", "OCR", "MiniLM classifier", "DistilBERT NER", "Validated JSON"], caption: "Extraction pipeline" },
    ],
    caseStudy: {
      problem:
        "Invoices, receipts and forms arrive as scans and PDFs. Pulling out invoice numbers, dates, totals and GST IDs by hand is slow and error-prone.",
      built:
        "An end-to-end pipeline that preprocesses the document, runs OCR, classifies the document type, extracts fields with a NER model, and validates them before returning JSON over a REST API.",
      architecture: [
        "OpenCV preprocessing, then OCR on each page.",
        "MiniLM-L6 classifier: INVOICE, RECEIPT, FORM, OTHER.",
        "DistilBERT NER for invoice number, date, totals, tax, vendor, customer, address and GST ID.",
        "Regex and validation post-processing; ONNX export and quantization for CPU inference; FastAPI server with a Next.js integration.",
      ],
      features: [
        "Trained on the CORD-v2, SROIE and FUNSD datasets",
        "Per-field confidence scores and source in the response",
        "Multi-page PDF support",
        "Built to run on CPU, packaged for Hugging Face Spaces",
      ],
      contribution: "Built the training scripts, the inference pipeline, model optimisation and the API.",
    },
  },
  {
    repo: "cognition",
    slug: "cognition",
    title: "Cognition",
    tagline:
      "Privacy-first desktop notes app that runs LLMs locally through Ollama for summaries, restructuring, mind maps and chat.",
    category: "Desktop / AI",
    technologies: ["Tauri", "Rust", "React", "Zustand", "Ollama"],
    featured: true,
    order: 5,
    year: "2026",
    signals: { complexity: 0.85, usefulness: 0.8, completeness: 0.75, relevance: 0.85, documentation: 0.8, deployment: 0.4, originality: 0.85 },
    media: [
      { kind: "diagram", nodes: ["React editor", "Tauri bridge (Rust)", "Local storage", "Ollama · local LLM"], caption: "Everything stays on the device" },
    ],
    caseStudy: {
      problem:
        "AI note tools send your notes to someone else's server. For private notes that is a non-starter.",
      built:
        "A cross-platform desktop notes app with a rich-text editor, folders, full-text search and attachments. AI features (summarise, organise, mind maps, chat) run on a local model through Ollama.",
      architecture: [
        "React frontend with Zustand stores.",
        "Tauri shell with a Rust backend for file-system access and packaging.",
        "Ollama for fully offline LLM inference (llama3.2 recommended).",
      ],
      features: [
        "Summarise, organise messy text, generate mind maps, chat with your notes",
        "Images and PDFs as attachments",
        "Builds for macOS, Windows and Linux",
        "No cloud: notes never leave the device",
      ],
      contribution: "Designed and built the app, both the React UI and the Tauri/Rust side.",
    },
  },
  {
    repo: "Weber-CRM",
    slug: "weber-crm",
    title: "Weber CRM",
    tagline:
      "Work-management CRM: assignments, submissions and evaluations with role-based access, search, sorting and push notifications.",
    category: "Full Stack",
    technologies: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "JWT", "Web Push"],
    featured: true,
    order: 6,
    year: "2026",
    signals: { complexity: 0.75, usefulness: 0.8, completeness: 0.75, relevance: 0.9, documentation: 0.3, deployment: 1, originality: 0.6 },
    media: [
      { kind: "diagram", nodes: ["Assignment", "Submission", "Evaluation", "Notification"], caption: "Core workflow" },
    ],
    caseStudy: {
      problem: "A team needed to hand out work, collect submissions and review them without losing track in chat threads.",
      built:
        "A CRM-style app where work moves from assignment to submission to evaluation, with permissions per role and notifications at each step.",
      architecture: [
        "Next.js 16 App Router with API routes and a service layer.",
        "PostgreSQL via node-postgres; Joi validation; JWT auth with bcrypt.",
        "Web Push notifications; structured logging with Winston; deployed on Vercel.",
      ],
      features: [
        "Assignments with priority and due dates",
        "Search and sorting on assignments, submissions and evaluations",
        "Cascading deletes and permission checks per resource",
      ],
      contribution: "Built the application end to end.",
    },
  },

  // Archive-only tweaks
  { repo: "itzfizz-scroll-hero", title: "Scroll Hero", category: "Frontend", technologies: ["Next.js", "GSAP", "Tailwind CSS"] },
  { repo: "MARS", title: "MARS ML Pipeline", category: "AI / ML", technologies: ["Python", "scikit-learn", "FastAPI", "Docker"], tagline: "Risk and anomaly models for rail sensor and weather data, served through FastAPI with an event-bus hook." },
  { repo: "voucher-generator", title: "QR Voucher Generator", category: "Automation", technologies: ["JavaScript", "Google Apps Script"], tagline: "Rotating-QR enrollment flow with short-lived tokens, backed by Google Sheets." },
  { repo: "TradeBot", title: "TradeBot", category: "Backend", technologies: ["Python", "Binance API"] },
  { repo: "MCQ-Test-Generator-Gemini-", title: "MCQ Generator", category: "AI / ML", technologies: ["Next.js", "Gemini API"], tagline: "Generates and runs multiple-choice tests from a prompt using the Gemini API." },
  { repo: "Digital_library_main", title: "Digital Library", category: "Full Stack", technologies: ["React", "Node.js", "MySQL"], tagline: "Team project from BCA: a digital library hosted on a server the team set up in-house." },

  // Not shown: tutorials, forks, empty or superseded repos.
  ...[
    "mrrobot-1001", "mrrobot-1001.github.io", "expensify", "sgi", "sgi-web", "github-final-project",
    "testing-ibm", "src", "trade-app", "sample-project", "leetcode-solving", "DCES", "DCES-backend",
    "DCLink", "Digital_library_v2.0", "morale", "budget-allocation",
  ].map((repo) => ({ repo, hidden: true })),
];
