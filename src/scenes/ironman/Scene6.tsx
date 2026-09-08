import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, PerspectiveCamera, Environment } from '@react-three/drei';
import gsap from 'gsap';
import { CinematicText } from '../../components/CinematicText';
import '../../shaders/EnergyRimMaterial';

export const Scene6: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const suitGroupRef = useRef<THREE.Group>(null);
  const piecesRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: '530vh top',
        end: '+=120vh',
        scrub: 1.6,
        pin: true,
      },
    });

    // Full 360 orbit and spiral up
    tl.to(cameraRef.current!.position, { 
      x: 5, y: 8, z: 5, 
      duration: 1, 
      ease: 'none' 
    }, 0)
    .to(cameraRef.current!.rotation, { 
      y: Math.PI * 2, 
      duration: 1, 
      ease: 'none' 
    }, 0);

    // Piece assembly logic
    const pieces = piecesRef.current?.children || [];
    pieces.forEach((piece, i) => {
      const t = 0.1 + i * (0.8 / pieces.length);
      tl.to(piece.position, { 
        x: 0, y: 1, z: 0, 
        duration: 0.2, 
        ease: 'power2.in' 
      }, t);
    });
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[5, 2, 5]} fov={34} />
      
      <group ref={suitGroupRef}>
        {/* Core Character */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1.8]} />
          <meshStandardMaterial color="#111" />
        </mesh>

        {/* Assembly Pieces - positions generated once */}
        <group ref={piecesRef}>
          {[...Array(12)].map((_, i) => {
            const pos = useMemo(() => [
              (Math.random() - 0.5) * 10, 
              (Math.random() - 0.5) * 10, 
              (Math.random() - 0.5) * 10
            ], []);
            return (
              <mesh key={i} position={pos}>
                <boxGeometry args={[0.4, 0.4, 0.2]} />
                <energyRimMaterial uRimColor={new THREE.Color('#e8b33d')} uRimIntensity={3} uRimPower={2} />
              </mesh>
            );
          })}
        </group>
      </group>

      <Environment preset="city" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffccaa" />

      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        pointerEvents: 'none',
        textAlign: 'center'
      }}>
        <CinematicText 
          text="Genius. Built, not born." 
          className="i6-caption" 
          duration={1.5} 
        />
      </div>
    </>
  );
};
