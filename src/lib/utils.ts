import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const base =
  "inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-full font-semibold text-[15px] leading-tight cursor-pointer select-none transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-out active:scale-[.98]";

// Texte nuit sur orange : contraste AA (le blanc sur orange ne passe pas)
export const btn = {
  sun: cn(base, "bg-linear-to-r from-amber to-sun text-night shadow-[0_10px_30px_-10px_rgb(242_106_27/.75)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgb(242_106_27/.95)]"),
  glass: cn(base, "border border-white/25 bg-white/5 text-white backdrop-blur-md hover:bg-white/12 hover:border-white/40"),
  outline: cn(base, "border-2 border-indigo text-indigo hover:bg-indigo hover:text-white"),
  dark: cn(base, "bg-indigo text-white hover:bg-violet"),
};

export const fmtNumber = (n: number, digits = 0) =>
  new Intl.NumberFormat("fr-FR", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
