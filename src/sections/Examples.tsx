import { Building2, Droplets, Factory, House, MapPin, Sprout, Store } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { Photo } from "@/components/ui/photo";
import { SectionHead } from "@/components/ui/reveal";
import type { PhotoKey } from "@/lib/photos";

// Configurations types (et non des références clients) : à remplacer par de vraies réalisations dès qu'elles sont disponibles.
// Les photos sont des images d'illustration libres de droits, pas des chantiers S2ME.
const EXAMPLES: { icon: typeof House; photo: PhotoKey; type: string; place: string; power: string; text: string }[] = [
  { icon: House, photo: "villaTerrasse", type: "Villa", place: "Sousse", power: "5 kWc", text: "Toit-terrasse, 10 panneaux, onduleur connecté" },
  { icon: Droplets, photo: "oliveraie", type: "Oliveraie", place: "Sfax", power: "Pompe 7,5 kW", text: "Pompage solaire sur puits profond, sans gasoil" },
  { icon: Factory, photo: "atelierToiture", type: "Atelier", place: "Ben Arous", power: "30 kWc", text: "Autoconsommation en journée, basse tension" },
  { icon: House, photo: "maisonTuiles", type: "Maison", place: "Nabeul", power: "3 kWc", text: "Toiture inclinée, dossier PROSOL Élec" },
  { icon: Building2, photo: "hotelCentrale", type: "Hôtel", place: "Djerba", power: "100 kWc", text: "Centrale en toiture, suivi à distance" },
  { icon: Sprout, photo: "serreMaraichere", type: "Serre maraîchère", place: "Kairouan", power: "Pompe 4 kW", text: "Irrigation goutte-à-goutte au fil du soleil" },
  { icon: Store, photo: "commercePanneaux", type: "Commerce", place: "Tunis", power: "10 kWc", text: "Climatisation alimentée aux heures chaudes" },
  { icon: Droplets, photo: "irrigationEau", type: "Élevage", place: "Béja", power: "Pompe 2,2 kW", text: "Abreuvement autonome, hors réseau" },
];

function ExampleCard({ icon: Icon, photo, type, place, power, text }: (typeof EXAMPLES)[number]) {
  return (
    <article className="group flex w-[300px] shrink-0 flex-col overflow-hidden rounded-3xl border border-line bg-linear-to-b from-white to-chalk transition-colors hover:border-violet/30">
      <Photo
        name={photo}
        className="aspect-[3/2] shrink-0"
        imgClassName="transition-transform duration-700 group-hover:scale-[1.06]"
        sizes="300px"
        eager
      >
        <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-[#B8480A] shadow-sm">
          {power}
        </span>
      </Photo>
      <div className="flex flex-col p-6">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-violet/10 text-violet"><Icon className="size-5" aria-hidden /></span>
        <h3 className="mt-4 text-lg font-semibold text-indigo">{type}</h3>
        <p className="flex items-center gap-1 text-sm text-muted"><MapPin className="size-3.5" aria-hidden />{place}</p>
        <p className="mt-3 text-[15px] text-muted">{text}</p>
      </div>
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
      <p className="mx-auto mt-8 max-w-3xl px-5 text-center text-sm text-muted sm:px-8">
        Photographies d’illustration. Nos propres réalisations seront publiées ici avec l’accord de nos clients.
      </p>
    </section>
  );
}
