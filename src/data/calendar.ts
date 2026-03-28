// Sanity-ready interface for race calendar
export interface RaceImage {
  _key: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface RaceEvent {
  _id: string;
  _type: "raceEvent";
  slug: { current: string };
  name: string;
  location: string;
  dateStart: string; // ISO 8601 date string
  dateEnd?: string;
  description: string;
  eventType: "slalom" | "hillclimb" | "testday";
  season: number;
  image?: {
    url: string;
    alt: string;
  };
  gallery?: RaceImage[];
  status: "completed" | "live" | "upcoming" | "cancelled";
  result?: {
    position: number;
    time: string;
    isRecord?: boolean;
    category?: string;
  };
  trackInfo?: {
    length: string;
    elevation?: string;
    corners?: number;
  };
  details?: {
    registration?: string; // URL or deadline
    startTime?: string;
    organizer?: string;
    website?: string;
  };
}

// 2024 Season (archive)
export const raceEvents2024: RaceEvent[] = [
  {
    _id: "race-2024-001",
    _type: "raceEvent",
    slug: { current: "st-ursanne-2024" },
    name: "St-Ursanne - Les Rangiers",
    location: "Jura, Schweiz",
    dateStart: "2024-08-17",
    dateEnd: "2024-08-18",
    description: "Das schnellste Bergrennen Europas. Highspeed und hohe Einsätze.",
    eventType: "hillclimb",
    season: 2024,
    image: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAmARYLB7gf-ZFDIIiNPPmkgXA1UFIdn0DnWQPt7vZSZIlidRcaE9jx0ZuVhe5rvRcypAT_0WuSEuAyChz1sNz3OMvyAI1mhx9KFy7syT0meBbbw0PnU0ayHQZloEOi6dXvjO8hJyf_NJbrHliiqfN6_wYGYNhwDlQ_wVP9GKfRgcThT6Zphrc_18uwSeUXTbRY289Md7uNpFHaV0gOPgEqn26dAAi53zIc5zpwQvzv_HLNxFw7yv0KOjoNWZDevq0bo73B-Mq2vM1",
      alt: "Forest road race track",
    },
    status: "completed",
    result: {
      position: 1,
      time: "1:43.25",
      isRecord: true,
    },
    trackInfo: {
      length: "5.1 km",
      elevation: "420 m",
      corners: 24,
    },
  },
  {
    _id: "race-2024-002",
    _type: "raceEvent",
    slug: { current: "gurnigel-2024" },
    name: "Gurnigel Bergrennen",
    location: "Bern, Schweiz",
    dateStart: "2024-09-07",
    dateEnd: "2024-09-08",
    description: "Technische Kurven und begeisterte Zuschauer. Das Saisonhighlight.",
    eventType: "hillclimb",
    season: 2024,
    image: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6DyjWnJJko9DHZOqCTlrs5folK73PtbfVPmgc8COi71LHSbyC75g4Y4JE40U4Vq2POcaozojFlItpIZ4GvcQUi4UH8PYqYCIMjFWx2Hh-lsk0PLfb-v67OBewtiWxQ71KcMexfwXhgo8iqehGC6nAISiih4VAJ4CEfrHdhvuFRe-F98wQwwGQfvXiHOI1WmXb9T3mRWVJZL_CP6roGrge8GqMwVnnC7yQG7F1G2j-cgwJzfmG1bDTjWtqdyIlD1MiBaCD4Xdhok0u",
      alt: "Mountain pass race track",
    },
    status: "completed",
    trackInfo: {
      length: "4.2 km",
      elevation: "380 m",
      corners: 18,
    },
  },
  {
    _id: "race-2024-003",
    _type: "raceEvent",
    slug: { current: "les-paccots-2024" },
    name: "Les Paccots",
    location: "Fribourg, Schweiz",
    dateStart: "2024-09-15",
    description: "Saisonfinale. Meisterschaftsentscheidung.",
    eventType: "hillclimb",
    season: 2024,
    status: "completed",
    trackInfo: {
      length: "3.8 km",
      elevation: "310 m",
      corners: 15,
    },
  },
];

