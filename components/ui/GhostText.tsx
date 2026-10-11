/**
 * Large faint decorative type (section numerals, watermark titles) drawn as SVG.
 * It scales to its box and is hidden from assistive tech; real headings carry the text.
 */
export function GhostText({ text, className = "" }: { text: string; className?: string }) {
  const width = Math.max(1, text.length) * 60; // ≈ cap advance of the display face at size 100
  return (
    <svg aria-hidden viewBox={`0 0 ${width} 75`} preserveAspectRatio="xMinYMid meet" className={`select-none ${className}`}>
      <text
        x="0"
        y="73"
        textLength={width}
        lengthAdjust="spacingAndGlyphs"
        fill="currentColor"
        style={{ font: "500 100px var(--font-display)", textTransform: "uppercase" }}
      >
        {text}
      </text>
    </svg>
  );
}
