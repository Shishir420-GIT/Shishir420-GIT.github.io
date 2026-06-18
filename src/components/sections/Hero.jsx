import SlideIn from '../animations/SlideIn';
import FadeIn from '../animations/FadeIn';
import './Hero.css';

const Hero = ({ config }) => {
  const name = config.header?.greeting || config.personal?.name || 'Shishir Srivastav';
  const tagline = config.header?.tagline || config.personal?.tagline || 'AI Security Engineer';
  const philosophy = config.hero?.philosophy || 'Building intelligent systems.';
  const headshot = config.personal?.headshot || '/assets/hero-section/shishir-img.png';

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Headshot - slides in from left */}
        <SlideIn direction="left" duration={0.6} className="hero-headshot-wrapper">
          <img
            src={headshot}
            alt={name}
            className="hero-headshot"
          />
        </SlideIn>

        {/* Content - slides in from right with stagger */}
        <div className="hero-content">
          <SlideIn direction="right" delay={0.2} duration={0.5}>
            <h1 className="hero-name gradient-text">{name}</h1>
          </SlideIn>

          <SlideIn direction="right" delay={0.4} duration={0.5}>
            <h2 className="hero-tagline">{tagline}</h2>
          </SlideIn>

          <SlideIn direction="right" delay={0.6} duration={0.5}>
            <p className="hero-philosophy">{philosophy}</p>
          </SlideIn>

          {/* Focus areas */}
          {config.hero?.focus && config.hero.focus.length > 0 && (
            <SlideIn direction="right" delay={0.8} duration={0.5}>
              <div className="hero-focus">
                {config.hero.focus.map((item, index) => (
                  <span key={index} className="focus-tag">
                    {item}
                  </span>
                ))}
              </div>
            </SlideIn>
          )}

          {/* CTA Buttons */}
          <SlideIn direction="right" delay={1.0} duration={0.5}>
            <div className="hero-cta-container">
              {config.youtube?.channel_url && (
                <a
                  href={config.youtube.channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-cta hero-cta-secondary"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Watch My YouTube
                </a>
              )}

              {config.contact?.booking_url && (
                <a
                  href={config.contact.booking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-cta hero-cta-primary"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Book a 1:1 Session
                </a>
              )}
            </div>
          </SlideIn>
        </div>
      </div>

      {/* Social Links - Glassmorphism */}
      {config.social_links && config.social_links.length > 0 && (
        <FadeIn delay={1.0} className="hero-social-section">
          <span className="hero-social-label">Find me on:</span>
          <div className="hero-social-links">
            {config.social_links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                title={link.name}
              >
                {link.name}
              </a>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Scroll Indicator */}
      <FadeIn delay={1.2} className="scroll-indicator">
        <div className="scroll-arrow">
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
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
        <span className="scroll-text">Scroll to explore</span>
      </FadeIn>
    </section>
  );
};

export default Hero;
