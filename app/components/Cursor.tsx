'use client';
import { useEffect, useState } from 'react';

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Suit la souris
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Détecte si on survole un élément cliquable (bouton ou lien)
      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') !== null ||
        target.closest('.cursor-pointer') !== null
      );
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      {/* Le point central */}
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-black rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ left: position.x, top: position.y }}
      />
      
      {/* Le cercle qui traîne derrière */}
      <div 
        className={`fixed top-0 left-0 border border-black rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out mix-blend-difference
          ${isHovering ? 'w-12 h-12 opacity-50 bg-white/20' : 'w-8 h-8 opacity-100'}
        `}
        style={{ 
            left: position.x, 
            top: position.y,
            // Petit délai pour l'effet de traînée fluide
            transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`
        }}
      />
    </>
  );
}