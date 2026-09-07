import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, PerspectiveCamera, Float } from '@react-three/drei';
import gsap from 'gsap';

export const Scene3: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const bedroomRef = useRef<THREE.Group>(null);
  const [activeBeat, setActiveBeat] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: '150vh top',
        end: '+=110vh',
        scrub: 1,
        pin: true,
      },
    });

    // Beat 1: Wall Crawl Orbit
    tl.to(cameraRef.current!.position, { x: 5, y: 5, z: 5, duration: 1 }, 0)
      .to(cameraRef.current!.rotation, { y: Math.PI, duration: 1 }, 0);

    // Beat 2: Bullet Time (Reflexes)
    tl.to(cameraRef.current!.position, { x: 0, y: 2, z: 2, duration: 1 }, 1)
      .to(cameraRef.current!.rotation, { y: -Math.PI/2, duration: 1 }, 1);

    // Beat 3: Strength Push-in
    tl.to(cameraRef.current!.position, { z: 1, duration: 1 }, 2);
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 2, 5]} />
      
      <group ref={bedroomRef}>
        {/* Stylized Bedroom Box */}
        <mesh position={[0, 0, -5]}>
          <boxGeometry args={[10, 10, 10]} />
          <meshStandardMaterial color="#4a3b2c" side={THREE.BackSide} />
        </mesh>
        
        {/* Bed/Furniture Placeholders */}
        <mesh position={[-2, 0.5, -2]}>
          <boxGeometry args={[2, 1, 4]} />
          <meshStandardMaterial color="#634e34" />
        </mesh>
        
        {/* The Character Silhouette */}
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
          <mesh position={[0, 1, -1]}>
            <cylinderGeometry args={[0.2, 0.2, 1.7]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </Float>
      </group>

      <ambientLight intensity={0.3} />
      <pointLight position={[2, 5, 2]} intensity={1} color="#ffccaa" />
      <pointLight position={[-2, 2, -2]} intensity={0.5} color="#00e5ff" />

      <div className="s3-captions" style={{
        position: 'fixed',
        bottom: '15%',
        left: '10%',
        color: 'var(--void-fg)',
        fontFamily: 'sans-serif',
        pointerEvents: 'none',
        zIndex: 100,
      }}>
        <div className="s3-cap-1" style={{ opacity: 0 }}>Walls stopped being walls.</div>
        <div className="s3-cap-2" style={{ opacity: 0 }}>Time had more room in it.</div>
        <div className="s3-cap-3" style={{ opacity: 0 }}>He didn't know his own strength yet.</div>
      </div>
    </>
  );
};
