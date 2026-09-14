import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Carte avec halo lumineux qui suit le pointeur (motif « Spotlight Card » de 21st.dev)
export function SpotlightCard({
  children,
  className,
  glow = "rgb(242 106 27 / 0.14)",
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={cn(
        "group relative isolate overflow-hidden rounded-3xl border border-line bg-white",
        "transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-violet/30 hover:shadow-[0_24px_60px_-30px_rgb(36_26_107/.45)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(480px circle at var(--x, 50%) var(--y, 50%), ${glow}, transparent 60%)` }}
      />
      {children}
    </div>
  );
}
