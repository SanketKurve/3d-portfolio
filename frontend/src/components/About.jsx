import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Zap, Brain, Code2, MapPin, Calendar } from 'lucide-react';
import portfolioConfig from '../config/portfolio';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const achievementIcons = {
    'Zap': Zap,
    'Brain': Brain,
    'Code2': Code2,
  };

  return (
    <section id="about" ref={ref} className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00fff2] to-[#8b5cf6]">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00fff2] to-[#8b5cf6] mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Bio and Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Bio */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                The Core System
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                {portfolioConfig.personal.bio}
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.div
                className="p-4 bg-[#1a1a2e] border border-[#00fff2]/20 rounded-lg"
                whileHover={{ scale: 1.05, borderColor: 'rgba(0, 255, 242, 0.5)' }}
              >
                <MapPin className="text-[#00fff2] mb-2" size={20} />
                <p className="text-gray-400 text-sm">Location</p>
                <p className="text-white font-semibold">{portfolioConfig.personal.location}</p>
              </motion.div>

              <motion.div
                className="p-4 bg-[#1a1a2e] border border-[#8b5cf6]/20 rounded-lg"
                whileHover={{ scale: 1.05, borderColor: 'rgba(139, 92, 246, 0.5)' }}
              >
                <Calendar className="text-[#8b5cf6] mb-2" size={20} />
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-white font-semibold">{portfolioConfig.personal.availability}</p>
              </motion.div>
            </div>

            {/* Experience Highlights */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white mb-4">Journey Highlights</h4>
              {portfolioConfig.experience[0].achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="w-2 h-2 bg-[#00fff2] rounded-full mt-2" />
                  <p className="text-gray-300">{achievement}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Achievements Gamification */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Achievements Unlocked
            </h3>

            {portfolioConfig.achievements.map((achievement, index) => {
              const IconComponent = achievementIcons[achievement.icon] || Code2;
              
              return (
                <motion.div
                  key={achievement.id}
                  className="relative p-6 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] border border-[#00fff2]/30 rounded-xl overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(0, 255, 242, 0.6)' }}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00fff2]/0 via-[#00fff2]/10 to-[#00fff2]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#00fff2] to-[#8b5cf6] rounded-lg flex items-center justify-center">
                        <IconComponent className="text-white" size={24} />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-1">{achievement.title}</h4>
                      <p className="text-gray-400 text-sm">{achievement.description}</p>
                    </div>
                    
                    {/* Unlocked Badge */}
                    {achievement.unlocked && (
                      <motion.div
                        className="flex-shrink-0 px-3 py-1 bg-[#00ff88]/20 border border-[#00ff88] rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
                      >
                        <span className="text-[#00ff88] text-xs font-semibold">✓ Unlocked</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Stats Card */}
            <motion.div
              className="p-6 bg-[#1a1a2e] border border-[#8b5cf6]/30 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1 }}
            >
              <h4 className="text-lg font-bold text-white mb-4">Quick Stats</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-[#00fff2]">{portfolioConfig.skills.length}+</p>
                  <p className="text-gray-400 text-sm">Skills</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#8b5cf6]">{portfolioConfig.projects.filter(p => p.status === 'completed').length}</p>
                  <p className="text-gray-400 text-sm">Projects</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#00ff88]">{portfolioConfig.achievements.filter(a => a.unlocked).length}</p>
                  <p className="text-gray-400 text-sm">Achievements</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#00fff2]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
    </section>
  );
};

export default About;