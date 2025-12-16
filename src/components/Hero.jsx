import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { memo } from "react";
import myimg from "../assets/profile (4).png";
import resume from "../assets/resume.pdf";
import { BackgroundBeams } from "./ui/background-beams";
import { TextType } from "./ui/TextType";

/* ---------------- Animations ---------------- */

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 18, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

/* ---------------- Component ---------------- */

const Hero = () => {
  return (
    <section
      id="hero"
      aria-label="Hero section"
      className="
        relative min-h-screen flex items-center
        px-4 sm:px-6
        bg-gradient-dark overflow-hidden
      "
    >
      {/* ================= SEO H1 (Invisible to users, visible to Google) ================= */}
      <h1 className="sr-only">
        Saleem Bazhil – Python Full Stack Developer specializing in React and Django
      </h1>

      {/* Background */}
      <BackgroundBeams className="absolute inset-0 -z-10 opacity-60" />

      <div className="container mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="
            grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]
            gap-12 lg:gap-14 xl:gap-16
            lg:px-16 xl:px-20
            items-center
          "
        >
          {/* ================= TEXT ================= */}
          <motion.div
            className="
              order-2 lg:order-1
              text-center lg:text-left
            "
          >
            {/* VISUAL NAME (NOT SEO H1) */}
            <motion.h2
              aria-hidden
              variants={item}
              className="
                text-4xl sm:text-5xl md:text-6xl
                lg:text-7xl xl:text-8xl
                font-heading font-extrabold
                tracking-[-0.02em] lg:tracking-[-0.03em]
                leading-[0.95]
                bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600
                bg-clip-text text-transparent
                mb-4
              "
            >
              Saleem Bazhil
            </motion.h2>

            {/* ROLE / KEYWORDS */}
            <motion.div
              variants={item}
              aria-live="polite"
              className="
                font-body font-medium
                text-base sm:text-lg md:text-xl lg:text-2xl
                text-primary/90
                mb-6
                min-h-[2.8rem] sm:min-h-[3.2rem]
                leading-tight
                flex items-center justify-center lg:justify-start
              "
            >
              <TextType
                text={[
                  "Python Full Stack Developer",
                  "React Developer",
                  "Django Developer",
                  "Full Stack Web Developer",
                ]}
                typingSpeed={50}
                pauseDuration={1800}
                showCursor
                aria-label="Professional roles"
              />
            </motion.div>

            {/* SEO-FRIENDLY DESCRIPTION */}
            <motion.p
              variants={item}
              className="
                font-body
                text-sm sm:text-base md:text-lg
                text-muted-foreground/90
                leading-relaxed
                max-w-[48ch]
                mx-auto lg:mx-0
                mb-6
              "
            >
              Python Full Stack Developer with strong experience in{" "}
              <strong className="text-primary font-medium">React</strong> and{" "}
              <strong className="text-primary font-medium">Django</strong>,
              building fast, scalable, and user-focused web applications with
              clean, intuitive user experiences.
            </motion.p>

            {/* TRUST / AVAILABILITY */}
            <motion.p
              variants={item}
              className="
                text-[13px] sm:text-sm
                tracking-wide
                text-muted-foreground/80
                mb-8
              "
            >
              Project-Based • Open to Full-Time & Freelance Opportunities
            </motion.p>

            {/* BUTTONS */}
            <motion.div
              variants={item}
              className="
                flex flex-col sm:flex-row
                gap-4 sm:gap-5
                justify-center lg:justify-start
              "
            >
              <a href="#projects" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="View Projects"
                  className="
                    flex items-center justify-center gap-2
                    px-6 py-3 rounded-xl
                    font-heading text-sm sm:text-base
                    bg-primary text-primary-foreground
                    hover:bg-primary/90 neon-glow
                    focus-visible:ring-2 focus-visible:ring-primary
                    focus-visible:ring-offset-2
                    w-full sm:w-auto
                  "
                >
                  <ArrowRight className="h-5 w-5" />
                  View Projects
                </motion.button>
              </a>

              <a href={resume} download className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="Download Resume"
                  className="
                    flex items-center justify-center
                    px-6 py-3 rounded-xl
                    font-heading text-sm sm:text-base
                    btn opacity-90 hover:opacity-100
                    focus-visible:ring-2 focus-visible:ring-primary
                    focus-visible:ring-offset-2
                    w-full sm:w-auto
                  "
                >
                  Download Resume
                </motion.button>
              </a>
            </motion.div>
          </motion.div>

          {/* ================= IMAGE ================= */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative group">
              <div
                className="
                  absolute inset-0 rounded-full
                  blur-xl opacity-25
                  gradient-background
                  group-hover:opacity-40 transition
                "
              />
              <div className="relative rounded-full p-1 gradient-background">
                <img
                  src={myimg}
                  alt="Saleem Bazhil – Python Full Stack Developer (React & Django)"
                  width={384}
                  height={384}
                  loading="eager"
                  fetchPriority="high"
                  className="
                    w-48 h-48
                    sm:w-60 sm:h-60
                    md:w-72 md:h-72
                    lg:w-96 lg:h-96
                    rounded-full object-cover
                    border-4 border-background
                  "
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Hero);
