import React, { useEffect, useRef } from 'react';

const CanvasParticles = ({ mode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!mode || mode === 'none') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    
    // Mode specific variables
    // 1. Matrix
    const matrixChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$@#&%+=*';
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    // 2. Rain
    const rainParticles = [];
    const maxRain = 140;

    // 3. Snow
    const snowParticles = [];
    const maxSnow = 90;

    // Initialize arrays
    const initParticles = () => {
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);

      if (mode === 'rain') {
        rainParticles.length = 0;
        for (let i = 0; i < maxRain; i++) {
          rainParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 8 + 12,
            opacity: Math.random() * 0.4 + 0.1
          });
        }
      } else if (mode === 'snow') {
        snowParticles.length = 0;
        for (let i = 0; i < maxSnow; i++) {
          snowParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1.5 + 0.5,
            density: Math.random() * 30,
            opacity: Math.random() * 0.5 + 0.2
          });
        }
      }
    };
    initParticles();

    // Loop
    const draw = () => {
      if (mode === 'matrix') {
        // Semitransparent black background to create trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Green glowing matrix characters
        ctx.fillStyle = '#00ff46';
        ctx.font = `${fontSize}px monospace`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#00ff46';

        for (let i = 0; i < drops.length; i++) {
          const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          // Reset drop once it reaches bottom
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        ctx.shadowBlur = 0; // reset
      } 
      
      else if (mode === 'rain') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)'; // Cyan rain
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.3)';

        for (let i = 0; i < rainParticles.length; i++) {
          const r = rainParticles[i];
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          // Angle slightly diagonal
          ctx.lineTo(r.x - 1, r.y + r.length);
          ctx.stroke();

          // Move down
          r.y += r.speed;
          r.x -= 0.5;

          // Recycle
          if (r.y > canvas.height) {
            r.y = -20;
            r.x = Math.random() * canvas.width;
          }
        }
        ctx.shadowBlur = 0;
      } 
      
      else if (mode === 'snow') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        
        for (let i = 0; i < snowParticles.length; i++) {
          const s = snowParticles[i];
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();

          // Drifting angles
          s.y += s.speed;
          s.x += Math.sin(s.density) * 0.5;
          s.density += 0.01;

          // Recycle
          if (s.y > canvas.height) {
            s.y = -10;
            s.x = Math.random() * canvas.width;
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode]);

  if (!mode || mode === 'none') return null;

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: mode === 'matrix' ? -1 : 98, // Matrix behind cards, rain/snow over cards
        pointerEvents: 'none'
      }}
    />
  );
};

export default CanvasParticles;
