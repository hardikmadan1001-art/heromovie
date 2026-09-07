import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CinematicTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}

export const CinematicText: React.FC<CinematicTextProps> = ({ text, className, duration = 1, delay = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = text.split('');
    const charElements = containerRef.current.children;

    gsap.fromTo(charElements, 
      { 
        opacity: 0, 
        y: 20, 
        filter: 'blur(10px)',
        scale: 1.2
      }, 
      { 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)',
        scale: 1,
        duration: duration, 
        stagger: 0.03, 
        ease: 'power4.out', 
        delay: delay 
      }
    );
  }, [text, duration, delay]);

  return (
    <div ref={containerRef} className={className} style={{ display: 'flex', overflow: 'hidden' }}>
      {text.split('').map((char, i) => (
        <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {char}
        </span>
      ))}
    </div>
  );
};
