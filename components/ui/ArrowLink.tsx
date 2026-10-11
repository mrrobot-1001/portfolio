import type { ReactNode } from "react";

/** Text link with animated underline. External links open in a new tab and get ↗. */
export function ArrowLink({
  href,
  children,
  className = "",
  external,
  cursor,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  cursor?: string;
}) {
  const isExternal = external ?? /^https?:/.test(href);
  return (
    <a
      href={href}
      className={`link-u ${className}`}
      data-cursor={cursor}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      <span aria-hidden className={`arrow ${isExternal ? "arrow-ne" : "arrow-e"}`}>
        {isExternal ? "↗" : "→"}
      </span>
      {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
