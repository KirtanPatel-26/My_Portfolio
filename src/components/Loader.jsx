import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  
  const systemLogs = [
    'INITIATING VECTOR CORES...',
    'RESOLVING SHADER SHAPES...',
    'SPAWNING 3D PUPPY WORLD...',
    'SYNCING THREE.JS COMPILER...',
    'COMPILING NEON GRADIENTS...',
    'ESTABLISHING MATRIX BRIDGE...',
    'ONLINE: WELCOME CREATOR'
  ];

  useEffect(() => {
    // Increment progress
    const duration = 2800; // 2.8 seconds loader
    const intervalTime = 30;
    const increment = 100 / (duration / intervalTime);
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    // Increment log statements
    const logTimer = setInterval(() => {
      setLogIndex((prev) => (prev < systemLogs.length - 1 ? prev + 1 : prev));
    }, duration / systemLogs.length);

    return () => {
      clearInterval(timer);
      clearInterval(logTimer);
    };
  }, []);

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#050505',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)'
      }}
      exit={{ 
        y: '-100vh',
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      {/* Morphing Logo */}
      <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '40px' }}>
        <motion.div
          animate={{
            borderRadius: ["20% 20% 20% 20%", "40% 40% 40% 40%", "50% 50% 50% 50%", "30% 30% 30% 30%", "20% 20% 20% 20%"],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{
            width: '80px',
            height: '80px',
            border: '2.5px solid var(--primary)',
            boxShadow: '0 0 25px var(--glow-color)',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(157, 78, 221, 0.1))',
            margin: 'auto'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: '900',
            color: '#fff',
            textShadow: '0 0 10px var(--primary)'
          }}
        >
          {Math.floor(progress)}%
        </div>
      </div>

      {/* Startup logs console */}
      <div 
        style={{ 
          height: '40px', 
          textAlign: 'center', 
          marginBottom: '20px',
          color: 'var(--text-muted)',
          fontSize: '11px',
          letterSpacing: '1.5px',
          maxWidth: '80%',
          textShadow: '0 0 5px rgba(255,255,255,0.1)'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={logIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {systemLogs[logIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cyberpunk Progress bar */}
      <div 
        style={{
          width: '260px',
          height: '3px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '5px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
            boxShadow: '0 0 10px var(--primary)',
            width: `${progress}%`
          }}
        />
      </div>
      
      {/* Decorative corners */}
      <div style={{ position: 'absolute', top: '40px', left: '40px', borderLeft: '2px solid var(--primary)', borderTop: '2px solid var(--primary)', width: '20px', height: '20px' }} />
      <div style={{ position: 'absolute', top: '40px', right: '40px', borderRight: '2px solid var(--primary)', borderTop: '2px solid var(--primary)', width: '20px', height: '20px' }} />
      <div style={{ position: 'absolute', bottom: '40px', left: '40px', borderLeft: '2px solid var(--primary)', borderBottom: '2px solid var(--primary)', width: '20px', height: '20px' }} />
      <div style={{ position: 'absolute', bottom: '40px', right: '40px', borderRight: '2px solid var(--primary)', borderBottom: '2px solid var(--primary)', width: '20px', height: '20px' }} />
    </motion.div>
  );
};

export default Loader;
