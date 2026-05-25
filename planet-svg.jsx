// 행성 SVG 컴포넌트들 — radial gradient + 표면 패턴
function PlanetSVG({ planet, size = 200, spinning = true, tilt = 0, dayMode = true, showRing = true, ringTilt = 15 }) {
  const id = planet.id;
  const r = 100;
  const spinDur = spinning ? `${planet.spinSpeed || 20}s` : '0s';

  // 행성별 표면 패턴
  const renderSurface = () => {
    if (id === 'sun') {
      return (
        <g>
          <circle cx="100" cy="100" r="95" fill={`url(#${id}-grad)`} />
          {[...Array(14)].map((_, i) => {
            const a = (i / 14) * Math.PI * 2;
            const r1 = 60 + Math.random() * 15;
            return <circle key={i} cx={100 + Math.cos(a) * r1} cy={100 + Math.sin(a) * r1} r={6 + Math.random() * 6} fill="#FF7B00" opacity="0.35" />;
          })}
          <circle cx="78" cy="85" r="8" fill="#7a2900" opacity="0.5" />
          <circle cx="125" cy="115" r="6" fill="#7a2900" opacity="0.4" />
        </g>
      );
    }
    if (id === 'mercury') {
      const surfaceColor = dayMode ? planet.color : '#3a4a6b';
      return (
        <g>
          <circle cx="100" cy="100" r="95" fill={dayMode ? `url(#${id}-grad)` : `url(#${id}-grad-night)`} />
          {/* craters */}
          <circle cx="70" cy="80" r="14" fill={dayMode ? '#6e5a47' : '#26334d'} opacity="0.55" />
          <circle cx="125" cy="120" r="9" fill={dayMode ? '#6e5a47' : '#26334d'} opacity="0.5" />
          <circle cx="105" cy="60" r="6" fill={dayMode ? '#6e5a47' : '#26334d'} opacity="0.55" />
          <circle cx="140" cy="85" r="5" fill={dayMode ? '#6e5a47' : '#26334d'} opacity="0.55" />
          <circle cx="80" cy="135" r="7" fill={dayMode ? '#6e5a47' : '#26334d'} opacity="0.5" />
          <circle cx="60" cy="115" r="4" fill={dayMode ? '#6e5a47' : '#26334d'} opacity="0.5" />
        </g>
      );
    }
    if (id === 'venus') {
      return (
        <g>
          <circle cx="100" cy="100" r="95" fill={`url(#${id}-grad)`} />
          {/* swirling clouds */}
          <path d="M30 90 Q100 70, 170 95" stroke="#fff6d8" strokeWidth="6" fill="none" opacity="0.45" />
          <path d="M35 120 Q100 105, 165 125" stroke="#fff6d8" strokeWidth="5" fill="none" opacity="0.4" />
          <path d="M50 65 Q100 55, 150 70" stroke="#fff6d8" strokeWidth="4" fill="none" opacity="0.35" />
          <path d="M45 145 Q100 140, 155 150" stroke="#fff6d8" strokeWidth="4" fill="none" opacity="0.35" />
        </g>
      );
    }
    if (id === 'earth') {
      return (
        <g>
          <circle cx="100" cy="100" r="95" fill={`url(#${id}-grad)`} />
          {/* continents */}
          <path d="M55 75 Q70 60 90 70 Q100 85 85 95 Q70 100 55 90 Z" fill="#3fa863" />
          <path d="M110 60 Q130 55 140 75 Q138 85 125 80 Q115 78 110 60 Z" fill="#3fa863" />
          <path d="M105 110 Q130 105 145 120 Q150 140 130 145 Q115 142 105 130 Z" fill="#3fa863" />
          <path d="M65 130 Q80 125 85 140 Q80 155 70 150 Q60 145 65 130 Z" fill="#3fa863" />
          {/* clouds */}
          <ellipse cx="80" cy="55" rx="22" ry="5" fill="#fff" opacity="0.6" />
          <ellipse cx="140" cy="100" rx="18" ry="4" fill="#fff" opacity="0.5" />
        </g>
      );
    }
    if (id === 'mars') {
      return (
        <g>
          <circle cx="100" cy="100" r="95" fill={`url(#${id}-grad)`} />
          <circle cx="75" cy="85" r="12" fill="#8c3220" opacity="0.5" />
          <circle cx="130" cy="115" r="10" fill="#8c3220" opacity="0.45" />
          <circle cx="115" cy="70" r="7" fill="#8c3220" opacity="0.5" />
          <ellipse cx="100" cy="35" rx="35" ry="8" fill="#fff" opacity="0.55" />
          <ellipse cx="100" cy="165" rx="30" ry="7" fill="#fff" opacity="0.55" />
        </g>
      );
    }
    if (id === 'jupiter') {
      return (
        <g>
          <circle cx="100" cy="100" r="95" fill={`url(#${id}-grad)`} />
          <ellipse cx="100" cy="60" rx="95" ry="6" fill="#b88858" opacity="0.6" />
          <ellipse cx="100" cy="80" rx="95" ry="5" fill="#ead8b8" opacity="0.45" />
          <ellipse cx="100" cy="100" rx="95" ry="7" fill="#a87648" opacity="0.55" />
          <ellipse cx="100" cy="120" rx="95" ry="5" fill="#ead8b8" opacity="0.4" />
          <ellipse cx="100" cy="140" rx="95" ry="6" fill="#b88858" opacity="0.55" />
          {/* great red spot */}
          <ellipse cx="130" cy="115" rx="18" ry="9" fill="#c94a3d" opacity="0.85" />
        </g>
      );
    }
    if (id === 'saturn') {
      return (
        <g>
          <circle cx="100" cy="100" r="95" fill={`url(#${id}-grad)`} />
          <ellipse cx="100" cy="75" rx="95" ry="5" fill="#c9a560" opacity="0.5" />
          <ellipse cx="100" cy="100" rx="95" ry="6" fill="#f0dba0" opacity="0.4" />
          <ellipse cx="100" cy="125" rx="95" ry="5" fill="#c9a560" opacity="0.5" />
        </g>
      );
    }
    if (id === 'uranus') {
      return (
        <g>
          <circle cx="100" cy="100" r="95" fill={`url(#${id}-grad)`} />
          <ellipse cx="100" cy="100" rx="95" ry="3" fill="#fff" opacity="0.2" />
          <ellipse cx="100" cy="80" rx="90" ry="2" fill="#fff" opacity="0.15" />
          <ellipse cx="100" cy="120" rx="90" ry="2" fill="#fff" opacity="0.15" />
        </g>
      );
    }
    if (id === 'neptune') {
      return (
        <g>
          <circle cx="100" cy="100" r="95" fill={`url(#${id}-grad)`} />
          <ellipse cx="80" cy="85" rx="20" ry="8" fill="#1a3ab0" opacity="0.7" />
          <ellipse cx="135" cy="125" rx="14" ry="6" fill="#1a3ab0" opacity="0.6" />
          <ellipse cx="100" cy="60" rx="90" ry="3" fill="#fff" opacity="0.2" />
          <ellipse cx="100" cy="140" rx="80" ry="2" fill="#fff" opacity="0.15" />
        </g>
      );
    }
    return <circle cx="100" cy="100" r="95" fill={planet.color} />;
  };

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`${id}-grad`} cx="35%" cy="35%">
          <stop offset="0%" stopColor={planet.glow} />
          <stop offset="70%" stopColor={planet.color} />
          <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id={`${id}-grad-night`} cx="35%" cy="35%">
          <stop offset="0%" stopColor="#5a7099" />
          <stop offset="70%" stopColor="#2a3a5e" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.7" />
        </radialGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={planet.glow} stopOpacity="0.6" />
          <stop offset="60%" stopColor={planet.glow} stopOpacity="0.15" />
          <stop offset="100%" stopColor={planet.glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sun glow */}
      {id === 'sun' && (
        <circle cx="100" cy="100" r="140" fill={`url(#${id}-glow)`} className="sun-pulse" />
      )}

      <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '100px 100px' }}>
        {/* 토성 뒷쪽 고리 */}
        {planet.hasRings && showRing && (
          <g style={{ transform: `rotate(${ringTilt}deg)`, transformOrigin: '100px 100px' }}>
            <ellipse cx="100" cy="100" rx="155" ry="20" fill="none" stroke="#f4dca0" strokeWidth="6" opacity="0.7" />
            <ellipse cx="100" cy="100" rx="135" ry="16" fill="none" stroke="#d4b06a" strokeWidth="4" opacity="0.85" />
          </g>
        )}

        {/* 자전하는 행성 본체 */}
        <g className="planet-spin" style={{ '--spin-duration': spinDur, transformOrigin: '100px 100px' }}>
          {renderSurface()}
        </g>

        {/* 토성 앞쪽 고리 (행성의 일부를 가림) */}
        {planet.hasRings && showRing && (
          <g style={{ transform: `rotate(${ringTilt}deg)`, transformOrigin: '100px 100px' }}>
            <path
              d="M -55 100 A 155 20 0 0 0 255 100"
              fill="none"
              stroke="#f4dca0"
              strokeWidth="6"
              opacity="0.85"
              transform="translate(0,0)"
              style={{ display: 'none' }}
            />
            <ellipse cx="100" cy="100" rx="155" ry="20" fill="none" stroke="#f4dca0" strokeWidth="3" opacity="0.5" strokeDasharray="200 1000" strokeDashoffset="-100" />
          </g>
        )}

        {/* 회전축 표시 (천왕성/지구 비교용) */}
        {planet.tiltAxis && tilt !== 0 && (
          <line x1="100" y1="-10" x2="100" y2="210" stroke="#FFD93D" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
        )}
      </g>
    </svg>
  );
}

// 별 배경
function Starfield({ count = 100 }) {
  const stars = React.useMemo(() => {
    return [...Array(count)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.6 + 0.4,
      delay: Math.random() * 5,
      dur: 2 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.7,
    }));
  }, [count]);
  return (
    <svg className="starfield" viewBox="0 0 100 100" preserveAspectRatio="none">
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.18} fill="#fff" opacity={s.opacity}>
          <animate attributeName="opacity" values={`${s.opacity};0.1;${s.opacity}`} dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

Object.assign(window, { PlanetSVG, Starfield });
