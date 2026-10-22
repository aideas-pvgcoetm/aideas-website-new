import Hero from "@/components/Hero";
import HomeResultsBanner from "@/components/home/HomeResultsBanner";
import ZigzagSection from "@/components/home/ZigzagSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ScrollStorySection from "@/components/home/ScrollStorySection";
import HomepageLoadingScreen from "@/components/home/HomepageLoadingScreen";
// Temporarily disabled for Shree Ram navbar video experiment:
// import FloatingDandiyaDancers from "@/components/home/FloatingDandiyaDancers";
// Temporarily disabled to improve initial page load performance (restore for Diwali):
// import FloatingDiya from "@/components/home/FloatingDiya";

export default function Home() {
  return (
    <main className="page-main relative">
      <HomepageLoadingScreen />
      <HomeResultsBanner />
      <Hero />
      <ZigzagSection />
      <StatsSection />
      <TestimonialsSection />
      <ScrollStorySection />
      {/* FloatingDandiyaDancers temporarily disabled to avoid competing decorative human figures */}
      {/* Golden arrow video & fireworks temporarily disabled to improve initial page load performance (restore for Diwali): */}
      {/* <FloatingDiya /> */}
    </main>
  );
}
