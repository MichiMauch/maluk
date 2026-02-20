// Sanity-ready interface with unique IDs, slugs, and ISO date strings
export interface NewsArticle {
  _id: string;
  _type: "newsArticle";
  slug: { current: string };
  title: string;
  excerpt: string;
  category: "race-result" | "tech" | "team" | "announcement";
  tag?: string;
  publishedAt: string; // ISO 8601 date string
  image: {
    url: string;
    alt: string;
  };
  featured?: boolean;
  liveStatus?: {
    isLive: boolean;
    label: string;
    progress?: number;
  };
  techSpecs?: {
    label: string;
    value: string;
  }[];
}

export const newsArticles: NewsArticle[] = [
  {
    _id: "news-001",
    _type: "newsArticle",
    slug: { current: "st-ursanne-record-2024" },
    title: "Dominance at St-Ursanne: New Course Record Shattered",
    excerpt: "Clocking a blistering 1:43.25 under mixed conditions, the team secured P1 and rewrote the history books for the 3rd consecutive year.",
    category: "race-result",
    tag: "Record Broken",
    publishedAt: "2024-08-18T14:30:00Z",
    image: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjUKMCRO2e1InIoYD_FUxcH-eeKR6BGFxyLbZtAy8ldGVj_PqRO61bhZu9v9JMJ97Ji5nRh19nX6sfRzga4vV5IHNURFlX2alvNJldGXP0TFNXw20uyJ1THdhtq7SgadvxknwAMIjYzmb5I_DytuLrjkkw02uKAi4R0qqP8lhLLA6Y9i3_LLKS8JTNlx6cGuNhpd82aIk3WPwTRTlTot6PJFppyB5-Cylm97Uy_ScsT1m9ZOIqs8wzmGpUFcoLOEdxIbKUN7WjDypb",
      alt: "Racing car taking a sharp corner on a mountain road",
    },
    featured: true,
  },
  {
    _id: "news-002",
    _type: "newsArticle",
    slug: { current: "aero-package-upgrade" },
    title: "Aero Package Upgrade",
    excerpt: "New front splitter configuration tested successfully in wind tunnel simulations.",
    category: "tech",
    publishedAt: "2024-08-15T10:00:00Z",
    image: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8sSQua_6bOMWPhasCJabTD5YL0uGVlohlCrE5QLmzDmGvLpbnEhBTlRpw-mg54Tr9VIl1pzihL4tx0Hc5VRGWHnvcSCjSUeTjO08-XGrYrv9L9ljAj4aT_jaWLHzdZDj8j7kH5CxB-gKRq_4TcM9MGJ3XlctgJfl86Lfjc5omx7DdyP-YZM5aCl_UHWlOBy6c4efn9PmiYVJwFVHrlPm1ea8MMbFNyNelhfoWrd0nwkcutAi3svK0f15pGDI63Wku84JrEzbtazVd",
      alt: "Close up of carbon fiber car parts",
    },
  },
  {
    _id: "news-003",
    _type: "newsArticle",
    slug: { current: "gurnigel-preparation" },
    title: "Gurnigel Preparation",
    excerpt: "Final setup adjustments before the season highlight.",
    category: "team",
    publishedAt: "2024-09-01T08:00:00Z",
    image: {
      url: "",
      alt: "",
    },
    liveStatus: {
      isLive: true,
      label: "Live Status",
      progress: 85,
    },
    techSpecs: [
      { label: "Engine Map", value: "Stage 3" },
      { label: "Tires", value: "Soft Compound" },
    ],
  },
];

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} HRS AGO`;
  if (diffInDays < 7) return `${diffInDays} DAYS AGO`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
