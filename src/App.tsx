import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import Lenis from 'lenis';
import { useStore } from './store/useStore';
import { CustomCursor } from './components/CustomCursor';
import { LoadingScreen } from './components/LoadingScreen';
import { Void } from './scenes/void/Void';
import { Choice } from './scenes/choice/Choice';
import { SpidermanPath } from './scenes/spiderman/SpidermanPath';
import { IronmanPath } from './scenes/ironman/IronmanPath';
import { Finale } from './scenes/Finale';
import './index.css';

const App: React.FC = () => {
  const { phase, choice } = useStore();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <>
      <CustomCursor />
      
      {/* 1. LOADING LAYER (Highest Z-Index) */}
      {phase === 'preload' && <LoadingScreen />}
      
      {/* 2. UI LAYER (Above Canvas) */}
      <div className="ui-layer" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 100,
      }}>
        {phase === 'void' && <VoidUI />}
        {phase === 'choice' && <div className="choice-ui" />}
      </div>

      {/* 3. 3D CANVAS LAYER (Background) */}
      <Canvas
        shadows
        camera={{ fov: 35 }}
        gl={{ antialias: true, powerPreference: 'high-performance', stencil: false }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}
      >
        <color attach="background" args={['#05050a']} />
        
        {phase === 'void' && <Void />}
        {phase === 'choice' && <Choice />}
        {phase === 'spiderman' && <SpidermanPath />}
        {phase === 'ironman' && <IronmanPath />}

        <EffectComposer disableNormalPass>
          <Bloom 
            intensity={1.5} 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            mipmapBlur 
          />
          <Noise opacity={0.04} blendMode="overlay" />
          <Vignette offset={0.3} darkness={0.5} />
          <ChromaticAberration offset={[0.001, 0.001]} />
        </EffectComposer>
      </Canvas>
      
      {phase === 'finale' && <Finale />}
      <div style={{ height: '1400vh', width: '100vw', pointerEvents: 'none' }} />
    </>
  );
};

// Separated UI Component to avoid Canvas rendering issues
const VoidUI = () => {
  const { setAudioUnlocked, audioUnlocked } = useStore();
  const [isUnlocked, setIsUnlocked] = React.useState(false);

  const handleEnter = () => {
    setAudioUnlocked(true);
    setIsUnlocked(true);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      {!isUnlocked ? (
        <div 
          onClick={handleEnter}
          style={{
            cursor: 'pointer',
            color: 'white',
            fontSize: '0.7rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            opacity: 0.8,
            userSelect: 'none',
            pointerEvents: 'auto',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '15px 30px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          [ Tap to Enter ]
        </div>
      ) : (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '100%'
        }}>
          <CinematicText 
            text="Every hero starts with a choice." 
            className="void-main-text" 
            duration={1.5} 
            delay={0.5} 
          />
        </div>
      )}
    </div>
  );
};

export default App;
