import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { education, profile } from "@/data/profile";
import { siteDescription, siteTitle, siteUrl } from "@/lib/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import "./globals.css";

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", weight: ["400", "500", "600"], display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s — ${profile.name}` },
  description: siteDescription,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.links.github }],
  creator: profile.name,
  keywords: [
    "Harsh Rana",
    "Full Stack Developer",
    "AI Engineer",
    "Software Engineer",
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "PyTorch",
    "India",
    "Open to relocation",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    title: siteTitle,
    description: siteDescription,
    locale: "en_IN",
    firstName: profile.firstName,
    lastName: profile.lastName,
  },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f3f2ee",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  image: `${siteUrl}/images/portrait/harsh-rana.jpg`,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school.split(",")[0] })),
  knowsAbout: ["Full stack development", "Next.js", "TypeScript", "PostgreSQL", "Machine learning", "NLP", "PyTorch"],
  sameAs: [profile.links.github, profile.links.linkedin, profile.links.huggingface],
};

/** Skip the intro loader after the first view in a session, on phones/tablets, and for reduced motion. Runs before paint. */
const introScript = `document.documentElement.classList.add('js');try{if(sessionStorage.getItem('hr-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches||matchMedia('(max-width: 1023.98px)').matches)document.documentElement.classList.add('no-intro')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body>
        <a
          href="#main"
          className="t-label sr-only z-[100] bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SmoothScroll>
          {children}
          <Cursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
