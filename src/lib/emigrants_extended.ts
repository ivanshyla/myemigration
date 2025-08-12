export type ExilePeriod = {
  startYear: number;
  endYear: number | null; // null = open-ended
  locations: string[]; // countries or cities
};

export type ExtendedEmigrantProfile = {
  id: string;
  name: string;
  slug: string;
  birthYear?: number;
  deathYear?: number;
  exilePeriods: ExilePeriod[];
  livedIn: string[]; // summary of countries/regions in exile
  activitiesInExile: string; // what they did
  reasonForExile: string; // why they left
  returned: boolean;
  outcome: string; // what happened if returned or if not returned
  sourceUrls: string[];
};

import data from "./data/emigrants_pre2020.json";

export const EXTENDED_PROFILES: ExtendedEmigrantProfile[] = data as ExtendedEmigrantProfile[];


