import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, PerspectiveCamera, Environment } from '@react-three/drei';
import gsap from 'gsap';
import { CinematicText } from '../../components/CinematicText';

export const Scene6: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const characterRef = useRef<THREE.Mesh>(null);
  const ledgeRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: '500vh top',
        end: '+=100vh',
        scrub: 1,
        pin: true,
      },
    });

    // The Leap: Reverse Crane
    // Start: Static on ledge [0, 2, 5] -> End: Pull back and drop [0, -10, 20]
    tl.to(cameraRef.current!.position, { 
      y: -10, 
      z: 20, 
      duration: 1, 
      ease: 'power1.in' 
    }, 0)
    .to(characterRef.current!.position, { 
      y: -20, 
      z: 10, 
      duration: 1, 
      ease: 'power1.in' 
    }, 0.1);
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 2, 5]} fov={40} />
      
      {/* Rooftop Ledge */}
      <mesh ref={ledgeRef} position={[0, 0, 0]}>
        <boxGeometry args={[10, 1, 2]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* FULL SUIT REVEAL */}
      <mesh ref={characterRef} position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1.8]} />
        <meshStandardMaterial color="#e62429" emissive="#e62429" emissiveIntensity={0.2} />
      </mesh>

      {/* Sunrise Skyline */}
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 5, -10]} 
        intensity={2} 
        color="#ffaa44" 
      />

      {/* UI Narrative */}
      <div style={{
        position: 'fixed',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        pointerEvents: 'none',
        textAlign: 'center'
      }}>
        <CinematicText 
          text="He jumped anyway." 
          className="s6-caption" 
          duration={2} 
          delay={0.5} 
        />
      </div>
    </>
  );
};
