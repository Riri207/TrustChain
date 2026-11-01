import Hero from "../components/home/Hero";
import CampaignSection from "../components/home/CampaignSection";
import Donate from "../components/home/Donate";
import HowItWorks from "../components/home/HowItWorks";
import FAQs from "../components/layout/FAQs";

export default function Home() {
  return (
    <>
      <Hero />

      <CampaignSection />

      {/* Navbar "Donate" scrolls here: Create a Campaign / Donate to a Campaign */}
      <div id="donate" className="scroll-mt-24">
        <Donate />
      </div>

      <div id="how-it-works" className="scroll-mt-24">
        <HowItWorks />
      </div>

      <FAQs />
    </>
  );
}