// 2026 Season
export const raceEvents2026: RaceEvent[] = [
  {
    _id: "race-2026-001",
    _type: "raceEvent",
    slug: { current: "ambri-testtag-2026" },
    name: "Slalom Testtag Ambri",
    location: "Ambri, Tessin",
    dateStart: "2026-03-27",
    description: "Offizieller Testtag zur Saisonvorbereitung.",
    eventType: "testday",
    season: 2026,
    status: "upcoming",
  },
  {
    _id: "race-2026-002",
    _type: "raceEvent",
    slug: { current: "slalom-romont-2026" },
    name: "Slalom Romont",
    location: "Romont, Fribourg",
    dateStart: "2026-04-05",
    description: "Saisonauftakt der Slalom-Serie.",
    eventType: "slalom",
    season: 2026,
    status: "cancelled",
  },
  {
    _id: "race-2026-003",
    _type: "raceEvent",
    slug: { current: "slalom-frauenfeld-2026" },
    name: "Slalom Frauenfeld",
    location: "Frauenfeld, Thurgau",
    dateStart: "2026-04-19",
    description: "Traditionsreicher Slalom im Herzen der Ostschweiz.",
    eventType: "slalom",
    season: 2026,
    status: "upcoming",
  },
  {
    _id: "race-2026-004",
    _type: "raceEvent",
    slug: { current: "slalom-de-bure-2026" },
    name: "Slalom de Bure",
    location: "Bure, Jura",
    dateStart: "2026-05-17",
    description: "Anspruchsvoller Slalom auf dem Gelände des Waffenplatzes.",
    eventType: "slalom",
    season: 2026,
    status: "upcoming",
  },
  {
    _id: "race-2026-005",
    _type: "raceEvent",
    slug: { current: "la-roche-la-berra-2026" },
    name: "La Roche – La Berra",
    location: "La Berra, Fribourg",
    dateStart: "2026-06-13",
    dateEnd: "2026-06-14",
    description: "Bergrennen durch die malerische Freiburger Voralpenlandschaft.",
    eventType: "hillclimb",
    season: 2026,
    status: "upcoming",
  },
  {
    _id: "race-2026-006",
    _type: "raceEvent",
    slug: { current: "reitnau-2026" },
    name: "Bergrennen Reitnau",
    location: "Reitnau, Aargau",
    dateStart: "2026-06-28",
    description: "Kompaktes Bergrennen mit spektakulären Passagen.",
    eventType: "hillclimb",
    season: 2026,
    status: "upcoming",
  },
  {
    _id: "race-2026-007",
    _type: "raceEvent",
    slug: { current: "ayent-anzere-2026" },
    name: "Ayent – Anzère",
    location: "Anzère, Wallis",
    dateStart: "2026-07-25",
    dateEnd: "2026-07-26",
    description: "Hochalpines Bergrennen mit atemberaubendem Panorama.",
    eventType: "hillclimb",
    season: 2026,
    status: "upcoming",
  },
  {
    _id: "race-2026-008",
    _type: "raceEvent",
    slug: { current: "st-ursanne-les-rangiers-2026" },
    name: "St.Ursanne – Les Rangiers",
    location: "Les Rangiers, Jura",
    dateStart: "2026-08-14",
    dateEnd: "2026-08-16",
    description: "Das legendäre Bergrennen Europas. Drei Tage Motorsport pur.",
    eventType: "hillclimb",
    season: 2026,
    status: "upcoming",
  },
  {
    _id: "race-2026-009",
    _type: "raceEvent",
    slug: { current: "oberhallau-2026" },
    name: "Bergrennen Oberhallau",
    location: "Oberhallau, Schaffhausen",
    dateStart: "2026-08-29",
    dateEnd: "2026-08-30",
    description: "Technisch anspruchsvolle Strecke im Klettgau.",
    eventType: "hillclimb",
    season: 2026,
    status: "upcoming",
  },
  {
    _id: "race-2026-010",
    _type: "raceEvent",
    slug: { current: "gurnigel-2026" },
    name: "Bergrennen Gurnigel",
    location: "Gurnigel, Bern",
    dateStart: "2026-09-12",
    dateEnd: "2026-09-13",
    description: "Das Saisonhighlight im Berner Oberland.",
    eventType: "hillclimb",
    season: 2026,
    status: "upcoming",
  },
  {
    _id: "race-2026-011",
    _type: "raceEvent",
    slug: { current: "chatel-st-denis-les-paccots-2026" },
    name: "Châtel-St-Denis – Les Paccots",
    location: "Les Paccots, Fribourg",
    dateStart: "2026-09-19",
    dateEnd: "2026-09-20",
    description: "Saisonfinale in der Freiburger Berglandschaft.",
    eventType: "hillclimb",
    season: 2026,
    status: "upcoming",
  },
];

// Combined events for display (default: current season)
export const raceEvents: RaceEvent[] = raceEvents2026;

// Helper to get events by season
export function getEventsBySeason(season: number): RaceEvent[] {
  const allEvents = [...raceEvents2024, ...raceEvents2026];
  return allEvents.filter((event) => event.season === season);
}

// Helper to get events by type
export function getEventsByType(type: RaceEvent["eventType"]): RaceEvent[] {
  const allEvents = [...raceEvents2024, ...raceEvents2026];
  return allEvents.filter((event) => event.eventType === type);
}

export function formatRaceDate(start: string, end?: string): string {
  const startDate = new Date(start);
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };

  if (end) {
    const endDate = new Date(end);
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDate.getDate()}.–${endDate.getDate()}. ${startDate.toLocaleDateString("de-CH", { month: "long" })} ${startDate.getFullYear()}`;
    }
    return `${startDate.toLocaleDateString("de-CH", options)} – ${endDate.toLocaleDateString("de-CH", options)}`;
  }

  return startDate.toLocaleDateString("de-CH", options);
}

export function formatRaceDateShort(start: string, end?: string): string {
  const startDate = new Date(start);

  if (end) {
    const endDate = new Date(end);
    return `${startDate.getDate()}.–${endDate.getDate()}. ${startDate.toLocaleDateString("de-CH", { month: "short" }).toUpperCase()} ${startDate.getFullYear()}`;
  }

  return startDate.toLocaleDateString("de-CH", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();
}

// Event type labels in German
export function getEventTypeLabel(type: RaceEvent["eventType"]): string {
  const labels: Record<RaceEvent["eventType"], string> = {
    slalom: "Slalom",
    hillclimb: "Bergrennen",
    testday: "Testtag",
  };
  return labels[type];
}
