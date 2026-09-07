import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { CinematicText } from '../components/CinematicText';
import gsap from 'gsap';

export const Finale: React.FC = () => {
  const { setPhase } = useStore();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'var(--void-bg)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '40px' }}>
        <CinematicText 
          text="Every hero starts with a choice." 
          className="finale-text" 
          duration={1.5} 
        />
        <CinematicText 
          text="What's yours?" 
          className="finale-text-sub" 
          duration={1.5} 
          delay={1} 
        />
      </div>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <button 
          onClick={() => setPhase('choice')}
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            border: '1px solid white',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = 'black';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'white';
          }}
        >
          Choose Another Hero
        </button>
      </div>
    </div>
  );
};
