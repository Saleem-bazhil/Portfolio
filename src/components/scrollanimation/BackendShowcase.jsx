import { memo, useCallback, useEffect, useState } from "react";
import BackendAnimation from "../ui/BackendAnimation";
import { ChevronsDown } from "lucide-react";
import Galaxy from "../ui/Galaxy";

const BACKEND_TAGS = [
  "RESTful APIs & JWT Authentication",
  "PostgreSQL & DB Schema Design",
  "Caching & Task Queues (Redis, Celery)",
  "Linux & VPS Production Deployment",
];

function BackendShowcaseComponent() {
  const [isDesktop, setIsDesktop] = useState(false);

  /* ---------- Detect desktop only ---------- */
  useEffect(() => {
    const checkDevice = () => setIsDesktop(window.innerWidth >= 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const handleScrollTotechskills = useCallback(() => {
    const target = document.getElementById("techskills");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <section
      id="backend"
      aria-labelledby="backend-heading"
      className="relative w-full h-screen overflow-hidden bg-[#020b0a] isolate"
    >
      {/* 🔍 SEO-only heading */}
      <h2 id="backend-heading" className="sr-only">
        Backend Skills – Python, Django, APIs, Databases & Deployment
      </h2>

      {/* 🌌 Galaxy background */}
      <div className="absolute inset-0 -z-30" aria-hidden>
        <Galaxy
          mouseRepulsion={isDesktop}
          mouseInteraction={isDesktop}
          density={isDesktop ? 1.4 : 0.8}
          glowIntensity={0.55}
          saturation={0.9}
          hueShift={120}
        />
      </div>

      {/* ✨ Overlays */}
      <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden>
        <div className="absolute inset-y-0 left-0 w-full md:w-[48%] bg-gradient-to-r from-[#020617]/28 via-[#020617]/10 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[40%] bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
        <div className="absolute -left-28 top-6 h-72 w-72 rounded-full bg-emerald-400/18 blur-3xl" />
        <div className="absolute -left-16 bottom-[-6rem] h-80 w-80 rounded-full bg-teal-500/14 blur-[90px]" />
        <div className="absolute right-[-4rem] top-24 h-64 w-64 rounded-full bg-sky-500/14 blur-[85px]" />
      </div>

      {/* 🧊 3D Animation – Desktop only */}
      {isDesktop && (
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
          <BackendAnimation />
        </div>
      )}

      {/* 📝 Content */}
      <div className="pointer-events-none absolute inset-0 flex z-10">
        <div className="hidden md:block md:w-[48%]" />

        <div className="pointer-events-auto flex items-center w-full md:w-[52%] px-6 sm:px-10 lg:px-16 pt-24 pb-10">
          <div className="max-w-xl space-y-4 sm:space-y-5 text-left">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] gradient-text">
              Backend • APIs • Databases
            </p>

            {/* ✅ Visible semantic heading */}
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-50 leading-tight">
              Scalable Backend Systems
              <span className="block gradient-text">
                API-Driven Architecture
              </span>
            </h3>

            <p className="text-sm sm:text-base text-slate-300/95 leading-relaxed">
              I build secure, scalable backend systems using{" "}
              <strong>Python</strong>, <strong>Django</strong>,{" "}
              <strong>Django REST Framework</strong>,{" "}
              <strong>FastAPI</strong>, <strong>PostgreSQL</strong> and{" "}
              <strong>Redis</strong>. My focus is on clean architecture,
              authentication, efficient database design, caching, and
              production-ready deployments on Linux & VPS servers.
            </p>

            <ul
              aria-label="Backend technology stack"
              className="flex flex-wrap gap-2 pt-3 text-[11px] sm:text-[12px] text-slate-300/90"
            >
              {BACKEND_TAGS.map((item) => (
                <li
                  key={item}
                  className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-700/70 backdrop-blur hover:-translate-y-0.5 transition-transform"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ⬇ Scroll hint */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center z-20">
        <button
          type="button"
          onClick={handleScrollTotechskills}
          aria-label="Scroll to next skills section"
          className="h-9 w-5 rounded-full border border-slate-600/70 flex items-center justify-center"
        >
          <ChevronsDown className="h-4 w-4 text-slate-300 animate-bounce" />
        </button>
      </div>
    </section>
  );
}

export default memo(BackendShowcaseComponent);
