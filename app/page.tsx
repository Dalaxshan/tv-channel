import { HeroCarousel } from "@/components/home/hero-carousel";
import { LiveTvSection } from "@/components/home/live-tv-section";
import { LatestEpisodes } from "@/components/home/latest-episodes";
import { TrendingPrograms } from "@/components/home/trending-programs";
import { AppPromo } from "@/components/home/app-promo";
import { Sponsors } from "@/components/home/sponsors";
import { PulseDivider } from "@/components/ui/pulse-mark";
import { FeaturedShows } from "@/components/home/featured-shows";
import { shows } from "@/lib/data";
import { RealityShows } from "@/components/home/reality-show";
import { Entertainments } from "@/components/home/entertainments";

export default async function HomePage() {
  return (
    <>
      <HeroCarousel />
      <LiveTvSection />
      <PulseDivider className="container-page opacity-40" />
      <LatestEpisodes />
      <Entertainments />
      <RealityShows />
      <TrendingPrograms />
      <FeaturedShows shows={shows} />
      <AppPromo />
      <Sponsors />
    </>
  );
}
