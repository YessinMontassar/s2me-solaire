import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Glint lumineux qui balaie le texte, façon reflet de soleil (motif « Animated Shiny Text » de 21st.dev)
export function ShinyText({
  children,
  className,
  shimmerWidth = 90,
}: {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}) {
  return (
    <span
      style={{ "--shiny-width": `${shimmerWidth}px` } as CSSProperties}
      className={cn(
        "animate-shiny-text bg-clip-text bg-no-repeat bg-gradient-to-r from-transparent via-white/90 via-50% to-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
