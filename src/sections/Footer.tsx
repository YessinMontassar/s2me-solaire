import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";
import { NAV, SITE } from "@/lib/site";
import { btn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="bg-night text-lilac">
      {/* Bandeau d'appel à l'action */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="relative -translate-y-1/2 overflow-hidden rounded-3xl bg-linear-to-r from-amber via-sun to-[#E2551A] p-8 text-night sm:p-12">
          <div aria-hidden className="absolute -right-16 -top-16 size-64 animate-spin-slow rounded-full border-[10px] border-dashed border-night/10" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-tight">Prêt à produire votre propre électricité ?</h2>
              <p className="mt-2 text-lg text-night/80">Une visite technique suffit pour connaître la bonne installation.</p>
            </div>
            <Magnetic>
              <a href="#contact" className={`${btn.dark} bg-night hover:bg-indigo`}>Demander une étude <ArrowRight className="size-4" aria-hidden /></a>
            </Magnetic>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto -mt-6 grid max-w-7xl gap-10 px-5 pb-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-[15px]">{SITE.legal} — étude, installation et entretien de centrales photovoltaïques en Tunisie.</p>
        </div>
        <nav aria-label="Pied de page">
          <p className="font-heading font-semibold text-white">Navigation</p>
          <ul className="mt-3 grid gap-2 text-[15px]">
            {NAV.map((n) => <li key={n.href}><a href={n.href} className="hover:text-amber">{n.label}</a></li>)}
          </ul>
        </nav>
        <div>
          <p className="font-heading font-semibold text-white">Nous joindre</p>
          <ul className="mt-3 grid gap-2 text-[15px]">
            <li><a href={SITE.phoneHref} className="hover:text-amber">{SITE.phone}</a></li>
            <li><a href={`mailto:${SITE.email}`} className="hover:text-amber">{SITE.email}</a></li>
            <li>{SITE.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-6 text-sm text-white/55 sm:px-8">© {new Date().getFullYear()} {SITE.legal}. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
