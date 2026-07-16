import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { audioEngine } from '../utils/AudioEngine';

const InteractiveDog = () => {
  const containerRef = useRef(null);
  const mountRef = useRef(null);
  
  // Tracking coordinates
  const dogPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const lastDogPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  
  // Paw print list state to render HTML elements
  const [pawPrints, setPawPrints] = useState([]);
  const pawCounter = useRef(0);
  
  // Interaction states
  const [speechBubble, setSpeechBubble] = useState('');
  const bubbleTimeout = useRef(null);
  
  // Three.js object references for animation
  const dogGroup = useRef(null);
  const headGroup = useRef(null);
  const tailRef = useRef(null);
  const legFL = useRef(null);
  const legFR = useRef(null);
  const legBL = useRef(null);
  const legBR = useRef(null);
  
  // Animation state variables
  const speed = useRef(0);
  const jumpProgress = useRef(0);
  const isJumping = useRef(false);
  const spinProgress = useRef(0);
  const isSpinning = useRef(false);
  const animTime = useRef(0);
  
  useEffect(() => {
    // 1. Mouse & Hover listeners
    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.classList.contains('interactive-card') ||
        target.closest('.btn-premium');
      
      if (isInteractive) {
        // Bark and wag tail rapidly!
        audioEngine.playDogBark();
        triggerSpeechBubble(getRandomBarkPhrase());
        
        // Randomly jump or spin on hover too!
        if (Math.random() > 0.5) {
          if (Math.random() > 0.5) isJumping.current = true;
          else isSpinning.current = true;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    // 2. Setup Three.js scene inside the mountRef
    const width = 120;
    const height = 120;
    
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.5);
    camera.lookAt(0, 0.2, 0);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0x00f0ff, 1.2); // Cyan glow
    dirLight.position.set(5, 5, 2);
    scene.add(dirLight);
    
    const purpleLight = new THREE.DirectionalLight(0x9d4edd, 0.8); // Purple glow
    purpleLight.position.set(-5, 3, -2);
    scene.add(purpleLight);

    // 3. Build Procedural 3D Dog (Cyberpunk Golden-Neon Retriever)
    const dog = new THREE.Group();
    dogGroup.current = dog;
    
    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: 0xe09f3e, // Golden-cyber
      roughness: 0.1,
      metalness: 0.8,
    });
    const neonMat = new THREE.MeshStandardMaterial({ 
      color: 0x9d4edd, // Neon Purple
      emissive: 0x9d4edd,
      emissiveIntensity: 0.6,
    });
    const blackMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const collarMat = new THREE.MeshStandardMaterial({ 
      color: 0x00f0ff, 
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8
    });
    
    // Body (cylinder)
    const bodyGeom = new THREE.CylinderGeometry(0.35, 0.35, 1, 12);
    bodyGeom.rotateX(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.y = 0.45;
    dog.add(body);
    
    // Collar
    const collarGeom = new THREE.CylinderGeometry(0.36, 0.36, 0.08, 12);
    collarGeom.rotateX(Math.PI / 2);
    const collar = new THREE.Mesh(collarGeom, collarMat);
    collar.position.set(0, 0.65, -0.4);
    dog.add(collar);
    
    // Head Group (parented to rotate nicely)
    const head = new THREE.Group();
    head.position.set(0, 0.95, -0.5);
    headGroup.current = head;
    
    // Skull (Sphere)
    const skullGeom = new THREE.SphereGeometry(0.38, 16, 16);
    const skull = new THREE.Mesh(skullGeom, bodyMat);
    head.add(skull);
    
    // Snout (Box)
    const snoutGeom = new THREE.BoxGeometry(0.22, 0.22, 0.35);
    const snout = new THREE.Mesh(snoutGeom, bodyMat);
    snout.position.set(0, -0.06, -0.38);
    head.add(snout);
    
    // Nose (Sphere)
    const noseGeom = new THREE.SphereGeometry(0.06, 8, 8);
    const nose = new THREE.Mesh(noseGeom, blackMat);
    nose.position.set(0, -0.01, -0.56);
    head.add(nose);
    
    // Eyes (Spheres)
    const eyeGeom = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeL = new THREE.Mesh(eyeGeom, neonMat);
    eyeL.position.set(0.16, 0.1, -0.28);
    const eyeR = new THREE.Mesh(eyeGeom, neonMat);
    eyeR.position.set(-0.16, 0.1, -0.28);
    head.add(eyeL);
    head.add(eyeR);
    
    // Ears (Boxes - Flappy!)
    const earGeom = new THREE.BoxGeometry(0.1, 0.38, 0.08);
    const earL = new THREE.Mesh(earGeom, bodyMat);
    earL.position.set(0.38, -0.05, -0.08);
    earL.rotation.z = -0.15;
    const earR = new THREE.Mesh(earGeom, bodyMat);
    earR.position.set(-0.38, -0.05, -0.08);
    earR.rotation.z = 0.15;
    head.add(earL);
    head.add(earR);
    
    dog.add(head);
    
    // Tail
    const tailGeom = new THREE.CylinderGeometry(0.05, 0.02, 0.5, 8);
    tailGeom.translate(0, 0.25, 0);
    tailGeom.rotateX(-Math.PI / 3);
    const tail = new THREE.Mesh(tailGeom, bodyMat);
    tail.position.set(0, 0.65, 0.45);
    tailRef.current = tail;
    dog.add(tail);
    
    // Legs (Cylinders)
    const legGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.55, 8);
    legGeom.translate(0, -0.275, 0);
    
    const fl = new THREE.Mesh(legGeom, bodyMat);
    fl.position.set(0.24, 0.3, -0.35);
    legFL.current = fl;
    dog.add(fl);
    
    const fr = new THREE.Mesh(legGeom, bodyMat);
    fr.position.set(-0.24, 0.3, -0.35);
    legFR.current = fr;
    dog.add(fr);
    
    const bl = new THREE.Mesh(legGeom, bodyMat);
    bl.position.set(0.24, 0.3, 0.35);
    legBL.current = bl;
    dog.add(bl);
    
    const br = new THREE.Mesh(legGeom, bodyMat);
    br.position.set(-0.24, 0.3, 0.35);
    legBR.current = br;
    dog.add(br);
    
    scene.add(dog);
    
    // Scale down the whole dog so it fits nicely in the small canvas viewport
    dog.scale.set(1.2, 1.2, 1.2);
    // Face mostly forward/diagonal
    dog.rotation.y = Math.PI - 0.4;
    
    // 4. Tick Animation Loop
    let animationFrameId;
    let tickCount = 0;
    
    const animate = () => {
      // 4.1 Update Coordinates of Dog Container (lag behind cursor)
      const ease = 0.07;
      
      // Calculate current speed
      const dx = mousePos.current.x - dogPos.current.x;
      const dy = mousePos.current.y - dogPos.current.y;
      
      // Make it hover 45px below and 45px to the right/left depending on direction
      const targetX = mousePos.current.x - (dx > 0 ? 55 : -55);
      const targetY = mousePos.current.y + 55;
      
      lastDogPos.current.x = dogPos.current.x;
      lastDogPos.current.y = dogPos.current.y;
      
      dogPos.current.x += (targetX - dogPos.current.x) * ease;
      dogPos.current.y += (targetY - dogPos.current.y) * ease;
      
      const moveDistance = Math.hypot(
        dogPos.current.x - lastDogPos.current.x,
        dogPos.current.y - lastDogPos.current.y
      );
      
      speed.current = moveDistance;
      
      if (containerRef.current) {
        containerRef.current.style.left = `${dogPos.current.x}px`;
        containerRef.current.style.top = `${dogPos.current.y}px`;
      }
      
      // 4.2 Spawn Paw Prints behind the dog when moving
      if (speed.current > 1.2 && tickCount % 12 === 0) {
        // Alternate left/right paw offsetting
        const sideOffset = (tickCount % 24 === 0 ? 1 : -1) * 12;
        spawnPawPrint(dogPos.current.x - sideOffset, dogPos.current.y);
      }
      
      // 4.3 Update 3D Rotations/Angles based on direction
      if (dogGroup.current) {
        // Face moving direction
        if (Math.abs(dx) > 2) {
          const targetYAngle = dx > 0 ? Math.PI - 0.5 : Math.PI + 0.5;
          dogGroup.current.rotation.y += (targetYAngle - dogGroup.current.rotation.y) * 0.1;
        }
        
        // 4.4 Run Jumps and Spins animation progress
        if (isJumping.current) {
          jumpProgress.current += 0.08;
          const jumpHeight = Math.sin(jumpProgress.current) * 0.8;
          dogGroup.current.position.y = jumpHeight;
          
          if (jumpProgress.current >= Math.PI) {
            isJumping.current = false;
            jumpProgress.current = 0;
            dogGroup.current.position.y = 0;
          }
        }
        
        if (isSpinning.current) {
          spinProgress.current += 0.12;
          dogGroup.current.rotation.y += 0.4;
          
          if (spinProgress.current >= Math.PI * 2) {
            isSpinning.current = false;
            spinProgress.current = 0;
          }
        }
      }
      
      // 4.5 Run legs cycle / tail wag cycle
      animTime.current += Math.min(speed.current * 0.08 + 0.02, 0.4);
      
      if (speed.current > 0.3) {
        // Running state
        const legSwing = Math.sin(animTime.current * 2) * 0.7;
        const tailWag = Math.sin(animTime.current * 4) * 0.4;
        
        if (legFL.current) legFL.current.rotation.x = legSwing;
        if (legBR.current) legBR.current.rotation.x = legSwing;
        if (legFR.current) legFR.current.rotation.x = -legSwing;
        if (legBL.current) legBL.current.rotation.x = -legSwing;
        
        if (tailRef.current) tailRef.current.rotation.z = tailWag;
        if (headGroup.current) headGroup.current.rotation.z = Math.sin(animTime.current * 1.5) * 0.1;
      } else {
        // Sitting/Idle State
        const sitEase = 0.1;
        
        // Return legs to neutral sitting positions
        if (legFL.current) legFL.current.rotation.x += (0 - legFL.current.rotation.x) * sitEase;
        if (legFR.current) legFR.current.rotation.x += (0 - legFR.current.rotation.x) * sitEase;
        // Back legs collapse slightly back
        if (legBL.current) legBL.current.rotation.x += (0.6 - legBL.current.rotation.x) * sitEase;
        if (legBR.current) legBR.current.rotation.x += (0.6 - legBR.current.rotation.x) * sitEase;
        
        // Slow tail wag
        if (tailRef.current) tailRef.current.rotation.z = Math.sin(tickCount * 0.05) * 0.15;
        if (headGroup.current) {
          headGroup.current.rotation.z += (0 - headGroup.current.rotation.z) * sitEase;
          headGroup.current.rotation.x = Math.sin(tickCount * 0.03) * 0.06; // Idle breath nod
        }
      }

      // Randomly trigger jumps/spins while idle
      if (speed.current < 0.2 && Math.random() < 0.003 && !isJumping.current && !isSpinning.current) {
        const rand = Math.random();
        if (rand < 0.3) {
          isJumping.current = true;
          triggerSpeechBubble('Yip!');
        } else if (rand < 0.6) {
          isSpinning.current = true;
          triggerSpeechBubble('Spin!');
        } else {
          triggerSpeechBubble('💤');
        }
      }
      
      tickCount++;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
      
      if (renderer && renderer.domElement && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      
      if (bubbleTimeout.current) clearTimeout(bubbleTimeout.current);
    };
  }, []);

  // Bubble text handlers
  const triggerSpeechBubble = (text) => {
    if (bubbleTimeout.current) clearTimeout(bubbleTimeout.current);
    setSpeechBubble(text);
    bubbleTimeout.current = setTimeout(() => {
      setSpeechBubble('');
    }, 1500);
  };

  const getRandomBarkPhrase = () => {
    const barks = ['Arf!', 'Woof!', 'Bark!', '♥', 'Code!', 'Fetch!', 'Tech!', 'Wag!'];
    return barks[Math.floor(Math.random() * barks.length)];
  };

  const spawnPawPrint = (x, y) => {
    const id = pawCounter.current++;
    setPawPrints((prev) => [...prev.slice(-15), { id, x, y }]);
    
    // Cleanup paw after 2.5s
    setTimeout(() => {
      setPawPrints((prev) => prev.filter((p) => p.id !== id));
    }, 2500);
  };

  return (
    <>
      {/* HTML Paw Prints overlay */}
      {pawPrints.map((paw) => (
        <div 
          key={paw.id} 
          className="paw-print" 
          style={{ left: paw.x, top: paw.y }} 
        />
      ))}
      
      {/* Floating 3D Dog Container */}
      <div 
        ref={containerRef}
        style={{
          position: 'fixed',
          width: '120px',
          height: '120px',
          zIndex: 999,
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Cute glass speech bubble */}
        {speechBubble && (
          <div 
            style={{
              position: 'absolute',
              top: '-25px',
              background: 'rgba(5, 5, 5, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid var(--primary)',
              borderRadius: '12px',
              padding: '4px 10px',
              color: 'var(--text-main)',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 10px var(--glow-color)',
              animation: 'scaleIn 0.15s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {speechBubble}
          </div>
        )}
        
        {/* ThreeJS canvas mount point */}
        <div ref={mountRef} style={{ width: '120px', height: '120px' }} />
      </div>
      
      {/* Quick keyframe styles for Speech Bubble */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0) translateY(10px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default InteractiveDog;
