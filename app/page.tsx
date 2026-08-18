import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Ticker from "@/components/ticker";
import ProblemSection from "@/components/feature-cards";
import StickyStory from "@/components/sticky-story";
import ChargingMap from "@/components/charging-map";
import DashboardSection from "@/components/dashboard-section";
import OptimisationPanel from "@/components/optimization-panel";
import XAIPanel from "@/components/xai-panel";
import PrototypeSection from "@/components/prototype-section";
import ArchitectureAndMore from "@/components/architecture-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <Ticker />
        <ProblemSection />
        <StickyStory />
        <ChargingMap />
        <DashboardSection />
        <OptimisationPanel />
        <XAIPanel />
        <PrototypeSection />
        <ArchitectureAndMore />
      </main>
      <Footer />
    </>
  );
}
