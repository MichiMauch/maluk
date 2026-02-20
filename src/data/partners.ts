// Sanity-ready interface for partners/sponsors
export interface Partner {
  _id: string;
  _type: "partner";
  slug: { current: string };
  name: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
  logo?: {
    url: string;
    alt: string;
  };
  website?: string;
  description?: string;
}

export const partners: Partner[] = [
  {
    _id: "partner-001",
    _type: "partner",
    slug: { current: "braichet" },
    name: "F. Braichet & Cie",
    tier: "platinum",
    logo: {
      url: "/images/sponsors/braichet.png",
      alt: "F. Braichet & Cie - Lubrifiants Porrentruy",
    },
    description: "Schmierstoffe und Motorenöle",
  },
  {
    _id: "partner-002",
    _type: "partner",
    slug: { current: "bewa-technik" },
    name: "BEWA-Technik",
    tier: "gold",
    logo: {
      url: "/images/sponsors/bewa-technik.png",
      alt: "BEWA-Technik",
    },
    description: "Technische Lösungen",
  },
  {
    _id: "partner-003",
    _type: "partner",
    slug: { current: "hess-uhren" },
    name: "Hess Uhren Luzern",
    tier: "gold",
    logo: {
      url: "/images/sponsors/hess-uhren.png",
      alt: "Hess Uhren Luzern",
    },
    description: "Uhren und Schmuck",
  },
  {
    _id: "partner-004",
    _type: "partner",
    slug: { current: "garage-friedli" },
    name: "Garage Friedli AG",
    tier: "silver",
    logo: {
      url: "/images/sponsors/garage-friedli.svg",
      alt: "Garage Friedli AG Bottenwil",
    },
    website: "https://www.garagefriedli.ch/",
    description: "Autohaus Bottenwil",
  },
  {
    _id: "partner-005",
    _type: "partner",
    slug: { current: "schorno" },
    name: "Schorno",
    tier: "silver",
    logo: {
      url: "/images/sponsors/schorno.avif",
      alt: "Schorno",
    },
  },
  {
    _id: "partner-006",
    _type: "partner",
    slug: { current: "mueller-baustoffe" },
    name: "Müller Baustoffe",
    tier: "silver",
    logo: {
      url: "/images/sponsors/mueller-baustoffe.svg",
      alt: "Müller Baustoffe Erlangen - mt-baustoffe.ch",
    },
    website: "https://www.mt-baustoffe.ch/home",
    description: "Baustoffe",
  },
  {
    _id: "partner-007",
    _type: "partner",
    slug: { current: "leuko" },
    name: "Leuko",
    tier: "silver",
    logo: {
      url: "/images/sponsors/leuko.png",
      alt: "Leuko",
    },
  },
  {
    _id: "partner-008",
    _type: "partner",
    slug: { current: "huwyler-klima" },
    name: "Huwyler Klima",
    tier: "bronze",
    logo: {
      url: "/images/sponsors/huwyler-klima.png",
      alt: "Huwyler Klima - Kälte und Klimatechnik",
    },
    description: "Kälte- und Klimatechnik",
  },
  {
    _id: "partner-009",
    _type: "partner",
    slug: { current: "marti" },
    name: "Marti",
    tier: "silver",
    logo: {
      url: "/images/sponsors/marti.png",
      alt: "Marti",
    },
  },
];

export const club100Stats = {
  goalPercentage: 82,
  memberCount: 47,
  benefits: [
    { icon: "badge", label: "Zutritt zum Fahrerlager" },
    { icon: "local_bar", label: "Getränke" },
    { icon: "newspaper", label: "Exklusive News" },
    { icon: "directions_walk", label: "Führung durchs Fahrerlager" },
  ],
};
