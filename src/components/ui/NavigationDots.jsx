import './NavigationDots.css';

const NavigationDots = ({ sections, activeSection, onNavigate }) => {
  return (
    <nav className="navigation-dots" aria-label="Section navigation">
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => onNavigate(index)}
          className={`nav-dot ${index === activeSection ? 'active' : ''}`}
          aria-label={`Go to ${section.id} section`}
          title={section.id.charAt(0).toUpperCase() + section.id.slice(1)}
        >
          <span className="nav-dot-inner"></span>
        </button>
      ))}
    </nav>
  );
};

export default NavigationDots;
