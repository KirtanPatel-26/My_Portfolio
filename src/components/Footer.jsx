import React from 'react';
import { motion } from 'framer-motion';

const Footer = ({ onOpenGame }) => {
  const socials = [
    { name: 'GitHub', icon: '🐙', url: '#' },
    { name: 'LinkedIn', icon: '🔗', url: '#' },
    { name: 'LeetCode', icon: '🧠', url: '#' },
    { name: 'X / Twitter', icon: '🐦', url: '#' }
  ];

  return (
    <footer style={{ width: '100%', position: 'relative', overflow: 'hidden', paddingBottom: '30px' }}>
      
      {/* Infinite running marquee */}
      <div className="marquee-container">
        <div className="marquee-content">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="marquee-text">
              KIRTAN PATEL <span>//</span> FULL STACK DEVELOPER <span>//</span> C++ PROGRAMMER <span>//</span> CREATIVE CODER <span>//</span> DESIGN ARCHITECT <span>//</span>
            </div>
          ))}
        </div>
      </div>

      <div 
        style={{ 
          maxWidth: '1100px', 
          margin: '40px auto 0 auto', 
          padding: '0 24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px'
        }}
      >
        {/* Left Side: Brand & Copyright */}
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--primary)', fontWeight: 'bold' }}>
            DEV.IO // SYSTEM ENGINE v1.2.0
          </span>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
            © {new Date().getFullYear()} Kirtan Patel. All vector modules synced.
          </p>
        </div>

        {/* Middle: Secret Retro Game Access */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            onClick={onOpenGame}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '1px',
              textDecoration: 'underline',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              outline: 'none'
            }}
            className="hover-trigger"
          >
            🕹️ ACCESS SYSTEM MINI-GAME
          </button>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            [OR TRIGGER VIA KONAMI CODE]
          </span>
        </div>

        {/* Right Side: Social links */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {socials.map((soc, idx) => (
            <motion.a
              href={soc.url}
              key={idx}
              whileHover={{ y: -5, scale: 1.1 }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.03)',
                border: '1.5px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                textDecoration: 'none'
              }}
              className="hover-trigger"
            >
              {soc.icon}
            </motion.a>
          ))}
        </div>

      </div>
    </footer>
  );
};

export default Footer;
