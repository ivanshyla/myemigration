export type EmigrantProfile = {
  id: string;
  name: string;
  slug: string;
  portraitEmoji?: string;
  startYear?: number;
  endYear?: number | null; // null = still in exile
  durationDaysEstimate?: number; // if exact years are unknown
  returned: boolean;
  blurb: string;
  sourceUrl?: string;
};

// NOTE: The entries below are simplified and approximate, intended for a playful match, not strict biography.
// Provide sources where convenient and keep text neutral.
export const EMIGRANTS: EmigrantProfile[] = [
  {
    id: "yakub-kolas",
    name: "Якуб Колас",
    slug: "yakub-kolas",
    portraitEmoji: "📚",
    // Known period of forced exile away from homeland (~1908–1911)
    startYear: 1908,
    endYear: 1911,
    returned: true,
    blurb:
      "Ты ў эміграцыі прыкладна, як Якуб Колас у пачатку ХХ стагодзьдзя. Ён вярнуўся і стаў адным з галоўных пісьменьнікаў Беларусі.",
    sourceUrl: "https://be.wikipedia.org/wiki/%D0%AF%D0%BA%D1%83%D0%B1_%D0%9A%D0%BE%D0%BB%D0%B0%D1%81",
  },
  {
    id: "svetlana-alexievich",
    name: "Святлана Алексіевіч",
    slug: "svetlana-alexievich",
    portraitEmoji: "🎖️",
    // Жыла па-за Беларуссю працяглы час; вярталася і зʼязджала. Бярэм доўгі адрэзак як прыблізны арыенцір.
    // Арыентыровачна 2000–2011 (з паўторнымі адʼездамі пасля 2020).
    startYear: 2000,
    endYear: 2011,
    returned: true,
    blurb:
      "Твая дарога нагадвае Святлану Алексіевіч: доўгі шлях па-за домам і вялікія тэксты пра нашу памяць.",
    sourceUrl: "https://be.wikipedia.org/wiki/%D0%A1%D0%B2%D1%8F%D1%82%D0%BB%D0%B0%D0%BD%D0%B0_%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D1%96%D0%B5%D0%B2%D1%96%D1%87",
  },
  {
    id: "zianon-pazniak",
    name: "Зянон Пазьняк",
    slug: "zianon-pazniak",
    portraitEmoji: "🚶",
    startYear: 1996,
    endYear: null, // у эміграцыі многія гады
    durationDaysEstimate: (2025 - 1996) * 365, // грубая ацэнка на сёння
    returned: false,
    blurb:
      "Па працягласці гэта блізка да Зянона Пазьняка — доўгая эміграцыя і пасьлядоўная пазіцыя.",
    sourceUrl: "https://be.wikipedia.org/wiki/%D0%97%D1%8F%D0%BD%D0%BE%D0%BD_%D0%9F%D0%B0%D0%B7%D1%8C%D0%BD%D1%8F%D0%BA",
  },
];

// Extend with external JSON seed if present
import seed from "./emigrants.data.json";
export const ALL_EMIGRANTS: EmigrantProfile[] = [
  ...EMIGRANTS,
  ...seed,
];

export function estimateDurationDays(profile: EmigrantProfile): number {
  if (typeof profile.durationDaysEstimate === "number") {
    return profile.durationDaysEstimate;
  }
  if (profile.startYear && (profile.endYear || profile.endYear === 0)) {
    const years = (profile.endYear ?? new Date().getFullYear()) - profile.startYear;
    return Math.max(0, Math.round(years * 365.25));
  }
  return 0;
}

export function findNearestByDays(daysInExile: number): EmigrantProfile {
  const pool = ALL_EMIGRANTS.length ? ALL_EMIGRANTS : EMIGRANTS;
  let best: EmigrantProfile = pool[0];
  let bestDiff = Number.POSITIVE_INFINITY;
  for (const profile of pool) {
    const d = Math.abs(estimateDurationDays(profile) - daysInExile);
    if (d < bestDiff) {
      best = profile;
      bestDiff = d;
    }
  }
  return best;
}


