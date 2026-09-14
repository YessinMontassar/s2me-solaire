import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Activity, FileText, Hammer, Landmark, Ruler } from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { Reveal, SectionHead } from "@/components/ui/reveal";
import { btn } from "@/lib/utils";

const STEPS = [
  { icon: Ruler, title: "Visite technique", text: "Nous mesurons votre toit ou votre terrain, relevons les ombrages et analysons vos factures." },
  { icon: FileText, title: "Étude et devis", text: "Vous recevez un dimensionnement détaillé, la production estimée et un devis poste par poste." },
  { icon: Landmark, title: "Dossiers STEG et ANME", text: "Nous déposons la demande de raccordement et, si vous y avez droit, le dossier de subvention PROSOL." },
  { icon: Hammer, title: "Installation", text: "Pose des structures, des panneaux et de l’onduleur par nos techniciens, en général en une à trois journées." },
  { icon: Activity, title: "Mise en service et suivi", text: "Après le passage de la STEG, nous activons le suivi de production et restons joignables pour l’entretien." },
];

export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section id="demarche" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead eyebrow="Notre démarche" title="Du premier appel à la mise en service" text="Un seul interlocuteur S2ME vous suit à chaque étape, sans surprise." />
          <Reveal delay={0.1}>
            <a href="#contact" className={`${btn.dark} mt-8`}>Planifier une visite technique</a>
          </Reveal>
          <Reveal delay={0.2}>
            <Photo
              name="poseTechniciens"
              className="mt-10 hidden rounded-3xl border border-line aspect-[4/3] lg:block"
              sizes="(min-width: 1024px) 40vw, 100vw"
              tint="soft"
            >
              <p className="absolute inset-x-5 bottom-4 text-sm font-medium text-white/90">
                Pose des modules par nos techniciens, en général en une à trois journées.
              </p>
            </Photo>
          </Reveal>
        </div>

        <ol ref={listRef} className="relative">
          <div aria-hidden className="absolute bottom-8 left-7 top-8 w-0.5 bg-line" />
          <motion.div aria-hidden className="absolute bottom-8 left-7 top-8 w-0.5 origin-top bg-linear-to-b from-amber to-sun" style={{ scaleY: line }} />
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative pb-6 pl-20 last:pb-0">
              <Reveal delay={0.05}>
                <span className="absolute left-0 top-0 flex size-14 items-center justify-center rounded-2xl border border-line bg-white text-sun shadow-sm">
                  <s.icon className="size-6" aria-hidden />
                </span>
                <div className="rounded-3xl border border-line bg-white p-6 transition-shadow hover:shadow-[0_20px_50px_-30px_rgb(36_26_107/.4)]">
                  <p className="text-sm font-semibold text-sun">Étape {i + 1}</p>
                  <h3 className="mt-1 text-xl font-semibold text-indigo">{s.title}</h3>
                  <p className="mt-2 text-muted">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
