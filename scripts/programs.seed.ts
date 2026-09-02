import type { ObjectId } from "mongodb";

export const PROGRAM_CATEGORIES = [
  "Teledrama",
  "News",
  "Lifestyle",
  "Interactive",
  "Kids",
  "Religious",
  "Entertainment",
  "Talk Show",
  "Sports",
  "Gaming",
  "Reality",
  "Arts",
  "Movie",
] as const;
export type ProgramCategory = (typeof PROGRAM_CATEGORIES)[number];

// NOTE: not defined in the source file you shared — assumed to be full
// day names. Adjust here if your actual type uses abbreviations etc.
export type ScheduleDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

/** A single recurring airing slot for a program, e.g. Monday 19:00-20:00. */
export interface ProgramScheduleEntry {
  day: ScheduleDay;
  startingTime: string; // 24hr "HH:MM"
  endTime: string; // 24hr "HH:MM"
}

export interface ProgramDocument {
  _id?: ObjectId;
  title: string;
  slug: string;
  thumbnailKey: string;
  thumbnailUrl: string;
  category: ProgramCategory;
  schedule: ProgramScheduleEntry[];
  effectiveFrom: Date;
  effectiveEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ---- shared values applied to every seeded program ----
const THUMBNAIL_URL =
  "https://pub-3bfe14d0c2c34e5687e41c228cf8ae2e.r2.dev/programs/24d36cb6-274a-4711-91c8-cf1a969ce835.jpg";
const THUMBNAIL_KEY = "programs/24d36cb6-274a-4711-91c8-cf1a969ce835.jpg";

const EFFECTIVE_FROM = new Date("2026-01-01T00:00:00.000Z");
const EFFECTIVE_END = new Date("2099-12-31T00:00:00.000Z");

const MON_FRI: ScheduleDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];
const MON_SAT: ScheduleDay[] = [...MON_FRI, "Saturday"];
const MON_SUN: ScheduleDay[] = [...MON_SAT, "Sunday"];
const SAT_SUN: ScheduleDay[] = ["Saturday", "Sunday"];

/** Builds one ProgramScheduleEntry per day for a shared time range. */
function slots(
  days: ScheduleDay[],
  startingTime: string,
  endTime: string
): ProgramScheduleEntry[] {
  return days.map((day) => ({ day, startingTime, endTime }));
}

const now = new Date();

type SeedProgram = Omit<
  ProgramDocument,
  "thumbnailKey" | "thumbnailUrl" | "effectiveFrom" | "effectiveEnd" | "createdAt" | "updatedAt"
>;

