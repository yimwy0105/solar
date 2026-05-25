// Korean voice quality score (lower = better). Prefers neural/premium voices,
// known good Korean voices, online (non-local) voices, and female timbre
// (warmer for kid-facing app).
function koVoiceScore(v) {
  const n = (v.name || '').toLowerCase();
  let s = 0;
  if (n.match(/neural|natural|premium|enhanced/)) s += 200;
  if (n.includes('wavenet')) s += 180;
  if (n.includes('google')) s += 150;
  if (n.includes('yuna')) s += 120;
  if (n.includes('heami') || n.includes('seoyeon')) s += 100;
  if (n.match(/siwoo|sora|minji|jimin|sunhi|injoon/)) s += 80;
  if (!v.localService) s += 40;
  if (n.match(/female|woman|여/)) s += 20;
  return -s;
}

// Main App
function App() {
  const defaults = window.TWEAK_DEFAULTS || {};
  const [tweaks, setTweak] = useTweaks(defaults);

  const [screen, setScreen] = React.useState('intro'); // 'intro' | 'home' | 'detail' | 'done'
  const [mode, setMode] = React.useState('kids'); // 'kids' | 'advanced'
  const [currentId, setCurrentId] = React.useState(null);
  const [visited, setVisited] = React.useState([]);

  const motionReduced = tweaks.motionReduced;
  const largeText = tweaks.largeText;
  const orbitSpeed = tweaks.orbitSpeed || 40;
  const voiceMode = tweaks.voiceMode || 'tts'; // 'tts' | 'karaoke' | 'off'
  const ttsEnabled = voiceMode === 'tts';
  const karaokeEnabled = voiceMode === 'karaoke';

  // ── Voice picker: discover available Korean voices ──
  const [voices, setVoices] = React.useState([]);
  React.useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      const ko = all.filter((v) => v.lang && v.lang.toLowerCase().startsWith('ko'));
      ko.sort((a, b) => koVoiceScore(a) - koVoiceScore(b));
      setVoices(ko);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  const chosenVoiceURI = tweaks.voiceURI;

  // 사용자가 voice를 직접 고르지 않았으면 "Google 한국의"를 기본으로 선택
  React.useEffect(() => {
    if (chosenVoiceURI || voices.length === 0) return;
    const google = voices.find((v) => (v.name || '').toLowerCase().includes('google'));
    if (google) setTweak('voiceURI', google.voiceURI);
  }, [voices, chosenVoiceURI]);

  // Apply theme to body
  React.useEffect(() => {
    document.body.dataset.theme = tweaks.theme || 'cosmic';
    document.body.dataset.largeText = largeText ? 'true' : 'false';
  }, [tweaks.theme, largeText]);

  // TTS
  const speak = React.useCallback((text) => {
    if (karaokeEnabled) {
      // Karaoke mode handled in DetailScreen — no audio here
      return;
    }
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/~/g, ''));
    u.lang = 'ko-KR';
    // Pick the chosen voice, else the best available Korean voice
    const all = window.speechSynthesis.getVoices();
    const ko = all.filter((v) => v.lang && v.lang.toLowerCase().startsWith('ko'));
    let voice = null;
    if (chosenVoiceURI) voice = all.find((v) => v.voiceURI === chosenVoiceURI);
    if (!voice && ko.length) {
      voice = [...ko].sort((a, b) => koVoiceScore(a) - koVoiceScore(b))[0];
    }
    if (voice) u.voice = voice;
    u.rate = 0.95;
    u.pitch = 1.3;
    u.volume = 1;
    window.speechSynthesis.speak(u);
  }, [ttsEnabled, karaokeEnabled, chosenVoiceURI]);

  React.useEffect(() => {
    return () => { try { window.speechSynthesis.cancel(); } catch(e) {} };
  }, []);

  const planets = window.PLANETS;
  const current = planets.find((p) => p.id === currentId);
  const currentIdx = planets.findIndex((p) => p.id === currentId);
  const nextPlanet = currentIdx >= 0 && currentIdx < planets.length - 1 ? planets[currentIdx + 1] : null;

  const handleSelect = (id) => {
    setCurrentId(id);
    setVisited((v) => v.includes(id) ? v : [...v, id]);
    setScreen('detail');
  };

  const handleNext = () => {
    try { window.speechSynthesis.cancel(); } catch(e) {}
    if (nextPlanet) {
      handleSelect(nextPlanet.id);
    } else {
      // visited all?
      if (visited.length >= planets.length) {
        setScreen('done');
      } else {
        setScreen('home');
      }
    }
  };

  const handleBack = () => {
    try { window.speechSynthesis.cancel(); } catch(e) {}
    if (visited.length >= planets.length) {
      setScreen('done');
    } else {
      setScreen('home');
    }
  };

  return (
    <React.Fragment>
      <div className="app-root">
        {screen === 'intro' && (
          <IntroScreen
            onStart={(m) => { setMode(m); setScreen('home'); }}
            motionReduced={motionReduced}
          />
        )}
        {screen === 'home' && (
          <HomeScreen
            planets={planets}
            onSelect={handleSelect}
            visited={visited}
            orbitSpeed={orbitSpeed}
            motionReduced={motionReduced}
            layout={tweaks.homeLayout}
          />
        )}
        {screen === 'detail' && current && mode === 'advanced' && (
          <AdvancedDetailScreen
            planet={current}
            onBack={handleBack}
            onNext={handleNext}
            onSpeak={speak}
            ttsEnabled={ttsEnabled}
            nextPlanet={nextPlanet}
          />
        )}
        {screen === 'detail' && current && mode !== 'advanced' && (
          <DetailScreen
            planet={current}
            onBack={handleBack}
            onNext={handleNext}
            onSpeak={speak}
            ttsEnabled={ttsEnabled}
            karaokeEnabled={karaokeEnabled}
            motionReduced={motionReduced}
            nextPlanet={nextPlanet}
          />
        )}
        {screen === 'done' && (
          <CompletionScreen
            planets={planets}
            onRestart={() => { setVisited([]); setScreen('intro'); }}
          />
        )}
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="우주 분위기" />
        <TweakSelect
          label="배경 테마"
          value={tweaks.theme}
          onChange={(v) => setTweak('theme', v)}
          options={[
            { value: 'cosmic', label: '🌌 깊은 우주' },
            { value: 'dusk', label: '🌅 노을 우주' },
            { value: 'pastel', label: '☁️ 파스텔 하늘' },
          ]}
        />

        <TweakSection label="목소리 / 읽기" />
        <TweakSelect
          label="읽어주기 방식"
          value={voiceMode}
          onChange={(v) => setTweak('voiceMode', v)}
          options={[
            { value: 'tts', label: '🔊 음성으로 읽어주기' },
            { value: 'karaoke', label: '✨ 글자 따라 읽기 (부모님)' },
            { value: 'off', label: '🔇 끄기' },
          ]}
        />
        {voiceMode === 'tts' && voices.length > 0 && (
          <TweakSelect
            label="목소리 종류"
            value={tweaks.voiceURI || voices[0].voiceURI}
            onChange={(v) => setTweak('voiceURI', v)}
            options={voices.map((v) => ({ value: v.voiceURI, label: `${v.name}${v.localService ? '' : ' (온라인)'}` }))}
          />
        )}
        {voiceMode === 'tts' && voices.length === 0 && (
          <div style={{ fontSize: 12, color: '#a8a8c0', padding: '4px 0' }}>
            한국어 음성을 찾을 수 없어요. "글자 따라 읽기" 모드를 추천해요.
          </div>
        )}

        <TweakSection label="움직임" />
        <TweakSlider
          label="공전 속도"
          min={10} max={100} step={5}
          value={tweaks.orbitSpeed}
          onChange={(v) => setTweak('orbitSpeed', v)}
        />
        <TweakToggle
          label="모션 줄이기"
          value={tweaks.motionReduced}
          onChange={(v) => setTweak('motionReduced', v)}
        />

        <TweakSection label="글자" />
        <TweakToggle
          label="큰 글씨 모드"
          value={tweaks.largeText}
          onChange={(v) => setTweak('largeText', v)}
        />

        <TweakSection label="진행" />
        <TweakButton label="처음부터 다시" onClick={() => { setVisited([]); setScreen('intro'); }} />
        <TweakButton label="완주 화면 보기" secondary onClick={() => { setVisited(window.PLANETS.map(p => p.id)); setScreen('done'); }} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
