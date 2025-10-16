import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import myimg from "../assets/Profile.jpg";

const Hero = () => {
  const techRef = useRef(null);
  const buttonsRef = useRef([]); 
  useEffect(() => {
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
  }, []);

  return (
    <section
      className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 bg-gradient-dark"
      id="hero"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:px-8 items-center">
          {/* Hero Text */}
          <div className="text-center lg:text-left hero-text order-2 lg:order-1 lg:ps-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading mb-4 gradient-text leading-tight">
              Saleem Bazhil
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
            <div className="flex gap-5 lg:ms-2 justify-center lg:justify-start grid grid-cols-1 md:grid-cols-3 hero-button">
              {["View Projects", "Download Resume"].map((text, index) => (
                <button
                  key={index}
                  ref={(el) => (buttonsRef.current[index] = el)}
                  className={`flex justify-center items-center px-5 py-3 rounded-xl font-heading text-lg tracking-wide ${
                    text === "View Projects"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 neon-glow bebas-neue-regular"
                      : "btn bebas-neue-regular"
                  }`}
                >
                  <a
                    href="#project"
                    className="flex items-center w-full justify-center"
                  >
                    {text === "View Projects" && (
                      <ArrowRight className="mr-2" />
                    )}
                    {text}
                  </a>
                </button>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2 lg:me-18">
            <div className="relative group circle ">
              <div className="absolute inset-0 gradient-background rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative rounded-full p-1 gradient-background">
                <img
                  src={myimg}
                  alt="Alex Chen - Full Stack Developer"
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
