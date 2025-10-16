import React from "react";
import ProjectCard from "./ProjectCard";
import project from "../constants/project.js";

const Project = () => {
  return (
    <section className="min-h-screen py-24 px-4 sm:px-6 lg:px-18" id="project">
      <div className="container mx-auto">
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-heading mb-4 text-center gradient-text">
          Featured Projects
        </h2>
        <p className="text-center text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto mb-16">
          A selection of recent work showcasing modern web technologies and clean design.
        </p>

        {/* ✅ Corrected grid class (typo: lg:grid-col-3 → lg:grid-cols-3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 m-6 md:m-0">
          {project.map((proj, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProjectCard {...proj} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Project;
