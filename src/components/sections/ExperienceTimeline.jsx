import { motion } from 'framer-motion';
import AtmosphericEffects from '../effects/AtmosphericEffects';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import './ExperienceTimeline.css';

const ExperienceTimeline = ({ config }) => {
  const jobs = config.experience?.jobs || [];

  return (
    <section className="experience-section">
      <AtmosphericEffects />
      <div className="experience-container">
        <FadeIn>
          <h2 className="section-title">Professional Journey</h2>
        </FadeIn>

        <div className="timeline">
          {/* Timeline trunk */}
          <div className="timeline-trunk"></div>

          {/* Experience Cards */}
          {jobs.map((job, index) => {
            const isLeft = index % 2 === 0;

            return (
              <SlideIn
                key={index}
                direction={isLeft ? 'left' : 'right'}
                delay={index * 0.2}
                className={`timeline-item ${isLeft ? 'left' : 'right'}`}
              >
                <div className="timeline-card">
                  {/* Company Logo */}
                  {job.logo && (
                    <div className="company-logo-wrapper">
                      <img
                        src={job.logo}
                        alt={`${job.company} logo`}
                        className="company-logo"
                      />
                    </div>
                  )}

                  {/* Job Info */}
                  <h3 className="job-title">{job.role}</h3>
                  <h4 className="company-name">{job.company}</h4>
                  <p className="job-date">{job.date}</p>

                  {/* Responsibilities */}
                  {job.responsibilities && job.responsibilities.length > 0 && (
                    <ul className="responsibilities-list">
                      {job.responsibilities.map((responsibility, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: (index * 0.2) + (idx * 0.1) }}
                        >
                          {responsibility}
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Timeline dot */}
                <motion.div
                  className="timeline-dot"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, type: 'spring' }}
                ></motion.div>

                {/* Branch connecting to trunk */}
                <div className="timeline-branch"></div>
              </SlideIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
