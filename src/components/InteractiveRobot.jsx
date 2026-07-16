import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const InteractiveRobot = () => {
  const mountRef = useRef(null);
  
  // Animation/Joint references
  const rightShoulder = useRef(null);
  const robotGroup = useRef(null);
  const eyeLMatRef = useRef(null);
  const eyeRMatRef = useRef(null);
  
  // Wave state
  const isWaving = useRef(false);
  const waveTime = useRef(0);
  const hoverActive = useRef(false);
  
  useEffect(() => {
    const width = mountRef.current.clientWidth || 300;
    const height = 300;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4);
    camera.lookAt(0, 0.7, 0);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0x00f0ff, 2.5);
    spotLight.position.set(2, 4, 3);
    scene.add(spotLight);
    
    const fillLight = new THREE.DirectionalLight(0x9d4edd, 1.5);
    fillLight.position.set(-2, 2, -1);
    scene.add(fillLight);
    
    // Robot parent group
    const robot = new THREE.Group();
    robotGroup.current = robot;
    scene.add(robot);
    
    // Materials
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x22252a,
      roughness: 0.15,
      metalness: 0.8,
    });
    
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xe09f3e,
      roughness: 0.2,
      metalness: 0.7,
    });
    
    const glowMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.5,
    });
    
    // Torso (Body box)
    const torsoGeom = new THREE.BoxGeometry(0.7, 0.9, 0.5);
    const torso = new THREE.Mesh(torsoGeom, metalMat);
    torso.position.y = 0.75;
    robot.add(torso);
    
    // Torso screen/glowing plate
    const screenGeom = new THREE.BoxGeometry(0.45, 0.35, 0.05);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.1,
    });
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.position.set(0, 0.8, 0.24);
    robot.add(screen);
    
    // Core (Heart light)
    const coreGeom = new THREE.SphereGeometry(0.08, 8, 8);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x9d4edd,
      emissive: 0x9d4edd,
      emissiveIntensity: 1.2
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    core.position.set(0, 0.8, 0.26);
    robot.add(core);
    
    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.4, 0);
    
    const headGeom = new THREE.BoxGeometry(0.55, 0.45, 0.45);
    const head = new THREE.Mesh(headGeom, metalMat);
    headGroup.add(head);
    
    // Digital Eyes
    const eyeGeom = new THREE.BoxGeometry(0.12, 0.04, 0.05);
    const eyeLMat = glowMat.clone();
    const eyeRMat = glowMat.clone();
    eyeLMatRef.current = eyeLMat;
    eyeRMatRef.current = eyeRMat;
    
    const eyeL = new THREE.Mesh(eyeGeom, eyeLMat);
    eyeL.position.set(0.14, 0.06, 0.21);
    const eyeR = new THREE.Mesh(eyeGeom, eyeRMat);
    eyeR.position.set(-0.14, 0.06, 0.21);
    headGroup.add(eyeL);
    headGroup.add(eyeR);
    
    // Ears/Antenna connectors
    const boltGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.12, 8);
    boltGeom.rotateZ(Math.PI / 2);
    const earL = new THREE.Mesh(boltGeom, brassMat);
    earL.position.set(0.3, 0.06, 0);
    const earR = new THREE.Mesh(boltGeom, brassMat);
    earR.position.set(-0.3, 0.06, 0);
    headGroup.add(earL);
    headGroup.add(earR);
    
    // Antenna
    const antennaStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8), brassMat);
    antennaStem.position.set(0, 0.3, 0);
    const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), glowMat);
    antennaTip.position.set(0, 0.42, 0);
    headGroup.add(antennaStem);
    headGroup.add(antennaTip);
    
    robot.add(headGroup);
    
    // Neck joint
    const neckGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 8);
    const neck = new THREE.Mesh(neckGeom, brassMat);
    neck.position.y = 1.25;
    robot.add(neck);
    
    // Left Arm (Static/relaxed)
    const armGeom = new THREE.CylinderGeometry(0.06, 0.05, 0.6, 8);
    armGeom.translate(0, -0.3, 0);
    const armL = new THREE.Mesh(armGeom, metalMat);
    armL.position.set(0.44, 1.1, 0);
    armL.rotation.z = -0.2;
    robot.add(armL);
    
    // Left Shoulder Joint
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), brassMat);
    shoulderL.position.set(0.42, 1.15, 0);
    robot.add(shoulderL);
    
    // Right Arm Joint Group (for Waving)
    const waveJoint = new THREE.Group();
    waveJoint.position.set(-0.42, 1.15, 0);
    rightShoulder.current = waveJoint;
    
    // Shoulder Sphere
    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), brassMat);
    waveJoint.add(shoulderR);
    
    // Right Arm (Relative to joint)
    const armR = new THREE.Mesh(armGeom, metalMat);
    armR.position.set(-0.02, -0.05, 0);
    armR.rotation.z = 0.2;
    waveJoint.add(armR);
    
    robot.add(waveJoint);
    
    // Legs
    const legGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8);
    const footGeom = new THREE.BoxGeometry(0.16, 0.08, 0.22);
    
    // Leg L
    const legL = new THREE.Mesh(legGeom, metalMat);
    legL.position.set(0.2, 0.1, 0);
    const footL = new THREE.Mesh(footGeom, brassMat);
    footL.position.set(0.2, -0.12, 0.04);
    robot.add(legL);
    robot.add(footL);
    
    // Leg R
    const legR = new THREE.Mesh(legGeom, metalMat);
    legR.position.set(-0.2, 0.1, 0);
    const footR = new THREE.Mesh(footGeom, brassMat);
    footR.position.set(-0.2, -0.12, 0.04);
    robot.add(legR);
    robot.add(footR);
    
    // Position robot overall
    robot.position.y = 0.2;
    
    // Mouse hover trackers
    const handleMouseIn = () => {
      hoverActive.current = true;
      isWaving.current = true;
    };
    
    const handleMouseOut = () => {
      hoverActive.current = false;
    };
    
    const handleClick = () => {
      isWaving.current = true;
      waveTime.current = 0; // restart wave
      
      // Blink eyes green/purple
      if (eyeLMatRef.current && eyeRMatRef.current) {
        eyeLMatRef.current.color.setHex(0x9d4edd);
        eyeLMatRef.current.emissive.setHex(0x9d4edd);
        eyeRMatRef.current.color.setHex(0x9d4edd);
        eyeRMatRef.current.emissive.setHex(0x9d4edd);
        setTimeout(() => {
          if (eyeLMatRef.current) {
            eyeLMatRef.current.color.setHex(0x00f0ff);
            eyeLMatRef.current.emissive.setHex(0x00f0ff);
          }
          if (eyeRMatRef.current) {
            eyeRMatRef.current.color.setHex(0x00f0ff);
            eyeRMatRef.current.emissive.setHex(0x00f0ff);
          }
        }, 600);
      }
    };
    
    const dom = renderer.domElement;
    dom.addEventListener('mouseenter', handleMouseIn);
    dom.addEventListener('mouseleave', handleMouseOut);
    dom.addEventListener('click', handleClick);
    
    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', handleResize);
    
    // Animation tick loop
    let frameId;
    let clock = new THREE.Clock();
    
    const tick = () => {
      const elapsed = clock.getElapsedTime();
      
      // Idle body breathing
      if (robotGroup.current) {
        robotGroup.current.position.y = 0.2 + Math.sin(elapsed * 2) * 0.04;
        robotGroup.current.rotation.y = Math.sin(elapsed * 0.5) * 0.15;
      }
      
      // Head looking slightly
      headGroup.rotation.y = Math.sin(elapsed * 1) * 0.08;
      headGroup.rotation.x = Math.sin(elapsed * 0.6) * 0.04;
      
      // Heart glow pulse
      coreMat.emissiveIntensity = 1.0 + Math.sin(elapsed * 5) * 0.5;
      
      // Waving animation
      if (isWaving.current && rightShoulder.current) {
        waveTime.current += 0.08;
        
        // Lift arm up and swing back/forth
        const armLift = 2.0; // Rotate up
        const swing = Math.sin(waveTime.current * 4) * 0.4;
        
        rightShoulder.current.rotation.z = armLift + swing;
        rightShoulder.current.rotation.x = Math.sin(waveTime.current * 2) * 0.25;
        
        // Stop waving after 3 wave cycles (unless still hovering)
        if (waveTime.current > Math.PI * 3 && !hoverActive.current) {
          isWaving.current = false;
          waveTime.current = 0;
        }
      } else if (rightShoulder.current) {
        // Return arm to relaxed position smoothly
        rightShoulder.current.rotation.z += (0.2 - rightShoulder.current.rotation.z) * 0.15;
        rightShoulder.current.rotation.x += (0 - rightShoulder.current.rotation.x) * 0.15;
      }
      
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };
    tick();
    
    return () => {
      cancelAnimationFrame(frameId);
      dom.removeEventListener('mouseenter', handleMouseIn);
      dom.removeEventListener('mouseleave', handleMouseOut);
      dom.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && dom) {
        mountRef.current.removeChild(dom);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '300px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative'
      }} 
    />
  );
};

export default InteractiveRobot;
