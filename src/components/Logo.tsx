import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="#F26A1B" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="60" cy="60" r="22" strokeWidth="5" />
      <path d="M64 44 52 62h10l-6 15 14-20H60l4-13Z" strokeWidth="4.5" />
      <g strokeWidth="5" strokeDasharray="6 7">
        <path d="M60 30V6" /><path d="M60 90v24" /><path d="M30 60H6" /><path d="M90 60h24" />
        <path d="m39 39-15-15" /><path d="m81 39 15-15" /><path d="m39 81-15 15" /><path d="m81 81 15 15" />
      </g>
    </svg>
  );
}

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-10 transition-transform duration-700 group-hover:rotate-45" />
      <span className="flex flex-col leading-none">
        <span className={cn("font-heading text-2xl font-bold tracking-tight", light ? "text-white" : "text-violet")}>S2ME</span>
        <span className="mt-1 text-[11px] font-semibold tracking-wide text-amber">Montassar Énergie</span>
      </span>
    </span>
  );
}
