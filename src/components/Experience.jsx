import React from 'react';
import { motion } from 'framer-motion';

const Experience = () => {
  const jobs = [
    {
      role: 'Lead Full Stack Engineer',
      company: 'Quantum Tech Solutions',
      period: '2024 - Present',
      desc: 'Architected high-throughput React dashboard applications utilizing WebGL metrics rendering. Standardized TypeScript practices and reduced build bundle weight by 38% using tree shaking and modular code structures.',
      tags: ['React', 'Next.js', 'WebAudio API', 'Three.js']
    },
    {
      role: 'Software Architect',
      company: 'Apex Digital Inc',
      period: '2022 - 2024',
      desc: 'Directed Backend-to-Frontend systems redesign. Formulated C++ based WebAssembly image processing libraries, shortening image rendering time on client devices from 2s to 120ms.',
      tags: ['C++', 'WebAssembly', 'NodeJS', 'Docker']
    },
    {
      role: 'Frontend Developer',
      company: 'Nebula Creative Lab',
      period: '2020 - 2022',
      desc: 'Constructed custom micro-interaction vectors and interactive experiences. Achieved pixel-perfect responsive layouts and custom GSAP timelines for premium brand campaigns.',
      tags: ['React', 'GSAP', 'Framer Motion', 'Vanilla CSS']
    },
    {
      role: 'Systems Consultant',
      company: 'Freestate Open Source',
      period: '2019 - 2020',
      desc: 'Maintained and contributed to C/C++ engine runtimes. Fixed critical memory leaks, optimized node thread allocations, and wrote unit test routines.',
      tags: ['C++', 'Linux Systems', 'Git', 'Bash']
    }
  ];

  return (
    <section 
      id="experience" 
      className="section-padding"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', position: 'relative' }}>
        
        {/* Title */}
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
            03 / HISTORICAL TIMELINE
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
            My Journey<span style={{ color: 'var(--primary)' }}>.</span>
          </h2>
        </motion.div>

        {/* Timeline wrapper */}
        <div style={{ position: 'relative', width: '100%', marginTop: '30px' }}>
          
          {/* Vertical center line */}
          <div 
            style={{
              position: 'absolute',
              left: '50%',
              top: '0',
              bottom: '0',
              width: '2px',
              background: 'linear-gradient(180deg, var(--primary), var(--secondary), transparent)',
              transform: 'translateX(-50%)',
              opacity: 0.25
            }}
          />

          {/* Job item loops */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            {jobs.map((job, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: isEven ? 'flex-start' : 'flex-end',
                    width: '100%',
                    position: 'relative'
                  }}
                >
                  
                  {/* Timeline Glowing Node */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '25px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: isEven ? 'var(--primary)' : 'var(--secondary)',
                      boxShadow: `0 0 12px 3px ${isEven ? 'var(--primary)' : 'var(--secondary)'}`,
                      border: '3px solid #050505',
                      transform: 'translateX(-50%)',
                      zIndex: 10
                    }}
                  />

                  {/* Card Container */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="glass-card glow-border interactive-card"
                    style={{
                      width: 'calc(50% - 40px)',
                      padding: '24px',
                      zIndex: 5,
                      alignSelf: 'center'
                    }}
                  >
                    {/* Period Badge */}
                    <span 
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: isEven ? 'var(--primary)' : 'var(--secondary)',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--card-border)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        display: 'inline-block',
                        marginBottom: '12px'
                      }}
                    >
                      {job.period}
                    </span>

                    <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '4px', fontFamily: 'var(--font-sans)', fontWeight: '700' }}>
                      {job.role}
                    </h3>
                    
                    <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
                      {job.company}
                    </h4>
                    
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                      {job.desc}
                    </p>

                    {/* Skill Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {job.tags.map((t, i) => (
                        <span 
                          key={i}
                          style={{
                            fontSize: '10px',
                            fontFamily: 'var(--font-mono)',
                            color: '#fff',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--card-border)'
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Responsive timeline adjustments for mobile screen viewports */}
      <style>{`
        @media (max-width: 768px) {
          #experience div[style*="left: 50%"] {
            left: 20px !important;
          }
          #experience div[style*="justify-content"] {
            justify-content: flex-end !important;
          }
          #experience div[style*="width: calc(50% - 40px)"] {
            width: calc(100% - 50px) !important;
          }
          #experience div[style*="left: 50%"][style*="width: 16px"] {
            left: 20px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Experience;
