
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CampaignSection from "./components/CampaignSection.jsx";
import CreateCampaign from "./components/CreateCampaign.jsx";
import HowItWorks from "./components/HowItWorks";
import OurImpact from "./components/OurImpact";
import DonationTicker from "./components/DonationTicker";
import Blog from "./components/Blog";
import FAQsSection from "./components/FAQs.jsx";
import AboutUs from "./components/AboutUs.jsx";


function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <CampaignSection/>
      <CreateCampaign/>
      <HowItWorks/>
      <OurImpact/>
      <DonationTicker/>
      <Blog/>
      <FAQsSection/>
      <AboutUs/>
    </>
  );
}

export default App;

