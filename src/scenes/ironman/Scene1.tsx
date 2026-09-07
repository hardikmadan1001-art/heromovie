import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, PerspectiveCamera, Environment } from '@react-three/drei';
import gsap from 'gsap';
import { CinematicText } from '../../components/CinematicText';

export const Scene1: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const towerRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    // Mechanical Crane-Up
    gsap.to(cameraRef.current!.position, {
      y: 40,
      z: 60,
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: '+=90vh',
        scrub: 1,
      },
      ease: 'none',
    });

    // LookAt tilting from base to spire
    gsap.to(cameraRef.current!.rotation, {
      x: -0.5,
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: '+=90vh',
        scrub: 1,
      },
      ease: 'none',
    });
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, -2, 30]} fov={32} />
      
      {/* Stark Tower - Monolith */}
      <mesh ref={towerRef} position={[0, 20, 0]}>
        <boxGeometry args={[10, 40, 10]} />
        <meshPhysicalMaterial 
          color="#2b2e35" 
          metalness={0.9} 
          roughness={0.1} 
          clearcoat={1.0} 
        />
      </mesh>

      {/* City Background */}
      {[...Array(20)].map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 100, 
          0, 
          (Math.random() - 0.5) * 100
        ]}>
          <boxGeometry args={[5, Math.random() * 30 + 10, 5]} />
          <meshStandardMaterial color="#15171c" />
        </mesh>
      ))}

      <Environment preset="city" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 20, 10]} intensity={1} color="#aaccff" />

      {/* HUD-Style Typography */}
      <div style={{
        position: 'fixed',
        bottom: '15%',
        left: '10%',
        zIndex: 100,
        pointerEvents: 'none',
        fontFamily: 'monospace',
        color: 'var(--im-cyan)'
      }}>
        <CinematicText 
          text="STARK INDUSTRIES" 
          className="i1-logo" 
          duration={1} 
        />
        <div style={{ fontSize: '0.7rem', opacity: 0.6, letterSpacing: '0.2em', marginTop: '10px' }}>
          EST. — INNOVATION DIVISION
        </div>
      </div>
    </>
  );
};
