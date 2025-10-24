import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import portfolioConfig from '../config/portfolio';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/skills`);
        setSkills(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
        setSkills(portfolioConfig.skills);
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categoryColors = {
    'Programming': '#00fff2',
    'Frontend': '#8b5cf6',
    'Backend': '#ff006e',
    'Database': '#00ff88',
  };

  return (
    <section id="skills" ref={ref} className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#1a1a2e]">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00fff2] to-[#8b5cf6]">Arsenal</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00fff2] to-[#8b5cf6] mx-auto rounded-full" />
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            My technology stack - mastered through dedication and continuous learning
          </p>
        </motion.div>

        {/* Animated Skill Orbs */}
        <motion.div
          className="mb-16 relative h-96 hidden md:block"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Central "You" orb */}
            <motion.div
              className="absolute w-20 h-20 bg-gradient-to-br from-white to-gray-300 rounded-full flex items-center justify-center shadow-2xl z-10"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(255,255,255,0.3)',
                  '0 0 40px rgba(255,255,255,0.5)',
                  '0 0 20px rgba(255,255,255,0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Orbitron, sans-serif' }}>ME</span>
            </motion.div>

            {/* Orbiting skill circles */}
            {!loading && skills.map((skill, index) => {
              const angle = (index / skills.length) * 2 * Math.PI;
              const radius = 150;
              const size = (skill.level / 100) * 40 + 30;

              return (
                <motion.div
                  key={skill.name}
                  className="absolute rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: categoryColors[skill.category],
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius,
                    opacity: 1,
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    opacity: { duration: 0.5, delay: index * 0.05 }
                  }}
                  whileHover={{ scale: 1.2, zIndex: 20 }}
                >
                  <span className="text-center px-2">{skill.name}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Skills List by Category */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(groupedSkills).map(([category, skills], catIndex) => (
            <motion.div
              key={category}
              className="p-6 bg-[#0a0a0f] border border-[#00fff2]/20 rounded-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: catIndex * 0.1 }}
              whileHover={{ scale: 1.03, borderColor: `${categoryColors[category]}80` }}
            >
              <h3 className="text-xl font-bold text-white mb-4" style={{ color: categoryColors[category] }}>
                {category}
              </h3>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">{skill.name}</span>
                      <span className="text-xs text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: categoryColors[category] }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.level}%` } : {}}
                        transition={{ duration: 0.8, delay: catIndex * 0.05, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-gray-400 text-sm">{category}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#00fff2]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
    </section>
  );
};

export default Skills;
