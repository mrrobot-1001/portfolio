import { profile } from "@/data/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="frame border-t border-paper/25 bg-ink pt-8 pb-10 text-paper">
      <div className="grid-editorial t-label gap-y-6">
        <p className="col-span-2 lg:col-span-3">{profile.name}</p>
        <p className="col-span-2 text-gray-dark lg:col-span-3">{profile.shortRole}</p>
        <p className="col-span-2 text-gray-dark lg:col-span-2">India → Anywhere</p>
        <ul className="col-span-2 flex flex-wrap gap-x-4 gap-y-2 lg:col-span-3">
          <li><a className="link-u" href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a className="link-u" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a className="link-u" href={`mailto:${profile.email}`}>Email</a></li>
        </ul>
        <p className="col-span-4 text-gray-dark lg:col-span-1 lg:text-right">© {year}</p>
      </div>
      {/* Decorative wordmark; SVG so it scales to the exact width and stays out of the text layer. */}
      <svg aria-hidden viewBox="0 0 1000 150" className="mt-16 w-full text-paper/10 select-none">
        <text
          x="0"
          y="142"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          fill="currentColor"
          style={{ font: "600 190px var(--font-display)", textTransform: "uppercase" }}
        >
          {profile.firstName} {profile.lastName}
        </text>
      </svg>
    </footer>
  );
}
