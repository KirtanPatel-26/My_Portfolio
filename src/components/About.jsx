import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const [snippets, setSnippets] = useState([]);
  
  const codeTemplates = [
    'const developer = new Human({ name: "Kirtan" });',
    'import { React, TypeScript } from "world";',
    'std::vector<std::string> skills = {"C++", "V8", "CUDA"};',
    'await developer.optimize(codebase);',
    'if (coffee.isEmpty()) refuel();',
    'map.set("success", developer.workEthic);',
    'class CreativeBrain extends NeuralNetwork {}',
    'git commit -m "feat: Awwwards portfolio release" -f',
    'npm install happiness --global'
  ];

  useEffect(() => {
    // Spawn a code snippet every 2.8 seconds
    const interval = setInterval(() => {
      const text = codeTemplates[Math.floor(Math.random() * codeTemplates.length)];
      const id = Date.now() + Math.random();
      
      const left = Math.random() * 80 + 10; // 10% to 90%
      const speed = Math.random() * 10 + 15; // 15s to 25s
      
      setSnippets((prev) => [...prev.slice(-8), { id, text, left, speed }]);
      
      // Cleanup after duration
      setTimeout(() => {
        setSnippets((prev) => prev.filter((s) => s.id !== id));
      }, speed * 1000);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="about" 
      className="section-padding"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Background Floating Snippets */}
      {snippets.map((snip) => (
        <span
          key={snip.id}
          className="floating-code-snippet"
          style={{
            left: `${snip.left}%`,
            animation: `floatUp ${snip.speed}s linear forwards`,
            bottom: '-5%'
          }}
        >
          {snip.text}
        </span>
      ))}

      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
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
            01 / DETAILED OVERVIEW
          </span>
          
          <h2 
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontFamily: 'var(--font-sans)',
              fontWeight: '700',
              marginBottom: '40px',
              color: '#fff',
              letterSpacing: '-1.5px'
            }}
          >
            About My Craft<span style={{ color: 'var(--primary)' }}>.</span>
          </h2>
        </motion.div>

        {/* Grid Panels */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {/* Main Biography Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="glass-card glow-border interactive-card"
            style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '16px', fontFamily: 'var(--font-sans)' }}>
                Engineering Meets Elegance
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>
                I am a software engineer dedicated to building high-performance, immersive interfaces and robust backend systems. My design philosophy is heavily inspired by Apple's minimalism combined with the raw, interactive energy of Awwwards interfaces.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
                Whether it's deploying shaders on WebGL using Three.js, structuring microservices, or writing high-efficiency C++ programs, I focus on building products that load quickly and delight users on every interaction.
              </p>
            </div>
            
            <div style={{ marginTop: '24px', borderTop: '1px solid var(--card-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <div>
                <span style={{ color: 'var(--primary)' }}>LOC:</span> Gujarat, IN
              </div>
              <div>
                <span style={{ color: 'var(--secondary)' }}>EXP:</span> 4+ Years
              </div>
            </div>
          </motion.div>

          {/* Core Philosophy Cards Grid (Right column) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Speed card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card interactive-card"
            >
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--primary)', fontSize: '18px' }}>⚡</span> Performance-First
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                60 FPS interactive visualizer rendering, asynchronous state handling, and deferred bundle chunk loading. Optimization isn't an afterthought; it is integrated directly into the architecture.
              </p>
            </motion.div>

            {/* Fullstack Capability */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-card interactive-card"
            >
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--secondary)', fontSize: '18px' }}>⚙️</span> Full-Stack Synergy
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                Creating beautiful visual layers while maintaining robust APIs, secure database models, and efficient system communication loops in Node, Python, and C++.
              </p>
            </motion.div>

            {/* Design & UX */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card interactive-card"
            >
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--primary)', fontSize: '18px' }}>👁️</span> Aesthetics & micro-UX
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                Subtle cursor ripples, spring physics translations, and rich glowing color palettes. Every click is designed to feel responsive, tactile, and premium.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Quick custom styles for floating animation */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.15;
          }
          90% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(-110vh) rotate(15deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
