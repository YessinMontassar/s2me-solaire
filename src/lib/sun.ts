// Position du soleil au-dessus de Tunis — approximation astronomique (± 2 min), suffisante pour l'affichage
const TUNIS = { lat: 36.8065, lon: 10.1815, utcOffset: 1 }; // UTC+1, pas d'heure d'été
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export function tunisNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Tunis", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  const y = get("year"), m = get("month"), d = get("day");
  const dayOfYear = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 864e5);
  return { dayOfYear, minutes: get("hour") * 60 + get("minute") };
}

export function solarDay(dayOfYear: number) {
  const B = rad((360 / 365) * (dayOfYear - 81));
  const decl = rad(23.44) * Math.sin(B);
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); // minutes
  const noon = 720 + 4 * (15 * TUNIS.utcOffset - TUNIS.lon) - eot;
  const phi = rad(TUNIS.lat);
  const h0 = rad(-0.833); // réfraction + rayon du disque
  const cosW = (Math.sin(h0) - Math.sin(phi) * Math.sin(decl)) / (Math.cos(phi) * Math.cos(decl));
  const halfDay = deg(Math.acos(Math.max(-1, Math.min(1, cosW)))) * 4;
  return { decl, noon, sunrise: noon - halfDay, sunset: noon + halfDay };
}

export function elevation(minutes: number, sd: ReturnType<typeof solarDay>) {
  const phi = rad(TUNIS.lat);
  const w = rad((minutes - sd.noon) / 4);
  return deg(Math.asin(Math.sin(phi) * Math.sin(sd.decl) + Math.cos(phi) * Math.cos(sd.decl) * Math.cos(w)));
}

// Ensoleillement par ciel clair sur un panneau incliné à ~30° plein sud (W/m²), modèle de Meinel simplifié
export function clearSkyIrradiance(elevDeg: number) {
  if (elevDeg <= 0) return 0;
  const airMass = 1 / Math.sin(rad(elevDeg));
  const direct = 1353 * Math.pow(0.7, Math.pow(airMass, 0.678));
  return Math.min(1050, direct * Math.max(0, Math.sin(rad(elevDeg + 30))) * 1.1);
}

export const fmtTime = (min: number) => {
  const m = Math.round(min);
  return `${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}`;
};

export function sunSnapshot() {
  const { dayOfYear, minutes } = tunisNow();
  const sd = solarDay(dayOfYear);
  const isDay = minutes >= sd.sunrise && minutes <= sd.sunset;
  const elev = isDay ? Math.max(0, elevation(minutes, sd)) : 0;
  return {
    minutes,
    sunrise: sd.sunrise,
    sunset: sd.sunset,
    isDay,
    progress: isDay ? (minutes - sd.sunrise) / (sd.sunset - sd.sunrise) : 0,
    elev,
    irradiance: clearSkyIrradiance(elev),
  };
}
