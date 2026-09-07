import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

export const LoadingScreen: React.FC = () => {
  const { setPhase } = useStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate asset loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase('void'), 500);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [setPhase]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'var(--void-bg)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'var(--void-fg)',
    }}>
      <div style={{
        width: '200px',
        height: '1px',
        backgroundColor: 'var(--void-dim)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${progress}%`,
          backgroundColor: 'var(--void-fg)',
          transition: 'width 0.2s ease-out',
        }} />
      </div>
      <div style={{
        marginTop: '20px',
        fontSize: '0.7rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        opacity: 0.6,
      }}>
        Loading Assets... {Math.round(progress)}%
      </div>
    </div>
  );
};
