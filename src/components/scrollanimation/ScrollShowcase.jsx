// src/components/scrollanimation/ScrollShowcase.jsx
import {
  memo,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronsDown } from "lucide-react";

// Lazy-load heavy 3D / canvas components
const ScrollAnimation = lazy(() => import("./ScrollAnimation"));
const Galaxy = lazy(() => import("../ui/Galaxy"));

const FRONTEND_TAGS = [
  "React & Modern JavaScript (ES6+)",
  "Bootstrap & Tailwind CSS",
  "Responsive UI & Component Architecture",
  "API Integration & Performance",
];

function ScrollShowcaseComponent() {
  const [isActive, setIsActive] = useState(false); // true only when section is visible
  const sectionRef = useRef(null);

  // Activate 3D once the section enters the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // small delay so the nav click + scroll can paint first
          setTimeout(() => setIsActive(true), 80);
        }
      },
      {
        threshold: 0.25, // 25% of section visible
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleScrollToBackend = useCallback(() => {
    const target = document.getElementById("backend");
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skill2"
      className="relative w-full h-screen overflow-hidden bg-[#0b0e14] z-0"
    >
      {/* 🌌 Galaxy background – only mounted when active */}
      {isActive && (
        <div className="absolute inset-0 -z-30">
          <Suspense fallback={null}>
            <Galaxy
              mouseRepulsion
              mouseInteraction
              density={1.5}
              glowIntensity={0.5}
              saturation={0.8}
              hueShift={240}
            />
          </Suspense>
        </div>
      )}

      {/* 🧊 3D Canvas – only mounted when active */}
      {isActive && (
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <Suspense fallback={null}>
            <ScrollAnimation />
          </Suspense>
        </div>
      )}

      {/* 🔲 Dark overlays to make text + 3D pop more */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Left: darker under text */}
        <div className="absolute inset-y-0 left-0 w-full md:w-2/3 bg-gradient-to-r from-[#020617]/95 via-[#020617]/70 to-transparent" />

        {/* Right: slight darkening behind 3D ring */}
        <div className="absolute inset-y-0 right-0 w-[40%] bg-gradient-to-l from-black/70 via-black/40 to-transparent" />

        {/* Existing soft glows */}
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/12 blur-3xl" />
        <div className="absolute left-10 bottom-[-6rem] h-80 w-80 rounded-full bg-purple-500/10 blur-[90px]" />
      </div>

      {/* Text overlay – on top */}
      <div className="pointer-events-none absolute inset-0 flex z-10">
        {/* LEFT: text block */}
        <div className="pointer-events-auto flex items-center w-full md:w-1/2 px-6 sm:px-10 lg:px-20 pt-24 pb-10">
          <div className="group max-w-2xl space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-cyan-400 to-purple-400" />
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] gradient-text">
                Frontend • React • 3D
              </p>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-50 leading-tight drop-shadow-[0_0_18px_rgba(15,23,42,0.9)] transition-transform duration-300 group-hover:-translate-y-0.5">
              Interactive 3D Website
              <span className="block gradient-text">
                Frontend Skills Carousel
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300/95 max-w-lg leading-relaxed drop-shadow-[0_0_12px_rgba(15,23,42,0.9)]">
              I build modern, high-quality web interfaces using HTML, CSS,
              JavaScript, Bootstrap, Tailwind CSS, and React, combining clean
              design with strong engineering practices. My focus is on
              responsive layouts, reusable component architecture, smooth
              animations, and API-driven, production-ready frontends.
            </p>

            <div className="flex flex-wrap gap-2 pt-3 text-[11px] sm:text-[12px] text-slate-300/90">
              {FRONTEND_TAGS.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-700/70 backdrop-blur shadow-[0_0_20px_rgba(15,23,42,0.75)] transition-transform transition-colors duration-200 hover:-translate-y-0.5 hover:bg-slate-800/90"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: transparent area for 3D ring */}
        <div className="hidden md:block md:w-1/2" />
      </div>

      {/* Bottom scroll hint */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center z-20">
        <div className="flex flex-col items-center gap-2 text-[10px] sm:text-xs text-slate-400">
          <div className="h-9 w-5 rounded-full border border-slate-600/70 flex items-center justify-center overflow-hidden">
            <button
              type="button"
              onClick={handleScrollToBackend}
              className="pointer-events-auto"
              aria-label="Scroll to backend section"
            >
              <ChevronsDown className="h-4 w-4 text-slate-300 animate-bounce" />
            </button>
          </div>
          <span className="tracking-[0.25em] uppercase">
            Scroll to explore
          </span>
        </div>
      </div>
      {/* Full-bleed decorative seam — keeps starfield visually continuous */}
<div aria-hidden="true"
  className="absolute left-0 right-0 bottom-0 z-0 pointer-events-none -translate-y-[1px]">

  <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2
                  bg-gradient-to-r from-[#8b5cf6] via-[#6366f1] to-[#3b82f6]
                  opacity-90" />

  <div className="absolute left-0 right-0 top-1/2 h-[10px] -translate-y-1/2
                  blur-[18px] opacity-20
                  bg-gradient-to-r from-[#8b5cf6] via-[#6366f1] to-[#3b82f6]" />
</div>


    </section>
  );
}

const ScrollShowcase = memo(ScrollShowcaseComponent);
export default ScrollShowcase;
