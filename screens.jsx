// 화면들: Intro, Home(orbit), Detail, Completion

// ───────────────────────────────────────────────
// Intro Screen
// ───────────────────────────────────────────────
function IntroScreen({ onStart, motionReduced }) {
  const [selectedMode, setSelectedMode] = React.useState(null); // null | 'kids' | 'advanced'
  const [launching, setLaunching] = React.useState(false);
  const handleStart = () => {
    if (!selectedMode) return;
    setLaunching(true);
    setTimeout(() => onStart(selectedMode), motionReduced ? 100 : 1100);
  };
  return (
    <div className="screen intro-screen" data-screen-label="01 Intro">
      <Starfield count={120} />
      <div className={`rocket-wrap ${launching ? 'launching' : 'floating'}`}>
        <svg viewBox="0 0 120 200" width="180" height="280">
          <defs>
            <linearGradient id="rocket-body" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#FFE5A0" />
            </linearGradient>
          </defs>
          {/* fire */}
          <g className="rocket-fire">
            <ellipse cx="60" cy="180" rx="14" ry="22" fill="#FFD93D" />
            <ellipse cx="60" cy="185" rx="9" ry="15" fill="#FF6B9D" />
            <ellipse cx="60" cy="188" rx="5" ry="9" fill="#fff" />
          </g>
          {/* body */}
          <path d="M60 10 Q85 50 85 110 L85 150 L35 150 L35 110 Q35 50 60 10 Z" fill="url(#rocket-body)" stroke="#2A2D5B" strokeWidth="3" />
          {/* window */}
          <circle cx="60" cy="80" r="14" fill="#4ECDC4" stroke="#2A2D5B" strokeWidth="3" />
          <circle cx="56" cy="76" r="4" fill="#fff" opacity="0.7" />
          {/* fins */}
          <path d="M35 130 L15 165 L35 155 Z" fill="#FF6B9D" stroke="#2A2D5B" strokeWidth="3" />
          <path d="M85 130 L105 165 L85 155 Z" fill="#FF6B9D" stroke="#2A2D5B" strokeWidth="3" />
          <rect x="35" y="148" width="50" height="10" rx="3" fill="#FF6B9D" stroke="#2A2D5B" strokeWidth="3" />
        </svg>
      </div>
      <h1 className="intro-title">우리 태양계 친구들을<br/>만나러 갈까요?</h1>
      <p className="intro-sub">먼저 모드를 골라줘</p>
      <div className="intro-mode-grid">
        <button
          className={`mode-button mode-kids ${selectedMode === 'kids' ? 'selected' : ''}`}
          onClick={() => setSelectedMode('kids')}
          disabled={launching}
          aria-pressed={selectedMode === 'kids'}
        >
          <div className="mode-emoji">🌈</div>
          <div className="mode-title">유아용</div>
          <div className="mode-desc">친구처럼 인사하고<br/>재미있게 놀아요</div>
        </button>
        <button
          className={`mode-button mode-advanced ${selectedMode === 'advanced' ? 'selected' : ''}`}
          onClick={() => setSelectedMode('advanced')}
          disabled={launching}
          aria-pressed={selectedMode === 'advanced'}
        >
          <div className="mode-emoji">📚</div>
          <div className="mode-title">초등 4~6학년</div>
          <div className="mode-desc">사진·수치·탐사 기록까지<br/>제대로 공부해요</div>
        </button>
      </div>
      <button
        className="big-button pink-button intro-launch-button"
        onClick={handleStart}
        disabled={!selectedMode || launching}
      >
        🚀 출발!
      </button>
      <p className="intro-sub-foot">9개의 우주 친구가 너를 기다리고 있어!</p>
    </div>
  );
}

