import React from "react";
import { ExternalLink, Github } from "lucide-react";

const ProjectCard = ({
  title,
  description,
  image,
  tags,
  liveUrl,
  githubUrl,
}) => {
  return (
    <div className="card bg-card bg-gradient-card border border-border card-hover group  rounded-xl overflow-hidden">
      {/* Project Image */}
      <figure className="relative overflow-hidden aspect-video">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
      </figure>

      {/* Card Body */}
      <div className="card-body p-4">
        <div className="space-y-1  p-4 rounded-xl transition-colors duration-200">
          <h3 className="card-title text-2xl font-heading mb-3 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-muted-foreground mb-4 leading-relaxed">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="badge px-3 py-1 mb-2 me-1 text-sm bg-muted text-primary rounded-full border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="card-actions flex gap-3 relative bottom-2">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm flex items-center gap-2 rounded-xl bg-background"
              >
                <ExternalLink size={16} />
                Live Demo
              </a>
            )}
            {githubUrl && (

                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 rounded-md lg:rounded-xl bg-background border border-muted-foreground/30 text-muted-foreground hover:bg-muted hover:text-black ms-1">
                  <Github size={16}  />
                  Code
                </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
