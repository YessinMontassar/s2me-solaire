// À REMPLACER : coordonnées réelles de S2ME avant la mise en ligne
export const SITE = {
  name: "S2ME",
  legal: "Ste Montassar Énergie",
  phone: "+216 00 000 000",
  phoneHref: "tel:+21600000000",
  whatsapp: "21600000000", // format international sans « + »
  email: "contact@s2me.tn",
  address: ["[Rue et numéro]", "[Code postal] [Ville], Tunisie"],
  hours: "Lundi au samedi, 8h à 17h",
};

export const whatsappLink = (text = "Bonjour S2ME, je souhaite une étude pour une installation solaire.") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const NAV = [
  { href: "#solutions", label: "Solutions" },
  { href: "#simulateur", label: "Simulateur" },
  { href: "#demarche", label: "Démarche" },
  { href: "#exemples", label: "Exemples" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export const GOUVERNORATS = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", "Kairouan",
  "Kasserine", "Kébili", "Le Kef", "Mahdia", "La Manouba", "Médenine", "Monastir", "Nabeul",
  "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan",
];
