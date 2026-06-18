import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '../animations/FadeIn';
import ProjectModal from '../ui/ProjectModal';
import AtmosphericEffects from '../effects/AtmosphericEffects';
import './ProjectsGallery.css';

const ProjectsGallery = ({ config }) => {
  const projects = config.projects?.items || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  if (projects.length === 0) {
    return null;
  }

  const currentProject = projects[currentIndex];

  return (
    <>
      <section className="projects-section">
        <AtmosphericEffects />
        <div className="projects-container">
          <FadeIn>
            <h2 className="section-title">Featured Projects</h2>
          </FadeIn>

          {/* Carousel */}
          <div className="carousel-wrapper">
            {/* Navigation Buttons */}
            <button
              onClick={handlePrevious}
              className="carousel-nav carousel-nav-prev"
              aria-label="Previous project"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Project Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="project-card"
              >
                {/* Project Image */}
                <div className="project-image-wrapper">
                  {currentProject.picture ? (
                    <img
                      src={currentProject.picture}
                      alt={currentProject.name}
                      className="project-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <svg
                    className="project-image-placeholder"
                    viewBox="0 0 600 400"
                    fill="none"
                    style={{ display: currentProject.picture ? 'none' : 'flex' }}
                  >
                    <rect width="600" height="400" fill="var(--color-bg-tertiary)"/>
                    <g opacity="0.3">
                      <rect x="220" y="140" width="160" height="120" rx="8" stroke="var(--color-accent-blue)" strokeWidth="3" fill="none"/>
                      <circle cx="260" cy="170" r="15" fill="var(--color-accent-blue)"/>
                      <path d="M220 240 L280 190 L340 210 L380 180" stroke="var(--color-accent-blue)" strokeWidth="3" fill="none"/>
                    </g>
                    <text x="300" y="300" textAnchor="middle" fill="var(--color-text-tertiary)" fontSize="18" fontFamily="var(--font-mono)">
                      {currentProject.name}
                    </text>
                  </svg>
                </div>

                {/* Project Info */}
                <div className="project-info">
                  <h3 className="project-title">{currentProject.name}</h3>

                  {currentProject.date && (
                    <p className="project-date">{currentProject.date}</p>
                  )}

                  {/* Tech Stack */}
                  {currentProject.tech_stack && currentProject.tech_stack.length > 0 && (
                    <div className="tech-stack">
                      {currentProject.tech_stack.map((tech, index) => (
                        <span key={index} className="tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  {currentProject.description && (
                    <div className="project-description">
                      {Array.isArray(currentProject.description)
                        ? currentProject.description.slice(0, 2).map((line, index) => (
                            <p key={index}>{line}</p>
                          ))
                        : <p>{currentProject.description}</p>
                      }
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="project-actions">
                    <button
                      onClick={() => handleViewDetails(currentProject)}
                      className="project-cta"
                    >
                      View Details
                    </button>

                    {currentProject.link?.url && (
                      <a
                        href={currentProject.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link-button"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                        {currentProject.link.title || 'View Project'}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={handleNext}
              className="carousel-nav carousel-nav-next"
              aria-label="Next project"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-indicators">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <p className="carousel-counter">
            {currentIndex + 1} of {projects.length}
          </p>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectsGallery;
