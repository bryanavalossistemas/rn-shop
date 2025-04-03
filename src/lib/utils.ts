import type { Product } from "@/schemas/products";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(productName: Product["name"], id: Product["id"]) {
  const slug = productName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Elimina caracteres especiales excepto espacios y guiones
    .replace(/\s+/g, "-") // Reemplaza espacios por guiones
    .replace(/-+/g, "-") // Evita múltiples guiones seguidos
    .trim(); // Elimina espacios extra

  return `${slug}-${id}`;
}

export function extractIdFromSlug(slug: string) {
  const match = slug.match(/-(\d+)$/); // Busca un número al final del slug
  return match ? parseInt(match[1], 10) : null; // Convierte a número o devuelve null si no hay coincidencia
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(currency);
}
