import { Building2, Droplets, Factory, House, MapPin, Sprout, Store } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { SectionHead } from "@/components/ui/reveal";

// Configurations types (et non des références clients) : à remplacer par de vraies réalisations dès qu'elles sont disponibles
const EXAMPLES = [
  { icon: House, type: "Villa", place: "Sousse", power: "5 kWc", text: "Toit-terrasse, 10 panneaux, onduleur connecté" },
  { icon: Droplets, type: "Oliveraie", place: "Sfax", power: "Pompe 7,5 kW", text: "Pompage solaire sur puits profond, sans gasoil" },
  { icon: Factory, type: "Atelier", place: "Ben Arous", power: "30 kWc", text: "Autoconsommation en journée, basse tension" },
  { icon: House, type: "Maison", place: "Nabeul", power: "3 kWc", text: "Toiture inclinée, dossier PROSOL Élec" },
  { icon: Building2, type: "Hôtel", place: "Djerba", power: "100 kWc", text: "Centrale en toiture, suivi à distance" },
  { icon: Sprout, type: "Serre maraîchère", place: "Kairouan", power: "Pompe 4 kW", text: "Irrigation goutte-à-goutte au fil du soleil" },
  { icon: Store, type: "Commerce", place: "Tunis", power: "10 kWc", text: "Climatisation alimentée aux heures chaudes" },
  { icon: Droplets, type: "Élevage", place: "Béja", power: "Pompe 2,2 kW", text: "Abreuvement autonome, hors réseau" },
];

function ExampleCard({ icon: Icon, type, place, power, text }: (typeof EXAMPLES)[number]) {
  return (
    <article className="flex w-[300px] shrink-0 flex-col rounded-3xl border border-line bg-linear-to-b from-white to-chalk p-6 transition-colors hover:border-violet/30">
      <div className="flex items-center justify-between">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-violet/10 text-violet"><Icon className="size-5" aria-hidden /></span>
        <span className="rounded-full bg-sun/10 px-3 py-1 text-sm font-semibold text-[#B8480A]">{power}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-indigo">{type}</h3>
      <p className="flex items-center gap-1 text-sm text-muted"><MapPin className="size-3.5" aria-hidden />{place}</p>
      <p className="mt-3 text-[15px] text-muted">{text}</p>
    </article>
  );
}

export function Examples() {
  return (
    <section id="exemples" className="overflow-hidden pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          center
          eyebrow="Configurations types"
          title="Une solution pour chaque toit, chaque terrain"
          text="Du Nord au Sud, la puissance et le matériel changent selon l’usage. Voici des configurations courantes ; la visite technique fixe le dimensionnement exact."
        />
      </div>
      <Marquee label="Exemples de configurations solaires" className="mt-14">
        {EXAMPLES.map((e) => <ExampleCard key={e.type + e.place} {...e} />)}
      </Marquee>
    </section>
  );
}
