import { NumberTicker } from "@/components/ui/number-ticker";
import { Reveal } from "@/components/ui/reveal";

// Chiffres sur le potentiel solaire tunisien et le périmètre d'intervention — pas de statistiques inventées
const STATS = [
  { value: 3200, suffix: "h", label: "d’ensoleillement par an dans le sud du pays" },
  { value: 1600, suffix: "kWh", label: "produits en moyenne par kWc installé et par an" },
  { value: 24, suffix: "", label: "gouvernorats où nous intervenons" },
  { value: 25, suffix: "ans", label: "de garantie de performance fabricant sur les panneaux" },
];

export function Stats() {
  return (
    <section aria-label="Le solaire en Tunisie en chiffres" className="relative z-10 -mt-6">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-line bg-white shadow-[0_30px_80px_-40px_rgb(36_26_107/.45)] lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="border-line p-6 sm:p-8 [&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0 [&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-r">
              <p className="font-heading text-[clamp(2.2rem,4vw,3.25rem)] font-semibold leading-none tracking-tight text-indigo">
                {s.value === 25 && <span className="text-2xl text-muted">jusqu’à </span>}
                <NumberTicker value={s.value} />
                {s.suffix && <span className="ml-1 text-[.5em] font-medium text-sun">{s.suffix}</span>}
              </p>
              <p className="mt-3 text-[15px] leading-snug text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
