
import React from 'react';

interface ParallaxBackgroundProps {
  scrollY: number;
  mousePosition: { x: number; y: number };
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ scrollY, mousePosition }) => {
  const { x, y } = mousePosition;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Calculate mouse influence, making it subtle
  const mouseX = (x - centerX) / 50;
  const mouseY = (y - centerY) / 50;
  
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-gray-900" aria-hidden="true">
      {/* Orb 1 */}
      <div
        className="absolute w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-2xl"
        style={{
          transform: `translate3d(${mouseX}px, ${-mouseY + scrollY * 0.3}px, 0)`,
          top: '10vh',
          left: '15vw',
        }}
      />
      {/* Orb 2 */}
      <div
        className="absolute w-[30rem] h-[30rem] bg-teal-500 rounded-full opacity-20 blur-2xl"
        style={{
          transform: `translate3d(${-mouseX * 0.8}px, ${mouseY * 0.8 + scrollY * 0.5}px, 0)`,
          top: '50vh',
          right: '10vw',
        }}
      />
      {/* Orb 3 */}
      <div
        className="absolute w-80 h-80 bg-red-500 rounded-full opacity-10 blur-2xl"
        style={{
          transform: `translate3d(${mouseX * 0.5}px, ${-mouseY * 0.5 + scrollY * 0.7}px, 0)`,
          top: '120vh',
          left: '30vw',
        }}
      />
       {/* Orb 4 */}
      <div
        className="absolute w-[25rem] h-[25rem] bg-indigo-400 rounded-full opacity-20 blur-2xl"
        style={{
          transform: `translate3d(${-mouseX * 0.3}px, ${mouseY * 0.3 + scrollY * 0.4}px, 0)`,
          top: '180vh',
          right: '25vw',
        }}
      />
    </div>
  );
};

export default ParallaxBackground;
