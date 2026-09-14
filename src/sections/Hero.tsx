import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { ArrowRight, FileCheck, MapPin, Moon, Smartphone, Sunrise, Sunset, Wrench } from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";
import { EASE } from "@/components/ui/reveal";
import { fmtTime, sunSnapshot } from "@/lib/sun";
import { SITE } from "@/lib/site";
import { btn, cn, fmtNumber } from "@/lib/utils";

function useSun() {
  const [s, setS] = useState(sunSnapshot);
  useEffect(() => {
    const id = setInterval(() => setS(sunSnapshot()), 60_000);
    return () => clearInterval(id);
  }, []);
  return s;
}

// 5 kWc, ratio de performance 0,8 : puissance instantanée de référence affichée dans le hero
function estimatePower5kw(irradiance: number) {
  return (5 * irradiance * 0.8) / 1000;
}

const GLOBE_R = 76;
const ORBIT_R = 114;
const GLOBE_CENTER = { x: 150, y: 158 };

// Étoiles du fond : position x, y, rayon, opacité (dispersion à la main, pas de motif répétitif)
const STARS: [number, number, number, number][] = [
  [20, 25, 1.2, .8], [45, 15, 0.8, .5], [70, 30, 1, .65], [15, 60, 0.9, .55], [280, 20, 1.3, .75],
  [255, 45, 0.8, .5], [290, 80, 1, .6], [265, 110, 0.7, .4], [10, 110, 1.1, .7], [25, 150, 0.8, .5],
  [8, 190, 1, .6], [30, 230, 0.9, .55], [15, 265, 1.2, .75], [50, 285, 0.8, .5], [90, 15, 0.7, .45],
  [130, 10, 1, .6], [170, 12, 0.8, .5], [210, 18, 1.1, .65], [240, 270, 1, .6], [200, 285, 0.8, .5],
  [160, 290, 1.2, .7], [110, 288, 0.9, .55], [70, 275, 0.7, .45], [285, 150, 1, .6], [280, 190, 0.8, .5],
  [270, 230, 1.1, .65], [260, 260, 0.9, .55], [45, 265, 1, .6], [190, 283, 0.7, .45], [220, 45, 0.9, .5],
];

