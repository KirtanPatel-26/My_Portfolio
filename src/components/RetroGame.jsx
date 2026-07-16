import React, { useEffect, useRef, useState } from 'react';
import { audioEngine } from '../utils/AudioEngine';

const RetroGame = ({ isOpen, onClose }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAMEOVER
  
  const stateRef = useRef({
    gameState: 'START',
    playerX: 0,
    bullets: [],
    enemies: [],
    particles: [],
    keys: {},
    lastShot: 0
  });

  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  useEffect(() => {
    if (!isOpen) return;

    // Load Highscore
    const saved = localStorage.getItem('portfolio_retro_highscore');
    if (saved) setHighScore(parseInt(saved, 10));

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set Dimensions
    canvas.width = 600;
    canvas.height = 400;
    
    // Initial State values
    const state = stateRef.current;
    state.playerX = canvas.width / 2;
    state.bullets = [];
    state.enemies = [];
    state.particles = [];
    state.keys = {};
    state.lastShot = 0;
    
    setScore(0);
    setLives(3);

    // Keyboard handlers
    const handleKeyDown = (e) => {
      state.keys[e.key] = true;
      
      // Prevent browser scroll when playing
      if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'd'].includes(e.key)) {
        e.preventDefault();
      }
      
      if (e.key === ' ' && state.gameState === 'PLAYING') {
        fireBullet();
      }
    };

    const handleKeyUp = (e) => {
      state.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Helper functions
    const fireBullet = () => {
      const now = Date.now();
      if (now - state.lastShot < 150) return; // limit fire rate
      state.lastShot = now;
      
      state.bullets.push({
        x: state.playerX,
        y: canvas.height - 35,
        speed: 8,
        radius: 3,
        color: '#00f0ff'
      });
      
      // Procedural audio shoot
      audioEngine.playClickSpark();
    };

    const spawnEnemy = () => {
      if (state.gameState !== 'PLAYING') return;
      
      const sizes = [15, 20, 25];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      
      state.enemies.push({
        x: Math.random() * (canvas.width - size * 2) + size,
        y: -size,
        size: size,
        speed: Math.random() * 1.5 + 1.2 + (score * 0.05), // speed scales with score
        color: Math.random() > 0.5 ? '#ff007f' : '#9d4edd',
        points: size === 15 ? 30 : (size === 20 ? 20 : 10)
      });
    };

    // Spawn loop
    const spawnInterval = setInterval(spawnEnemy, 1200);

    const createExplosion = (x, y, color) => {
      audioEngine.playExplosion();
      
      for (let i = 0; i < 12; i++) {
        state.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          size: Math.random() * 3 + 1,
          color,
          alpha: 1,
          decay: Math.random() * 0.03 + 0.015
        });
      }
    };

    // Main Game Frame Loop
    let animId;
    
    const updateGame = () => {
      // Clear
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines in bg
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (state.gameState === 'PLAYING') {
        // Move player
        if (state.keys['ArrowLeft'] || state.keys['a']) {
          state.playerX = Math.max(20, state.playerX - 6);
        }
        if (state.keys['ArrowRight'] || state.keys['d']) {
          state.playerX = Math.min(canvas.width - 20, state.playerX + 6);
        }

        // Draw Player Ship (Glowing Vector Triangle)
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00f0ff';
        ctx.strokeStyle = '#00f0ff';
        ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(state.playerX, canvas.height - 35); // Tip
        ctx.lineTo(state.playerX - 15, canvas.height - 15); // Bottom Left
        ctx.lineTo(state.playerX + 15, canvas.height - 15); // Bottom Right
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Update & Draw Bullets
        for (let i = state.bullets.length - 1; i >= 0; i--) {
          const b = state.bullets[i];
          b.y -= b.speed;
          
          if (b.y < 0) {
            state.bullets.splice(i, 1);
            continue;
          }

          ctx.shadowBlur = 10;
          ctx.shadowColor = b.color;
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Update & Draw Enemies
        for (let i = state.enemies.length - 1; i >= 0; i--) {
          const e = state.enemies[i];
          e.y += e.speed;
          
          // Check collision with bottom boundary
          if (e.y > canvas.height + e.size) {
            state.enemies.splice(i, 1);
            
            // Deduct lives
            setLives((l) => {
              const nextL = l - 1;
              if (nextL <= 0) {
                setGameState('GAMEOVER');
                audioEngine.playExplosion();
              }
              return nextL;
            });
            continue;
          }

          // Check collision with Player Ship
          const shipDist = Math.hypot(e.x - state.playerX, e.y - (canvas.height - 25));
          if (shipDist < e.size + 15) {
            createExplosion(e.x, e.y, e.color);
            createExplosion(state.playerX, canvas.height - 25, '#00f0ff');
            state.enemies.splice(i, 1);
            
            setLives((l) => {
              const nextL = l - 1;
              if (nextL <= 0) {
                setGameState('GAMEOVER');
              }
              return nextL;
            });
            continue;
          }

          // Check collisions with Bullets
          let hit = false;
          for (let j = state.bullets.length - 1; j >= 0; j--) {
            const b = state.bullets[j];
            const dist = Math.hypot(e.x - b.x, e.y - b.y);
            if (dist < e.size + b.radius) {
              createExplosion(e.x, e.y, e.color);
              state.enemies.splice(i, 1);
              state.bullets.splice(j, 1);
              
              setScore((s) => {
                const nextS = s + e.points;
                // update highscore live
                if (nextS > highScore) {
                  setHighScore(nextS);
                  localStorage.setItem('portfolio_retro_highscore', nextS.toString());
                }
                return nextS;
              });
              hit = true;
              break;
            }
          }
          if (hit) continue;

          // Draw Enemy (Neon glowing square vectors)
          ctx.shadowBlur = 10;
          ctx.shadowColor = e.color;
          ctx.strokeStyle = e.color;
          ctx.fillStyle = 'rgba(157, 78, 221, 0.15)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.strokeRect(e.x - e.size / 2, e.y - e.size / 2, e.size, e.size);
          ctx.fillRect(e.x - e.size / 2, e.y - e.size / 2, e.size, e.size);
          ctx.shadowBlur = 0;
        }
      }

      // Update & Draw Particles (Debris)
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        
        if (p.alpha <= 0) {
          state.particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Pre-game / Post-game Overlays directly drawn on canvas
      if (state.gameState === 'START') {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.textAlign = 'center';
        ctx.fillStyle = '#00f0ff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00f0ff';
        ctx.font = '24px "Space Grotesk", sans-serif';
        ctx.fillText('CYBER VECTOR ARCADE', canvas.width / 2, canvas.height / 2 - 40);
        
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.font = '14px "Sora", sans-serif';
        ctx.fillText('Move with A/D or Left/Right Arrow keys.', canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText('Shoot with Spacebar.', canvas.width / 2, canvas.height / 2 + 35);
        ctx.fillStyle = '#9d4edd';
        ctx.fillText('Press SPACE to initiate flight sequence.', canvas.width / 2, canvas.height / 2 + 80);
        
        if (state.keys[' ']) {
          setGameState('PLAYING');
        }
      }

      if (state.gameState === 'GAMEOVER') {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff007f';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff007f';
        ctx.font = '28px "Space Grotesk", sans-serif';
        ctx.fillText('SYSTEM COLLAPSED', canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.font = '14px "Sora", sans-serif';
        ctx.fillText(`Final Core Score: ${score}`, canvas.width / 2, canvas.height / 2 + 15);
        ctx.fillStyle = '#00f0ff';
        ctx.fillText('Press SPACE to re-engage loop.', canvas.width / 2, canvas.height / 2 + 60);
        
        if (state.keys[' ']) {
          setScore(0);
          setLives(3);
          state.enemies = [];
          state.bullets = [];
          setGameState('PLAYING');
        }
      }

      animId = requestAnimationFrame(updateGame);
    };

    updateGame();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(spawnInterval);
      cancelAnimationFrame(animId);
    };
  }, [isOpen, gameState, score, highScore]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 5, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        className="glass-card" 
        style={{
          width: '640px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderColor: 'var(--primary)',
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.25)',
          borderRadius: '24px'
        }}
      >
        {/* Header */}
        <div 
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}
        >
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)' }}>
              SCORE: <strong style={{ color: 'var(--primary)' }}>{score}</strong>
            </span>
            <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)' }}>
              HIGH: <strong style={{ color: 'var(--secondary)' }}>{highScore}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span 
                key={i} 
                style={{ 
                  color: i < lives ? '#ff007f' : '#444',
                  fontSize: '18px',
                  textShadow: i < lives ? '0 0 5px #ff007f' : 'none'
                }}
              >
                ▲
              </span>
            ))}
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '20px',
              fontWeight: 'bold',
              transition: 'color 0.2s'
            }}
            className="hover-trigger"
          >
            ×
          </button>
        </div>

        {/* Canvas Area */}
        <canvas 
          ref={canvasRef} 
          style={{
            border: '2px solid var(--card-border)',
            borderRadius: '16px',
            backgroundColor: '#050505',
            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8)',
            maxWidth: '100%'
          }} 
        />

        <div 
          style={{
            marginTop: '15px',
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'center'
          }}
        >
          CODENAME: PROJECT ARCADE // SECTOR 7 // PRESS ESC/CLICK CROSS TO EXIT
        </div>
      </div>
    </div>
  );
};

export default RetroGame;
