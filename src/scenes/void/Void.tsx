import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, Html } from '@react-three/drei';
import gsap from 'gsap';
import { useStore } from '../../store/useStore';
import { CinematicText } from '../../components/CinematicText';
import { audioManager } from '../../audio/AudioManager';

export const Void: React.FC = () => {
  const { setAudioUnlocked } = useStore();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const lightRef = useRef<THREE.PointLight>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useEffect(() => {
    const unlockAudio = () => {
      setAudioUnlocked(true);
      setIsUnlocked(true);
      playVoidSequence();
    };

    window.addEventListener('click', unlockAudio, { once: true });
    return () => window.removeEventListener('click', unlockAudio);
  }, [setAudioUnlocked]);

  const playVoidSequence = () => {
    audioManager.playMusic('/audio/void-drone.mp3');
    audioManager.playSfx('void-vo-1');
  };

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lightRef.current) lightRef.current.intensity = 0.05 + Math.sin(t * 0.5) * 0.02;
    if (particlesRef.current) particlesRef.current.rotation.y += 0.0001;
    if (isUnlocked) state.camera.position.z -= 0.0005;
  });

  return (
    <>
      <pointLight ref={lightRef} position={[0, 0, 0]} intensity={0.05} />
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={300}
            array={new Float32Array(300 * 3).map(() => (Math.random() - 0.5) * 15)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.01} color="#f5f3ee" transparent opacity={0.1} sizeAttenuation />
      </points>

      {isUnlocked && (
        <Html center>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100,
            pointerEvents: 'none',
            textAlign: 'center',
            width: '100vw'
          }}>
            <CinematicText 
              text="Every hero starts with a choice." 
              className="void-main-text" 
              duration={1.5} 
              delay={0.5} 
            />
          </div>
        </Html>
      )}

      {!isUnlocked && (
        <Html center>
          <div 
            onClick={() => {}} 
            style={{
              cursor: 'pointer',
              color: 'white',
              fontSize: '0.7rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              opacity: 0.8,
              userSelect: 'none'
            }}
          >
            [ Tap to Enter ]
          </div>
        </Html>
      )}
    </>
  );
};
