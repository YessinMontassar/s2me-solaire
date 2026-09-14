import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn, fmtNumber } from "@/lib/utils";

// Adapté du composant « Number Ticker » (Magic UI, via 21st.dev) :
// format fr-FR, suit les changements de valeur, respecte prefers-reduced-motion.
export function NumberTicker({
  value,
  decimalPlaces = 0,
  className,
}: {
  value: number;
  decimalPlaces?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

  useEffect(() => {
    if (!inView) return;
    if (reduce) spring.jump(value);
    motionValue.set(value);
  }, [inView, value, reduce, motionValue, spring]);

  useEffect(
    () =>
      spring.on("change", (latest) => {
        if (ref.current) ref.current.textContent = fmtNumber(Number(latest.toFixed(decimalPlaces)), decimalPlaces);
      }),
    [spring, decimalPlaces],
  );

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)}>
      {fmtNumber(0, decimalPlaces)}
    </span>
  );
}
