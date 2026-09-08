import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useStore } from '../../store/useStore';

export const Void: React.FC = () => {
  const { audioUnlocked } = useStore();
  const lightRef = useRef<THREE.PointLight>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lightRef.current) lightRef.current.intensity = 0.05 + Math.sin(t * 0.5) * 0.02;
    if (particlesRef.current) particlesRef.current.rotation.y += 0.0001;
    if (audioUnlocked) state.camera.position.z -= 0.0005;
  });

  return (
    <>
      <pointLight ref={lightRef} position={[0, 0, 0]} intensity={0.05} />
      {/* Static particle positions using ref to avoid re-randomizing on every render */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={500}
            array={new Float32Array(500 * 3).map(() => (Math.random() - 0.5) * 20)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#f5f3ee" transparent opacity={0.3} sizeAttenuation />
      </points>
    </>
  );
};
