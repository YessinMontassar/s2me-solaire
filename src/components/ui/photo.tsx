import { PHOTOS, photoSrc, photoSrcSet, type PhotoKey } from "@/lib/photos";
import { cn } from "@/lib/utils";

type Props = {
  name: PhotoKey;
  /** Classes du cadre : format, coins, marges */
  className?: string;
  /** Classes de l'image elle-même (position du sujet, animation au survol) */
  imgClassName?: string;
  /** Voile dégradé indigo posé sur la photo, pour rester dans la palette de la marque */
  tint?: "none" | "soft" | "strong";
  /** Priorité de chargement : uniquement pour la photo visible d'emblée */
  priority?: boolean;
  /** Charge la photo sans attendre qu'elle entre dans le champ : pour le bandeau défilant,
   *  où l'arrivée d'une carte est trop rapide pour un chargement paresseux */
  eager?: boolean;
  sizes?: string;
  /** Texte de remplacement : par défaut celui du registre */
  alt?: string;
  /** Photo purement décorative, doublée par le texte voisin */
  decorative?: boolean;
  children?: React.ReactNode;
};

const TINT = {
  none: null,
  soft: "bg-linear-to-t from-night/55 via-night/10 to-transparent",
  strong: "bg-linear-to-t from-night/85 via-night/45 to-night/15",
} as const;

/** Photo réelle, chargée en WebP avec deux largeurs et un aplat de couleur pendant le chargement. */
export function Photo({
  name, className, imgClassName, tint = "soft", priority = false, eager = false,
  sizes = "(min-width: 1024px) 33vw, 100vw", alt, decorative = false, children,
}: Props) {
  const p = PHOTOS[name];
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ backgroundColor: p.tone }}>
      <img
        src={photoSrc(p)}
        srcSet={photoSrcSet(p)}
        sizes={sizes}
        width={p.w}
        height={p.h}
        alt={decorative ? "" : (alt ?? p.alt)}
        aria-hidden={decorative || undefined}
        loading={priority || eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={cn("size-full object-cover", imgClassName)}
      />
      {TINT[tint] && <div aria-hidden className={cn("absolute inset-0", TINT[tint])} />}
      {children}
    </div>
  );
}
