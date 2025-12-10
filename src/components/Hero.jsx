import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import myimg from "../assets/profile (4).png";
import resume from "../assets/resume.pdf";
import { BackgroundBeams } from "./ui/background-beams";
import { TextType } from "./ui/TextType";

const Hero = () => {
  const heroRef = useRef(null);
  const techRef = useRef(null);
  const buttonsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const techItems = techRef.current?.querySelectorAll(".tech-item");

      // Animate hero text and image
      gsap.fromTo(
        [".hero-text h1", ".hero-text p", ".circle"],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.out" }
      );

      // Animate buttons
      if (buttonsRef.current.length) {
        gsap.fromTo(
          buttonsRef.current,
          { y: 5, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
            stagger: 0.2,
            delay: 1.2,
          }
        );
      }

      // Animate tech items vertical scroll
      if (techItems) {
        gsap.to(techRef.current, {
          y: -80,
          duration: 8,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex items-center px-4 sm:px-6 lg:px-0 bg-gradient-dark"
      id="hero"
    >
      <BackgroundBeams className="absolute inset-0 -z-10" />

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:px-8 items-center">
          {/* Hero Text */}
          <div className="text-center lg:text-left hero-text order-2 lg:order-1 lg:ps-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading lg:mb-4 gradient-text leading-tight">
              <span className="inline-block min-h-[120px] whitespace-nowrap">
                <TextType
                  text={[
                    "Saleem Bazhil",
                    "Full Stack Developer",
                    "React Developer",
                    "Django Developer",
                  ]}
                  typingSpeed={50}
                  pauseDuration={2000}
                  className="gradient-text text-center"
                  showCursor={true}
                />
              </span>
            </h1>

            <p className="flex justify-center lg:justify-start items-center text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-4 lg:ms-0 font-light gap-2 tagesschrift-regular">
              Full Stack Developer |{" "}
              <span className="relative h-10 lg:w-40 w-20 overflow-hidden">
                <span
                  ref={techRef}
                  className="absolute top-0 left-0 flex flex-col gap-0"
                >
                  <span className="h-10 tech-item text-primary leading-none">
                    React
                  </span>
                  <span className="h-10 text-secondary leading-none">
                    Django
                  </span>
                  <span className="h-10 text-accent leading-none">
                    Tailwind
                  </span>
                  <span className="h-10 text-primary leading-none">React</span>
                </span>
              </span>
            </p>

            <p className="flex items-center text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-8 font-light gap-2 tagesschrift-regular">
              | Building modern, scalable web applications.
            </p>

            {/* Hero Buttons */}
            <div className="flex gap-5 lg:ms-2 justify-center lg:justify-start hero-button">
              {/* View Projects Button */}
              <a href="#project" className="w-full">
                <button
                  ref={(el) => (buttonsRef.current[0] = el)}
                  className="flex justify-center items-center px-5 py-3 rounded-xl font-heading text-lg tracking-wide w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-glow bebas-neue-regular"
                >
                  <ArrowRight className="mr-2" />
                  View Projects
                </button>
              </a>

              {/* Download Resume Button */}
              <a href={resume} download className="w-full">
                <button
                  ref={(el) => (buttonsRef.current[1] = el)}
                  className="flex justify-center items-center px-5 py-3 rounded-xl font-heading text-lg tracking-wide w-full btn bebas-neue-regular"
                >
                  Download Resume
                </button>
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center lg:justify-center order-1 lg:order-2 lg:me-0">
            <div className="relative group circle">
              <div className="absolute inset-0 gradient-background rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              <div className="relative rounded-full p-1 gradient-background">
                <img
                  src={myimg}
                  alt="Saleem Bazhil - Full Stack Developer"
                  width={384}          // matches lg:w-96
                  height={384}         // matches lg:h-96
                  loading="eager"      // 👈 tell browser this is LCP
                  fetchPriority="high" // 👈 prioritize this image
                  className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full object-cover border-4 border-background"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
