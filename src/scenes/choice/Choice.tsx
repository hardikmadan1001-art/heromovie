import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Text } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { audioManager } from '../../audio/AudioManager';
import gsap from 'gsap';
import '../../shaders/EnergyRimMaterial';

export const Choice: React.FC = () => {
  const { setChoice, setPhase } = useStore();
  const [hovered, setHovered] = useState<'left' | 'right' | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Cinematic Global Motion
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.05;
    }

    // Luxury Camera Response: Push and Tilt
    const targetX = hovered === 'left' ? -1.5 : hovered === 'right' ? 1.5 : 0;
    const targetFOV = hovered ? 32 : 40;
    
    gsap.to(state.camera.position, { x: targetX, duration: 0.8, ease: 'power2.out' });
    gsap.to(state.camera, { 
      fov: targetFOV, 
      duration: 0.8, 
      ease: 'power2.out', 
      onUpdate: () => state.camera.updateProjectionMatrix() 
    });

    // Update shader time for the heartbeat pulse
    const materials = state.scene.children
      .filter(c => c.material && (c.material as any).uTime !== undefined)
      .map(c => c.material as any);
    
    materials.forEach(mat => {
      mat.uTime = t;
    });
  });

  const handleSelect = (hero: 'spiderman' | 'ironman') => {
    // High-Impact "Commit" Sequence
    audioManager.playSfx('commit');
    
    // The "Fork Transition": Blind overexposure
    gsap.to('body', { 
      backgroundColor: 'white', 
      duration: 0.4, 
      ease: 'power4.in',
      onComplete: () => {
        setChoice(hero);
        setPhase(hero);
        gsap.to('body', { backgroundColor: 'var(--void-bg)', duration: 1, delay: 0.1 });
      }
    });
  };

  return (
    <group ref={groupRef}>
      {/* SPIDER-MAN MASK - Luxury Physical Material */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh 
          position={[-3, 0, 0]} 
          onClick={() => handleSelect('spiderman')}
          onPointerOver={() => setHovered('left')}
          onPointerOut={() => setHovered(null)}
          className="interactive"
        >
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial 
            color="#e62429" 
            roughness={0.3} 
            metalness={0.2} 
            clearcoat={1.0} 
            clearcoatRoughness={0.1} 
          />
          <Text 
            position={[0, -2, 0]} 
            fontSize={0.2} 
            color="white" 
            opacity={hovered === 'left' ? 1 : 0}
            transition={{ opacity: 0.5 }}
          >
            THE MASK
          </Text>
        </mesh>
      </Float>

      {/* ARC REACTOR - Energy Rim Shader */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh 
          position={[3, 0, 0]} 
          onClick={() => handleSelect('ironman')}
          onPointerOver={() => setHovered('right')}
          onPointerOut={() => setHovered(null)}
          className="interactive"
        >
          <torusGeometry args={[0.8, 0.2, 32, 100]} />
          <energyRimMaterial 
            uRimColor={new THREE.Color('#3fe0ff')} 
            uRimIntensity={3} 
            uRimPower={2} 
          />
          <Text 
            position={[0, -2, 0]} 
            fontSize={0.2} 
            color="white" 
            opacity={hovered === 'right' ? 1 : 0}
            transition={{ opacity: 0.5 }}
          >
            THE REACTOR
          </Text>
        </mesh>
      </Float>
      
      <Text 
        position={[0, 4, 0]} 
        fontSize={0.4} 
        color="white" 
        letterSpacing={0.5}
        fontWeight={300}
      >
        CHOOSE YOUR HERO
      </Text>
    </group>
  );
};
