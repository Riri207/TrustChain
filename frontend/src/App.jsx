import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import AboutUs from "./components/layout/AboutUs";
import ScrollToHash from "./components/layout/ScrollToHash";

import Home from "./pages/Home";
//import Campaigns from "./pages/Campaigns";//
//import Impact from "./pages/Impact";//
import Login from "./pages/Login";

function App() {
  return (
    <>
      <ScrollToHash />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <AboutUs />
    </>
  );
}

export default App;