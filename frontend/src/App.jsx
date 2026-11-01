import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import AboutUs from "./components/layout/AboutUs";
import ScrollToHash from "./components/layout/ScrollToHash";

import Home from "./pages/Home";
import CampaignsPage from "./pages/CampaignsPage";
//import Impact from "./pages/Impact";
import Login from "./pages/Login";
import CreateCampaign from "./pages/CreateCampaign";

function App() {
  return (
    <>
      <ScrollToHash />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
       <Route path="/create-campaign" element={<CreateCampaign />} />
        <Route path="/login" element={<Login />} />
      </Routes>


      <AboutUs />
    </>
  );
}

export default App;