import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

// Single counter logic
const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          
          let startTime = null;
          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // easeOutQuad
            const easedProgress = percentage * (2 - percentage);
            setCount(Math.floor(easedProgress * target));
            
            if (progress < duration) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={elementRef}>{count}</span>;
};

const Achievements = () => {
  const sectionRef = useRef(null);
  const confettiTriggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !confettiTriggered.current) {
          confettiTriggered.current = true;
          
          // Fire a cool double confetti burst!
          const duration = 2 * 1000;
          const end = Date.now() + duration;

          const frame = () => {
            confetti({
              particleCount: 5,
              angle: 60,
              spread: 55,
              origin: { x: 0, y: 0.8 },
              colors: ['#00f0ff', '#9d4edd', '#ffea00']
            });
            confetti({
              particleCount: 5,
              angle: 120,
              spread: 55,
              origin: { x: 1, y: 0.8 },
              colors: ['#00f0ff', '#9d4edd', '#ffea00']
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          };
          frame();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: 'DSA SOLVED', target: 750, suffix: '+', desc: 'LeetCode, Codeforces, and HackerRank solutions' },
    { label: 'GLOBAL PROJECTS', target: 24, suffix: '', desc: 'Web apps, compiled utilities, and OS packages' },
    { label: 'CONTRIBUTIONS', target: 500, suffix: '+', desc: 'Open-source GitHub commits and patch merges' },
    { label: 'AWARDS & WINS', target: 12, suffix: '', desc: 'Hackathon podiums and algorithmic competition honors' }
  ];

  return (
    <section 
      ref={sectionRef}
      id="achievements" 
      className="section-padding"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        
        {/* Section title */}
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
            05 / CORE METRICS
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
            Milestones & Stats<span style={{ color: 'var(--primary)' }}>.</span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px'
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card glow-border interactive-card"
              style={{
                textAlign: 'center',
                padding: '32px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Trophy Icon placeholder */}
              <div 
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1.5px solid var(--card-border)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  marginBottom: '16px'
                }}
              >
                {i === 0 ? '💻' : (i === 1 ? '🚀' : (i === 2 ? '⚡' : '🏆'))}
              </div>
              
              <h3 
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                  fontWeight: '800',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '8px',
                  textShadow: '0 0 10px var(--glow-color)'
                }}
              >
                <Counter target={stat.target} />{stat.suffix}
              </h3>
              
              <span 
                style={{ 
                  fontSize: '11px', 
                  fontFamily: 'var(--font-sans)', 
                  fontWeight: '700', 
                  color: 'var(--primary)', 
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                {stat.label}
              </span>
              
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
