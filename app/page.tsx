import { HeroCarousel } from "@/components/home/hero-carousel";
import { LiveTvSection } from "@/components/home/live-tv-section";
import { ScheduleTimeline } from "@/components/home/schedule-timeline";
import { LatestEpisodes } from "@/components/home/latest-episodes";
import { TrendingPrograms } from "@/components/home/trending-programs";
import { VideoLibraryPreview } from "@/components/home/video-library-preview";
import { Podcasts } from "@/components/home/podcasts";
import { AppPromo } from "@/components/home/app-promo";
import { Sponsors } from "@/components/home/sponsors";
import { PulseDivider } from "@/components/ui/pulse-mark";
import { FeaturedShows } from "@/components/home/featured-shows";
import { shows } from "@/lib/data";

export default async function HomePage() {

  return (
    <>
      <HeroCarousel />
      <LiveTvSection />
      <PulseDivider className="container-page opacity-40" />
      <ScheduleTimeline />
      <FeaturedShows shows={shows} />
      <LatestEpisodes />
      <TrendingPrograms />
      <VideoLibraryPreview />
      <Podcasts />
      <AppPromo />
      <Sponsors />
    </>
  );
}
