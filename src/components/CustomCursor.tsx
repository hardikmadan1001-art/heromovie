import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';

export const CustomCursor: React.FC = () => {
  const { choice } = useStore();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).classList.contains('interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const ringColor = choice === 'spiderman' ? 'var(--sm-red)' : choice === 'ironman' ? 'var(--im-gold)' : 'var(--void-fg)';

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: isHovering ? '48px' : '8px',
        height: isHovering ? '48px' : '8px',
        borderRadius: '50%',
        border: `1px solid ${ringColor}`,
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'width 0.3s, height 0.3s',
        transform: `translate(${position.x - (isHovering ? 24 : 4)}px, ${position.y - (isHovering ? 24 : 4)}px)`,
        mixBlendMode: 'difference',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '2px',
        height: '2px',
        backgroundColor: ringColor,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
      }} />
    </div>
  );
};
