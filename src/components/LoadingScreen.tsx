import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { useAudioInit } from '../audio/AudioManager';

export const LoadingScreen: React.FC = () => {
  const { setPhase } = useStore();
  useAudioInit(); // Initialize audio on first interaction
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (!mounted) return prev;
        if (prev >= 100) {
          clearInterval(interval);
          if (mounted) setPhase('void');
          return 100;
        }
        return prev + Math.min(15, 100 - prev); // Ensure we don't overshoot and reach 100 reliably
      });
    }, 100);
    
    // Safety timeout: Force enter Void after 5 seconds regardless of progress
    const timeout = setTimeout(() => {
      if (mounted) setPhase('void');
    }, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [setPhase]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#05050a',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#f5f3ee',
      transition: 'opacity 1s ease-out',
    }}>
      <div style={{
        width: '200px',
        height: '1px',
        backgroundColor: 'rgba(245, 243, 238, 0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#f5f3ee',
          transition: 'width 0.2s ease-out',
        }} />
      </div>
      <div style={{
        marginTop: '20px',
        fontSize: '0.6rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        opacity: 0.5,
      }}>
        Initializing Cinema... {Math.round(progress)}%
      </div>
    </div>
  );
};
