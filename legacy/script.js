// ---------- Menu mobile ----------
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
  toggle.textContent = open ? "Fermer" : "Menu";
});
nav.addEventListener("click", (e) => {
  if (e.target.closest("a") && nav.classList.contains("is-open")) toggle.click();
});

document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Trajectoire du soleil au-dessus de Tunis ----------
const TUNIS = { lat: 36.8065, lon: 10.1815, utcOffset: 1 }; // Tunisie : UTC+1, pas d'heure d'été
const rad = (d) => (d * Math.PI) / 180;
const deg = (r) => (r * 180) / Math.PI;

function tunisNow() {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Tunis", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  const y = get("year"), m = get("month"), d = get("day");
  const dayOfYear = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 864e5);
  return { dayOfYear, minutes: get("hour") * 60 + get("minute") };
}

// Approximation astronomique suffisante pour l'affichage (± 2 min)
function solarDay(dayOfYear) {
  const B = rad((360 / 365) * (dayOfYear - 81));
  const decl = rad(23.44) * Math.sin(B);
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); // minutes
  const noon = 720 + 4 * (15 * TUNIS.utcOffset - TUNIS.lon) - eot; // midi solaire, minutes locales
  const phi = rad(TUNIS.lat);
  const h0 = rad(-0.833); // réfraction + rayon du disque
  const cosW = (Math.sin(h0) - Math.sin(phi) * Math.sin(decl)) / (Math.cos(phi) * Math.cos(decl));
  const halfDay = deg(Math.acos(Math.max(-1, Math.min(1, cosW)))) * 4; // minutes
  return { decl, noon, sunrise: noon - halfDay, sunset: noon + halfDay };
}

function elevation(minutes, sd) {
  const phi = rad(TUNIS.lat);
  const w = rad((minutes - sd.noon) / 4);
  return deg(Math.asin(Math.sin(phi) * Math.sin(sd.decl) + Math.cos(phi) * Math.cos(sd.decl) * Math.cos(w)));
}

const fmt = (min) => {
  const m = Math.round(min);
  return `${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}`;
};

const sunEl = document.getElementById("sun");
// Le masque révèle la partie déjà parcourue de l'arc orange (qui reste en pointillé)
const arcReveal = document.getElementById("arc-reveal");
const arcLen = arcReveal.getTotalLength();
arcReveal.style.strokeDasharray = `0 ${arcLen + 1}`;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Arc elliptique : centre (600, 310), rayons 540 × 280
function placeSun(t) {
  const a = Math.PI * (1 - t);
  const x = 600 + 540 * Math.cos(a);
  const y = 310 - 280 * Math.sin(a);
  sunEl.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  arcReveal.style.strokeDasharray = `${arcLen * t} ${arcLen + 1}`;
}

