import { motion } from 'framer-motion';
import AtmosphericEffects from '../effects/AtmosphericEffects';
import FadeIn from '../animations/FadeIn';
import './Certifications.css';

const Certifications = ({ config }) => {
  // Find the certifications category from skills
  const skillsCategories = config.skills?.categories || [];
  const certificationsCategory = skillsCategories.find(
    cat => cat.name === 'Certifications & Learning' || cat.name.toLowerCase().includes('certification')
  );

  const certifications = certificationsCategory?.items || [];

  if (certifications.length === 0) {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <section className="certifications-section">
      <AtmosphericEffects />
      <div className="certifications-container">
        <FadeIn>
          <h2 className="section-title">Certifications & Achievements</h2>
          <p className="certifications-subtitle">
            Professional certifications demonstrating expertise across multiple platforms
          </p>
        </FadeIn>

        <motion.div
          className="certifications-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={container}
        >
          {certifications.map((cert, index) => {
            const isObject = typeof cert === 'object';
            const certName = isObject ? cert.name : cert;
            const certUrl = isObject ? cert.url : null;

            return (
              <motion.div
                key={index}
                className="certification-card"
                variants={item}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {certUrl ? (
                  <a
                    href={certUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="certification-link"
                  >
                    <div className="certification-icon">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </div>
                    <p className="certification-name">{certName}</p>
                    <span className="certification-badge">Verified</span>
                  </a>
                ) : (
                  <>
                    <div className="certification-icon">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </div>
                    <p className="certification-name">{certName}</p>
                    <span className="certification-badge">Verified</span>
                  </>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications;
