import { HeroCarousel } from "@/components/home/hero-carousel";
import { StatsCounter } from "@/components/home/stats-counter";
import { LiveTvSection } from "@/components/home/live-tv-section";
import { ScheduleTimeline } from "@/components/home/schedule-timeline";
import { LatestEpisodes } from "@/components/home/latest-episodes";
import { TrendingPrograms } from "@/components/home/trending-programs";
import { NewsCenter } from "@/components/home/news-center";
import { VideoLibraryPreview } from "@/components/home/video-library-preview";
import { Podcasts } from "@/components/home/podcasts";
import { FeaturedHosts } from "@/components/home/featured-hosts";
import { AppPromo } from "@/components/home/app-promo";
import { SocialWall } from "@/components/home/social-wall";
import { NewsletterSection } from "@/components/home/newsletter";
import { Sponsors } from "@/components/home/sponsors";
import { PulseDivider } from "@/components/ui/pulse-mark";
import { FeaturedShows } from "@/components/home/featured-shows";
import { getYouTubeEpisodes } from "@/lib/youtube";

export default async function HomePage() {

  const featuredShows = (await getYouTubeEpisodes()).slice(0, 10);
  return (
    <>
      <HeroCarousel />
      {/* <StatsCounter /> */}
      <LiveTvSection />
      <PulseDivider className="container-page opacity-40" />
      <ScheduleTimeline />
      <FeaturedShows shows={featuredShows} />
      <LatestEpisodes />
      <TrendingPrograms />
      {/* <NewsCenter /> */}
      <VideoLibraryPreview />
      <Podcasts />
      {/* <FeaturedHosts /> */}
      <AppPromo />
      {/* <SocialWall /> */}
      {/* <NewsletterSection /> */}
      <Sponsors />
    </>
  );
}
