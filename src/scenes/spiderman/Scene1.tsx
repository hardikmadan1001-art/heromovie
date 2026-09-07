import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, Environment, Float } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Scene1: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const windowRef = useRef<THREE.Mesh>(null);
  const cityRef = useRef<THREE.Group>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cinematic Crane-up Camera Move
    // Start: Close on window [0, 1.5, 2] -> End: High view [0, 8, 20]
    gsap.to(cameraRef.current!.position, {
      x: 0,
      y: 8,
      z: 20,
      scrollTrigger: {
        trigger: 'body', // In a real setup, we'd use a specific marker
        start: 'top top',
        end: '+=90vh',
        scrub: 1.2,
      },
      ease: 'none',
    });

    // Caption Animation
    gsap.fromTo('.s1-caption', 
      { opacity: 0, y: 16 }, 
      { 
        opacity: 1, 
        y: 0, 
        scrollTrigger: {
          trigger: 'body',
          start: '10% top',
          end: '30% top',
          scrub: true,
        }
      }
    );
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Rain-on-glass simulation (scrolling texture)
    if (windowRef.current) {
      const mat = windowRef.current.material as THREE.MeshStandardMaterial;
      // Normally we'd use a custom shader, but for this step, we'll simulate with roughness/metalness flickers
      mat.roughness = 0.1 + Math.sin(t) * 0.05;
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 1.5, 2]} />
      
      {/* Rain Window - The starting point */}
      <mesh ref={windowRef} position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#aab" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Stylized City Block */}
      <group ref={cityRef}>
        {/* Simple Brownstones */}
        {[...Array(10)].map((_, i) => (
          <mesh key={i} position={[ (i % 2 === 0 ? -5 : 5), 2, -i * 5 ]}>
            <boxGeometry args={[4, 4, 4]} />
            <meshStandardMaterial color="#3d3d4d" />
            {/* Lit windows */}
            <mesh position={[0, 1, 2.01]}>
              <planeGeometry args={[0.5, 0.5]} />
              <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={2} />
            </mesh>
          </mesh>
        ))}
        
        {/* Protagonist Silhouette on Fire Escape */}
        <mesh position={[0, 2, -2]}>
          <cylinderGeometry args={[0.2, 0.2, 1.7]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>

      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffaa88" />

      {/* UI Caption */}
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
    </>
  );
};

// Helper to avoid missing PerspectiveCamera import
function PerspectiveCamera(props: any) {
  return <primitive object={new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)} {...props} />;
}
