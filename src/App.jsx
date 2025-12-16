// src/App.jsx
import { lazy, Suspense } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SectionTransition from "./components/ui/SectionTransition";

// Lazy-load heavy & below-the-fold sections
const ScrollShowcase = lazy(() =>
  import("./components/scrollanimation/ScrollShowcase")
);
const BackendShowcase = lazy(() =>
  import("./components/scrollanimation/BackendShowcase")
);
const About = lazy(() => import("./components/About"));
const Project = lazy(() => import("./components/Project"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));

function App() {
  return (
    <>
      {/* Top priority content (fast paint) */}
      <Navbar />
      <Hero />

      {/* Seam between hero and skills */}
      <SectionTransition />

      {/* Heavy sections loaded lazily */}
      <Suspense fallback={null}>
        <ScrollShowcase />
        <BackendShowcase />
        <About />
        <Project />
        <Contact />
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
