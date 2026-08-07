export type Category =
  | "Reality"
  | "Music"
  | "Drama"
  | "News"
  | "Sports"
  | "Lifestyle"
  | "Kids"
  | "Religious"
  | "Entertainment";

export interface Show {
  slug: string;
  title: string;
  category: Category;
  synopsis: string;
  duration: string;
  rating: string;
  image: string;
  isNewEpisode?: boolean;
  trending?: boolean;
  host?: string;
}

export interface Episode {
  slug: string;
  showSlug: string;
  showTitle: string;
  episodeNumber: number;
  title: string;
  duration: string;
  publishDate: string;
  image: string;
  category: Category;
}

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: "Politics" | "Business" | "Sports" | "Technology" | "International" | "Entertainment";
  image: string;
  readingTime: string;
  date: string;
  author: string;
  breaking?: boolean;
  featured?: boolean;
}

export interface Presenter {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  shows: string[];
  social: { platform: string; url: string }[];
}

export interface ScheduleItem {
  day: string;
  time: string;
  block: "Morning" | "Afternoon" | "Evening" | "Night";
  title: string;
  category: Category;
  host?: string;
  live?: boolean;
}

export interface Podcast {
  slug: string;
  title: string;
  guest: string;
  duration: string;
  image: string;
  date: string;
}
