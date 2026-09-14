import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ShinyText } from "@/components/ui/shiny-text";

export const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ eyebrow, title, text, dark = false, center = false }: {
  eyebrow: string; title: ReactNode; text?: ReactNode; dark?: boolean; center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className={`mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] ${dark ? "text-amber" : "text-sun"}`}>
        <span className="h-px w-8 bg-current" aria-hidden />
        <ShinyText>{eyebrow}</ShinyText>
      </p>
      <h2 className={`text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.06] tracking-tight ${dark ? "text-white" : "text-indigo"}`}>
        {title}
      </h2>
      {text && <p className={`mt-5 text-lg ${dark ? "text-lilac" : "text-muted"}`}>{text}</p>}
    </Reveal>
  );
}
