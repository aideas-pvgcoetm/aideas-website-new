import Hero from "@/components/Hero";
import ZigzagSection from "@/components/home/ZigzagSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ScrollStorySection from "@/components/home/ScrollStorySection";
import HomepageLoadingScreen from "@/components/home/HomepageLoadingScreen";

export default function Home() {
  return (
    <main className="page-main relative">
      <HomepageLoadingScreen />
      <Hero />
      <ZigzagSection />
      <StatsSection />
      <TestimonialsSection />
      <ScrollStorySection />
    </main>
  );
}
