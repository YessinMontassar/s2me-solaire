import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { Reveal, SectionHead } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const FAQ = [
  {
    q: "Qu’est-ce que le programme PROSOL Élec ?",
    a: "C’est le programme national piloté par l’ANME avec la STEG pour encourager les foyers à installer des panneaux raccordés au réseau. Selon les conditions en vigueur, il ouvre droit à une subvention et à des facilités de paiement. Nous vérifions votre éligibilité et montons le dossier.",
  },
  {
    q: "Que devient l’électricité que je ne consomme pas ?",
    a: "Le surplus produit en journée est injecté sur le réseau STEG et vient en déduction de vos consommations suivantes, selon le régime de comptage applicable à votre installation.",
  },
  {
    q: "Combien de temps dure l’installation ?",
    a: "La pose elle-même prend en général une à trois journées pour une maison. Le délai total dépend surtout des démarches de raccordement auprès de la STEG, que nous suivons pour vous.",
  },
  {
    q: "Les panneaux produisent-ils en hiver ou par temps nuageux ?",
    a: "Oui, mais moins. En Tunisie, un mois d’hiver produit environ moitié moins qu’un mois d’été : c’est pourquoi nous dimensionnons sur l’année entière, comme dans le simulateur.",
  },
  {
    q: "Quel entretien faut-il prévoir ?",
    a: "Surtout un nettoyage régulier des modules, car la poussière et le sable réduisent la production, notamment dans le Sud. Nous proposons des contrats d’entretien avec nettoyage et contrôle électrique.",
  },
  {
    q: "Faut-il des batteries pour le pompage solaire ?",
    a: "Généralement non : la pompe fonctionne aux heures ensoleillées et l’eau est stockée dans un bassin ou un réservoir. C’est plus simple, moins cher et sans entretien de batteries.",
  },
];

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <div className={cn("rounded-2xl border bg-white transition-colors", open ? "border-violet/30" : "border-line")}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left text-lg font-semibold text-indigo"
        >
          {q}
          <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full transition-[transform,background-color] duration-300", open ? "rotate-45 bg-sun text-night" : "bg-chalk text-violet")}>
            <Plus className="size-5" aria-hidden />
          </span>
        </button>
      </h3>
      <div id={id} role="region" className={cn("grid transition-[grid-template-rows] duration-300 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-muted">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
        <SectionHead eyebrow="Questions fréquentes" title="Tout ce qu’il faut savoir avant de se lancer" text="Une autre question ? Appelez-nous ou écrivez-nous sur WhatsApp, nous répondons dans la journée." />
        <Reveal className="grid gap-3">
          {FAQ.map((f, i) => (
            <Item key={f.q} {...f} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
