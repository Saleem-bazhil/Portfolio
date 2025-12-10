// src/App.jsx
import { useEffect } from "react";           // 👈 add this
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WinterSnow from "./components/WinterSnow";
import Skills from "./components/Skills";
import About from "./components/About";
import Project from "./components/Project";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollShowcase from "./components/scrollanimation/ScrollShowcase";
import BackendShowcase from "./components/scrollanimation/BackendShowcase";
import { BrowserRouter } from "react-router-dom";

function App() {
  // 🔥 Preload heavy 3D bundles in the background after first render
  useEffect(() => {
    import("./components/scrollanimation/ScrollAnimation");
    import("./components/ui/Galaxy");
  }, []);

  return (
    <>
      <BrowserRouter>
        {/* <WinterSnow /> */}
        <Navbar />
        <Hero />
        <ScrollShowcase />
        <BackendShowcase />
        <Skills />
        <About />
        <Project />
        <Contact />
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
