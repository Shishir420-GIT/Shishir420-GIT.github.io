import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import AtmosphericEffects from '../effects/AtmosphericEffects';
import './About.css';

const About = ({ config }) => {
  const paragraphs = config.about?.paragraphs || [];

  return (
    <section className="about-section">
      <AtmosphericEffects />
      <div className="about-container">
        <FadeIn>
          <h2 className="section-title">About Me</h2>
        </FadeIn>

        <div className="about-content">
          {/* Who I Am */}
          <SlideIn direction="left" delay={0.2}>
            <div className="about-block">
              <h3 className="about-subtitle">Who I Am</h3>
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="about-text">
                  {paragraph}
                </p>
              ))}
            </div>
          </SlideIn>

          {/* What I Do */}
          {config.hero?.focus && config.hero.focus.length > 0 && (
            <SlideIn direction="right" delay={0.4}>
              <div className="about-block">
                <h3 className="about-subtitle">What I Do</h3>
                <div className="focus-grid">
                  {config.hero.focus.map((item, index) => (
                    <div key={index} className="focus-item">
                      <span className="focus-bullet">→</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SlideIn>
          )}

          {/* Philosophy */}
          {config.hero?.philosophy && (
            <SlideIn direction="up" delay={0.6}>
              <div className="about-block philosophy-block">
                <h3 className="about-subtitle">My Approach</h3>
                <p className="philosophy-text">{config.hero.philosophy}</p>
              </div>
            </SlideIn>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
