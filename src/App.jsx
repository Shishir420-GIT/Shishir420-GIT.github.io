import { useState, useEffect, useMemo, useCallback } from 'react';
import { loadConfig } from './utils/configLoader';

// Sections
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import SkillsTree from './components/sections/SkillsTree';
import ExperienceTimeline from './components/sections/ExperienceTimeline';
import ProjectsGallery from './components/sections/ProjectsGallery';
import Writing from './components/sections/Writing';
import YouTube from './components/sections/YouTube';
import Certifications from './components/sections/Certifications';
import Contact from './components/sections/Contact';

// UI Components
import NavigationDots from './components/ui/NavigationDots';
import MatrixBackground from './components/ui/MatrixBackground';

import './styles/global.css';

function App() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const loadedConfig = await loadConfig();
        setConfig(loadedConfig);
      } catch (error) {
        console.error('Failed to load config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Define sections in order: Hero → About → Projects → YouTube → Writing → Experience → Skills → Certifications → Contact
  // Memoize sections array to prevent unnecessary re-renders
  const sections = useMemo(() => [
    { id: 'hero', component: Hero, enabled: true },
    { id: 'about', component: About, enabled: config?.features?.about !== false },
    { id: 'projects', component: ProjectsGallery, enabled: config?.features?.projects !== false },
    { id: 'youtube', component: YouTube, enabled: config?.youtube?.channel_id },
    { id: 'writing', component: Writing, enabled: config?.writing?.hashnode_host },
    { id: 'experience', component: ExperienceTimeline, enabled: config?.features?.experience !== false },
    { id: 'skills', component: SkillsTree, enabled: config?.features?.skills !== false },
    { id: 'certifications', component: Certifications, enabled: true },
    { id: 'contact', component: Contact, enabled: true }
  ].filter(section => section.enabled), [config]);

  // Handle scroll to section
  const scrollToSection = (index) => {
    const sectionElement = document.getElementById(`section-${index}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track active section on scroll
  useEffect(() => {
    // Get the scroll container - could be #root or window
    const scrollContainer = document.getElementById('root') || window;
    const isRootScroll = scrollContainer !== window;

    const handleScroll = () => {
      // Use viewport-relative positions with getBoundingClientRect
      let currentSection = 0;
      let closestSection = 0;
      let closestDistance = -Infinity; // Track the section closest to top that has scrolled past

      sections.forEach((_, index) => {
        const sectionElement = document.getElementById(`section-${index}`);
        if (sectionElement) {
          const rect = sectionElement.getBoundingClientRect();

          // A section is "active" when its top has passed the top of the viewport
          // We want the section whose top is closest to 0 (but negative or just past top)
          // This means: rect.top <= threshold, and we pick the largest (least negative) value

          const threshold = window.innerHeight * 0.3; // Trigger when section is 30% into viewport

          if (rect.top <= threshold) {
            // Section has scrolled past the threshold
            // Pick the one with the largest rect.top (closest to current view)
            if (rect.top > closestDistance) {
              closestDistance = rect.top;
              closestSection = index;
            }
          }
        }
      });

      setActiveSection(closestSection);
    };

    // Initial check
    handleScroll();

    // Add scroll listener to the correct container
    if (isRootScroll) {
      scrollContainer.addEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (isRootScroll) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [sections]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: 'var(--color-text-primary)',
        fontSize: 'var(--font-size-xl)'
      }}>
        Loading...
      </div>
    );
  }

  if (!config) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: 'var(--color-text-primary)',
        fontSize: 'var(--font-size-xl)'
      }}>
        Failed to load configuration
      </div>
    );
  }

  return (
    <>
      {/* Matrix Background Effect */}
      <MatrixBackground />

      {/* Main Content */}
      <div className="app-container">
        {sections.map((section, index) => {
          const SectionComponent = section.component;
          return (
            <div
              key={section.id}
              id={`section-${index}`}
              className="section-wrapper"
            >
              <SectionComponent config={config} />
            </div>
          );
        })}
      </div>

      {/* Navigation Dots */}
      <NavigationDots
        sections={sections}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />
    </>
  );
}

export default App;
