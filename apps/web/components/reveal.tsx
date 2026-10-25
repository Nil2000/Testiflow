"use client";

import { useReducedMotion, motion } from "motion/react";
import type { ReactNode } from "react";
import { useIsClient } from "@/hooks/useIsClient";

export const motionEase = [0.2, 0.8, 0.2, 1] as const;
export const motionOffset = 12;
export const motionDuration = 0.45;
export const motionViewport = { once: true, margin: "-80px" } as const;

type Hidden = { opacity?: number; y?: number; scale?: number };

// False during SSR and hydration so the first paint matches, then true when
// the user prefers reduced motion.
export function useMotionReduced() {
  const ready = useIsClient();
  const prefers = useReducedMotion() === true;
  return ready && prefers;
}

export function enterMotion(reduce: boolean, delay = 0, hidden: Hidden = {}) {
  const scale = hidden.scale;
  const shown = scale == null ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 };
  if (reduce) {
    return { initial: false as const, animate: shown, transition: { duration: 0 } };
  }

  return {
    initial: {
      opacity: hidden.opacity ?? 0,
      ...(scale == null ? { y: hidden.y ?? motionOffset } : { scale }),
    },
    whileInView: shown,
    viewport: motionViewport,
    transition: { duration: motionDuration, delay, ease: motionEase },
  };
}

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export default function Reveal({ children, delay = 0, className }: Props) {
  const reduce = useMotionReduced();

  return (
    <motion.div className={className} {...enterMotion(reduce, delay)}>
      {children}
    </motion.div>
  );
}
