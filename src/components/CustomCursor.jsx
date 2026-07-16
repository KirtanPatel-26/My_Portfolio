import React, { useEffect, useRef, useState } from 'react';
import { audioEngine } from '../utils/AudioEngine';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const particles = useRef([]);
  const ripples = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      
      // Spawn trail sparks on move
      if (Math.random() < 0.35) {
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          size: Math.random() * 3 + 1,
          color: Math.random() > 0.5 ? 'var(--primary)' : 'var(--secondary)',
          alpha: 1,
          decay: Math.random() * 0.03 + 0.015,
        });
      }
    };

    const handleMouseOver = (e) => {
      // Find out if the hovered element is interactive
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.closest('.interactive-card') ||
        target.closest('.btn-premium');
      
      if (isInteractive) {
        setIsHovered(true);
        // Play subtle hover audio beep
        audioEngine.playHoverBeep();
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => {
      setIsClicked(true);
      audioEngine.playClickSpark();
      
      // Spawn explosion ripple on click
      ripples.current.push({
        x: mouse.current.x,
        y: mouse.current.y,
        radius: 2,
        maxRadius: Math.random() * 35 + 25,
        alpha: 1,
        color: 'var(--primary)',
        width: 3
      });

      // Spawn click explosion sparks
      for (let i = 0; i < 15; i++) {
        particles.current.push({
          x: mouse.current.x,
          y: mouse.current.y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          size: Math.random() * 4 + 1.5,
          color: Math.random() > 0.4 ? 'var(--primary)' : (Math.random() > 0.5 ? 'var(--secondary)' : '#ffea00'),
          alpha: 1,
          decay: Math.random() * 0.05 + 0.02,
        });
      }
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animationFrameId;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const updateCursor = () => {
      // 1. Move direct dot instantly
      if (dotRef.current) {
        dotRef.current.style.left = `${mouse.current.x}px`;
        dotRef.current.style.top = `${mouse.current.y}px`;
      }

      // 2. Move ring with smooth interpolation
      const ease = 0.16;
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * ease;
      
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }

      // 3. Render Canvas trail and click ripples
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update/Draw particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        
        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
          continue;
        }
        
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Update/Draw ripples
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const r = ripples.current[i];
        r.radius += (r.maxRadius - r.radius) * 0.12;
        r.alpha -= 0.04;
        
        if (r.alpha <= 0 || r.radius >= r.maxRadius - 1) {
          ripples.current.splice(i, 1);
          continue;
        }
        
        ctx.save();
        ctx.globalAlpha = r.alpha;
        ctx.strokeStyle = r.color;
        ctx.lineWidth = r.width;
        ctx.shadowBlur = 10;
        ctx.shadowColor = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(updateCursor);
    };
    
    updateCursor();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div 
        ref={dotRef} 
        className="custom-cursor-dot" 
        style={{ 
          transform: `translate(-50%, -50%) scale(${isClicked ? 0.75 : 1})`,
          transition: 'transform 0.1s ease'
        }}
      />
      <div 
        ref={ringRef} 
        className={`custom-cursor-ring ${isHovered ? 'hovered' : ''}`}
        style={{
          transform: `translate(-50%, -50%) scale(${isClicked ? 0.85 : 1})`
        }}
      />
      <canvas ref={canvasRef} className="cursor-canvas" />
    </>
  );
};

export default CustomCursor;
