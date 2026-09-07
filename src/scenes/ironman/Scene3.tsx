import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, PerspectiveCamera, Environment } from '@react-three/drei';
import gsap from 'gsap';
import { CinematicText } from '../../components/CinematicText';

export const Scene3: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const armorRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Orbit and Tilt around the prototype
    gsap.to(cameraRef.current!.position, {
      x: 5,
      y: 2,
      z: 5,
      scrollTrigger: {
        trigger: 'body',
        start: '190vh top',
        end: '+=110vh',
        scrub: 0.9,
      },
      ease: 'none',
    });

    gsap.to(cameraRef.current!.rotation, {
      y: Math.PI * 1.2,
      scrollTrigger: {
        trigger: 'body',
        start: '190vh top',
        end: '+=110vh',
        scrub: 0.9,
      },
      ease: 'none',
    });
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[-5, 2, 5]} fov={36} />
      
      <group ref={armorRef} position={[0, 1, 0]}>
        {/* Crude prototype armor (stylized boxes/cylinders) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 2]} />
          <meshStandardMaterial color="#444" roughness={0.8} />
        </mesh>
        <mesh position={[0.6, 0.5, 0]}>
          <boxGeometry args={[0.4, 0.6, 0.4]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[-0.6, 0.5, 0]}>
          <boxGeometry args={[0.4, 0.6, 0.4]} />
          <meshStandardMaterial color="#555" />
        </mesh>
      </group>

      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#ffa500" />

      <div style={{
        position: 'fixed',
        bottom: '15%',
        left: '10%',
        zIndex: 100,
        pointerEvents: 'none'
      }}>
        <CinematicText 
          text="It wasn't pretty. It worked." 
          className="i3-caption" 
          duration={1.2} 
        />
      </div>
    </>
  );
};
