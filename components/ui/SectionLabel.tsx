/** "02 / SELECTED WORK" style marker used at the top of every section. */
export function SectionLabel({ index, title, className = "" }: { index: string; title: string; className?: string }) {
  return (
    <p className={`t-label flex items-center gap-3 ${className}`}>
      <span>{index}</span>
      <span aria-hidden className="h-px w-8 bg-current" />
      <span>{title}</span>
    </p>
  );
}
