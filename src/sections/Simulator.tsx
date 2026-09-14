import { useId, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Info } from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Reveal, SectionHead } from "@/components/ui/reveal";
import { btn, cn, fmtNumber } from "@/lib/utils";

// Hypothèses affichées au visiteur
const PRICE_PER_KWH = 0.3; // DT, moyenne indicative
const PANEL_WC = 550;
const PANEL_AREA = 2.6; // m² par panneau, espacement compris
const CO2_KG_PER_KWH = 0.5; // ordre de grandeur du réseau tunisien

const REGIONS = [
  { id: "nord", label: "Nord", hint: "Tunis, Bizerte, Béja…", yield: 1550 },
  { id: "centre", label: "Centre et Sahel", hint: "Sousse, Sfax, Kairouan…", yield: 1650 },
  { id: "sud", label: "Sud", hint: "Gabès, Tozeur, Médenine…", yield: 1750 },
] as const;

// Répartition mensuelle typique de la production en Tunisie (relative)
const MONTHS = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];
const MONTHS_FULL = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const RAW = [95, 110, 145, 160, 180, 185, 195, 180, 150, 125, 100, 90];
const SHARE = RAW.map((v) => v / RAW.reduce((a, b) => a + b, 0));

export function Simulator({ onRequest }: { onRequest: (message: string) => void }) {
  const [bill, setBill] = useState(250);
  const [region, setRegion] = useState<(typeof REGIONS)[number]["id"]>("centre");
  const [month, setMonth] = useState<number | null>(null);
  const billId = useId();

  const r = useMemo(() => {
    const y = REGIONS.find((x) => x.id === region)!.yield;
    const annualKwh = (bill / PRICE_PER_KWH) * 6;
    const kwc = Math.max(1, Math.ceil((annualKwh / y) * 2) / 2);
    const panels = Math.ceil((kwc * 1000) / PANEL_WC);
    const prod = kwc * y;
    return {
      kwc, panels, prod,
      area: Math.ceil(panels * PANEL_AREA),
      savings: Math.round((Math.min(prod, annualKwh) * PRICE_PER_KWH) / 10) * 10,
      co2: (prod * CO2_KG_PER_KWH) / 1000,
      monthly: SHARE.map((s) => Math.round(prod * s)),
    };
  }, [bill, region]);

  const peak = r.monthly.indexOf(Math.max(...r.monthly));
  const shown = month ?? peak;
  const pct = ((bill - 50) / (1500 - 50)) * 100;

  const request = () => {
    const reg = REGIONS.find((x) => x.id === region)!.label;
    onRequest(
      `Facture STEG d’environ ${bill} DT tous les deux mois (région : ${reg}). Le simulateur m’indique une installation d’environ ${fmtNumber(r.kwc, 1)} kWc (${r.panels} panneaux).`,
    );
  };

  return (
    <section id="simulateur" className="relative isolate overflow-hidden bg-night py-24 text-white sm:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_85%_20%,rgb(90_63_208/.45),transparent),radial-gradient(50%_50%_at_10%_90%,rgb(242_106_27/.18),transparent)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          dark
          eyebrow="Simulateur"
          title={<>De quelle installation <span className="text-amber">avez-vous besoin ?</span></>}
          text="La STEG vous facture tous les deux mois. Indiquez le montant habituel et votre région : nous estimons la puissance adaptée à votre consommation."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* Réglages */}
          <Reveal className="rounded-3xl border border-white/10 bg-white/[.05] p-6 backdrop-blur sm:p-8">
            <label htmlFor={billId} className="block font-medium text-lilac">Ma facture STEG pour deux mois</label>
            <output htmlFor={billId} className="mt-2 block font-heading text-6xl font-semibold tabular-nums text-amber sm:text-7xl">
              {fmtNumber(bill)}<span className="ml-2 text-2xl font-medium text-white/70">DT</span>
            </output>
            <input
              id={billId}
              type="range"
              min={50}
              max={1500}
              step={10}
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
              className="sun-range mt-4"
              style={{ ["--pct" as string]: `${pct}%` }}
              aria-valuetext={`${bill} dinars`}
            />
            <div className="flex justify-between text-sm text-white/60" aria-hidden><span>50 DT</span><span>1 500 DT</span></div>

            <fieldset className="mt-8">
              <legend className="font-medium text-lilac">Ma région</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {REGIONS.map((reg) => (
                  <label
                    key={reg.id}
                    className={cn(
                      "relative cursor-pointer rounded-2xl border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-sun",
                      region === reg.id ? "border-amber bg-amber/10" : "border-white/15 hover:border-white/35",
                    )}
                  >
                    <input type="radio" name="region" value={reg.id} checked={region === reg.id} onChange={() => setRegion(reg.id)} className="sr-only" />
                    <span className="block font-semibold">{reg.label}</span>
                    <span className="mt-0.5 block text-sm text-white/60">{reg.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="mt-8 flex gap-3 rounded-2xl border-l-2 border-amber bg-white/[.04] p-4 text-sm text-white/65">
              <Info className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
              <span>
                Hypothèses : {fmtNumber(PRICE_PER_KWH, 2)} DT le kWh en moyenne, 1 550 à 1 750 kWh produits par kWc et par an selon la région, panneaux de {PANEL_WC} Wc, {fmtNumber(CO2_KG_PER_KWH, 1)} kg de CO₂ par kWh du réseau. La visite technique affine ce dimensionnement.
              </span>
            </p>
          </Reveal>

          {/* Résultats */}
          <Reveal delay={0.1} className="rounded-3xl bg-white p-6 text-ink shadow-[0_40px_100px_-40px_rgb(0_0_0/.7)] sm:p-8">
            <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3" aria-live="polite">
              {[
                { label: "Puissance conseillée", value: r.kwc, unit: "kWc", digits: 1, strong: true },
                { label: "Panneaux", value: r.panels, unit: "" },
                { label: "Surface de toit", value: r.area, unit: "m²", prefix: "≈ " },
                { label: "Production par an", value: r.prod, unit: "kWh" },
                { label: "Économie par an", value: r.savings, unit: "DT", prefix: "jusqu’à " },
                { label: "CO₂ évité par an", value: r.co2, unit: "t", digits: 1 },
              ].map((x) => (
                <div key={x.label}>
                  <p className="text-sm text-muted">{x.label}</p>
                  <p className={cn("mt-1 font-heading font-semibold leading-tight tracking-tight", x.strong ? "text-4xl text-sun" : "text-2xl text-indigo sm:text-3xl")}>
                    {x.prefix && <span className="text-base font-medium text-muted">{x.prefix}</span>}
                    <NumberTicker value={x.value} decimalPlaces={x.digits ?? 0} />
                    {x.unit && <span className="ml-1 text-base font-medium text-muted">{x.unit}</span>}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-medium text-indigo">Production mois par mois</p>
                <p className="text-sm text-muted" aria-live="polite">
                  En {MONTHS_FULL[shown]} : <strong className="text-ink tabular-nums">{fmtNumber(r.monthly[shown])} kWh</strong>
                </p>
              </div>
              <div className="mt-4 flex h-36 items-end gap-1.5 sm:gap-2" role="list" aria-label="Production estimée par mois">
                {r.monthly.map((v, i) => (
                  <button
                    type="button"
                    role="listitem"
                    key={MONTHS[i]}
                    onMouseEnter={() => setMonth(i)}
                    onMouseLeave={() => setMonth(null)}
                    onFocus={() => setMonth(i)}
                    onBlur={() => setMonth(null)}
                    onClick={() => setMonth(i)}
                    aria-label={`${MONTHS_FULL[i]} : ${fmtNumber(v)} kWh`}
                    aria-pressed={i === shown}
                    className="group flex h-full min-w-0 flex-1 cursor-pointer touch-manipulation flex-col items-center justify-end gap-1.5 rounded-md py-1"
                  >
                    <motion.span
                      className={cn("w-full origin-bottom rounded-t-md transition-colors", i === shown ? "bg-linear-to-t from-sun to-amber" : "bg-violet/25 group-hover:bg-violet/45")}
                      style={{ height: `${(RAW[i] / 195) * 100}%` }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-1.5 text-[11px] text-muted sm:gap-2" aria-hidden>
                {MONTHS.map((m) => <span key={m} className="flex-1 text-center">{m.slice(0, 1)}</span>)}
              </div>
            </div>

            <Magnetic className="mt-8 block w-full">
              <a href="#contact" onClick={request} className={cn(btn.sun, "w-full")}>
                Demander une étude pour {fmtNumber(r.kwc, 1)} kWc <ArrowRight className="size-4" aria-hidden />
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
