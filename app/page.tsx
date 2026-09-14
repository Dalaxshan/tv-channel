import { HeroCarousel } from "@/components/home/hero-carousel";
import { LiveTvSection } from "@/components/home/live-tv-section";
import { LatestEpisodes } from "@/components/home/latest-episodes";
import { TrendingPrograms } from "@/components/home/trending-programs";
import { Sponsors } from "@/components/home/sponsors";
import { PulseDivider } from "@/components/ui/pulse-mark";
import { shows } from "@/lib/data";
import { RealityShows } from "@/components/home/reality-show";
import { Entertainments } from "@/components/home/entertainments";
import ScrollHorizontal from "@/components/ui/scroll-horizontal";

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
      <ScrollHorizontal shows={shows} />
      <Sponsors />
    </>
  );
}
