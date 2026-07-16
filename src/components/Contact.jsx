import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine } from '../utils/AudioEngine';
import InteractiveRobot from './InteractiveRobot';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    // Play plane audio whoosh
    audioEngine.playPaperPlane();

    // Simulate sending time (1.2s)
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success banner after 4s
      setTimeout(() => {
        setSentSuccess(false);
      }, 4000);
    }, 1500);
  };

  return (
    <section 
      id="contact" 
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
            07 / COMMUNICATIONS
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
            Establish Connection<span style={{ color: 'var(--primary)' }}>.</span>
          </h2>
        </motion.div>

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '50px',
            alignItems: 'center'
          }}
        >
          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card glow-border"
            style={{ position: 'relative' }}
          >
            {/* Paper Plane Animation Overlay */}
            <AnimatePresence>
              {isSending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(5, 5, 5, 0.9)',
                    borderRadius: 'inherit',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <motion.div
                    animate={{
                      x: [0, 80, 200, 350],
                      y: [0, -40, -100, -220],
                      scale: [1, 1.2, 0.8, 0],
                      rotate: [0, -10, -25, -45]
                    }}
                    transition={{
                      duration: 1.2,
                      ease: 'easeInOut'
                    }}
                    style={{ fontSize: '50px' }}
                  >
                    ✈️
                  </motion.div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--primary)', marginTop: '20px', letterSpacing: '1px' }}>
                    LAUNCHING DATA VESSEL...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Your Identifier (Name)
                </label>
                <input 
                  type="text" 
                  className="input-premium hover-trigger"
                  placeholder="e.g. Neo Anderson"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Return Coordinates (Email)
                </label>
                <input 
                  type="email" 
                  className="input-premium hover-trigger"
                  placeholder="e.g. neo@matrix.net"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Encryption Payload (Message)
                </label>
                <textarea 
                  className="input-premium hover-trigger"
                  rows="4"
                  placeholder="Write your request details..."
                  required
                  style={{ resize: 'vertical' }}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button 
                type="submit" 
                className="btn-premium hover-trigger"
                style={{ width: '100%', marginTop: '10px' }}
              >
                Send Message
              </button>
            </form>

            {/* Success Prompt */}
            {sentSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: 'rgba(0, 240, 255, 0.05)',
                  border: '1.5px solid var(--primary)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--primary)',
                  boxShadow: '0 0 15px var(--glow-color)'
                }}
              >
                CONNECTION ESTABLISHED // TRANSMISSION SECURED
              </motion.div>
            )}
          </motion.div>

          {/* 3D Robot Assistant Helper Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            {/* 3D Canvas Mount Point */}
            <div style={{ width: '100%', maxWidth: '340px' }} className="glass-card glow-border">
              <InteractiveRobot />
              <div 
                style={{ 
                  marginTop: '12px', 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '11px', 
                  color: 'var(--text-muted)' 
                }}
              >
                SYSTEM ASSISTANT // CODENAME: BOT-3000
                <div style={{ color: 'var(--primary)', fontSize: '10px', marginTop: '4px' }}>
                  [HOVER / CLICK ME TO INTERACT]
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