// Terre stylisée avec repère Tunisie ; le soleil (ou la lune la nuit) en orbite sur 24 h, à l'heure réelle
function SolarGlobe({ sun }: { sun: ReturnType<typeof sunSnapshot> }) {
  const reduce = useReducedMotion();
  const angle = useMotionValue(0);

  useEffect(() => {
    const target = (sun.minutes / 1440 - 0.5) * Math.PI * 2;
    if (reduce) { angle.set(target); return; }
    const c = animate(angle, target, { duration: 1.8, ease: EASE });
    return () => c.stop();
  }, [sun.minutes, reduce, angle]);

  const orbX = useTransform(angle, (a) => GLOBE_CENTER.x + ORBIT_R * Math.sin(a));
  const orbY = useTransform(angle, (a) => GLOBE_CENTER.y - ORBIT_R * Math.cos(a));
  const behindOpacity = useTransform(orbY, (y) => (y > GLOBE_CENTER.y ? 0.4 : 1));
  const moonDX = useTransform(orbX, (v) => v + 4);
  const moonDY = useTransform(orbY, (v) => v - 3);

  // Bulle d'info : suit l'astre, toujours bien dégagée au-dessus
  const pillW = 130;
  const pillH = 46;
  const pillTop = useTransform(orbY, (v) => Math.max(v - 88, 8));
  const pillLeft = useTransform(orbX, (v) => v - pillW / 2);
  const pillBottom = useTransform(pillTop, (v) => v + pillH);
  const tailPath = useTransform([orbX, pillBottom], (v: number[]) => `M ${v[0] - 7} ${v[1]} L ${v[0] + 7} ${v[1]} L ${v[0]} ${v[1] + 9} Z`);
  const line1Y = useTransform(pillTop, (v) => v + 20);
  const line2Y = useTransform(pillTop, (v) => v + 36);
  const power5k = estimatePower5kw(sun.irradiance);

  return (
    <svg viewBox="0 0 300 300" className="block h-auto w-full max-w-[320px] overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="ocean-grad" cx="32%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#BFE8FF" />
          <stop offset="30%" stopColor="#4FA8DE" />
          <stop offset="62%" stopColor="#1B5C99" />
          <stop offset="100%" stopColor="#051221" />
        </radialGradient>
        <radialGradient id="shadow-grad" cx="72%" cy="78%" r="65%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity=".62" />
        </radialGradient>
        <radialGradient id="orbit-glow">
          <stop offset="0" stopColor="#F5A623" stopOpacity=".55" />
          <stop offset="1" stopColor="#F26A1B" stopOpacity="0" />
        </radialGradient>
        <clipPath id="globe-clip">
          <circle cx={GLOBE_CENTER.x} cy={GLOBE_CENTER.y} r={GLOBE_R} />
        </clipPath>
      </defs>

      {/* Étoiles */}
      <g fill="#fff">
        {STARS.map(([sx, sy, sr, so], i) => (
          i % 5 === 0 && !reduce ? (
            <motion.circle key={i} cx={sx} cy={sy} r={sr} opacity={so} animate={{ opacity: [so, so * 0.15, so] }} transition={{ duration: 2.4 + (i % 3), repeat: Infinity, ease: "easeInOut" }} />
          ) : (
            <circle key={i} cx={sx} cy={sy} r={sr} opacity={so} />
          )
        ))}
      </g>

      <circle cx={GLOBE_CENTER.x} cy={GLOBE_CENTER.y} r={ORBIT_R} fill="none" stroke="rgb(255 255 255 / .16)" strokeWidth="1.5" strokeDasharray="3 7" />

      {/* Halo d'atmosphère */}
      <circle cx={GLOBE_CENTER.x} cy={GLOBE_CENTER.y} r={GLOBE_R + 5} fill="none" stroke="#8ED8FF" strokeOpacity=".5" strokeWidth="7" style={{ filter: "blur(5px)" }} />

      {/* Terre : océan, continents, nuages, ombre directionnelle */}
      <circle cx={GLOBE_CENTER.x} cy={GLOBE_CENTER.y} r={GLOBE_R} fill="url(#ocean-grad)" />
      <g clipPath="url(#globe-clip)">
        <path d="M120,110 C110,95 135,83 156,90 C172,96 180,116 171,131 C180,141 173,157 158,159 C144,161 129,155 121,142 C111,134 109,121 120,110 Z" fill="#C2A26B" opacity=".92" />
        <path d="M166,150 C182,144 197,155 200,173 C202,189 191,203 174,206 C160,208 147,199 145,184 C143,170 152,155 166,150 Z" fill="#4F7A45" opacity=".9" />
        <path d="M100,188 C109,183 119,187 121,197 C123,206 114,213 103,211 C95,209 91,198 100,188 Z" fill="#7A6A45" opacity=".85" />
        <path d="M195,100 C204,97 212,103 211,112 C210,120 200,124 193,119 C187,115 188,103 195,100 Z" fill="#4F7A45" opacity=".8" />
        <g style={{ filter: "blur(2px)" }} fill="#fff" opacity=".55">
          <g transform="rotate(-15 135 120)"><ellipse cx="135" cy="120" rx="28" ry="9" /></g>
          <g transform="rotate(18 178 172)"><ellipse cx="178" cy="172" rx="22" ry="8" /></g>
          <g transform="rotate(-8 108 172)"><ellipse cx="108" cy="172" rx="17" ry="6.5" /></g>
          <g transform="rotate(28 192 122)"><ellipse cx="192" cy="122" rx="15" ry="6" /></g>
          <g transform="rotate(-20 148 200)"><ellipse cx="148" cy="200" rx="19" ry="6.5" /></g>
        </g>
        <circle cx={GLOBE_CENTER.x} cy={GLOBE_CENTER.y} r={GLOBE_R} fill="url(#shadow-grad)" style={{ mixBlendMode: "multiply" }} />
      </g>
      <circle cx={GLOBE_CENTER.x} cy={GLOBE_CENTER.y} r={GLOBE_R} fill="none" stroke="rgb(255 255 255 / .25)" strokeWidth="1" />

      {/* Repère Tunisie */}
      <g transform={`translate(${GLOBE_CENTER.x - GLOBE_R * 0.22} ${GLOBE_CENTER.y - GLOBE_R * 0.5})`}>
        {!reduce && (
          <motion.circle
            r="4"
            fill="none"
            stroke="#F5A623"
            strokeWidth="1.5"
            animate={{ r: [4, 11], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <circle r="3.5" fill="#F5A623" stroke="#F26A1B" strokeWidth="1.5" />
        <text x="9" y="4" fontFamily="var(--font-heading)" fontWeight="600" fontSize="11" fill="#fff">Tunisie</text>
      </g>

      <motion.g style={{ opacity: behindOpacity }}>
        {sun.isDay ? (
          <>
            <motion.circle cx={orbX} cy={orbY} r="30" fill="url(#orbit-glow)" />
            <motion.circle cx={orbX} cy={orbY} r="11" fill="#F5A623" stroke="#F26A1B" strokeWidth="3" />
          </>
        ) : (
          <>
            <motion.circle cx={orbX} cy={orbY} r="10" fill="#B3A8F2" />
            <motion.circle cx={moonDX} cy={moonDY} r="8.5" fill="#0F0A33" />
          </>
        )}
      </motion.g>

      <motion.path d={tailPath} fill="rgb(15 10 51 / .92)" />
      <motion.rect x={pillLeft} y={pillTop} width={pillW} height={pillH} rx="14" fill="rgb(15 10 51 / .92)" stroke="rgb(255 255 255 / .14)" />
      <motion.text x={orbX} y={line1Y} textAnchor="middle" fontFamily="var(--font-heading)" fontWeight="600" fontSize="16" fill="#fff">
        {fmtTime(sun.minutes)}
      </motion.text>
      <motion.text x={orbX} y={line2Y} textAnchor="middle" fontFamily="var(--font-heading)" fontWeight="600" fontSize="12" fill="#F5A623">
        {sun.isDay ? `${fmtNumber(power5k, 1)} kW · 5 kWc` : "Réseau STEG"}
      </motion.text>
    </svg>
  );
}

function LiveCard({ sun }: { sun: ReturnType<typeof sunSnapshot> }) {
  const power5k = estimatePower5kw(sun.irradiance);
  return (
    <motion.aside
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
      className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-white/[.06] p-6 text-white shadow-[0_30px_80px_-30px_rgb(0_0_0/.6)] backdrop-blur-xl"
      aria-labelledby="live-title"
    >
      <div className="flex items-center justify-between">
        <p id="live-title" className="flex items-center gap-2 text-sm font-medium text-lilac">
          <span className={cn("size-2 rounded-full", sun.isDay ? "animate-pulse-dot bg-amber" : "bg-lilac")} aria-hidden />
          En direct au-dessus de Tunis
        </p>
        <span className="text-sm tabular-nums text-white/70">{fmtTime(sun.minutes)}</span>
      </div>

      {sun.isDay ? (
        <>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="font-heading text-4xl font-semibold tabular-nums">{Math.round(sun.elev)}°</p>
              <p className="mt-1 text-sm text-lilac">hauteur du soleil</p>
            </div>
            <div>
              <p className="font-heading text-4xl font-semibold tabular-nums">
                {fmtNumber(Math.round(sun.irradiance / 10) * 10)}
                <span className="ml-1 text-base font-medium text-white/70">W/m²</span>
              </p>
              <p className="mt-1 text-sm text-lilac">ensoleillement estimé</p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-linear-to-r from-amber/20 to-sun/10 p-4 ring-1 ring-amber/30">
            <p className="text-sm text-white/85">En ce moment, une installation de 5 kWc produirait environ</p>
            <p className="mt-1 font-heading text-3xl font-semibold text-amber tabular-nums">
              {fmtNumber(power5k, 1)} kW
            </p>
          </div>
        </>
      ) : (
        <div className="mt-5 flex items-start gap-4">
          <Moon className="mt-1 size-9 shrink-0 text-lilac" aria-hidden />
          <p className="text-white/85">
            Vos panneaux se reposent : la nuit, le réseau STEG prend le relais. Prochain lever du soleil à <strong className="text-amber">{fmtTime(sun.sunrise)}</strong>.
          </p>
        </div>
      )}

      <div className="mt-5 flex justify-between border-t border-white/10 pt-4 text-sm text-white/75">
        <span className="flex items-center gap-1.5"><Sunrise className="size-4 text-amber" aria-hidden /> Lever {fmtTime(sun.sunrise)}</span>
        <span className="flex items-center gap-1.5"><Sunset className="size-4 text-sun" aria-hidden /> Coucher {fmtTime(sun.sunset)}</span>
      </div>
      <p className="mt-3 text-xs text-white/50">Calcul astronomique en temps réel, par ciel clair.</p>
    </motion.aside>
  );
}

const WORDS_1 = ["L’énergie", "du", "soleil", "tunisien,"];
const WORDS_2 = ["produite", "chez", "vous."];

export function Hero() {
  const sun = useSun();
  const glow = sun.isDay ? 0.25 + Math.min(1, sun.elev / 70) * 0.5 : 0.12;

  return (
    <section className="relative isolate overflow-hidden bg-night text-white">
      {/* Fond : ciel nuit → indigo, grille de cellules et lueur d'horizon */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_0%,#3a2aa6_0%,#1a1256_40%,#0f0a33_75%)]" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[.18] [background-image:linear-gradient(rgb(255_255_255/.35)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/.35)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute bottom-[-30%] left-1/2 -z-10 h-[70%] w-[120%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,#F26A1B,transparent)] blur-2xl transition-opacity duration-1000"
        style={{ opacity: glow }}
      />
      <div aria-hidden className="absolute -right-40 top-24 -z-10 size-[520px] animate-spin-slow rounded-full border border-dashed border-white/10" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-6 pt-32 sm:px-8 lg:grid-cols-[1.6fr_1fr] lg:pt-40">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-lilac backdrop-blur"
          >
            <MapPin className="size-4 text-amber" aria-hidden />
            Installateur photovoltaïque, partout en Tunisie
          </motion.p>

          <h1 className="text-[clamp(2.5rem,5.6vw,4.6rem)] font-semibold leading-[1.04] tracking-tight">
            {WORDS_1.map((w, i) => (
              <motion.span key={w} className="mr-[.22em] inline-block" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.07, duration: 0.7, ease: EASE }}>
                {w}
              </motion.span>
            ))}
            <br className="hidden sm:block" />
            <span className="sm:whitespace-nowrap">
            {WORDS_2.map((w, i) => (
              <motion.span
                key={w}
                className="mr-[.22em] inline-block bg-linear-to-r from-amber via-sun to-amber bg-clip-text pb-1 text-transparent"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.07, duration: 0.7, ease: EASE }}
              >
                {w}
              </motion.span>
            ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.7, ease: EASE }}
            className="mt-6 max-w-xl text-lg text-lilac sm:text-xl"
          >
            S2ME étudie, installe et entretient des centrales solaires pour les foyers, les entreprises et les exploitations agricoles. Nous montons aussi vos dossiers STEG et PROSOL.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.85, duration: 0.7, ease: EASE }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Magnetic>
              <a href="#simulateur" className={btn.sun}>
                Estimer mon installation <ArrowRight className="size-4" aria-hidden />
              </a>
            </Magnetic>
            <a href={SITE.phoneHref} className={btn.glass}>Appeler {SITE.phone}</a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/75"
          >
            {[
              { icon: Wrench, t: "Visite technique sur place" },
              { icon: FileCheck, t: "Dossiers STEG et ANME" },
              { icon: Smartphone, t: "Suivi de production sur mobile" },
            ].map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-2"><Icon className="size-4 text-amber" aria-hidden />{t}</li>
            ))}
          </motion.ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <LiveCard sun={sun} />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl justify-center px-5 pb-4 sm:px-8">
        <SolarGlobe sun={sun} />
      </div>
      <div className="h-10" />
    </section>
  );
}
