import Image from "next/image";
import type { ProjectMedia as Media } from "@/lib/types";
import { GhostText } from "@/components/ui/GhostText";

/**
 * Renders a project visual. Repos without UI screenshots (ML pipelines,
 * desktop apps) get a typographic architecture diagram instead of stock art.
 */
export function ProjectMedia({
  media,
  title,
  sizes,
  preload,
  tone = "dark",
}: {
  media: Media | undefined;
  title: string;
  sizes: string;
  preload?: boolean;
  tone?: "dark" | "light";
}) {
  if (!media) return null;

  if (media.kind === "image") {
    return (
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes={sizes}
        quality={80}
        preload={preload}
        className="object-cover object-top"
      />
    );
  }

  const line = tone === "dark" ? "border-paper/70" : "border-line";
  const sub = tone === "dark" ? "text-gray-dark" : "text-gray";
  return (
    <figure
      className={`absolute inset-0 flex flex-col justify-between p-5 sm:p-8 ${tone === "dark" ? "bg-[#111110] text-paper" : "bg-paper text-ink"}`}
      aria-label={`${title}: ${media.caption}`}
    >
      <figcaption className={`t-label flex justify-between ${sub}`}>
        <span>Fig. — {media.caption}</span>
        <span aria-hidden>{media.nodes.length} stages</span>
      </figcaption>
      <ol className="my-4 flex flex-1 flex-col justify-center gap-1.5 sm:gap-2">
        {media.nodes.map((n, i) => (
          <li key={n} className="flex items-center gap-3">
            <span className={`t-label w-6 shrink-0 ${sub}`}>{String(i + 1).padStart(2, "0")}</span>
            <span
              className={`t-label flex-1 border ${line} px-3 py-2 sm:py-2.5 ${i === media.nodes.length - 1 ? "bg-steel text-ink border-steel" : ""}`}
              style={{ marginLeft: `${i * 4}%` }}
            >
              {n}
            </span>
            {i < media.nodes.length - 1 && (
              <span aria-hidden className={`t-label ${sub}`}>
                ↓
              </span>
            )}
          </li>
        ))}
      </ol>
      <GhostText text={title} className="w-full max-w-[90%] opacity-15" />
    </figure>
  );
}