const seedPrograms: SeedProgram[] = [
  {
    title: "Pinsara Ahasa/Seth Kavi",
    slug: "pinsara-ahasa-seth-kavi",
    category: "Religious",
    schedule: slots(MON_SUN, "04:30", "06:00"),
  },
  {
    title: "Puwath Wimasuma",
    slug: "puwath-wimasuma",
    category: "News",
    schedule: [
      ...slots(MON_FRI, "06:00", "07:30"),
      ...slots(SAT_SUN, "06:00", "08:00"),
    ],
  },
  {
    title: "Morning Cafe",
    slug: "morning-cafe",
    category: "Lifestyle",
    schedule: slots(MON_FRI, "07:30", "10:00"),
  },
  {
    title: "Kids Movie + Channel Promo",
    slug: "kids-movie-channel-promo",
    category: "Kids",
    schedule: slots(["Saturday"], "08:00", "10:00"),
  },
  {
    title: "Dear Mom",
    slug: "dear-mom",
    category: "Lifestyle",
    schedule: slots(["Sunday"], "08:00", "09:00"),
  },
  {
    title: "Cooking Show",
    slug: "cooking-show",
    category: "Lifestyle",
    schedule: slots(["Sunday"], "09:00", "10:00"),
  },
  {
    title: "Text to Win",
    slug: "text-to-win",
    category: "Interactive",
    schedule: slots(MON_FRI, "10:00", "11:55"),
  },
  {
    title: "Star Seat",
    slug: "star-seat",
    category: "Talk Show",
    schedule: slots(["Saturday"], "10:00", "11:00"),
  },
  {
    title: "Art Pulse",
    slug: "art-pulse",
    category: "Arts",
    schedule: slots(["Saturday"], "11:00", "11:55"),
  },
  {
    title: "Travel Birds",
    slug: "travel-birds",
    category: "Lifestyle",
    schedule: slots(["Sunday"], "10:00", "11:00"),
  },
  {
    title: "Hada Vimana",
    slug: "hada-vimana",
    category: "Talk Show",
    schedule: slots(["Sunday"], "11:00", "11:55"),
  },
  {
    title: "News",
    slug: "news",
    category: "News",
    schedule: [
      ...slots(MON_SUN, "11:55", "12:30"),
      ...slots(MON_SUN, "18:55", "19:30"),
      ...slots(MON_SUN, "21:30", "22:15"),
    ],
  },
  {
    title: "Movie + Channel Promo",
    slug: "movie-channel-promo",
    category: "Movie",
    schedule: [
      ...slots(MON_SAT, "12:30", "16:00"),
      ...slots(["Sunday"], "12:30", "15:30"),
    ],
  },
  {
    title: "Cartoon X2 (SIN) Age 3-6",
    slug: "cartoon-x2-age-3-6",
    category: "Kids",
    schedule: slots(MON_FRI, "16:00", "17:00"),
  },
  {
    title: "Cartoon X2 (SIN) Age 6-14",
    slug: "cartoon-x2-age-6-14",
    category: "Kids",
    schedule: slots(MON_FRI, "17:00", "18:00"),
  },
  {
    title: "Kids Quiz",
    slug: "kids-quiz",
    category: "Kids",
    schedule: slots(MON_FRI, "18:00", "18:55"),
  },
  {
    title: "Teledrama - Taxi",
    slug: "teledrama-taxi",
    category: "Teledrama",
    schedule: slots(MON_FRI, "19:30", "20:00"),
  },
  {
    title: "Teledrama - Heena",
    slug: "teledrama-heena",
    category: "Teledrama",
    schedule: slots(MON_FRI, "20:00", "20:30"),
  },
  {
    title: "Teledrama - Ada Bass",
    slug: "teledrama-ada-bass",
    category: "Teledrama",
    schedule: slots(MON_FRI, "20:30", "21:00"),
  },
  {
    title: "Teledrama - Kotuwa Pitakotuwa",
    slug: "teledrama-kotuwa-pitakotuwa",
    category: "Teledrama",
    schedule: slots(MON_FRI, "21:00", "21:30"),
  },
  {
    title: "Non-Political News",
    slug: "non-political-news",
    category: "News",
    schedule: slots(["Monday"], "22:15", "24:00"),
  },
  {
    title: "GenZ News",
    slug: "genz-news",
    category: "News",
    schedule: slots(["Tuesday"], "22:15", "24:00"),
  },
  {
    title: "Mage Thaththa - Content",
    slug: "mage-thaththa-content",
    category: "Talk Show",
    schedule: slots(["Wednesday"], "22:15", "24:00"),
  },
  {
    title: "Bala Satana - News",
    slug: "bala-satana-news",
    category: "News",
    schedule: slots(["Thursday"], "22:15", "24:00"),
  },
  {
    title: "Swara Ahasa - Content",
    slug: "swara-ahasa-content",
    category: "Talk Show",
    schedule: slots(["Friday"], "22:15", "24:00"),
  },
  {
    title: "Speed",
    slug: "speed",
    category: "Sports",
    schedule: slots(["Saturday"], "16:00", "17:00"),
  },
  {
    title: "Gaming - Angampora",
    slug: "gaming-angampora",
    category: "Gaming",
    schedule: slots(["Saturday"], "17:00", "17:30"),
  },
  {
    title: "KFL",
    slug: "kfl",
    category: "Sports",
    schedule: slots(["Saturday"], "17:30", "18:00"),
  },
  {
    title: "Sports News",
    slug: "sports-news",
    category: "Sports",
    schedule: slots(["Saturday"], "18:00", "18:55"),
  },
  {
    title: "Aadareta Oone Deyak",
    slug: "aadareta-oone-deyak",
    category: "Reality",
    schedule: slots(SAT_SUN, "19:30", "21:00"),
  },
  {
    title: "Teledrama - Manawari",
    slug: "teledrama-manawari",
    category: "Teledrama",
    schedule: slots(SAT_SUN, "21:00", "21:30"),
  },
  {
    title: "Bajau Padura",
    slug: "bajau-padura",
    category: "Entertainment",
    schedule: slots(["Saturday"], "22:15", "24:00"),
  },
  {
    title: "Ranga Sutra",
    slug: "ranga-sutra",
    category: "Arts",
    schedule: slots(["Sunday"], "15:30", "16:00"),
  },
  {
    title: "Feel the Beat",
    slug: "feel-the-beat",
    category: "Entertainment",
    schedule: slots(["Sunday"], "16:00", "18:00"),
  },
  {
    title: "Queen",
    slug: "queen",
    category: "Entertainment",
    schedule: slots(["Sunday"], "18:00", "18:55"),
  },
  {
    title: "Cinema Ahasa",
    slug: "cinema-ahasa",
    category: "Movie",
    schedule: slots(["Sunday"], "22:15", "24:00"),
  },
];

export const programs: ProgramDocument[] = seedPrograms.map((p) => ({
  ...p,
  thumbnailUrl: THUMBNAIL_URL,
  thumbnailKey: THUMBNAIL_KEY,
  effectiveFrom: EFFECTIVE_FROM,
  effectiveEnd: EFFECTIVE_END,
  createdAt: now,
  updatedAt: now,
}));

export default programs;
