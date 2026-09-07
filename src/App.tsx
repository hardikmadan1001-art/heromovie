import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import Lenis from '@studio-freight/lenis';
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
      {phase === 'preload' && <LoadingScreen />}
      
      <div className="ui-layer">
        {phase === 'void' && <div className="void-ui" />}
        {phase === 'choice' && <div className="choice-ui" />}
      </div>

      <Canvas
        shadows
        camera={{ fov: 35 }}
        gl={{ antialias: true, powerPreference: 'high-performance', stencil: false }}
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
          <Noise 
            opacity={0.04} 
            blendMode="overlay" 
          />
          <Vignette 
            offset={0.3} 
            darkness={0.5} 
          />
          <ChromaticAberration 
            offset={[0.001, 0.001]} 
          />
        </EffectComposer>
      </Canvas>
      
      {phase === 'finale' && <Finale />}

      <div style={{ height: '1400vh', width: '100vw', pointerEvents: 'none' }} />
    </>
  );
};

export default App;
