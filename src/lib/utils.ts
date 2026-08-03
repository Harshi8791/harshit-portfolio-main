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

/** Prefilled "Hire me" mail draft so a visitor lands in a ready-to-send email. */
export function hireMailto(email: string, name: string) {
  const subject = `Opportunity for ${name} — Gen AI / ML Engineer`;
  const body = [
    `Hi ${name.split(" ")[0]},`,
    "",
    "I came across your portfolio and I'd like to talk about an opportunity.",
    "",
    "Company / Team:",
    "Role:",
    "Engagement type (full-time / internship / freelance):",
    "Timeline:",
    "",
    "Looking forward to hearing from you.",
    "",
    "Best regards,",
  ].join("\n");
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
