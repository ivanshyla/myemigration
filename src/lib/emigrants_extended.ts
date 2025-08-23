export type ExilePeriod = {
  startYear: number;
  endYear: number | null; // null = open-ended
  locations: string[]; // countries or cities
};

export type EmigrantTag =
  | "political"
  | "forced"
  | "war"
  | "study"
  | "sports"
  | "culture"
  | "science"
  | "religious"
  | "economic";

export type ExtendedEmigrantProfile = {
  id: string;
  name: string;
  slug: string;
  portraitUrl?: string;
  birthYear?: number;
  deathYear?: number;
  exilePeriods: ExilePeriod[];
  livedIn: string[]; // summary of countries/regions in exile
  activitiesInExile: string; // what they did
  reasonForExile: string; // why they left
  returned: boolean;
  outcome: string; // what happened if returned or if not returned
  sourceUrls: string[];
  tags?: EmigrantTag[];
};

import data from "./data/emigrants_pre2020.json";

export const EXTENDED_PROFILES: ExtendedEmigrantProfile[] = data as ExtendedEmigrantProfile[];

export type UserContext = {
  tags?: EmigrantTag[];
  locations?: string[]; // countries or cities
  reasonTag?: EmigrantTag;
  freeText?: string;
};

function normalizeToken(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zа-яёіўʼ’\-\s]/gi, "")
    .trim();
}

function textScore(hay: string, needleWords: string[]): number {
  if (!hay || needleWords.length === 0) return 0;
  const H = normalizeToken(hay);
  let score = 0;
  for (const w of needleWords) {
    if (w && H.includes(w)) score += 1;
  }
  return Math.min(score, 5);
}

export function findClosestExtendedProfile(user: UserContext, excludeSlug?: string): ExtendedEmigrantProfile | null {
  if (!EXTENDED_PROFILES.length) return null;
  const tags = new Set((user.tags || []).filter(Boolean));
  const locs = new Set((user.locations || []).map((l) => normalizeToken(l)));
  const reason = user.reasonTag;
  const words = (user.freeText || "")
    .split(/\s+/)
    .map((w) => normalizeToken(w))
    .filter((w) => w.length >= 3);

  let best: ExtendedEmigrantProfile | null = null;
  let bestScore = -Infinity;

  for (const p of EXTENDED_PROFILES) {
    // Пропускаем профиль, который нужно исключить
    if (excludeSlug && p.slug === excludeSlug) continue;
    
    let s = 0;
    // tags overlap
    const ptags = new Set((p.tags || []).filter(Boolean));
    for (const t of tags) if (ptags.has(t)) s += 3;

    // reason matches
    if (reason && ptags.has(reason)) s += 4;

    // location overlap
    const lived = new Set([...(p.livedIn || []), ...p.exilePeriods.flatMap((e) => e.locations || [])].map(normalizeToken));
    for (const l of locs) if (lived.has(l)) s += 2;

    // free text against activities/outcome
    s += textScore(`${p.activitiesInExile} ${p.outcome}`, words);

    if (s > bestScore) {
      bestScore = s;
      best = p;
    }
  }

  // Если нет совпадений, возвращаем случайный профиль (но не исключенный)
  if (!best) {
    const availableProfiles = EXTENDED_PROFILES.filter(p => !excludeSlug || p.slug !== excludeSlug);
    if (availableProfiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableProfiles.length);
      best = availableProfiles[randomIndex];
    }
  }

  return best;
}


