"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

const icon =
  "absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transition-[transform,opacity] duration-300 ease-out";

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const ready = useIsClient();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("relative h-9 w-9", className)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        ready
          ? `Switch to ${isDark ? "light" : "dark"} theme`
          : "Toggle color theme"
      }
    >
      <Sun
        className={cn(
          icon,
          "scale-100 rotate-0 opacity-100 dark:scale-[0.25] dark:-rotate-90 dark:opacity-0",
        )}
      />
      <Moon
        className={cn(
          icon,
          "scale-[0.25] rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100",
        )}
      />
    </Button>
  );
}
