// src/components/BackendShowcase.jsx
import { memo ,useCallback} from "react";
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
  
    const handleScrollTotechskills = useCallback(() => {
      const target = document.getElementById("techskills");
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, []);
  return (
    <section
      id="backend"
      className="relative w-full h-screen overflow-hidden bg-[#020b0a] z-0"
    >
      {/* 🌌 Galaxy background */}
      <div className="absolute inset-0 -z-30">
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={1.4}
          glowIntensity={0.55}
          saturation={0.9}
          hueShift={120}
        />
      </div>

      {/* ✨ Overlays + Glows (now UNDER the 3D canvas) */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        {/* Left: very soft dark gradient over background only */}
        <div
          className="
            absolute inset-y-0 left-0
            w-full md:w-[48%]
            bg-gradient-to-r
            from-[#020617]/28 via-[#020617]/10 to-transparent
          "
        />

        {/* Right: stronger darkening behind text for readability */}
        <div
          className="
            absolute inset-y-0 right-0
            w-[40%]
            bg-gradient-to-l
            from-black/70 via-black/40 to-transparent
          "
        />

        {/* Soft color glows */}
        <div className="absolute -left-28 top-6 h-72 w-72 rounded-full bg-emerald-400/18 blur-3xl" />
        <div className="absolute -left-16 bottom-[-6rem] h-80 w-80 rounded-full bg-teal-500/14 blur-[90px]" />
        <div className="absolute right-[-4rem] top-24 h-64 w-64 rounded-full bg-sky-500/14 blur-[85px]" />
      </div>

      {/* 🧊 3D Canvas – now ABOVE overlays so cubes stay bright */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <BackendAnimation />
      </div>

      {/* 📝 Text + layout */}
      <div className="pointer-events-none absolute inset-0 flex z-10">
        {/* LEFT: space for 3D */}
        <div className="hidden md:block md:w-[48%]" />

        {/* RIGHT: text */}
        <div className="pointer-events-auto flex items-center w-full md:w-[52%] px-6 sm:px-10 lg:px-16 pt-24 pb-10">
          <div className="group max-w-xl space-y-4 sm:space-y-5 text-left">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-emerald-400 to-teal-400" />
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] gradient-text">
                Backend • APIs • Databases
              </p>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-50 leading-tight drop-shadow-[0_0_20px_rgba(15,23,42,0.9)]">
              Scalable Backend Systems
              <span className="block gradient-text">
                API-Driven Architecture
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300/95 leading-relaxed drop-shadow-[0_0_14px_rgba(15,23,42,0.9)]">
              I build secure, scalable backend systems using Python, Django,
              Django REST Framework, FastAPI, PostgreSQL and Redis. I focus on
              clean architecture, authentication, efficient DB schemas, caching,
              and production-ready deployments on Linux &amp; VPS.
            </p>

            <div className="flex flex-wrap gap-2 pt-3 text-[11px] sm:text-[12px] text-slate-300/90">
              {BACKEND_TAGS.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-700/70 backdrop-blur shadow-[0_0_20px_rgba(15,23,42,0.75)] hover:-translate-y-0.5 transition-transform"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ⬇ Scroll hint */}
      <div className="pointer-events-none absolute bottom-6 inset-x-0 flex justify-center z-20">
        <div className="flex flex-col items-center gap-2 text-[10px] sm:text-xs text-slate-400">
          <div className="h-9 w-5 rounded-full border border-slate-600/70 flex items-center justify-center overflow-hidden">
                        <button
              type="button"
              onClick={handleScrollTotechskills}
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
    </section>
  );
}

const BackendShowcase = memo(BackendShowcaseComponent);
export default BackendShowcase;
