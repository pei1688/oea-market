import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// 生成隨機 4 位數字
export function generateInventoryNumber(): string {
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `OEA-${random}`;
}

export function recentlyUpdated(updatedAt?: string, minutes = 5) {
  if (!updatedAt) return false;

  const diffMs = Date.now() - new Date(updatedAt).getTime();
  return diffMs <= minutes * 60 * 1000;
}
