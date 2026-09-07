import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, PerspectiveCamera, Environment } from '@react-three/drei';
import gsap from 'gsap';
import { CinematicText } from '../../components/CinematicText';
import '../../shaders/EnergyRimMaterial';

export const Scene4: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [activated, setActivated] = useState(false);
  const coreRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    // Camera pull back into the center of the AI ring
    gsap.to(cameraRef.current!.position, {
      z: 8,
      scrollTrigger: {
        trigger: 'body',
        start: '300vh top',
        end: '+=120vh',
        scrub: 1,
      },
      ease: 'none',
    });
  }, []);

  const handleActivate = () => {
    setActivated(true);
    // Power-up animation for the core
    gsap.to(coreRef.current!.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.3, yoyo: true, repeat: 1 });
    gsap.to(coreRef.current!.material, { emissiveIntensity: 10, duration: 0.2, yoyo: true, repeat: 1 });
  };

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 4]} fov={44} />
      
      {/* AI Core */}
      <mesh ref={coreRef} position={[0, 0, 0]} onClick={handleActivate} className="interactive">
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color="#3fe0ff" 
          emissive="#3fe0ff" 
          emissiveIntensity={2} 
        />
      </mesh>

      {/* Holographic Ring Panels */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh 
            key={i} 
            position={[Math.cos(angle) * 5, Math.sin(angle) * 2, Math.sin(angle) * 5]} 
            rotation={[0, -angle, 0]}
          >
            <planeGeometry args={[3, 2]} />
            <energyRimMaterial 
              uRimColor={new THREE.Color('#3fe0ff')} 
              uRimIntensity={2} 
              uRimPower={3} 
            />
            <Text 
              position={[0, 0, 0.1]} 
              fontSize={0.15} 
              color="white" 
              textAlign="center"
            >
              {`SENSORS_ACT_${i+1}`}
            </Text>
          </mesh>
        );
      })}

      <Environment preset="city" />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={5} color="#3fe0ff" />

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
        {!activated ? (
          <div 
            onClick={handleActivate} 
            className="interactive" 
            style={{ cursor: 'pointer', color: 'var(--im-cyan)', fontSize: '1.5rem', letterSpacing: '0.2em' }}
          >
            [ TAP TO ACTIVATE ]
          </div>
        ) : (
          <CinematicText 
            text="SYSTEMS ONLINE. WELCOME BACK." 
            className="i4-response" 
            duration={0.5} 
          />
        )}
      </div>
    </>
  );
};
