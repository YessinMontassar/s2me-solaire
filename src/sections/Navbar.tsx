import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NAV } from "@/lib/site";
import { btn, cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lien actif selon la section visible
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => { const el = document.querySelector(n.href); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        solid ? "border-b border-line/70 bg-white/85 shadow-[0_8px_30px_-20px_rgb(36_26_107/.4)] backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <a href="#contenu" className="absolute -top-20 left-4 z-50 rounded-lg bg-indigo px-4 py-2 text-white focus:top-3">Aller au contenu</a>
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#" className="group rounded-lg" aria-label="S2ME, retour en haut de page">
          <Logo light={!solid} />
        </a>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              aria-current={active === n.href ? "true" : undefined}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors",
                solid ? "text-ink hover:text-violet" : "text-white/85 hover:text-white",
              )}
            >
              {active === n.href && (
                <motion.span
                  layoutId="nav-pill"
                  className={cn("absolute inset-0 -z-10 rounded-full", solid ? "bg-violet/10" : "bg-white/12")}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#contact" className={cn(btn.sun, "hidden min-h-11 px-5 sm:inline-flex")}>Demander une étude</a>
          <button
            type="button"
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full border transition-colors lg:hidden",
              solid ? "border-line text-indigo" : "border-white/30 text-white",
            )}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-mobile"
            aria-label="Navigation mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25 }}
            className="border-t border-line bg-white px-5 pb-6 pt-2 lg:hidden"
          >
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block border-b border-line py-3.5 text-lg font-medium text-ink">
                {n.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className={cn(btn.sun, "mt-5 w-full")}>Demander une étude</a>
          </motion.nav>
        )}
      </AnimatePresence>

      <motion.div aria-hidden className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-linear-to-r from-amber to-sun" style={{ scaleX: progress }} />
    </header>
  );
}
