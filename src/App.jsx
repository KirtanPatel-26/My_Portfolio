import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

// Components
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import CodingProfiles from './components/CodingProfiles';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import InteractiveDog from './components/InteractiveDog';
import CanvasParticles from './components/CanvasParticles';
import RetroGame from './components/RetroGame';

// Audio engine
import { audioEngine } from './utils/AudioEngine';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('dark'); // dark, cyberpunk, matrix, light
  const [weather, setWeather] = useState('none'); // none, rain, snow
  const [isMusicMuted, setIsMusicMuted] = useState(true);
  const [customColor, setCustomColor] = useState('#00f0ff');
  const [showControls, setShowControls] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Konami Code sequence tracker
  const konamiSequence = useRef([]);
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 
    'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 
    'ArrowLeft', 'ArrowRight', 
    'b', 'a'
  ];

  // 1. Lenis Smooth Scroll Initialization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // 2. Theme Applier & Color Override
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--glow-color', `${color}55`);
  };

  // Reset custom variable when changing themes
  useEffect(() => {
    document.documentElement.style.removeProperty('--primary');
    document.documentElement.style.removeProperty('--glow-color');
    if (theme === 'dark') setCustomColor('#00f0ff');
    else if (theme === 'cyberpunk') setCustomColor('#ff007f');
    else if (theme === 'matrix') setCustomColor('#00ff46');
    else if (theme === 'light') setCustomColor('#2563eb');
  }, [theme]);

  // 3. Konami Code Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      konamiSequence.current.push(e.key);
      konamiSequence.current = konamiSequence.current.slice(-10);

      const isMatch = konamiCode.every((val, index) => val === konamiSequence.current[index]);
      if (isMatch) {
        setIsGameOpen(true);
        audioEngine.playExplosion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 4. Scroll progress bar calculator & Active section intersection observer
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Section Observer
    const sections = document.querySelectorAll('section');
    const observerOptions = {
      root: null,
      threshold: 0.35
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((sec) => observer.observe(sec));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // 5. Audio Toggle
  const handleMusicToggle = () => {
    const nextMute = audioEngine.toggleMute();
    setIsMusicMuted(nextMute);
  };

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <>
      {/* 1. Cyberpunk Startup Preloader */}
      <AnimatePresence>
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <div style={{ position: 'relative' }}>
          
          {/* Custom Cursor spark system */}
          <CustomCursor />

          {/* Interactive ThreeJS follow dog */}
          <InteractiveDog />

          {/* Canvas rain, snow, and matrix particle overlays */}
          <CanvasParticles mode={theme === 'matrix' ? 'matrix' : weather} />

          {/* Noise texture overlay */}
          <div className="noise-overlay" />

          {/* Aurora glow blobs background (unless matrix mode is on) */}
          {theme !== 'matrix' && (
            <div className="aurora-container">
              <div className="aurora-blob aurora-blob-1" />
              <div className="aurora-blob aurora-blob-2" />
              <div className="aurora-blob aurora-blob-3" />
            </div>
          )}

          {/* Cyberpunk grid overlays */}
          <div className="cyber-grid" />
          <div className="cyber-scanlines" />

          {/* Top scrolling progress bar */}
          <div className="scroll-progress-container">
            <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
          </div>

          {/* Floating Glass Navigation menu */}
          <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

          {/* MAIN PAGE SECTIONS */}
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Achievements />
          <CodingProfiles />
          <Contact />
          
          {/* Footer marquee & game cabinet */}
          <Footer onOpenGame={() => setIsGameOpen(true)} />

          {/* Hidden retro space shooter game modal */}
          <RetroGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />

          {/* 6. FLOATING SYSTEM CONTROL SETTINGS PANEL */}
          <div className="controls-panel">
            <button 
              onClick={() => setShowControls(!showControls)} 
              className="controls-toggle-btn hover-trigger"
              title="Toggle System controls panel"
            >
              ⚙️
            </button>
            
            {showControls && (
              <div className="controls-menu glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: '#fff' }}>SYSTEM SETUP</h3>
                  <button 
                    onClick={() => setShowControls(false)} 
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '16px' }}
                    className="hover-trigger"
                  >
                    ×
                  </button>
                </div>
                
                {/* Theme Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', marginBottom: '6px' }}>
                    INTERFACE THEME:
                  </label>
                  <select 
                    value={theme} 
                    onChange={(e) => setTheme(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(5, 5, 5, 0.6)',
                      border: '1.5px solid var(--card-border)',
                      borderRadius: '8px',
                      padding: '8px',
                      color: 'var(--text-main)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                    className="hover-trigger"
                  >
                    <option value="dark">Awwwards Dark (Default)</option>
                    <option value="cyberpunk">Cyberpunk Neon</option>
                    <option value="matrix">Matrix Green</option>
                    <option value="light">Tech Light Mode</option>
                  </select>
                </div>

                {/* Weather particles */}
                {theme !== 'matrix' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', marginBottom: '6px' }}>
                      ATMOSPHERE MODE:
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['none', 'rain', 'snow'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setWeather(mode)}
                          style={{
                            flex: 1,
                            background: weather === mode ? 'rgba(0, 240, 255, 0.12)' : 'rgba(5,5,5,0.4)',
                            border: `1.5px solid ${weather === mode ? 'var(--primary)' : 'var(--card-border)'}`,
                            color: weather === mode ? 'var(--primary)' : 'var(--text-muted)',
                            borderRadius: '6px',
                            padding: '6px 0',
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            textTransform: 'uppercase'
                          }}
                          className="hover-trigger"
                        >
                          {mode === 'none' ? 'Clear' : mode}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Theme Color Picker */}
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', marginBottom: '6px' }}>
                    DYNAMIC SHADER COLOR:
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="color" 
                      value={customColor} 
                      onChange={handleColorChange}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        width: '35px',
                        height: '35px',
                        cursor: 'pointer'
                      }}
                      className="hover-trigger"
                    />
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {customColor.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Sound Settings */}
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', marginBottom: '6px' }}>
                    AUDIO SOUNDSCAPE:
                  </label>
                  <button
                    onClick={handleMusicToggle}
                    style={{
                      width: '100%',
                      background: !isMusicMuted ? 'rgba(157, 78, 221, 0.12)' : 'rgba(5,5,5,0.4)',
                      border: `1.5px solid ${!isMusicMuted ? 'var(--secondary)' : 'var(--card-border)'}`,
                      color: !isMusicMuted ? 'var(--secondary)' : 'var(--text-muted)',
                      borderRadius: '8px',
                      padding: '8px 0',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    className="hover-trigger"
                  >
                    {!isMusicMuted ? '🔊 MUSIC COMPOSER RUNNING' : '🔇 COMPOSER INACTIVE (CLICK TO PLAY)'}
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      )}
    </>
  );
}

export default App;
