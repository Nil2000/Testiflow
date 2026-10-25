import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Reveal from "./reveal";
import {
  PlanType,
  PLAN_DISPLAY_NAMES,
  PLAN_PRICES,
  TRIAL_DURATION_DAYS,
  getPlanFeatureList,
} from "@/lib/subscription";

const PLANS = [PlanType.FREE, PlanType.PRO, PlanType.ENTERPRISE] as const;

const PLAN_SUMMARY: Record<PlanType, string> = {
  [PlanType.FREE]: "One space, so you can see how collection works.",
  [PlanType.PRO]: "More spaces, more video, and AI review.",
  [PlanType.ENTERPRISE]: "The same tools, with more room in each space.",
};

function planAction(plan: PlanType, loggedIn: boolean) {
  if (plan === PlanType.FREE) {
    return {
      href: loggedIn ? "/dashboard" : "/api/auth/signin",
      label: loggedIn ? "Go to dashboard" : "Start collecting free",
    };
  }
  return {
    href: loggedIn ? "/buy-premium" : "/api/auth/signin",
    label: `Start ${TRIAL_DURATION_DAYS}-day trial`,
  };
}

export default function LandingPricing({ loggedIn }: { loggedIn: boolean }) {
  return (
    <section id="pricing" className="scroll-mt-24 border-t border-border px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Start free. Add room when you need it.
          </h2>
          <p className="mt-3 max-w-lg text-muted-foreground">
            Paid plans include a {TRIAL_DURATION_DAYS}-day trial. No card on the
            free plan.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan, index) => {
            const popular = plan === PlanType.PRO;
            const action = planAction(plan, loggedIn);
            const price = PLAN_PRICES[plan];

            return (
              <Reveal key={plan} delay={index * 0.1} className="h-full">
              <article
                className={cn(
                  "flex h-full flex-col rounded-xl border bg-card p-5 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
                  popular
                    ? "border-primary"
                    : "border-border hover:border-primary/60",
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl tracking-tight text-foreground">
                    {PLAN_DISPLAY_NAMES[plan]}
                  </h3>
                  {popular && (
                    <span className="font-geist_mono text-[11px] uppercase tracking-wide text-primary">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {PLAN_SUMMARY[plan]}
                </p>
                <p className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl text-foreground">
                    {price}
                  </span>
                  {plan !== PlanType.FREE && (
                    <span className="text-sm text-muted-foreground">/month</span>
                  )}
                </p>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm text-foreground/80">
                  {getPlanFeatureList(plan).map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={popular ? "default" : "outline"}
                  className="mt-6 w-full rounded-full"
                >
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
