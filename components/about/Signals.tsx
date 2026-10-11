import { signals } from "@/data/profile";
import { Reveal } from "@/components/ui/Reveal";

/** "What I bring": six short claims, each pointing at evidence on the page. */
export function Signals() {
  return (
    <section aria-labelledby="signals-title" className="frame bg-paper pb-28 lg:pb-40">
      <div className="grid-editorial items-end gap-y-6 border-t border-line pt-6">
        <p className="t-label col-span-2 text-gray lg:col-span-3">01.1 / For hiring teams</p>
        <h2 id="signals-title" className="t-display col-span-4 text-[12vw] lg:col-span-9 lg:text-[6.5vw]">
          What I bring
        </h2>
      </div>
      <Reveal as="ol" className="mt-12 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
        {signals.map((s, i) => (
          <li key={s.title} className="group relative flex min-h-64 flex-col border-r border-b border-line p-5 lg:p-7">
            <span className="t-label text-gray">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-8 font-display text-2xl font-medium tracking-tight uppercase lg:text-3xl">{s.title}</h3>
            <p className="mt-3 max-w-sm leading-relaxed text-ink/80">{s.body}</p>
            <p className="t-label mt-auto pt-6 text-gray">
              <span aria-hidden>→ </span>
              <span className="sr-only">Evidence: </span>
              {s.proof}
            </p>
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-steel transition-transform duration-500 group-hover:scale-x-100" />
          </li>
        ))}
      </Reveal>
    </section>
  );
}
