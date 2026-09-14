// Photographies libres de droits (licence Unsplash), téléchargées dans public/images.
// Ce sont des photos d'illustration : elles montrent du matériel et des chantiers réels,
// mais ce ne sont pas des réalisations S2ME. Voir public/images/CREDITS.md pour les crédits.

export type PhotoKey =
  | "heroToit"
  | "maisonToiture"
  | "entrepriseToiture"
  | "pompageChamp"
  | "maintenanceNettoyage"
  | "raccordementCablage"
  | "suiviOnduleur"
  | "poseTechniciens"
  | "posePanneauToit"
  | "villaTerrasse"
  | "oliveraie"
  | "atelierToiture"
  | "maisonTuiles"
  | "hotelCentrale"
  | "serreMaraichere"
  | "commercePanneaux"
  | "irrigationEau";

export type Photo = {
  /** Nom de base du fichier dans public/images */
  file: string;
  /** Les deux largeurs disponibles, la plus petite en premier */
  widths: [number, number];
  /** Dimensions intrinsèques de la petite variante, pour réserver la place */
  w: number;
  h: number;
  /** Texte alternatif en français */
  alt: string;
  /** Couleur moyenne : affichée sous l'image pendant le chargement */
  tone: string;
};

export const PHOTOS: Record<PhotoKey, Photo> = {
  heroToit: {
    file: "hero-toit-coucher-soleil", widths: [1280, 2000], w: 1280, h: 866, tone: "#6c6458",
    alt: "Rangées de panneaux photovoltaïques sur une toiture, au coucher du soleil",
  },
  maisonToiture: {
    file: "maison-toiture", widths: [640, 1280], w: 640, h: 360, tone: "#818e9f",
    alt: "Maison individuelle dont la toiture inclinée est couverte de panneaux solaires",
  },
  entrepriseToiture: {
    file: "entreprise-toiture", widths: [640, 1280], w: 640, h: 432, tone: "#86847a",
    alt: "Vue aérienne d’un bâtiment industriel dont toute la toiture est couverte de panneaux",
  },
  pompageChamp: {
    file: "pompage-champ", widths: [640, 1280], w: 640, h: 412, tone: "#718188",
    alt: "Panneaux solaires posés au sol en bordure d’une parcelle agricole",
  },
  maintenanceNettoyage: {
    file: "maintenance-nettoyage", widths: [640, 1280], w: 640, h: 427, tone: "#5c6a82",
    alt: "Nettoyage de modules photovoltaïques à la brosse à manche télescopique",
  },
  raccordementCablage: {
    file: "raccordement-cablage", widths: [640, 1280], w: 640, h: 427, tone: "#747a84",
    alt: "Connecteurs et câblage de panneaux solaires sur une toiture-terrasse",
  },
  suiviOnduleur: {
    file: "suivi-onduleur", widths: [640, 1280], w: 640, h: 480, tone: "#8f8e8d",
    alt: "Onduleur et coffrets de protection d’une installation solaire fixés au mur",
  },
  poseTechniciens: {
    file: "pose-techniciens", widths: [640, 1280], w: 640, h: 360, tone: "#53647b",
    alt: "Deux techniciens fixant un panneau solaire sur une toiture",
  },
  posePanneauToit: {
    file: "pose-panneau-toit", widths: [640, 1280], w: 640, h: 480, tone: "#456a94",
    alt: "Technicien portant un panneau solaire sur un toit, par ciel dégagé",
  },
  villaTerrasse: {
    file: "villa-terrasse", widths: [640, 1280], w: 640, h: 427, tone: "#4e6c9f",
    alt: "Panneaux solaires alignés sur un toit-terrasse",
  },
  oliveraie: {
    file: "oliveraie", widths: [640, 1280], w: 640, h: 342, tone: "#46483d",
    alt: "Oliviers dans un verger caillouteux baigné de soleil",
  },
  atelierToiture: {
    file: "atelier-toiture", widths: [640, 1280], w: 640, h: 376, tone: "#818691",
    alt: "Grande toiture plate entièrement couverte de panneaux photovoltaïques",
  },
  maisonTuiles: {
    file: "maison-tuiles", widths: [640, 1280], w: 640, h: 480, tone: "#826b5b",
    alt: "Panneaux solaires installés sur une toiture en tuiles",
  },
  hotelCentrale: {
    file: "hotel-centrale", widths: [640, 1280], w: 640, h: 427, tone: "#577ea5",
    alt: "Centrale photovoltaïque en toiture sous un ciel bleu",
  },
  serreMaraichere: {
    file: "serre-maraichere", widths: [640, 1280], w: 640, h: 428, tone: "#9fad8f",
    alt: "Rangées de plants sous une serre maraîchère",
  },
  commercePanneaux: {
    file: "commerce-panneaux", widths: [640, 1280], w: 640, h: 427, tone: "#473134",
    alt: "Rangées serrées de modules photovoltaïques sur une toiture",
  },
  irrigationEau: {
    file: "irrigation-eau", widths: [640, 1280], w: 640, h: 427, tone: "#737b5f",
    alt: "Jet d’eau d’irrigation arrosant une parcelle cultivée",
  },
};

export function photoSrc(p: Photo) {
  return `/images/${p.file}-${p.widths[0]}.webp`;
}

export function photoSrcSet(p: Photo) {
  return p.widths.map((w) => `/images/${p.file}-${w}.webp ${w}w`).join(", ");
}
