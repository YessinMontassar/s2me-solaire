import { useState } from "react";
import { MotionConfig } from "motion/react";
import { MessageCircle } from "lucide-react";
import { Navbar } from "@/sections/Navbar";
import { Hero } from "@/sections/Hero";
import { Stats } from "@/sections/Stats";
import { Solutions } from "@/sections/Solutions";
import { Simulator } from "@/sections/Simulator";
import { Process } from "@/sections/Process";
import { Examples } from "@/sections/Examples";
import { Faq } from "@/sections/Faq";
import { Contact } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";
import { whatsappLink } from "@/lib/site";

export default function App() {
  // Le simulateur pré-remplit le message du formulaire de contact
  const [prefill, setPrefill] = useState("");

  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main id="contenu">
        <Hero />
        <Stats />
        <Solutions />
        <Simulator onRequest={setPrefill} />
        <Process />
        <Examples />
        <Faq />
        <Contact prefill={prefill} />
      </main>
      <div className="h-24" />
      <Footer />

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nous écrire sur WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgb(37_211_102/.7)] transition-transform hover:scale-105"
      >
        <MessageCircle className="size-7" aria-hidden />
      </a>
    </MotionConfig>
  );
}
