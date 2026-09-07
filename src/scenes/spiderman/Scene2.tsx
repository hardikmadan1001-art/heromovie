import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';

export const Scene2: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const spiderRef = useRef<THREE.Mesh>(null);
  const handRef = useRef<THREE.Mesh>(null);
  const [isBitten, setIsBitten] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: '90vh top',
        end: '+=60vh',
        scrub: 1,
        pin: true,
      },
    });

    // Macro push-in and rack focus
    tl.to(cameraRef.current!.position, { z: 0.5, duration: 1, ease: 'none' }, 0)
      .to(cameraRef.current!, { fov: 24, duration: 1, onUpdate: () => cameraRef.current?.updateProjectionMatrix() }, 0)
      .to(spiderRef.current!.position, { x: 0, z: 0, duration: 1, ease: 'none' }, 0)
      .addLabel('bite', 0.55)
      .to({}, { 
        duration: 0.1, 
        onComplete: () => {
          setIsBitten(true);
          // Trigger visual "BITE" text and screen shake
          gsap.fromTo('.s2-bite-text', { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.1 });
          gsap.to(cameraRef.current!.position, { x: 0.05, duration: 0.05, yoyo: true, repeat: 5 });
        }
      }, 'bite');
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 2]} fov={35} />
      
      {/* Hand/Wrist Placeholder */}
      <mesh ref={handRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 2]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>

      {/* Glowing Spider */}
      <mesh ref={spiderRef} position={[1, 0, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2} />
      </mesh>

      {/* BITE Text */}
      <div className="s2-bite-text" style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '8rem',
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Impact, sans-serif',
        pointerEvents: 'none',
        zIndex: 100,
        opacity: 0,
      }}>
        BITE.
      </div>

      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 1]} intensity={1} color="#00e5ff" />
    </>
  );
};
