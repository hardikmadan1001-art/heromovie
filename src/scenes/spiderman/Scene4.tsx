import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, PerspectiveCamera, Environment } from '@react-three/drei';
import gsap from 'gsap';

export const Scene4: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const webRef = useRef<THREE.Line>(null);
  const windParticlesRef = useRef<THREE.Points>(null);

  // Create the swing path: A series of parabolic arcs
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 10, 0),
      new THREE.Vector3(10, 2, 10),
      new THREE.Vector3(20, 10, 20),
      new THREE.Vector3(30, 2, 30),
      new THREE.Vector3(40, 10, 40),
    ]);
  }, []);

  useEffect(() => {
    gsap.to(cameraRef.current!.position, {
      x: 40, y: 10, z: 40,
      scrollTrigger: {
        trigger: 'body',
        start: '300vh top',
        end: '+=130vh',
        scrub: 0.3,
      },
      ease: 'none',
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scrollProgress = window.scrollY / window.innerHeight;
    
    // Map scroll to curve progress (roughly)
    const curveT = Math.max(0, Math.min(1, (scrollProgress - 3) / 1.3));
    const pos = curve.getPointAt(curveT);
    const tangent = curve.getTangentAt(curveT);

    if (cameraRef.current) {
      cameraRef.current.position.copy(pos);
      // Look slightly ahead on the path
      const lookAtPos = curve.getPointAt(Math.min(1, curveT + 0.05));
      cameraRef.current.lookAt(lookAtPos);
      
      // Bank camera into the curve (simple approximation)
      cameraRef.current.rotation.z = Math.sin(curveT * Math.PI * 2) * 0.2;
    }

    // Web Line logic
    if (webRef.current) {
      const anchor = new THREE.Vector3(pos.x + Math.sin(curveT * 10) * 5, pos.y + 10, pos.z + Math.cos(curveT * 10) * 5);
      const points = [anchor, pos];
      (webRef.current.geometry as THREE.BufferGeometry).setFromPoints(points);
    }

    // Wind Particles: move them toward camera
    if (windParticlesRef.current) {
      windParticlesRef.current.position.z += 0.5;
      if (windParticlesRef.current.position.z > 10) windParticlesRef.current.position.z = 0;
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={55} />
      
      {/* The Web Line */}
      <line ref={webRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#e62429" linewidth={2} />
      </line>

      {/* Wind-streak particles */}
      <points ref={windParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={500}
            array={new Float32Array(500 * 3).map(() => (Math.random() - 0.5) * 20)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#f2f2f2" transparent opacity={0.4} />
      </points>

      {/* Stylized Skyscrapers */}
      {[...Array(40)].map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 100, 
          0, 
          (Math.random() - 0.5) * 100
        ]}>
          <boxGeometry args={[4, Math.random() * 50 + 20, 4]} />
          <meshStandardMaterial color="#1c2440" />
        </mesh>
      ))}

      <Environment preset="city" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 20, 10]} intensity={1} />

      {/* The "FREE." Caption */}
      <div className="s4-caption" style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '12rem',
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Impact, sans-serif',
        pointerEvents: 'none',
        zIndex: 100,
        opacity: 0,
        textTransform: 'uppercase',
      }}>
        FREE.
      </div>
    </>
  );
};
