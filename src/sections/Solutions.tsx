import { Activity, ArrowUpRight, Check, Droplets, Factory, FileCheck, House, Wrench } from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal, SectionHead } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

function IconBadge({ icon: Icon, tone = "sun" }: { icon: typeof House; tone?: "sun" | "violet" }) {
  return (
    <span className={cn("inline-flex size-12 items-center justify-center rounded-2xl", tone === "sun" ? "bg-sun/10 text-sun" : "bg-violet/10 text-violet")}>
      <Icon className="size-6" aria-hidden />
    </span>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 grid gap-2.5">
      {items.map((t) => (
        <li key={t} className="flex gap-2.5 text-[15px] text-muted">
          <Check className="mt-0.5 size-4 shrink-0 text-sun" aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Photo de la carte : format large, léger zoom au survol de la carte */
function CardPhoto({ name, className }: { name: Parameters<typeof Photo>[0]["name"]; className?: string }) {
  return (
    <Photo
      name={name}
      className={`mt-8 rounded-2xl ${className ?? "aspect-[16/7]"}`}
      imgClassName="transition-transform duration-700 group-hover:scale-[1.06]"
      sizes="(min-width: 1024px) 45vw, 100vw"
    />
  );
}

export function Solutions() {
  return (
    <section id="solutions" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
          <SectionHead eyebrow="Nos solutions" title="Une installation solaire pour chaque besoin" />
          <Reveal>
            <p className="text-lg text-muted lg:pb-2">
              Chaque projet commence par une visite sur place : orientation, ombrages, état de la toiture ou du terrain, et vos factures des douze derniers mois.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-6">
          <Reveal className="lg:col-span-3 lg:row-span-2">
            <SpotlightCard className="flex h-full flex-col p-8">
              <IconBadge icon={House} />
              <h3 className="mt-6 text-3xl font-semibold text-indigo">Maison</h3>
              <p className="mt-3 text-muted">
                Des panneaux raccordés au réseau STEG. Le jour, vous consommez votre propre électricité ; le surplus est injecté sur le réseau et vient réduire vos prochaines factures.
              </p>
              <Bullets items={["De 1 à 10 kWc sur toit-terrasse ou toiture inclinée", "Montage du dossier PROSOL Élec auprès de l’ANME", "Onduleur connecté : production visible sur téléphone"]} />
              <CardPhoto name="maisonToiture" className="min-h-56 flex-1" />
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-3">
            <SpotlightCard className="h-full p-8" glow="rgb(90 63 208 / 0.14)">
              <div className="flex items-start justify-between">
                <IconBadge icon={Factory} tone="violet" />
                <ArrowUpRight className="size-5 text-line transition-colors group-hover:text-violet" aria-hidden />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-indigo">Entreprises et industrie</h3>
              <p className="mt-3 text-muted">Ateliers, commerces, hôtels et usines qui consomment surtout en journée, au moment où les panneaux produisent le plus.</p>
              <Bullets items={["Centrales basse et moyenne tension, toiture ou sol", "Étude de rentabilité à partir de vos relevés"]} />
              <CardPhoto name="entrepriseToiture" />
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.16} className="lg:col-span-3">
            <SpotlightCard className="h-full p-8">
              <div className="flex items-start justify-between">
                <IconBadge icon={Droplets} />
                <ArrowUpRight className="size-5 text-line transition-colors group-hover:text-sun" aria-hidden />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-indigo">Pompage solaire agricole</h3>
              <p className="mt-3 text-muted">Irriguer sans groupe électrogène ni gasoil. La pompe fonctionne directement avec les panneaux, là où le réseau n’arrive pas.</p>
              <Bullets items={["Dimensionnement selon la profondeur du puits et le débit", "Oliveraies, maraîchage, élevage"]} />
              <CardPhoto name="pompageChamp" />
            </SpotlightCard>
          </Reveal>

          {[
            { icon: Wrench, photo: "maintenanceNettoyage" as const, title: "Maintenance et nettoyage", text: "Nettoyage des modules (poussière, sable), contrôle électrique et contrat d’entretien périodique." },
            { icon: FileCheck, photo: "raccordementCablage" as const, title: "Dossiers STEG et ANME", text: "Demande de raccordement et dossier de subvention PROSOL : nous gérons les démarches pour vous." },
            { icon: Activity, photo: "suiviOnduleur" as const, title: "Suivi de production", text: "Votre onduleur connecté affiche la production en temps réel. Nous surveillons les anomalies." },
          ].map((c, i) => (
            <Reveal key={c.title} delay={0.08 * i} className="lg:col-span-2">
              <SpotlightCard className="h-full p-7" glow="rgb(90 63 208 / 0.12)">
                <IconBadge icon={c.icon} tone="violet" />
                <h3 className="mt-5 text-xl font-semibold text-indigo">{c.title}</h3>
                <p className="mt-2 text-[15px] text-muted">{c.text}</p>
                <CardPhoto name={c.photo} className="mt-6 aspect-[16/9]" />
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
