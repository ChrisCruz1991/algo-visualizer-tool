import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomArray(size: number, min = 5, max = 100): number[] {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

export function parseManualInput(raw: string): number[] {
  return raw
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n > 0 && n <= 999);
}
