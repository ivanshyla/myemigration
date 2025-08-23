import { EmigrantProfile, findNearestByDays } from "@/lib/emigrants";
import { EXTENDED_PROFILES } from "@/lib/emigrants_extended";

function formatNumber(n: number): string {
  // Простое форматирование с пробелами каждые 3 цифры
  return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function pluralDays(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "дзень";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дні";
  return "дзён";
}

export function differenceInDays(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function buildMessage(startDate: Date, nearestOverride?: EmigrantProfile, userDays?: number) {
  const days = userDays ?? differenceInDays(startDate, new Date());
  const nearest = nearestOverride ?? findNearestByDays(days);
  const daysStr = `${formatNumber(days)} ${pluralDays(days)}`;
  const text = `Я ў эміграцыі ${daysStr}, гэта прыблізна як ${nearest.name}.`;
  // Используем только короткое описание (blurb) без расширенной информации
  const sub = `${nearest.blurb}`.trim();
  const params = new URLSearchParams({ q: text, sub });
  // portraits optional; skip if not defined in profile type
  const og = `/api/og?${params.toString()}`;
  const ig = `/api/ig?${params.toString()}`;
  return { days, nearest, text, sub, og, ig };
}


