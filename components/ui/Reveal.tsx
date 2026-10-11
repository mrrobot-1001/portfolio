"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MQ } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";

/**
 * Fades/rises direct children into view once. Content is fully visible without
 * JavaScript and with reduced motion; the start state is applied by GSAP only.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  stagger = 0.08,
  y = 28,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  stagger?: number;
  y?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useMotion(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const items = ref.current?.children;
        if (!items?.length) return;
        gsap.from(items, {
          y,
          autoAlpha: 0,
          duration: 1.1,
          stagger,
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    ref,
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
