import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);

  const projectList = [
    {
      id: 1,
      title: 'Hyper-Dimension Shader Engine',
      subtitle: 'WebGL / GLSL Render Editor',
      desc: 'An interactive web-based compiler for WebGL fragments and particle simulations. Implements procedural noise generation, custom raymarching algorithms, and real-time audio analysis feedback.',
      previewText: '// Fragment Shader Init\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / uResolution.xy;\n  float noise = fbm(uv * 3.0 + uTime);\n  vec3 color = vec3(noise * 0.1, noise * 0.9, noise * 0.7);\n  gl_FragColor = vec4(color, 1.0);\n}',
      color: '#00f0ff',
      glowClass: 'var(--glow-color)',
      tech: ['Three.js', 'React', 'GLSL Shaders', 'Web Audio API'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 2,
      title: 'Nova Database Engine',
      subtitle: 'In-Memory C++ Compiler Store',
      desc: 'A C++ compiled database engine focusing on high-frequency transactions. Uses locked hashing maps, multi-thread read/write concurrency, and Custom LSM Trees for sub-millisecond data writes.',
      previewText: '// Database Core Engine\ntemplate <typename Key, typename Val>\nclass NovaStore {\npublic:\n  void Put(const Key& k, const Val& v) {\n    std::lock_guard<std::mutex> lock(mut_);\n    lsm_tree_.Insert(k, v);\n  }\n};',
      color: '#9d4edd',
      glowClass: 'var(--accent-glow)',
      tech: ['C++ 20', 'LSM Tree', 'Multi-Threading', 'WebAssembly'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 3,
      title: 'Aether Immersive UX Lib',
      subtitle: 'Premium Fluid UI Library',
      desc: 'A collection of highly animated, physics-based dashboard components for React. Includes drag-gravity grids, elastic spring cards, and glassmorphic overlays designed to impress at first glance.',
      previewText: '// React Spring Physics Node\nconst AetherNode = ({ children }) => {\n  const [spring, set] = useSpring(() => ({\n    xyz: [0, 0, 0],\n    config: { mass: 1, tension: 170, friction: 26 }\n  }));\n  return <animated.div style={...} />;\n}',
      color: '#ffea00',
      glowClass: 'rgba(255, 234, 0, 0.25)',
      tech: ['React', 'Framer Motion', 'Vanilla CSS', 'Spring Physics'],
      liveUrl: '#',
      githubUrl: '#'
    }
  ];

  // Mouse Tilt Effect Handler
  const handleMouseMove = (e, cardId) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // mouse x relative to card
    const y = e.clientY - rect.top;  // mouse y relative to card
    
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    
    // Calculate rotation limits (-15 to 15 degrees)
    const rotateX = -((y - cy) / cy) * 12;
    const rotateY = ((x - cx) / cx) * 12;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    
    // Shift glow position
    const glow = card.querySelector('.card-tilt-glow');
    if (glow) {
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      glow.style.opacity = '0.15';
    }
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    
    const glow = card.querySelector('.card-tilt-glow');
    if (glow) {
      glow.style.opacity = '0';
    }
  };

  return (
    <section 
      id="projects" 
      className="section-padding"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span 
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--primary)',
              fontSize: '13px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '10px'
            }}
          >
            04 / TECHNICAL PORTFOLIO
          </span>
          <h2 
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontFamily: 'var(--font-sans)',
              fontWeight: '700',
              marginBottom: '60px',
              color: '#fff',
              letterSpacing: '-1.5px'
            }}
          >
            Projects & Codebases<span style={{ color: 'var(--primary)' }}>.</span>
          </h2>
        </motion.div>

        {/* Project grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}
        >
          {projectList.map((project) => (
            <div
              key={project.id}
              onMouseMove={(e) => handleMouseMove(e, project.id)}
              onMouseLeave={handleMouseLeave}
              onClick={() => setActiveProject(project)}
              className="glass-card glow-border interactive-card"
              style={{
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
                height: '420px',
                transformStyle: 'preserve-3d',
                cursor: 'pointer',
                transition: 'transform 0.1s ease-out, border-color 0.3s, box-shadow 0.3s'
              }}
            >
              {/* Dynamic tilt spot glow */}
              <div 
                className="card-tilt-glow"
                style={{
                  position: 'absolute',
                  width: '300px',
                  height: '300px',
                  background: `radial-gradient(circle, ${project.color} 0%, transparent 70%)`,
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  transform: 'translate(-50%, -50%)',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  zIndex: 1
                }}
              />

              {/* Card visual header (Mockup editor) */}
              <div 
                style={{
                  height: '180px',
                  background: 'rgba(10, 10, 10, 0.9)',
                  borderBottom: '1px solid var(--card-border)',
                  padding: '16px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  overflow: 'hidden'
                }}
              >
                {/* Console header spheres */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff007f' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9d4edd' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00f0ff' }} />
                </div>
                {/* Code syntax block */}
                <pre 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: '1.4',
                    margin: 0
                  }}
                >
                  {project.previewText}
                </pre>
              </div>

              {/* Card Details Body */}
              <div 
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flex: '1',
                  transform: 'translateZ(30px)',
                  zIndex: 2
                }}
              >
                <div>
                  <span 
                    style={{ 
                      fontSize: '10px', 
                      fontFamily: 'var(--font-mono)', 
                      color: project.color, 
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {project.subtitle}
                  </span>
                  <h3 
                    style={{ 
                      fontSize: '1.3rem', 
                      color: '#fff', 
                      marginTop: '4px',
                      marginBottom: '10px', 
                      fontFamily: 'var(--font-sans)', 
                      fontWeight: '700' 
                    }}
                  >
                    {project.title}
                  </h3>
                  <p 
                    style={{ 
                      fontSize: '13px', 
                      color: 'var(--text-muted)', 
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {project.desc}
                  </p>
                </div>
                
                {/* Project Footer tags */}
                <div style={{ display: 'flex', gap: '8px', overflow: 'hidden' }}>
                  {project.tech.slice(0, 3).map((t, i) => (
                    <span 
                      key={i} 
                      style={{ 
                        fontSize: '9px', 
                        fontFamily: 'var(--font-mono)', 
                        color: 'rgba(255,255,255,0.5)',
                        border: '1.5px solid var(--card-border)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apple-style Details Dialogue overlay */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(5, 5, 5, 0.85)',
              backdropFilter: 'blur(16px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="glass-card glow-border"
              style={{
                width: '100%',
                maxWidth: '650px',
                padding: '32px',
                borderColor: activeProject.color,
                boxShadow: `0 0 40px ${activeProject.glowClass}`,
                borderRadius: '24px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: activeProject.color, letterSpacing: '1px' }}>
                    {activeProject.subtitle}
                  </span>
                  <h3 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: '700', fontFamily: 'var(--font-sans)' }}>
                    {activeProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveProject(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    padding: '0 8px'
                  }}
                  className="hover-trigger"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
                {activeProject.desc}
              </p>

              {/* Technologies */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#fff', marginBottom: '10px' }}>
                  TECHNOLOGIES USED:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {activeProject.tech.map((t, i) => (
                    <span 
                      key={i}
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        color: activeProject.color,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1.5px solid var(--card-border)',
                        padding: '4px 10px',
                        borderRadius: '6px'
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code visual block */}
              <div style={{ background: 'rgba(10, 10, 10, 0.95)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', marginBottom: '32px', overflowX: 'auto' }}>
                <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.5', margin: 0 }}>
                  {activeProject.previewText}
                </pre>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <a href={activeProject.liveUrl} className="btn-premium">
                  Launch Application
                </a>
                <a 
                  href={activeProject.githubUrl} 
                  className="btn-premium"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                >
                  Inspect Source
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
