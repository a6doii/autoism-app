import React from 'react';

const SPARKS = [
  { top: '4%',  left: '10%', char: '✦', size: '1rem',    color: '#38bdf8', delay: '0s',    dur: '2.2s' },
  { top: '2%',  left: '60%', char: '✧', size: '0.8rem',  color: '#a78bfa', delay: '0.5s',  dur: '2.7s' },
  { top: '6%',  left: '84%', char: '✦', size: '1.1rem',  color: '#fbbf24', delay: '1s',    dur: '2s'   },
  { top: '44%', left: '-5%', char: '★', size: '0.85rem', color: '#34d399', delay: '1.3s',  dur: '2.5s' },
  { top: '42%', left: '97%', char: '✦', size: '0.9rem',  color: '#f472b6', delay: '0.3s',  dur: '2.8s' },
  { top: '74%', left: '7%',  char: '✧', size: '0.75rem', color: '#38bdf8', delay: '1.6s',  dur: '2.1s' },
  { top: '76%', left: '86%', char: '✦', size: '1rem',    color: '#a78bfa', delay: '0.7s',  dur: '2.4s' },
  { top: '22%', left: '93%', char: '★', size: '0.65rem', color: '#fbbf24', delay: '2s',    dur: '2.3s' },
];

const MascotSparkle = ({ src, alt, width, wrapperStyle }) => (
  <div className="mascot-sparkle-wrapper" style={wrapperStyle}>
    {SPARKS.map((s, i) => (
      <span
        key={i}
        className="spark"
        style={{
          top: s.top,
          left: s.left,
          fontSize: s.size,
          color: s.color,
          animationDelay: s.delay,
          animationDuration: s.dur,
        }}
      >
        {s.char}
      </span>
    ))}
    <img
      src={src}
      alt={alt}
      className="mascot-img-sparkle"
      style={{ width, objectFit: 'contain' }}
    />
  </div>
);

export default MascotSparkle;
