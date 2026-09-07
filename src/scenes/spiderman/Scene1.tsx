import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, Environment, Float, Html } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Scene1: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const windowRef = useRef<THREE.Mesh>(null);
  const cityRef = useRef<THREE.Group>(null);

  useEffect(() => {
    gsap.to(cameraRef.current!.position, {
      x: 0,
      y: 8,
      z: 20,
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: '+=90vh',
        scrub: 1.2,
      },
      ease: 'none',
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (windowRef.current) {
      const mat = windowRef.current.material as THREE.MeshStandardMaterial;
      mat.roughness = 0.1 + Math.sin(t) * 0.05;
    }
  });

  return (
    <>
      <primitive 
        object={new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)} 
        ref={cameraRef} 
        makeDefault 
        position={[0, 1.5, 2]} 
      />
      
      <mesh ref={windowRef} position={[0, 1.5, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#aab" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>

      <group ref={cityRef}>
        {[...Array(10)].map((_, i) => (
          <mesh key={i} position={[ (i % 2 === 0 ? -5 : 5), 2, -i * 5 ]}>
            <boxGeometry args={[4, 4, 4]} />
            <meshStandardMaterial color="#3d3d4d" />
            <mesh position={[0, 1, 2.01]}>
              <planeGeometry args={[0.5, 0.5]} />
              <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={2} />
            </mesh>
          </mesh>
        ))}
        <mesh position={[0, 2, -2]}>
          <cylinderGeometry args={[0.2, 0.2, 1.7]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>

      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffaa88" />

      <Html position={[0, 0, 0]} center>
        <div className="s1-caption" style={{
          position: 'fixed',
          bottom: '15%',
          left: '10%',
          fontSize: '1.2rem',
          color: 'var(--void-fg)',
          fontFamily: 'sans-serif',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 100,
        }}>
          Just another kid.
        </div>
      </Html>
    </>
  );
};
