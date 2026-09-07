import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, PerspectiveCamera, Float } from '@react-three/drei';
import gsap from 'gsap';
import { CinematicText } from '../../components/CinematicText';

export const Scene5: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const tunnelRef = useRef<THREE.Group>(null);

  const panels = useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        -i * 5,
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: Math.random() * 2 + 1,
      color: ['#00e5ff', '#ff2bd6', '#e62429'][Math.floor(Math.random() * 3)],
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scrollProgress = window.scrollY / window.innerHeight;
    
    // Tunnel Push-through
    if (tunnelRef.current) {
      tunnelRef.current.position.z = (scrollProgress - 4) * 10;
    }

    // Glitchy Camera Jumps
    if (Math.random() > 0.98) {
      cameraRef.current!.position.x += (Math.random() - 0.5) * 0.1;
      cameraRef.current!.position.y += (Math.random() - 0.5) * 0.1;
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={60} />
      
      <group ref={tunnelRef}>
        {panels.map((p, i) => (
          <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh position={p.position} rotation={p.rotation} scale={p.scale}>
              <planeGeometry args={[4, 6]} />
              <meshStandardMaterial 
                color={p.color} 
                transparent 
                opacity={0.6} 
                side={THREE.DoubleSide} 
              />
              <Text 
                position={[0, 0, 0.1]} 
                fontSize={0.3} 
                color="white" 
                maxWidth={3} 
                textAlign="center"
              >
                {i % 3 === 0 ? "SO MANY CHOICES" : i % 3 === 1 ? "SO MANY VERSIONS" : "SO MANY WORLDS"}
              </Text>
            </mesh>
          </Float>
        ))}
      </group>

      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ff2bd6" />

      {/* UI Glitch Captions */}
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
          text="So many versions of the same kid." 
          className="s5-caption" 
          duration={0.5} 
        />
      </div>
    </>
  );
};
