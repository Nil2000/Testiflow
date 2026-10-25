"use client";

import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { enterMotion, useMotionReduced } from "./reveal";

// Starts after the card reveal so the two entrances don't fire together.
const visualDelay = 0.25;
const stagger = 0.08;

export function CollectVisual() {
  const reduce = useMotionReduced();

  return (
    <div
      className="rounded-lg border border-border bg-background p-3"
      aria-hidden="true"
    >
      <p className="font-geist_mono text-[11px] text-muted-foreground">
        testiflow.app/your-brand
      </p>
      <p className="mt-3 text-sm text-foreground">How was working with us?</p>
      <span className="mt-2 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className="inline-flex"
            {...enterMotion(reduce, visualDelay + i * stagger, {
              scale: 0.9,
              opacity: 0,
            })}
          >
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          </motion.span>
        ))}
      </span>
      <div className="mt-3 flex h-8 items-center rounded-md border border-dashed border-border px-2 text-xs text-muted-foreground">
        Write, or record a video
      </div>
    </div>
  );
}

const manageRows = [
  {
    label: "5 stars",
    tag: "Positive",
    tone: "bg-secondary text-secondary-foreground",
  },
  { label: "Video", tag: "Neutral", tone: "border border-border text-foreground" },
  {
    label: "Archived",
    tag: "Spam",
    tone: "bg-destructive text-destructive-foreground",
  },
];

export function ManageVisual() {
  const reduce = useMotionReduced();

  return (
    <ul className="space-y-2" aria-hidden="true">
      {manageRows.map((row, i) => (
        <motion.li
          key={row.tag}
          className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-xs"
          {...enterMotion(reduce, visualDelay + i * stagger)}
        >
          <span className="text-muted-foreground">{row.label}</span>
          <span className={`rounded-md px-1.5 py-0.5 font-medium ${row.tone}`}>
            {row.tag}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}

const quotes = [
  "Same-day replies.",
  "Two minutes.",
  "Kept this one.",
  "In their words.",
];

export function ShowcaseVisual() {
  const reduce = useMotionReduced();

  return (
    <div className="grid grid-cols-2 gap-2" aria-hidden="true">
      {quotes.map((line, i) => (
        <motion.div
          key={line}
          className="rounded-lg border border-border bg-background p-2"
          {...enterMotion(reduce, visualDelay + i * stagger)}
        >
          <Quote className="h-3 w-3 text-primary" />
          <p className="mt-1.5 text-[11px] leading-snug text-foreground/80">
            {line}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
