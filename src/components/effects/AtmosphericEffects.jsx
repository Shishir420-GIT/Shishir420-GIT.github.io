import './AtmosphericEffects.css';

const AtmosphericEffects = () => {
  return (
    <div className="atmospheric-bg">
      <div className="atmos-light-rays"></div>
      <div className="atmos-mist-layer"></div>
      <div className="atmos-leaves-floating">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="atmos-leaf"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>
      <div className="atmos-fireflies">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="atmos-firefly"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AtmosphericEffects;
