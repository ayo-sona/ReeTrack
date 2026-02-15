'use client';
import { useRef, useEffect, useState, CSSProperties } from 'react';

interface ParallaxBackgroundProps {
  imageSrc?: string;
  opacity?: number;
  parallaxStrength?: number;
  smoothing?: number;
  className?: string;
  style?: CSSProperties;
}

const ParallaxBackground = ({
  imageSrc = '/map_background.png',
  opacity = 0.05,
  parallaxStrength = 15,
  smoothing = 0.1,
  className = '',
  style
}: ParallaxBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse tracking and smooth animation
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate mouse position relative to center
      // Invert the direction so background moves opposite to mouse
      mouseRef.current.x = (centerX - e.clientX) / rect.width * parallaxStrength;
      mouseRef.current.y = (centerY - e.clientY) / rect.height * parallaxStrength;
    };

    const animate = () => {
      // Smooth interpolation towards target position
      positionRef.current.x += (mouseRef.current.x - positionRef.current.x) * smoothing;
      positionRef.current.y += (mouseRef.current.y - positionRef.current.y) * smoothing;

      if (imageRef.current) {
        imageRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [parallaxStrength, smoothing, isMobile]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={style}
    >
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full transition-transform duration-100 ease-out"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: opacity,
          willChange: 'transform',
        }}
      />
    </div>
  );
};

export default ParallaxBackground;