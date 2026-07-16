import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const containerRef = useRef(null);
  const [skills, setSkills] = useState([]);
  
  // List of technical skills
  const skillList = [
    { name: 'React', level: 'Expert', color: 'var(--primary)' },
    { name: 'TypeScript', level: 'Expert', color: 'var(--primary)' },
    { name: 'C++', level: 'Advanced', color: 'var(--secondary)' },
    { name: 'Three.js', level: 'Intermediate', color: 'var(--primary)' },
    { name: 'Node.js', level: 'Advanced', color: 'var(--secondary)' },
    { name: 'GSAP', level: 'Advanced', color: 'var(--primary)' },
    { name: 'Tailwind CSS', level: 'Expert', color: 'var(--primary)' },
    { name: 'Next.js', level: 'Advanced', color: 'var(--secondary)' },
    { name: 'Framer Motion', level: 'Advanced', color: 'var(--primary)' },
    { name: 'Docker', level: 'Intermediate', color: 'var(--secondary)' },
    { name: 'Python', level: 'Advanced', color: 'var(--secondary)' },
    { name: 'GraphQL', level: 'Intermediate', color: 'var(--primary)' },
    { name: 'Git', level: 'Expert', color: 'var(--secondary)' },
    { name: 'V8 / Assembly', level: 'Advanced', color: 'var(--secondary)' },
    { name: 'MongoDB', level: 'Advanced', color: 'var(--primary)' },
    { name: 'Rust', level: 'Intermediate', color: 'var(--secondary)' },
    { name: 'SQL', level: 'Expert', color: 'var(--primary)' },
    { name: 'WebGL', level: 'Intermediate', color: 'var(--primary)' }
  ];

  // Rotate angles
  const angleX = useRef(0.003);
  const angleY = useRef(0.003);
  const mouseActive = useRef(false);

  useEffect(() => {
    // Generate spherical coordinates using Fibonacci Sphere algorithm
    const radius = 180; // sphere radius
    const count = skillList.length;
    
    const items = skillList.map((skill, index) => {
      // Golden spiral distribution
      const phi = Math.acos(-1 + (2 * index) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      return {
        ...skill,
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        scale: 1,
        alpha: 1
      };
    });

    setSkills(items);

    // Mouse interactive speeds
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      
      // Calculate offset from center
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      
      // Adjust angles based on mouse
      angleX.current = -dy * 0.015;
      angleY.current = dx * 0.015;
    };

    const handleMouseEnter = () => {
      mouseActive.current = true;
    };

    const handleMouseLeave = () => {
      mouseActive.current = false;
      // return to slow auto rotate
      angleX.current = 0.003;
      angleY.current = 0.003;
    };

    const element = containerRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation Loop
    let animId;
    
    const animateSphere = () => {
      setSkills((prevItems) => {
        if (prevItems.length === 0) return prevItems;
        
        // Rotations
        const cosX = Math.cos(angleX.current);
        const sinX = Math.sin(angleX.current);
        const cosY = Math.cos(angleY.current);
        const sinY = Math.sin(angleY.current);
        
        return prevItems.map((item) => {
          // Rotate X
          const y1 = item.y * cosX - item.z * sinX;
          const z1 = item.z * cosX + item.y * sinX;
          
          // Rotate Y
          const x2 = item.x * cosY - z1 * sinY;
          const z2 = z1 * cosY + item.x * sinY;
          
          // Perspective scaling based on depth Z
          const depth = 280; // perspective distance
          const scale = depth / (depth + z2); // front items bigger, back smaller
          const alpha = 0.35 + 0.65 * (1 - z2 / radius); // front brighter, back transparent
          
          return {
            ...item,
            x: x2,
            y: y1,
            z: z2,
            scale,
            alpha
          };
        });
      });

      animId = requestAnimationFrame(animateSphere);
    };

    animateSphere();

    return () => {
      cancelAnimationFrame(animId);
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section 
      id="skills" 
      className="section-padding"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
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
            02 / CAPABILITIES & SYSTEM
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
            Core Tech Stack<span style={{ color: 'var(--primary)' }}>.</span>
          </h2>
        </motion.div>

        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '50px',
            marginTop: '30px'
          }}
        >
          {/* Detailed Skill Bars */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '10px', fontFamily: 'var(--font-sans)' }}>
              Core Specializations
            </h3>
            
            {/* Skill Item */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                <span>Frontend Architecture (React, TS, NextJS)</span>
                <span style={{ color: 'var(--primary)' }}>95%</span>
              </div>
              <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '95%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }}
                />
              </div>
            </div>

            {/* Skill Item */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                <span>System Programming & Backend (C++, Node, Python)</span>
                <span style={{ color: 'var(--secondary)' }}>88%</span>
              </div>
              <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '88%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'var(--secondary)', boxShadow: '0 0 8px var(--secondary)' }}
                />
              </div>
            </div>

            {/* Skill Item */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                <span>Creative 3D Graphics & Animations (Three.js, WebGL)</span>
                <span style={{ color: 'var(--primary)' }}>80%</span>
              </div>
              <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '80%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }}
                />
              </div>
            </div>
          </div>

          {/* Interactive 3D Sphere Tag Cloud (Right) */}
          <div 
            style={{
              flex: '1 1 400px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '420px',
              position: 'relative'
            }}
          >
            <div 
              ref={containerRef}
              style={{
                width: '400px',
                height: '400px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {skills.map((skill, index) => {
                const zIndex = Math.round(skill.scale * 100);
                return (
                  <span
                    key={index}
                    style={{
                      position: 'absolute',
                      left: `calc(50% + ${skill.x}px)`,
                      top: `calc(50% + ${skill.y}px)`,
                      transform: `translate(-50%, -50%) scale(${skill.scale})`,
                      opacity: skill.alpha,
                      zIndex: zIndex,
                      color: skill.color,
                      fontSize: '14px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 'bold',
                      textShadow: skill.alpha > 0.75 ? `0 0 8px ${skill.color}` : 'none',
                      whiteSpace: 'nowrap',
                      pointerEvents: skill.alpha > 0.8 ? 'auto' : 'none',
                      transition: 'color 0.3s',
                      backgroundColor: 'rgba(5, 5, 5, 0.45)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: `1px solid rgba(255,255,255, ${skill.alpha * 0.05})`
                    }}
                    className="hover-trigger"
                  >
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
