// Coordonnées S2ME — téléphone et e-mail confirmés sur leur page Facebook,
// WhatsApp confirmé par le client (numéro personnel du gérant)
export const SITE = {
  name: "S2ME",
  legal: "Ste Montassar Énergie",
  phone: "+216 53 107 208",
  phoneHref: "tel:+21653107208",
  whatsapp: "21627200480", // format international sans « + » — WhatsApp du gérant
  email: "omontassar38@gmail.com",
  address: ["Jbeniana", "3056 Sfax, Tunisie"],
  hours: "Ouvert en permanence",
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
