import { profile } from "@/data/profile";

/** Absolute base URL for canonical links, sitemap and OpenGraph. */
export const siteUrl = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
})();

export const siteTitle = `${profile.name} — Full Stack Developer & AI Builder`;
export const siteDescription =
  `${profile.name} is a full stack and AI engineer in ${profile.location} building production web apps and ML systems with Next.js, TypeScript, PostgreSQL, Python and PyTorch.` +
  (profile.relocation ? " Open to relocation." : "");
