"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGroup, motion } from "motion/react";
import { useMotionReduced } from "./reveal";
import { ArrowRight, Star, Video } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { cn } from "@/lib/utils";

const ease = [0.2, 0.8, 0.2, 1] as const;
const COLLECTION_LINK = "testiflow.app/your-brand";
const HEADLINE = [
  "Collect testimonials.",
  "Keep the good ones.",
  "Put them to work.",
];

// CSS, not motion: a JS opacity of 0 hides the headline until hydration.
const enter = "motion-safe:animate-wol-enter motion-reduce:animate-none";

type ReviewItem = {
  id: string;
  name: string;
  quote: string;
  kind: "text" | "video";
  stars: number;
  sentiment: "positive" | "spam";
};

const REVIEWS: ReviewItem[] = [
  {
    id: "lena",
    name: "Lena",
    quote:
      "We sent one link. The replies came back the same day, in their own words.",
    kind: "text",
    stars: 5,
    sentiment: "positive",
  },
  {
    id: "omar",
    name: "Omar",
    quote: "Filmed it between meetings. Took two minutes.",
    kind: "video",
    stars: 5,
    sentiment: "positive",
  },
  {
    id: "spam",
    name: "Chris",
    quote: "Buy cheap followers now. Click here.",
    kind: "text",
    stars: 0,
    sentiment: "spam",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span className="flex" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < count
              ? "fill-primary text-primary"
              : "fill-transparent text-muted-foreground/40"
          }`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function TypedLink() {
  const reduce = useMotionReduced();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduce || count >= COLLECTION_LINK.length) return;
    const delay = count === 0 ? 520 : 26;
    const timer = setTimeout(() => setCount((current) => current + 1), delay);
    return () => clearTimeout(timer);
  }, [count, reduce]);

  const shown = reduce ? COLLECTION_LINK : COLLECTION_LINK.slice(0, count);

  return (
    <p
      className="mt-4 min-h-4 font-geist_mono text-xs text-muted-foreground"
      aria-label={COLLECTION_LINK}
    >
      <span aria-hidden="true">
        {shown}
        {!reduce && count < COLLECTION_LINK.length && (
          <span className="text-primary">|</span>
        )}
      </span>
    </p>
  );
}

function ReviewCard({
  item,
  onWall,
  onToggle,
  reduceMotion,
  pulse,
}: {
  item: ReviewItem;
  onWall: boolean;
  onToggle: (on: boolean) => void;
  reduceMotion: boolean;
  pulse: boolean;
}) {
  const isSpam = item.sentiment === "spam";

  return (
    <motion.article
      layout={!reduceMotion}
      layoutId={item.id}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { layout: { type: "spring", bounce: 0.16, duration: 0.45 } }
      }
      className="rounded-lg border border-border bg-background p-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{item.name}</p>
          <p className="mt-1 text-sm leading-snug text-foreground/80">
            {item.quote}
          </p>
          {item.kind === "video" && (
            <p className="mt-2 flex items-center gap-1.5 font-geist_mono text-[11px] text-muted-foreground">
              <Video className="h-3.5 w-3.5" aria-hidden="true" />
              Video
            </p>
          )}
        </div>
        <Badge variant={isSpam ? "destructive" : "secondary"}>
          {isSpam ? "Spam" : "Positive"}
        </Badge>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        {item.stars > 0 ? <Stars count={item.stars} /> : <span />}
        {isSpam ? (
          <span className="font-geist_mono text-[11px] uppercase tracking-wide text-muted-foreground">
            Archived
          </span>
        ) : (
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Wall
            <span className="relative inline-flex">
              {pulse && (
                <motion.span
                  className="pointer-events-none absolute -inset-1 rounded-full ring-2 ring-primary"
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.65 }}
                  transition={{ delay: 1.15, duration: 0.8, ease }}
                  aria-hidden="true"
                />
              )}
              <Switch
                checked={onWall}
                onCheckedChange={onToggle}
                aria-label={`Add ${item.name}'s testimonial to the Wall of Love`}
              />
            </span>
          </label>
        )}
      </div>
    </motion.article>
  );
}

export default function HeroSection({ loggedIn }: { loggedIn: boolean }) {
  const reduceMotion = useMotionReduced();
  const [hint, setHint] = useState(true);
  const [onWall, setOnWall] = useState<Record<string, boolean>>({
    lena: true,
  });

  const inbox = REVIEWS.filter(
    (item) => item.sentiment === "spam" || !onWall[item.id],
  );
  const wall = REVIEWS.filter(
    (item) => item.sentiment !== "spam" && onWall[item.id],
  );

  const publish = (id: string, on: boolean) => {
    setHint(false);
    setOnWall((prev) => ({ ...prev, [id]: on }));
  };

  return (
    <section className="mx-auto grid w-full max-w-6xl items-start gap-12 px-4 pb-20 pt-28 lg:grid-cols-2 lg:gap-16 lg:pt-36">
      <div>
        <p
          className={cn(
            enter,
            "font-geist_mono text-xs uppercase tracking-[0.18em] text-secondary",
          )}
        >
          Testimonial management
        </p>
        <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {HEADLINE.map((line, index) => (
            <span
              key={line}
              className={cn(enter, "block")}
              style={{ animationDelay: `${80 + index * 80}ms` }}
            >
              {line}
            </span>
          ))}
        </h1>
        <p
          className={cn(
            enter,
            "mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg",
          )}
          style={{ animationDelay: "340ms" }}
        >
          Send one link for text and video. Review what comes in, then publish
          a Wall of Love or embed a single testimonial on your site.
        </p>
        <div
          className={cn(enter, "mt-8 flex flex-col gap-3 sm:flex-row")}
          style={{ animationDelay: "420ms" }}
        >
          <Button asChild size="lg" className="group h-12 rounded-full px-7">
            <Link href={loggedIn ? "/dashboard" : "/api/auth/signin"}>
              {loggedIn ? "Go to dashboard" : "Start collecting free"}
              <ArrowRight
                className="ms-2 opacity-70 transition-transform group-hover:translate-x-1"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full px-7"
          >
            <a href="#features">See how it works</a>
          </Button>
        </div>
        <TypedLink />
      </div>

      <LayoutGroup>
        <div
          className={cn(
            enter,
            "rounded-xl border border-border bg-card p-4 sm:p-5",
          )}
          style={{ animationDelay: "500ms" }}
          role="group"
          aria-label="Example review inbox"
        >
          <p className="font-geist_mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Example inbox
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {inbox.map((item) => (
              <ReviewCard
                key={item.id}
                item={item}
                onWall={false}
                reduceMotion={reduceMotion}
                pulse={hint && !reduceMotion && item.id === "omar"}
                onToggle={(on) => publish(item.id, on)}
              />
            ))}
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <p className="font-geist_mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Wall of Love
            </p>
            {wall.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Flip Wall on a testimonial to publish it.
              </p>
            ) : (
              <div
                className={cn(
                  "mt-3 grid gap-2",
                  wall.length > 1 && "sm:grid-cols-2",
                )}
              >
                {wall.map((item) => (
                  <ReviewCard
                    key={item.id}
                    item={item}
                    onWall
                    reduceMotion={reduceMotion}
                    pulse={false}
                    onToggle={(on) => publish(item.id, on)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </LayoutGroup>
    </section>
  );
}