let current = 0;
function animateTo(target) {
  if (reduceMotion) { placeSun(target); current = target; return; }
  const from = current, start = performance.now(), dur = 2200;
  const step = (now) => {
    const k = Math.min(1, (now - start) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    placeSun(from + (target - from) * e);
    if (k < 1) requestAnimationFrame(step); else current = target;
  };
  requestAnimationFrame(step);
}

function updateSun(first = false) {
  const { dayOfYear, minutes } = tunisNow();
  const sd = solarDay(dayOfYear);
  document.getElementById("sunrise").textContent = `Lever ${fmt(sd.sunrise)}`;
  document.getElementById("sunset").textContent = `Coucher ${fmt(sd.sunset)}`;
  const status = document.getElementById("sun-status");
  const isDay = minutes >= sd.sunrise && minutes <= sd.sunset;

  if (isDay) {
    const t = (minutes - sd.sunrise) / (sd.sunset - sd.sunrise);
    const elev = Math.max(0, Math.round(elevation(minutes, sd)));
    status.textContent = `Il est ${fmt(minutes)} à Tunis : le soleil est à ${elev}° au-dessus de l’horizon.`;
    sunEl.classList.remove("is-night");
    first ? animateTo(t) : (placeSun(t), (current = t));
  } else {
    status.textContent = `Il est ${fmt(minutes)} à Tunis. Prochain lever du soleil à ${fmt(sd.sunrise)}.`;
    sunEl.classList.add("is-night");
    placeSun(0); // la nuit, l'arc reste entièrement violet
    current = 0;
  }
}
updateSun(true);
setInterval(updateSun, 60_000);

// ---------- Simulateur ----------
const PRICE_PER_KWH = 0.3;      // DT, moyenne indicative
const YIELD_PER_KWC = 1600;     // kWh/kWc/an en Tunisie
const PANEL_WC = 550;
const PANEL_AREA = 2.6;         // m² par panneau, espacement compris

const bill = document.getElementById("bill");
const nf = new Intl.NumberFormat("fr-FR");

function simulate() {
  const b = Number(bill.value);
  const annualKwh = (b / PRICE_PER_KWH) * 6;
  const kwc = Math.max(1, Math.ceil((annualKwh / YIELD_PER_KWC) * 2) / 2);
  const panels = Math.ceil((kwc * 1000) / PANEL_WC);
  document.getElementById("bill-out").textContent = `${nf.format(b)} DT`;
  document.getElementById("r-kwc").textContent = `${nf.format(kwc)} kWc`;
  document.getElementById("r-panels").textContent = `${panels} panneaux`;
  document.getElementById("r-area").textContent = `≈ ${nf.format(Math.ceil(panels * PANEL_AREA))} m²`;
  document.getElementById("r-prod").textContent = `${nf.format(Math.round(kwc * YIELD_PER_KWC / 10) * 10)} kWh`;
  const pct = ((b - bill.min) / (bill.max - bill.min)) * 100;
  bill.style.setProperty("--pct", `${pct}%`);
  simResult = { b, kwc, panels };
}
let simResult = null;
bill.addEventListener("input", simulate);
simulate();

// Le bouton du simulateur pré-remplit le formulaire
document.getElementById("sim-cta").addEventListener("click", () => {
  if (!simResult) return;
  const msg = document.getElementById("f-msg");
  if (!msg.value.trim()) {
    msg.value = `Facture STEG d’environ ${simResult.b} DT tous les deux mois. Le simulateur m’indique une installation d’environ ${simResult.kwc} kWc (${simResult.panels} panneaux).`;
  }
});

// ---------- Formulaire de contact ----------
const GOUVERNORATS = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", "Kairouan",
  "Kasserine", "Kébili", "Le Kef", "Mahdia", "La Manouba", "Médenine", "Monastir", "Nabeul",
  "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan",
];
const gov = document.getElementById("f-gov");
GOUVERNORATS.forEach((g) => gov.add(new Option(g, g)));

const form = document.getElementById("contact-form");
const errorEl = document.getElementById("form-error");
const doneEl = document.getElementById("form-done");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const missing = [];
  form.querySelectorAll("[required]").forEach((f) => {
    const bad = !f.value.trim();
    f.setAttribute("aria-invalid", bad);
    if (bad) missing.push(form.querySelector(`label[for="${f.id}"]`).textContent.toLowerCase());
  });
  if (missing.length) {
    errorEl.textContent = `Renseignez votre ${missing.join(", ")} pour que nous puissions vous rappeler.`;
    errorEl.hidden = false;
    doneEl.hidden = true;
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }
  errorEl.hidden = true;

  // Sans serveur : la demande est préparée dans la messagerie du visiteur.
  const d = new FormData(form);
  const body = [
    `Nom : ${d.get("name")}`,
    `Téléphone : ${d.get("phone")}`,
    `Gouvernorat : ${d.get("gouvernorat")}`,
    `Projet : ${d.get("type")}`,
    "",
    d.get("message") || "",
  ].join("\n");
  const subject = `Demande d’étude solaire : ${d.get("type")} (${d.get("gouvernorat")})`;
  window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  doneEl.hidden = false;
});
