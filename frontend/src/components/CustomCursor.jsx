import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Add to trail
      setTrail(prev => [
        ...prev.slice(-10),
        { x: e.clientX, y: e.clientY, id: Date.now() }
      ]);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, input, textarea, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Hide on mobile
  if (window.innerWidth < 768) return null;

  return (
    <>
      {/* Trail particles */}
      {trail.map((point, i) => (
        <motion.div
          key={point.id}
          className="fixed pointer-events-none z-50 w-1 h-1 bg-[#00fff2] rounded-full"
          style={{
            left: point.x,
            top: point.y,
          }}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
        />
      ))}

      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 10,
          y: mousePosition.y - 10,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div className="relative w-5 h-5">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 border-2 border-[#00fff2] rounded-full"
            animate={{
              scale: isHovering ? [1, 1.2, 1] : 1,
              opacity: isHovering ? [1, 0.5, 1] : 1,
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          
          {/* Inner dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#00fff2] rounded-full" />
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-[#00fff2] rounded-full blur-md"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </>
  );
};

export default CustomCursor;