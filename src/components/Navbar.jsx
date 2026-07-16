import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Navbar = ({ activeSection, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Awards' },
    { id: 'coding', label: 'Stats' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: isScrolled ? '15px' : '25px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '900px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isScrolled ? '10px 24px' : '16px 32px',
        background: isScrolled ? 'rgba(10, 10, 10, 0.75)' : 'rgba(5, 5, 5, 0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid var(--card-border)',
        borderRadius: '50px',
        boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px var(--glow-color)' : 'none',
        transition: 'padding 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s, box-shadow 0.4s, border-color 0.4s, top 0.4s'
      }}
    >
      {/* Brand logo */}
      <div 
        onClick={() => onNavigate('hero')}
        style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: '900',
          fontSize: '18px',
          letterSpacing: '-1px',
          color: 'var(--text-main)',
          textShadow: '0 0 10px var(--glow-color)',
          cursor: 'pointer'
        }}
        className="hover-trigger"
      >
        DEV<span style={{ color: 'var(--primary)' }}>.</span>IO
      </div>

      {/* Navigation items */}
      <nav style={{ display: 'flex', gap: '8px' }}>
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                position: 'relative',
                background: 'transparent',
                border: 'none',
                padding: '8px 16px',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
                fontWeight: '500',
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'color 0.3s ease',
                outline: 'none',
                display: 'flex',
                alignItems: 'center'
              }}
              className="hover-trigger"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavBackground"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '30px',
                    background: 'rgba(0, 240, 255, 0.08)',
                    border: '1px solid rgba(0, 240, 255, 0.15)',
                    zIndex: -1,
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {item.label}
              
              {isActive && (
                <motion.div
                  layoutId="activeNavLine"
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    left: '25%',
                    width: '50%',
                    height: '2px',
                    backgroundColor: 'var(--primary)',
                    boxShadow: '0 0 8px var(--primary)',
                    borderRadius: '2px'
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </motion.header>
  );
};

export default Navbar;
