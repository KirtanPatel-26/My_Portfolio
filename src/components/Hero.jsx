import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const Hero = () => {
  const mountRef = useRef(null);
  const parallaxRef = useRef({ x: 0, y: 0 });
  const [roleText, setRoleText] = useState('');
  
  // Typing animation setup
  const roles = [
    'Full Stack Developer',
    'React Specialist',
    'C++ Programmer',
    'Creative Thinker',
    'Problem Solver'
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentFullText = roles[roleIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setRoleText((prev) => prev.slice(0, -1));
      }, 40);
    } else {
      timer = setTimeout(() => {
        setRoleText((prev) => currentFullText.slice(0, prev.length + 1));
      }, 70);
    }

    if (!isDeleting && roleText === currentFullText) {
      timer = setTimeout(() => setIsDeleting(true), 1500); // pause at end
    } else if (isDeleting && roleText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timer);
  }, [roleText, isDeleting, roleIndex]);

  // ThreeJS Background 3D Shader Sphere
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight || window.innerHeight;
    
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Shader Material for wobbling gradient sphere
    const uniforms = {
      uTime: { value: 0.0 },
      uNoiseFreq: { value: 1.2 },
      uNoiseAmp: { value: 0.18 },
    };
    
    const vertexShader = `
      uniform float uTime;
      uniform float uNoiseFreq;
      uniform float uNoiseAmp;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      // Simple 3D sine wave deformation to simulate organic wobble
      float getWobble(vec3 pos) {
        return sin(pos.x * uNoiseFreq + uTime * 1.5) * 
               cos(pos.y * uNoiseFreq + uTime * 1.2) * 
               sin(pos.z * uNoiseFreq + uTime * 1.8) * uNoiseAmp;
      }
      
      void main() {
        vNormal = normalMatrix * normal;
        vPosition = position;
        vUv = uv;
        
        float wobble = getWobble(position);
        vec3 deformedPosition = position + normal * wobble;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(deformedPosition, 1.0);
      }
    `;
    
    const fragmentShader = `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        // Create organic moving color coordinates
        float r = 0.5 + 0.5 * sin(vPosition.x * 1.8 + uTime * 0.8);
        float g = 0.3 + 0.5 * cos(vPosition.y * 1.5 - uTime * 0.6);
        float b = 0.8 + 0.2 * sin(vPosition.z * 2.2 + uTime * 1.1);
        
        // Add subtle Fresnel glow border
        float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        vec3 baseGlow = vec3(r, g, b) + vec3(0.0, 0.94, 1.0) * intensity; // Blend base colors with neon cyan rim
        
        gl_FragColor = vec4(baseGlow, 0.92);
      }
    `;
    
    const sphereGeom = new THREE.SphereGeometry(1.6, 64, 64);
    const shaderMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true
    });
    
    const sphere = new THREE.Mesh(sphereGeom, shaderMat);
    scene.add(sphere);

    // Floating particles (Cones, Torus, Cubes)
    const floatersGroup = new THREE.Group();
    const floaterMat = new THREE.MeshStandardMaterial({
      color: 0x9d4edd,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.6
    });
    const glowFloaterMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.5
    });

    const geoms = [
      new THREE.TorusGeometry(0.18, 0.05, 12, 24),
      new THREE.ConeGeometry(0.15, 0.3, 4),
      new THREE.SphereGeometry(0.12, 12, 12),
      new THREE.BoxGeometry(0.2, 0.2, 0.2)
    ];

    const floatersCount = 18;
    const floaterObjs = [];

    for (let i = 0; i < floatersCount; i++) {
      const geom = geoms[Math.floor(Math.random() * geoms.length)];
      const mat = Math.random() > 0.5 ? floaterMat : glowFloaterMat;
      const mesh = new THREE.Mesh(geom, mat);
      
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3
      );
      
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        0
      );
      
      floatersGroup.add(mesh);
      floaterObjs.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        floatSpeed: Math.random() * 0.01 + 0.005,
        floatOffset: Math.random() * Math.PI * 2
      });
    }
    
    scene.add(floatersGroup);
    
    // Add lighting for floating mesh pieces
    const ambLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambLight);
    const pointLight = new THREE.PointLight(0x00f0ff, 1.5, 100);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    // Mouse movement parallax event
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      parallaxRef.current = { x, y };
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let clock = new THREE.Clock();
    let frameId;
    
    const tick = () => {
      const elapsed = clock.getElapsedTime();
      
      // Update uniform
      uniforms.uTime.value = elapsed;
      
      // Wobble animation
      sphere.rotation.y = elapsed * 0.15;
      sphere.rotation.x = elapsed * 0.1;
      
      // Mouse Parallax smooth lerp
      camera.position.x += (parallaxRef.current.x * 0.8 - camera.position.x) * 0.05;
      camera.position.y += (-parallaxRef.current.y * 0.8 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Animate floating mesh particles
      floaterObjs.forEach((f) => {
        f.mesh.rotation.x += f.rotSpeedX;
        f.mesh.rotation.y += f.rotSpeedY;
        f.mesh.position.y += Math.sin(elapsed + f.floatOffset) * 0.003;
      });
      
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };
    tick();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section 
      id="hero" 
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* 3D Scene canvas holder */}
      <div 
        ref={mountRef} 
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none'
        }} 
      />

      {/* Hero content overlays */}
      <div 
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '800px',
          padding: '0 24px'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span 
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--primary)',
              fontSize: '14px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '16px',
              textShadow: '0 0 10px var(--glow-color)'
            }}
          >
            SOFTWARE ARCHITECT & DEVELOPER
          </span>
          
          <h1 
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: '800',
              lineHeight: '1.05',
              color: '#fff',
              letterSpacing: '-2px',
              marginBottom: '20px'
            }}
          >
            Hi, I'm <span style={{
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none'
            }}>Kirtan Patel</span>
          </h1>

          {/* Typing Roles Container */}
          <div 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)',
              color: 'var(--text-main)',
              height: '40px',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span>I build solutions as a&nbsp;</span>
            <span style={{ 
              color: 'var(--secondary)', 
              borderRight: '2.5px solid var(--primary)', 
              paddingRight: '4px',
              animation: 'blink 0.75s step-end infinite',
              textShadow: '0 0 10px var(--accent-glow)'
            }}>
              {roleText}
            </span>
          </div>

          <p 
            style={{
              fontSize: '15px',
              color: 'var(--text-muted)',
              lineHeight: '1.6',
              maxWidth: '540px',
              margin: '0 auto 40px auto',
              fontFamily: 'var(--font-sans)'
            }}
          >
            Crafting premium digital experiences where fluid design meets robust engineering. Specializing in highly interactive applications, custom 3D web frameworks, and algorithms.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a 
              href="#projects" 
              className="btn-premium"
            >
              Explore Creations
            </a>
            <a 
              href="#contact" 
              className="btn-premium"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              Get In Touch
            </a>
          </div>
        </motion.div>
      </div>

      {/* Mouse scroll down indicator */}
      <div 
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '1px'
        }}
      >
        <span>SCROLL DOWN</span>
        <div 
          style={{
            width: '20px',
            height: '35px',
            border: '1.5px solid var(--card-border)',
            borderRadius: '10px',
            position: 'relative'
          }}
        >
          <motion.div 
            animate={{
              y: [2, 18, 2],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '4px',
              height: '6px',
              backgroundColor: 'var(--primary)',
              borderRadius: '50%',
              position: 'absolute',
              left: '7px',
              top: '4px'
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes blink {
          from, to { border-color: transparent }
          50% { border-color: var(--primary); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
