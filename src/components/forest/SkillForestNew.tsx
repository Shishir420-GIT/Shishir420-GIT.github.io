import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillCategories, allSkills, getSkillsByCategory } from '../../constants/skillTreeData';
import { Skill } from '../../types/skill';
import './SkillForestNew.css';

const SkillForestNew = () => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to show legend only when skills section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShowLegend(entry.isIntersecting);
        });
      },
      {
        threshold: 0.3, // Show when 30% of section is visible
        rootMargin: '-100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  const closeSidePanel = () => {
    setSelectedSkill(null);
  };

  // Color mapping for proficiency levels
  const getLevelColor = (level: number) => {
    if (level <= 2) return '#4ADE80'; // Green - Beginner
    if (level === 3) return '#FBBF24'; // Yellow - Intermediate
    if (level === 4) return '#F87171'; // Red - Advanced
    return '#A78BFA'; // Purple - Expert
  };

  const getLevelText = (level: number) => {
    if (level <= 2) return 'Beginner';
    if (level === 3) return 'Intermediate';
    if (level === 4) return 'Advanced';
    return 'Expert';
  };

  return (
    <div className="skill-forest-new" ref={sectionRef}>
      {/* Forest Background */}
      <div className="forest-bg">
        <div className="light-rays"></div>
        <div className="trees-layer"></div>
        <div className="mist-layer"></div>
        <div className="leaves-floating">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="leaf" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>
        <div className="fireflies">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="firefly" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="forest-content">
        {/* Header */}
        <motion.div
          className="forest-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="leaf-icon">🌿</div>
          <h1>SKILL FOREST</h1>
          <div className="leaf-icon">🌿</div>
          <p className="tagline">Rooted in fundamentals. Growing through experience. Thriving in impact.</p>
        </motion.div>

        {/* Skills Tree Container */}
        <div className="skills-tree-container">
          {/* Trunk visualization */}
          <div className="tree-trunk-visual"></div>

          {/* Skill Categories */}
          <div className="skill-categories-grid">
            {skillCategories.map((category, catIndex) => {
              const categorySkills = getSkillsByCategory(category.id);

              return (
                <motion.div
                  key={category.id}
                  className="skill-category-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.15, duration: 0.6 }}
                >
                  {/* Category Label */}
                  <div className="category-label" style={{ borderColor: category.color }}>
                    <div className="category-icon">
                      {category.id === 'languages' && '< />'}
                      {category.id === 'ai' && '🧠'}
                      {category.id === 'cloud' && '☁️'}
                      {category.id === 'devops' && '⚙️'}
                      {category.id === 'frontend' && '🌐'}
                      {category.id === 'backend' && '💾'}
                    </div>
                    <span>{category.name.toUpperCase()}</span>
                  </div>

                  {/* Skills Badges */}
                  <div className="skills-badges">
                    {categorySkills.slice(0, 8).map((skill, skillIndex) => (
                      <motion.div
                        key={skill.id}
                        className="skill-badge-item"
                        style={{
                          backgroundColor: category.color + '20',
                          borderColor: category.color
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        onClick={() => handleSkillClick(skill)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: catIndex * 0.15 + skillIndex * 0.05 }}
                      >
                        <span className="skill-name">{skill.name}</span>
                        <div
                          className="skill-level-dot"
                          style={{ backgroundColor: getLevelColor(skill.level) }}
                        ></div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer Tagline */}
        <motion.div
          className="forest-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="leaf-small">🍃</div>
          <p>Continuous learning. Real world impact.</p>
        </motion.div>

        {/* Proficiency Legend - only show when section is visible */}
        <AnimatePresence>
          {showLegend && (
            <motion.div
              className="proficiency-legend"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <h4>Proficiency Level</h4>
              <div className="legend-items">
                <div className="legend-item">
                  <div className="legend-dot" style={{ backgroundColor: '#4ADE80' }}></div>
                  <span>Beginner</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ backgroundColor: '#FBBF24' }}></div>
                  <span>Intermediate</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ backgroundColor: '#F87171' }}></div>
                  <span>Advanced</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ backgroundColor: '#A78BFA' }}></div>
                  <span>Expert</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            className="skill-side-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <button className="close-panel" onClick={closeSidePanel}>✕</button>

            <div className="panel-content">
              <div className="skill-icon-large">
                <div className="icon-circle" style={{
                  backgroundColor: skillCategories.find(c => c.id === selectedSkill.categoryId)?.color + '40'
                }}>
                  {selectedSkill.name.charAt(0)}
                </div>
              </div>

              <h2>{selectedSkill.name}</h2>

              {selectedSkill.years && (
                <p className="experience-text">{selectedSkill.years} Years Experience</p>
              )}

              <div className="proficiency-display">
                <div className="proficiency-bar">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`bar-segment ${i < selectedSkill.level ? 'filled' : ''}`}
                      style={{
                        backgroundColor: i < selectedSkill.level ? getLevelColor(selectedSkill.level) : '#374151'
                      }}
                    ></div>
                  ))}
                </div>
                <span className="proficiency-label">{getLevelText(selectedSkill.level)}</span>
              </div>

              <div className="panel-section">
                <h3>Expertise</h3>
                <div className="expertise-tags">
                  <span className="tag">AI Development</span>
                  <span className="tag">Automation</span>
                  <span className="tag">Backend</span>
                  <span className="tag">Data Processing</span>
                  <span className="tag">Scripting</span>
                </div>
              </div>

              <div className="panel-section">
                <h3>Projects</h3>
                <ul className="projects-list">
                  <li>✓ AI Security Framework</li>
                  <li>✓ CostSense.ai</li>
                  <li>✓ Agentic Extraction System</li>
                  <li>✓ ADK Multi-Agent Projects</li>
                </ul>
                <a href="#" className="view-all-link">View all →</a>
              </div>

              <div className="panel-section">
                <h3>Certifications</h3>
                <ul className="certifications-list">
                  <li>⊙ AWS Certified Developer</li>
                  <li>⊙ Google Cloud Professional</li>
                  <li>⊙ Microsoft Azure Fundamentals</li>
                </ul>
                <a href="#" className="view-all-link">View all →</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay when panel is open */}
      {selectedSkill && (
        <motion.div
          className="panel-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSidePanel}
        />
      )}
    </div>
  );
};

export default SkillForestNew;
