import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

export const storageBaseUrl = supabaseUrl
  ? `${supabaseUrl}/storage/v1/object/public/wedding/Main`
  : "";

export function storageUrl(path: string, fallback?: string) {
  const normalized = path.replace(/^\/+/, "");
  if (storageBaseUrl) return `${storageBaseUrl}/${normalized}`;
  return fallback ?? `/${normalized}`;
}
