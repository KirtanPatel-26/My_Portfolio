import React from 'react';
import { motion } from 'framer-motion';

const CodingProfiles = () => {
  const profiles = [
    {
      name: 'GitHub',
      icon: '🐙',
      metric: '50+ Repositories // 800+ Stars',
      color: '#ffffff',
      glow: 'rgba(255, 255, 255, 0.2)',
      detail: 'Open-source maintainer. Active compiler and library developer.',
      url: '#'
    },
    {
      name: 'LeetCode',
      icon: '🧠',
      metric: '700+ Solved // Top 3% Rank',
      color: '#ffa116',
      glow: 'rgba(255, 161, 22, 0.35)',
      detail: 'Solved 250+ Hard level problems. Expert in trees, dynamic programming, and graphs.',
      url: '#'
    },
    {
      name: 'Codeforces',
      icon: '📊',
      metric: 'Rating: 1680 (Expert)',
      color: '#3182ce',
      glow: 'rgba(49, 130, 206, 0.35)',
      detail: 'Active participant in competitive programming rounds.',
      url: '#'
    },
    {
      name: 'HackerRank',
      icon: '🏆',
      metric: '5 Star Gold in Problem Solving',
      color: '#2ec866',
      glow: 'rgba(46, 200, 102, 0.35)',
      detail: 'Certified specialized profiles in algorithms and SQL queries.',
      url: '#'
    },
    {
      name: 'LinkedIn',
      icon: '🔗',
      metric: '500+ Connections // 12+ Endorsements',
      color: '#0077b5',
      glow: 'rgba(0, 119, 181, 0.35)',
      detail: 'Professional networking, sharing technical writings and project updates.',
      url: '#'
    }
  ];

  return (
    <section 
      id="coding" 
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
            06 / ONLINE PROFILES
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
            Coding Profiles<span style={{ color: 'var(--primary)' }}>.</span>
          </h2>
        </motion.div>

        {/* Profiles Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {profiles.map((profile, i) => (
            <motion.a
              href={profile.url}
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass-card interactive-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '28px',
                borderColor: 'var(--card-border)',
                textDecoration: 'none',
                minHeight: '200px'
              }}
              whileHover={{
                y: -8,
                borderColor: profile.color,
                boxShadow: `0 10px 30px ${profile.glow}`
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: '700', fontFamily: 'var(--font-sans)' }}>
                    {profile.name}
                  </h3>
                  <span style={{ fontSize: '24px' }}>{profile.icon}</span>
                </div>
                
                <span 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: profile.color,
                    display: 'block',
                    marginBottom: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {profile.metric}
                </span>
                
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {profile.detail}
                </p>
              </div>
              
              <div 
                style={{ 
                  marginTop: '16px', 
                  fontSize: '11px', 
                  fontFamily: 'var(--font-mono)', 
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                CONNECT TO PROFILE <span style={{ color: profile.color }}>→</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CodingProfiles;
