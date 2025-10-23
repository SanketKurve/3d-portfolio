import React from 'react';
import { motion } from 'framer-motion';
import portfolioConfig from '../config/portfolio';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const scrollToNext = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const codeSnippets = ['React.js', 'Python', 'Node.js', 'AI/ML', 'MongoDB', 'Django', 'Express', 'Java'];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e]">
      {/* Animated code blocks background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {codeSnippets.map((snippet, i) => (
          <motion.div
            key={i}
            className="absolute px-4 py-2 bg-[#1a1a2e]/80 border border-[#00fff2]/30 rounded-lg backdrop-blur-sm"
            initial={
              {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }
            }
            animate={{
              x: [null, Math.random() * window.innerWidth],
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 0.6, 0.6, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <span className="text-[#00fff2] text-sm font-mono">{snippet}</span>
          </motion.div>
        ))}
      </div>

      {/* Matrix-style falling code effect */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 text-[#00fff2] font-mono text-xs"
            style={{ left: `${i * 5}%` }}
            animate={{
              y: ['-100%', '100vh'],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          >
            {Array.from({ length: 30 }, () => 
              String.fromCharCode(33 + Math.floor(Math.random() * 94))
            ).join('\n')}
          </motion.div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Greeting */}
          <motion.p
            className="text-[#00fff2] text-sm md:text-base font-mono mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Hello, World! I'm
          </motion.p>

          {/* Name with glitch effect */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 relative"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <span className="relative inline-block">
              {portfolioConfig.personal.name}
              <motion.span
                className="absolute inset-0 text-[#00fff2]"
                animate={{ opacity: [0, 0.5, 0], x: [-2, 2, -2] }}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
              >
                {portfolioConfig.personal.name}
              </motion.span>
            </span>
          </motion.h1>

          {/* Title */}
          <motion.h2
            className="text-2xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00fff2] to-[#8b5cf6] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {portfolioConfig.personal.title}
          </motion.h2>

          {/* Tagline */}
          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            {portfolioConfig.personal.tagline}
          </motion.p>

          {/* Superpower Badge */}
          <motion.div
            className="inline-block px-6 py-3 bg-[#1a1a2e]/80 backdrop-blur-md border border-[#00fff2]/30 rounded-full mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <p className="text-[#00fff2] text-sm md:text-base font-medium">
              ⚡ Superpower: {portfolioConfig.personal.superpower}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            <motion.button
              onClick={() => scrollToNext()}
              className="px-8 py-4 bg-gradient-to-r from-[#00fff2] to-[#8b5cf6] text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-[#00fff2]/50 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore My Work
            </motion.button>
            
            <motion.a
              href={`mailto:${portfolioConfig.contact.email}`}
              className="px-8 py-4 border-2 border-[#00fff2] text-[#00fff2] rounded-lg font-semibold text-lg hover:bg-[#00fff2]/10 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
        onClick={scrollToNext}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="text-[#00fff2] w-8 h-8" />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent z-5" />
    </section>
  );
};

export default Hero;