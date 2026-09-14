import { useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

// Adapté de « Testimonials with Marquee » (21st.dev) : défilement infini en CSS,
// pause au survol / au focus, bouton pause, et grille statique si le mouvement est réduit.
export function Marquee({
  children,
  duration = "50s",
  label,
  className,
}: {
  children: ReactNode;
  duration?: string;
  label: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);

  if (reduce) {
    return <div className={cn("mx-auto flex max-w-6xl flex-wrap justify-center gap-4 px-5", className)}>{children}</div>;
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className="group flex overflow-hidden py-2 [--gap:1rem] [gap:var(--gap)]"
        style={{ ["--duration" as string]: duration }}
        role="region"
        aria-label={label}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className={cn(
              "flex shrink-0 animate-marquee [gap:var(--gap)] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
              paused && "[animation-play-state:paused]",
            )}
          >
            {children}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-40 bg-linear-to-r from-chalk sm:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-40 bg-linear-to-l from-chalk sm:block" />
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium text-muted transition-colors hover:border-violet/40 hover:text-indigo"
        >
          {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
          {paused ? "Reprendre le défilement" : "Mettre en pause"}
        </button>
      </div>
    </div>
  );
}
