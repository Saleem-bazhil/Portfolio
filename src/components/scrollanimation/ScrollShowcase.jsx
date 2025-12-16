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

// Stable constant (outside render)
const FRONTEND_TAGS = [
  "React & Modern JavaScript (ES6+)",
  "Bootstrap & Tailwind CSS",
  "Responsive UI & Component Architecture",
  "API Integration & Performance",
];

function ScrollShowcaseComponent() {
  const [isActive, setIsActive] = useState(false);
  const sectionRef = useRef(null);

  /* ---------------- Device & Motion Detection ---------------- */
  const isClient = typeof window !== "undefined";

  const isMobile =
    isClient && window.matchMedia("(max-width: 768px)").matches;

  const prefersReducedMotion =
    isClient &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const enable3D = !isMobile && !prefersReducedMotion;

  /* ---------------- Intersection Observer ---------------- */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsActive(true), 80);
          observer.disconnect(); // activate once
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ---------------- Scroll Handler ---------------- */
  const handleScrollToBackend = useCallback(() => {
    const target = document.getElementById("backend");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skill2"
      aria-labelledby="frontend-skills-heading"
      className="relative w-full h-screen overflow-hidden bg-[#0b0e14] z-0"
    >
      {/* ================= SEO H2 (Indexed but Invisible) ================= */}
      <h2 id="frontend-skills-heading" className="sr-only">
        Frontend Skills – React, JavaScript, CSS, UI Architecture &
        Performance
      </h2>

      {/* ================= DESKTOP 3D BACKGROUND ================= */}
      {enable3D && isActive && (
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

      {/* ================= DESKTOP 3D CANVAS ================= */}
      {enable3D && isActive && (
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <Suspense fallback={null}>
            <ScrollAnimation />
          </Suspense>
        </div>
      )}

      {/* ================= MOBILE / REDUCED MOTION FALLBACK ================= */}
      {!enable3D && (
        <div
          aria-hidden
          className="absolute inset-0 -z-20
                     bg-gradient-to-br
                     from-[#020617]
                     via-[#0b0e14]
                     to-[#020617]"
        />
      )}

      {/* ================= DARK OVERLAYS ================= */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-y-0 left-0 w-full md:w-2/3 bg-gradient-to-r from-[#020617]/95 via-[#020617]/70 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[40%] bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/12 blur-3xl" />
        <div className="absolute left-10 bottom-[-6rem] h-80 w-80 rounded-full bg-purple-500/10 blur-[90px]" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="pointer-events-none absolute inset-0 flex z-10">
        <div className="pointer-events-auto flex items-center w-full md:w-1/2 px-6 sm:px-10 lg:px-20 pt-24 pb-10">
          <div className="group max-w-2xl space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-cyan-400 to-purple-400" />
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] gradient-text">
                Frontend • React • 3D
              </p>
            </div>

            {/* Visible heading */}
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-50 leading-tight drop-shadow-[0_0_18px_rgba(15,23,42,0.9)]">
              Interactive 3D Website
              <span className="block gradient-text">
                Frontend Skills Carousel
              </span>
            </h3>

            {/* SEO-rich description */}
            <p className="text-sm sm:text-base text-slate-300/95 max-w-lg leading-relaxed drop-shadow-[0_0_12px_rgba(15,23,42,0.9)]">
              I build modern, production-ready frontend applications using{" "}
              <strong>React</strong>, <strong>JavaScript</strong>,{" "}
              <strong>HTML</strong>, <strong>CSS</strong>,{" "}
              <strong>Bootstrap</strong>, and{" "}
              <strong>Tailwind CSS</strong>. My work focuses on
              responsive UI, reusable component architecture, smooth
              animations, performance optimization, and API-driven
              experiences.
            </p>

            {/* Skill tags */}
            <ul
              aria-label="Frontend technology stack"
              className="flex flex-wrap gap-2 pt-3 text-[11px] sm:text-[12px] text-slate-300/90"
            >
              {FRONTEND_TAGS.map((item) => (
                <li
                  key={item}
                  className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-700/70 backdrop-blur shadow-[0_0_20px_rgba(15,23,42,0.75)] hover:-translate-y-0.5 transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hidden md:block md:w-1/2" />
      </div>

      {/* ================= SCROLL HINT ================= */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center z-20">
        <div className="flex flex-col items-center gap-2 text-[10px] sm:text-xs text-slate-400">
          <button
            type="button"
            onClick={handleScrollToBackend}
            aria-label="Scroll to backend skills section"
            className="h-9 w-5 rounded-full border border-slate-600/70 flex items-center justify-center"
          >
            <ChevronsDown className="h-4 w-4 text-slate-300 animate-bounce" />
          </button>
          <span className="tracking-[0.25em] uppercase">
            Scroll to explore
          </span>
        </div>
      </div>

      {/* ================= DECORATIVE SEAM ================= */}
     <div
      aria-hidden
      className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none"
    >
      {/* Sharp core line */}
      <div
        className="
          absolute inset-x-0 bottom-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#6366f1]
          to-transparent
          opacity-90
        "
      />

      {/* Soft glow */}
      <div
        className="
          absolute inset-x-0 bottom-0
          h-[12px]
          -translate-y-1/2
          bg-gradient-to-r
          from-transparent
          via-[#6366f1]
          to-transparent
          blur-[16px]
          opacity-30
        "
      />
    </div>
    </section>
  );
}

export default memo(ScrollShowcaseComponent);