// ───────────────────────────────────────────────
// Home Screen — 태양계 지도 (orbit)
// ───────────────────────────────────────────────
function HomeScreen({ planets, onSelect, visited, orbitSpeed, motionReduced, layout }) {
  const [hoveredId, setHoveredId] = React.useState(null);
  const sun = planets[0];
  const others = planets.slice(1);

  // Measure orbit-stage container so layout adapts to whatever size it ends up
  const stageRef = React.useRef(null);
  const [stageSize, setStageSize] = React.useState(600);
  React.useEffect(() => {
    if (!stageRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setStageSize(Math.min(r.width, r.height));
    });
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);

  // Outermost orbit (Neptune r=7.7) should span ~92% of stage diameter
  const unit = stageSize * 0.92 / (2 * 7.7);
  // Sun visual diameter — kept smaller than Mercury's orbit radius (2.0 × unit)
  const sunDiameter = Math.max(58, 1.3 * unit);
  // Planet visual: scales with size, generous minimum so it's still readable
  const planetDiameter = (p) => Math.max(44, p.size * unit * 1.05);
  // Invisible touch target — always ≥ 64px and pads beyond visible body
  const touchTarget = (p) => Math.max(72, planetDiameter(p) + 28);

  return (
    <div className="screen home-screen" data-screen-label="02 Home">
      <Starfield count={180} />

      {/* Progress dots */}
      <div className="progress-bar">
        {planets.map((p) => (
          <span key={p.id} className={`progress-dot ${visited.includes(p.id) ? 'visited' : ''}`} title={p.name} />
        ))}
        <span className="progress-text">{visited.length} / {planets.length}</span>
      </div>

      <h2 className="home-title">어떤 친구를 만날까?</h2>
      <p className="home-sub">행성을 콕! 눌러봐</p>

      <div className="orbit-stage" ref={stageRef}>
        {/* 궤도 선 */}
        {others.map((p, i) => (
          <div
            key={'orbit-' + p.id}
            className="orbit-ring"
            style={{
              width: p.orbitRadius * 2 * unit,
              height: p.orbitRadius * 2 * unit,
            }}
          />
        ))}

        {/* 태양 (중심) */}
        <button
          className={`planet-handle sun-handle ${hoveredId === sun.id ? 'hovered' : ''} ${visited.includes(sun.id) ? 'visited' : ''}`}
          style={{ width: Math.max(96, sunDiameter + 24), height: Math.max(96, sunDiameter + 24) }}
          onClick={() => onSelect(sun.id)}
          onMouseEnter={() => setHoveredId(sun.id)}
          onMouseLeave={() => setHoveredId(null)}
          aria-label={sun.name}
        >
          <span className="planet-visual" style={{ width: sunDiameter, height: sunDiameter }}>
            <PlanetSVG planet={sun} size={sunDiameter} spinning={!motionReduced} />
          </span>
          <span className="planet-name-tag sun-name-tag">{sun.name}</span>
        </button>

        {/* 행성들 (공전) */}
        {others.map((p, i) => {
          const orbitDur = motionReduced ? 0 : (p.orbitSpeed * (40 / orbitSpeed));
          const startAngle = (i * 47) % 360;
          const dia = planetDiameter(p);
          const target = touchTarget(p);
          const orbitStyle = {
            width: p.orbitRadius * 2 * unit,
            height: p.orbitRadius * 2 * unit,
          };
          if (orbitDur) {
            orbitStyle.animationDuration = `${orbitDur}s`;
            orbitStyle.animationDelay = `${-(startAngle / 360) * orbitDur}s`;
            orbitStyle.animationPlayState = 'running';
          } else {
            orbitStyle.animation = 'none';
            orbitStyle.transform = `translate(-50%, -50%) rotate(${startAngle}deg)`;
          }
          return (
            <div key={p.id} className="orbiter" style={orbitStyle}>
              <button
                className={`planet-handle ${hoveredId === p.id ? 'hovered' : ''} ${visited.includes(p.id) ? 'visited' : ''}`}
                style={{
                  width: target,
                  height: target,
                  animationDuration: orbitDur ? `${orbitDur}s` : '0s',
                  animationDelay: orbitDur ? `${-(startAngle / 360) * orbitDur}s` : '0s',
                  animationPlayState: orbitDur ? 'running' : 'paused',
                }}
                onClick={() => onSelect(p.id)}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={p.name}
              >
                <span className="planet-visual" style={{ width: dia, height: dia }}>
                  <PlanetSVG planet={p} size={dia} spinning={!motionReduced} />
                </span>
                <span className="planet-name-tag">{p.name}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Detail Screen — 행성 상세
// ───────────────────────────────────────────────
function DetailScreen({ planet, onBack, onNext, onSpeak, ttsEnabled, karaokeEnabled, motionReduced, nextPlanet }) {
  const [flipped, setFlipped] = React.useState({});
  const [ringTilt, setRingTilt] = React.useState(15);
  const [dayMode, setDayMode] = React.useState(true);
  const [showTilt, setShowTilt] = React.useState(false);
  const [moonAngle, setMoonAngle] = React.useState(0);
  const [bounce, setBounce] = React.useState(false);
  const [karaokeIdx, setKaraokeIdx] = React.useState(-1);
  const karaokeTimers = React.useRef([]);

  // 단어 분리
  const introWords = React.useMemo(() => planet.intro.split(/(\s+)/).filter(w => w.length), [planet.intro]);

  const clearKaraoke = () => {
    karaokeTimers.current.forEach((t) => clearTimeout(t));
    karaokeTimers.current = [];
    setKaraokeIdx(-1);
  };

  const playChime = (freq = 660) => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      o.connect(g); g.connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + 0.28);
      setTimeout(() => ctx.close(), 400);
    } catch (e) {}
  };

  const playKaraoke = () => {
    clearKaraoke();
    const realWords = introWords.filter(w => w.trim().length);
    let realIdx = 0;
    introWords.forEach((w, i) => {
      if (!w.trim().length) return;
      const t = setTimeout(() => {
        setKaraokeIdx(i);
        // pitch goes up slightly per word
        playChime(540 + (realIdx % 5) * 60);
        realIdx++;
      }, realIdx * 420);
      karaokeTimers.current.push(t);
    });
    const endT = setTimeout(() => setKaraokeIdx(-1), realWords.length * 420 + 600);
    karaokeTimers.current.push(endT);
  };

  // animate moon
  React.useEffect(() => {
    if (!planet.moons || motionReduced) return;
    let raf;
    const tick = () => { setMoonAngle((a) => (a + 0.7) % 360); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [planet.id, motionReduced]);

  // Responsive planet stage size
  const stageRef = React.useRef(null);
  const [stageDim, setStageDim] = React.useState(280);
  React.useEffect(() => {
    if (!stageRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setStageDim(Math.min(r.width, r.height));
    });
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);
  const planetSize = stageDim * 0.85;
  const moonRadius = stageDim * 0.5;

  // Saturn ring drag
  const handleRingDrag = (e) => {
    if (!planet.hasRings || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - cx;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - cy;
    let angle = Math.atan2(y, x) * 180 / Math.PI;
    angle = Math.max(-40, Math.min(40, angle));
    setRingTilt(angle);
  };

  const speakIntro = () => {
    if (karaokeEnabled) {
      playKaraoke();
    } else if (ttsEnabled) {
      if (onSpeak) onSpeak(planet.audioText);
    }
  };

  const handleCardClick = (idx, fact) => {
    const willFlip = !flipped[idx];
    setFlipped((f) => ({ ...f, [idx]: !f[idx] }));
    setBounce(true);
    setTimeout(() => setBounce(false), 300);
    if (fact.interactive === 'daynight') setDayMode((d) => !d);
    if (fact.interactive === 'tilt') setShowTilt((t) => !t);
    if (fact.interactive === 'rings') setRingTilt((t) => (t === 15 ? -25 : 15));
    if (willFlip && ttsEnabled && onSpeak) onSpeak(fact.text);
  };

  React.useEffect(() => {
    setFlipped({});
    setRingTilt(15);
    setDayMode(true);
    setShowTilt(false);
    clearKaraoke();
    if (ttsEnabled || karaokeEnabled) {
      const t = setTimeout(() => speakIntro(), 500);
      return () => clearTimeout(t);
    }
  }, [planet.id]);

  React.useEffect(() => () => clearKaraoke(), []);

  const planetTilt = planet.tiltAxis && showTilt ? 90 : 0;

  return (
    <div className="screen detail-screen" data-screen-label={`03 ${planet.name}`} style={{ '--planet-color': planet.color, '--planet-glow': planet.glow }}>
      <Starfield count={80} />

      <header className="detail-header">
        <button className="ghost-button" onClick={onBack} aria-label="우주로 돌아가기">
          ← 우주로 돌아가기
        </button>
        <button className="ghost-button" onClick={speakIntro} aria-label="들려줘">
          {karaokeEnabled ? '✨ 따라 읽기' : ttsEnabled ? '🔊 들려줘' : '🔇 음성 꺼짐'}
        </button>
      </header>

      <div className="detail-body">
        <div className="detail-left">
          <div className="planet-stage" ref={stageRef}
            onMouseMove={planet.hasRings ? (e) => { if (e.buttons === 1) handleRingDrag(e); } : null}
            onTouchMove={planet.hasRings ? handleRingDrag : null}>
            <div className={`planet-big ${bounce ? 'bounce' : ''}`}>
              <PlanetSVG
                planet={planet}
                size={planetSize}
                spinning={!motionReduced}
                tilt={planetTilt}
                dayMode={dayMode}
                ringTilt={ringTilt}
              />
              {planet.moons && planet.moons.map((m, i) => {
                const a = (moonAngle + i * 137) * Math.PI / 180;
                const x = Math.cos(a) * moonRadius;
                const y = Math.sin(a) * moonRadius * 0.4;
                return (
                  <div key={i} className="moon" style={{ background: m.color, transform: `translate(${x}px, ${y}px)` }} title={m.name}>
                    <span className="moon-label">{m.name}</span>
                  </div>
                );
              })}
            </div>
            {planet.hasRings && (
              <p className="hint-text">💡 고리를 드래그해서 기울여봐!</p>
            )}
          </div>
        </div>

        <div className="detail-right">
          <h1 className="planet-name">
            {planet.emoji} {planet.name}
          </h1>
          <p className="planet-intro">
            {introWords.map((w, i) => (
              w.trim().length
                ? <span key={i} className={`intro-word ${i === karaokeIdx ? 'karaoke-active' : ''} ${karaokeIdx > -1 && i < karaokeIdx ? 'karaoke-past' : ''}`}>{w}</span>
                : <span key={i}>{w}</span>
            ))}
          </p>

          <div className="fact-cards">
            {planet.facts.map((fact, i) => (
              <button
                key={i}
                className={`fact-card ${flipped[i] ? 'flipped' : ''}`}
                onClick={() => handleCardClick(i, fact)}
              >
                <div className="fact-card-inner">
                  <div className="fact-card-front">
                    <div className="fact-icon">{fact.icon}</div>
                    <div className="fact-label">{fact.label}</div>
                    <div className="fact-hint">눌러봐!</div>
                  </div>
                  <div className="fact-card-back">
                    <div className="fact-text">{fact.text}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button className="big-button mint-button next-button" onClick={onNext}>
            {nextPlanet ? `✨ ${nextPlanet.name} 만나러 가기` : '🌟 끝까지 다 봤어!'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Advanced Detail Screen — 초등 4~6학년용
// ───────────────────────────────────────────────
function AdvancedDetailScreen({ planet, onBack, onNext, onSpeak, ttsEnabled, nextPlanet }) {
  const a = planet.advanced;
  const [imgFailed, setImgFailed] = React.useState(false);

  const speakAll = () => {
    if (!onSpeak) return;
    const parts = [planet.name, a.tagline, ...a.story];
    onSpeak(parts.join(' '));
  };

  const speakLine = (text) => {
    if (onSpeak) onSpeak(text);
  };

  return (
    <div className="screen advanced-screen" data-screen-label={`03A ${planet.name}`}>
      <Starfield count={60} />

      <header className="adv-header">
        <button className="ghost-button" onClick={onBack} aria-label="우주로 돌아가기">
          ← 우주로 돌아가기
        </button>
        <button className="ghost-button" onClick={speakAll} disabled={!ttsEnabled}>
          {ttsEnabled ? '🔊 전체 들려줘' : '🔇 음성 꺼짐'}
        </button>
      </header>

      <article className="adv-body">
        <section className="adv-hero">
          <div className="adv-photo-wrap">
            {!imgFailed ? (
              <img
                className="adv-photo"
                src={a.image}
                alt={`${planet.name} 사진 (${a.imageCredit})`}
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className="adv-photo-fallback">
                <PlanetSVG planet={planet} size={320} spinning={false} />
              </div>
            )}
            <p className="adv-photo-credit">사진: {a.imageCredit}</p>
          </div>
          <div className="adv-headline">
            <div className="adv-eyebrow">{planet.emoji} 행성 카드</div>
            <h1 className="adv-name">{planet.name}</h1>
            <p className="adv-tagline">{a.tagline}</p>
          </div>
        </section>

        <section className="adv-section">
          <h2 className="adv-section-title">📊 기본 데이터</h2>
          <div className="adv-stats">
            {a.stats.map((s, i) => (
              <div key={i} className="adv-stat">
                <div className="adv-stat-label">{s.label}</div>
                <div className="adv-stat-value">{s.value}</div>
                {s.sub && <div className="adv-stat-sub">{s.sub}</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="adv-section">
          <h2 className="adv-section-title">✨ 흥미로운 사실</h2>
          <ul className="adv-story">
            {a.story.map((s, i) => (
              <li key={i}>
                <button className="adv-story-item" onClick={() => speakLine(s)} disabled={!ttsEnabled}>
                  <span className="adv-story-icon">{ttsEnabled ? '🔊' : '•'}</span>
                  <span className="adv-story-text">{s}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="adv-section">
          <h2 className="adv-section-title">🚀 탐사 역사</h2>
          <ol className="adv-timeline">
            {a.exploration.map((e, i) => (
              <li key={i} className="adv-timeline-item">
                <div className="adv-timeline-year">{e.year}</div>
                <div className="adv-timeline-body">
                  <div className="adv-timeline-name">{e.name}</div>
                  <div className="adv-timeline-desc">{e.desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="adv-section">
          <h2 className="adv-section-title">🔗 더 공부하기</h2>
          <ul className="adv-links">
            {a.links.map((l, i) => (
              <li key={i}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="adv-link">
                  {l.label} <span className="adv-link-arrow">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <button className="big-button mint-button next-button" onClick={onNext}>
          {nextPlanet ? `✨ ${nextPlanet.name} 만나러 가기` : '🌟 끝까지 다 봤어!'}
        </button>
      </article>
    </div>
  );
}

// ───────────────────────────────────────────────
// Completion Screen
// ───────────────────────────────────────────────
function CompletionScreen({ planets, onRestart }) {
  const [confetti, setConfetti] = React.useState([]);
  React.useEffect(() => {
    const c = [...Array(50)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      dur: 2 + Math.random() * 3,
      color: ['#FFD93D', '#FF6B9D', '#4ECDC4', '#fff', '#FFE5A0'][i % 5],
      emoji: ['⭐', '✨', '🌟', '💫', '🪐'][i % 5],
    }));
    setConfetti(c);
  }, []);

  return (
    <div className="screen completion-screen" data-screen-label="04 Completion">
      <Starfield count={150} />
      {confetti.map((c) => (
        <span key={c.id} className="confetti-piece" style={{
          left: `${c.x}%`,
          animationDelay: `${c.delay}s`,
          animationDuration: `${c.dur}s`,
          color: c.color,
        }}>{c.emoji}</span>
      ))}
      <h1 className="completion-title">와!<br/>태양계 친구들을<br/>모두 만났어요! 🎉</h1>
      <div className="sticker-grid">
        {planets.map((p) => (
          <div key={p.id} className="sticker">
            <PlanetSVG planet={p} size={80} spinning={false} />
            <span className="sticker-name">{p.name}</span>
          </div>
        ))}
      </div>
      <button className="big-button pink-button" onClick={onRestart}>🚀 다시 우주여행 가기</button>
    </div>
  );
}

Object.assign(window, { IntroScreen, HomeScreen, DetailScreen, AdvancedDetailScreen, CompletionScreen });
