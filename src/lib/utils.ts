import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Makes a user-entered profile link safe to use in href (adds https:// when missing). */
export function toExternalUrl(value: string) {
  const v = (value || "").trim();
  if (!v) return "#";
  if (/^https?:\/\//i.test(v)) return v;
  if (/^(mailto:|tel:)/i.test(v)) return v;
  return `https://${v.replace(/^\/+/, "")}`;
}
