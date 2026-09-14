import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";
import { ShinyText } from "@/components/ui/shiny-text";
import { GOUVERNORATS, SITE, whatsappLink } from "@/lib/site";
import { btn, cn } from "@/lib/utils";

const TYPES = ["Maison", "Entreprise ou industrie", "Pompage solaire agricole", "Entretien d’une installation existante"];

const field = "w-full min-h-12 rounded-xl border-[1.5px] border-line bg-chalk px-4 py-3 text-ink transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-violet focus:outline-none focus:ring-4 focus:ring-violet/15 aria-[invalid=true]:border-[#C0392B]";

export function Contact({ prefill }: { prefill: string }) {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { if (prefill) setMessage(prefill); }, [prefill]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const next = {
      name: !String(d.get("name") ?? "").trim(),
      phone: !String(d.get("phone") ?? "").trim(),
      gouvernorat: !String(d.get("gouvernorat") ?? ""),
    };
    setErrors(next);
    const firstBad = Object.entries(next).find(([, bad]) => bad);
    if (firstBad) {
      (formRef.current?.elements.namedItem(firstBad[0]) as HTMLElement | null)?.focus();
      return;
    }
    // Sans serveur : la demande est préparée dans la messagerie du visiteur
    const body = [
      `Nom : ${d.get("name")}`,
      `Téléphone : ${d.get("phone")}`,
      `Gouvernorat : ${d.get("gouvernorat")}`,
      `Projet : ${d.get("type")}`,
      "",
      message,
    ].join("\n");
    const subject = `Demande d’étude solaire : ${d.get("type")} (${d.get("gouvernorat")})`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDone(true);
  };

  const err = (k: string, text: string) =>
    errors[k] && <p id={`${k}-err`} className="text-sm font-medium text-[#B3261E]">{text}</p>;

  return (
    <section id="contact" className="relative isolate overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_100%_at_50%_0%,rgb(245_166_35/.16),transparent)]" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr]">
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-sun"><span className="h-px w-8 bg-current" aria-hidden /><ShinyText>Contact</ShinyText></p>
          <h2 className="text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.06] tracking-tight text-indigo">Parlons de votre projet</h2>
          <p className="mt-5 max-w-md text-lg text-muted">Décrivez-nous votre besoin : nous vous rappelons pour fixer une visite technique.</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={cn(btn.sun, "bg-none bg-[#25D366] text-[#0b3d1f] shadow-none hover:shadow-[0_14px_40px_-14px_rgb(37_211_102/.8)]")}>
                <MessageCircle className="size-5" aria-hidden /> Écrire sur WhatsApp
              </a>
            </Magnetic>
            <a href={SITE.phoneHref} className={btn.outline}><Phone className="size-4" aria-hidden /> {SITE.phone}</a>
          </div>

          <address className="mt-10 grid gap-4 not-italic sm:grid-cols-2">
            {[
              { icon: MapPin, title: "Adresse", body: <>{SITE.address[0]}<br />{SITE.address[1]}</> },
              { icon: Mail, title: "E-mail", body: <a className="underline decoration-sun underline-offset-4 hover:text-violet" href={`mailto:${SITE.email}`}>{SITE.email}</a> },
              { icon: Phone, title: "Téléphone", body: <a className="underline decoration-sun underline-offset-4 hover:text-violet" href={SITE.phoneHref}>{SITE.phone}</a> },
              { icon: Clock, title: "Horaires", body: SITE.hours },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-violet"><Icon className="size-5" aria-hidden /></span>
                <div>
                  <p className="text-sm font-semibold text-violet">{title}</p>
                  <div className="mt-0.5 text-ink">{body}</div>
                </div>
              </div>
            ))}
          </address>
        </Reveal>

        <Reveal delay={0.1}>
          <form ref={formRef} onSubmit={submit} noValidate className="grid gap-5 rounded-3xl border border-line bg-white p-6 shadow-[0_40px_100px_-50px_rgb(36_26_107/.5)] sm:p-9">
            <div className="grid gap-2">
              <label htmlFor="f-name" className="font-medium">Nom et prénom</label>
              <input id="f-name" name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
              {err("name", "Indiquez votre nom pour que nous puissions vous rappeler.")}
            </div>
            <div className="grid gap-2">
              <label htmlFor="f-phone" className="font-medium">Téléphone</label>
              <input id="f-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+216" className={field} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-err" : undefined} />
              {err("phone", "Indiquez un numéro où vous joindre.")}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid content-start gap-2">
                <label htmlFor="f-gov" className="font-medium">Gouvernorat</label>
                <select id="f-gov" name="gouvernorat" defaultValue="" className={field} aria-invalid={!!errors.gouvernorat} aria-describedby={errors.gouvernorat ? "gouvernorat-err" : undefined}>
                  <option value="" disabled>Choisir</option>
                  {GOUVERNORATS.map((g) => <option key={g}>{g}</option>)}
                </select>
                {err("gouvernorat", "Choisissez votre gouvernorat.")}
              </div>
              <div className="grid content-start gap-2">
                <label htmlFor="f-type" className="font-medium">Type de projet</label>
                <select id="f-type" name="type" className={field}>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="f-msg" className="font-medium">Votre message <span className="font-normal text-muted">(facultatif)</span></label>
              <textarea id="f-msg" name="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className={cn(field, "resize-y")} />
            </div>
            <button type="submit" className={cn(btn.sun, "w-full sm:w-auto sm:justify-self-start")}>
              Envoyer la demande <Send className="size-4" aria-hidden />
            </button>
            <AnimatePresence>
              {done && (
                <motion.p role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2 rounded-xl bg-[#E8F6EE] p-4 font-medium text-[#1E6B3F]">
                  <CircleCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
                  Demande préparée dans votre messagerie : envoyez l’e-mail pour nous la transmettre.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
