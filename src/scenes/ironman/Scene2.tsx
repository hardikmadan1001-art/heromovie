import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, PerspectiveCamera, Float, Environment } from '@react-three/drei';
import gsap from 'gsap';
import { CinematicText } from '../../components/CinematicText';
import '../../shaders/EnergyRimMaterial';

export const Scene2: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const workshopRef = useRef<THREE.Group>(null);

  useEffect(() => {
    gsap.to(cameraRef.current!.position, {
      x: 10,
      scrollTrigger: {
        trigger: 'body',
        start: '90vh top',
        end: '+=100vh',
        scrub: 1.4,
      },
      ease: 'sine.inOut',
    });
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[-10, 2, 5]} fov={42} />
      
      <group ref={workshopRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#15171c" roughness={0.8} />
        </mesh>

        {[...Array(15)].map((_, i) => (
          <mesh key={i} position={[
            (i % 5) * 4 - 8, 
            0.5, 
            (Math.floor(i / 5)) * 3 - 5
          ]}>
            <boxGeometry args={[2, 1, 1]} />
            <meshStandardMaterial color="#2b2e35" roughness={0.6} />
          </mesh>
        ))}

        {[...Array(3)].map((_, i) => (
          <Float key={i} speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <mesh position={[i * 4 - 4, 2, -2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[2, 2]} />
              <energyRimMaterial 
                uRimColor={new THREE.Color('#3fe0ff')} 
                uRimIntensity={2} 
                uRimPower={3} 
              />
              <Text 
                position={[0, 0, 0.1]} 
                fontSize={0.1} 
                color="white" 
                textAlign="center"
              >
                SCHEMATIC_V{i+1}.0
              </Text>
            </mesh>
          </Float>
        ))}
      </group>

      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 0]} intensity={1} color="#ffccaa" />
      <pointLight position={[0, 2, -2]} intensity={1} color="#3fe0ff" />

      <div style={{
        position: 'fixed',
        bottom: '15%',
        left: '10%',
        zIndex: 100,
        pointerEvents: 'none'
      }}>
        <CinematicText 
          text="Every empire starts on a workbench." 
          className="i2-caption" 
          duration={1.2} 
        />
      </div>
    </>
  );
};
