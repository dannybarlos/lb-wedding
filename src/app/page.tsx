import Hero from "@/components/sections/Hero";
import LoveStory from "@/components/sections/LoveStory";
import DateCountdown from "@/components/sections/DateCountdown";
import Venue from "@/components/sections/Venue";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <DateCountdown />
      <LoveStory />
      <Venue />
    </main>
  );
}
