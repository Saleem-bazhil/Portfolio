import React, { useEffect } from "react";
import skills from "../constants/skillcategory.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
 useEffect(() => {
  ScrollTrigger.batch(".card", {
    onEnter: (batch) => {
      batch.forEach((card) => {
        gsap.fromTo(
          card,
          { y: -200, opacity: 0 },  
          { 
            y: 0, 
            opacity: 1,
            duration: 1.5,
            ease: "bounce.out",                     
            stagger: 0.2
          }
        );
      });
    },
    start: "top 80%",
  });
}, []); 
  return (
    <section
      id="skills"
      className="min-h-screen bg-background py-24 px-8 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading gradient-text text-center mb-4">
          My Skills
        </h1>
        <p className="sm:text-xl text-lg text-center text-muted-foreground mb-5">
          A comprehensive toolkit for building modern, scalable web applications
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:p-10 p-4">
          {skills.map((skillCategory, index) => (
            <div
              className="card bg-card mt-5 p-8 rounded-xl bg-gradient-card border border-border card-hover group"
              key={index}
            >
              {/* Card Header */}
              <div className="card-header flex items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <skillCategory.icon size={32} className="text-primary" />
                </div>
                <h3 className="ms-6 text-2xl font-heading text-foreground">
                  {skillCategory.category}
                </h3>
              </div>

              {/* Card Body */}
              <div className="card-body space-y-4">
                {skillCategory.skills.map((ski, i) => (
                  <div
                    key={i}
                    className="space-y-1 my-6 p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-colors duration-200"
                  >
                    {/* Skill row: name + badge */}
                    <div className="flex justify-between items-center">
                      <span className="text-foreground font-medium">
                        {ski.name}
                      </span>
                      <span className="text-sm text-primary font-semibold badge border border-primary rounded-full px-3">
                        {ski.expertise}
                      </span>
                    </div>

                    {/* Stars row below the skill */}
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= ski.level
                              ? "text-primary"
                              : "text-primary/10"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
