import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, PerspectiveCamera, Float } from '@react-three/drei';
import gsap from 'gsap';
import { CinematicText } from '../../components/CinematicText';

export const Scene5: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const suitRef = useRef<THREE.Group>(null);

  const marks = [
    { label: 'MARK I — FUNCTIONAL', color: '#444', scale: 1.2 },
    { label: 'MARK II — TESTED', color: '#666', scale: 1.1 },
    { label: 'MARK III — REFINED', color: '#888', scale: 1.0 },
    { label: 'MARK V — SUITCASE', color: '#aaa', scale: 1.0 },
    { label: 'MARK [FINAL] — READY', color: '#e8b33d', scale: 1.0 },
  ];

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: '400vh top',
        end: '+=130vh',
        scrub: 0.4,
        pin: true,
      },
    });

    marks.forEach((mark, i) => {
      const t = i / marks.length;
      tl.to(cameraRef.current!.position, { 
        x: Math.sin(i) * 2, 
        y: 2 + Math.cos(i), 
        z: 5, 
        duration: 0.2 
      }, t)
      .to(cameraRef.current!.rotation, { 
        y: i * Math.PI / 3, 
        duration: 0.2 
      }, t);
    });
  }, []);

  useFrame((state) => {
    const scrollProgress = window.scrollY / window.innerHeight;
    const markIndex = Math.min(
      marks.length - 1, 
      Math.max(0, Math.floor((scrollProgress - 4) * 2))
    );
    
    if (suitRef.current) {
      const mark = marks[markIndex];
      gsap.to(suitRef.current.scale, { x: mark.scale, y: mark.scale, z: mark.scale, duration: 0.2 });
      // In a real build, we'd swap the mesh geometry here
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 2, 5]} fov={40} />
      
      <group ref={suitRef} position={[0, 1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 1.8]} />
          <meshStandardMaterial color="#888" />
        </mesh>
      </group>

      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} />

      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        pointerEvents: 'none',
        textAlign: 'center',
        fontFamily: 'monospace'
      }}>
        <div className="i5-caption" style={{ color: 'var(--im-gold)', fontSize: '2rem' }}>
          {/* The current mark label will be updated via GSAP/ScrollTrigger in real build */}
          MARK EVOLUTION
        </div>
      </div>
    </>
  );
};
