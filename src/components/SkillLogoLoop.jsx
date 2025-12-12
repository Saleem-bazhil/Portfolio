// src/components/SkillLogoLoop.jsx
import React, { memo, useMemo, useCallback } from "react";
import LogoLoop from "./ui/LogoLoop";
import {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiTailwindcss,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiBootstrap,
  SiGit,
  SiPython,
  SiDjango,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiNextdotjs,
} from "react-icons/si";
import { Card, CardContent } from "@/components/ui/card";

const ICON_SIZE = 56;

/* --------------------------------------------------
   1. Memoize SKILLS constant → prevents re-render each time
-------------------------------------------------- */
const SKILLS = Object.freeze([
  { id: "html", icon: <SiHtml5 color="#E34F26" />, title: "HTML5", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { id: "css", icon: <SiCss3 color="#1572B6" />, title: "CSS3", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { id: "js", icon: <SiJavascript color="#F7DF1E" />, title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },

  { id: "ts", icon: <SiTypescript color="#3178C6" />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { id: "react", icon: <SiReact color="#61DAFB" />, title: "React", href: "https://react.dev" },
  { id: "next", icon: <SiNextdotjs color="#FFFFFF" />, title: "Next.js", href: "https://nextjs.org" },

  { id: "node", icon: <SiNodedotjs color="#83CD29" />, title: "Node.js", href: "https://nodejs.org" },
  { id: "express", icon: <SiExpress color="#FFFFFF" />, title: "Express.js", href: "https://expressjs.com" },

  { id: "tailwind", icon: <SiTailwindcss color="#06B6D4" />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { id: "bootstrap", icon: <SiBootstrap color="#7952B3" />, title: "Bootstrap", href: "https://getbootstrap.com" },

  { id: "git", icon: <SiGit color="#F05032" />, title: "Git", href: "https://git-scm.com" },
  { id: "python", icon: <SiPython color="#3776AB" />, title: "Python", href: "https://www.python.org" },
  { id: "django", icon: <SiDjango color="#0C4B33" />, title: "Django", href: "https://www.djangoproject.com" },

  { id: "mongodb", icon: <SiMongodb color="#47A248" />, title: "MongoDB", href: "https://www.mongodb.com" },
  { id: "postgresql", icon: <SiPostgresql color="#336791" />, title: "PostgreSQL", href: "https://www.postgresql.org" },

  { id: "gsap", icon: <span style={{ fontWeight: 700, color: "#00ff99" }}>GSAP</span>, title: "GSAP", href: "https://greensock.com/gsap/" },
  { id: "react-router", icon: <span style={{ fontWeight: 700, color: "#CA4245" }}>RR</span>, title: "React Router", href: "https://reactrouter.com" },
]);

/* --------------------------------------------------
   2. Memoized SkillCard → prevents unnecessary re-renders
-------------------------------------------------- */
const SkillCard = memo(function SkillCard({ item }) {
  const iconEl = useMemo(() => {
    return React.isValidElement(item.icon)
      ? React.cloneElement(item.icon, { size: ICON_SIZE, "aria-hidden": true })
      : <div style={{ fontSize: ICON_SIZE * 0.6 }}>{item.icon}</div>;
  }, [item.icon]);

  const label = item.title;

  return (
    <div
      className="flex flex-col items-center"
      style={{ minWidth: 220, padding: 8, boxSizing: "border-box" }}
    >
      <Card className="rounded-xl border border-slate-800 skill-card">
        <CardContent
          className="flex items-center justify-center"
          style={{ width: 160, height: 140, padding: 12 }}
        >
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              aria-label={label}
              className="flex items-center justify-center"
            >
              {iconEl}
            </a>
          ) : (
            <div role="img" aria-label={label} className="flex items-center justify-center">
              {iconEl}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-sm font-semibold text-gray-200 text-center">
        {item.title}
      </div>
    </div>
  );
});

/* --------------------------------------------------
   3. Main Component — optimized
-------------------------------------------------- */
export default function SkillLogoLoop() {
  // Stable renderItem callback → avoids rerenders in LogoLoop
  const renderSkillItem = useCallback(
    (item, key) => <SkillCard item={item} key={key} />,
    []
  );

  return (
    <section className="w-full min-h-screen bg-background flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-3">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            TECH SKILLS
          </span>
        </h2>

        <div className="mx-auto w-40 h-1 bg-gradient-to-r from-indigo-400 to-pink-400 opacity-80 rounded mb-6" />
        <p className="text-gray-400 mb-8">
          Technologies I use to build modern, scalable web applications
        </p>

        <div className="relative overflow-hidden py-8" style={{ minHeight: 260 }}>
          <LogoLoop
            logos={SKILLS}
            speed={80}
            direction="left"
            width="100%"
            logoHeight={ICON_SIZE}
            gap={48}
            pauseOnHover
            hoverSpeed={0}
            scaleOnHover
            renderItem={renderSkillItem}
            className="logoloop--smooth"
          />
        </div>
      </div>
    </section>
  );
}
