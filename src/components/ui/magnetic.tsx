import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, type SpringOptions } from "motion/react";

const SPRING = { stiffness: 150, damping: 12, mass: 0.15 };

// Effet magnétique : l'élément est attiré vers le curseur à l'approche (motif « Magnetic » de 21st.dev)
export function Magnetic({
  children,
  className,
  intensity = 0.35,
  range = 70,
  springOptions = SPRING,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  range?: number;
  springOptions?: SpringOptions;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springOptions);
  const springY = useSpring(y, springOptions);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el || !hovered) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= range) {
        const scale = 1 - dist / range;
        x.set(dx * intensity * scale);
        y.set(dy * intensity * scale);
      }
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [hovered, intensity, range, x, y]);

  return (
    <motion.div
      ref={ref}
      className={className ?? "inline-block"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        x.set(0);
        y.set(0);
      }}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}
