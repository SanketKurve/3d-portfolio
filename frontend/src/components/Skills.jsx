import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as THREE from 'three';
import portfolioConfig from '../config/portfolio';

// 3D Skill Planet
const SkillPlanet = ({ position, skill, index }) => {
  const mesh = useRef();
  const [hovered, setHovered] = React.useState(false);

  // Size based on skill level
  const size = useMemo(() => (skill.level / 100) * 1.5 + 0.5, [skill.level]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    // Orbit around center
    const time = state.clock.elapsedTime;
    const radius = 5 + index * 0.5;
    const speed = 0.2 + index * 0.05;
    
    mesh.current.position.x = Math.cos(time * speed + index) * radius;
    mesh.current.position.z = Math.sin(time * speed + index) * radius;
    mesh.current.position.y = Math.sin(time * 0.5 + index) * 2;
    
    // Rotate
    mesh.current.rotation.y += 0.01;
    mesh.current.rotation.x = Math.sin(time * 0.3) * 0.2;
  });

  // Color based on category
  const getColor = (category) => {
    const colors = {
      'Programming': '#00fff2',
      'Frontend': '#8b5cf6',
      'Backend': '#ff006e',
      'Database': '#00ff88',
    };
    return colors[category] || '#00fff2';
  };

  return (
    <group
      ref={mesh}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={getColor(skill.category)}
          emissive={getColor(skill.category)}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          transparent
          opacity={hovered ? 1 : 0.8}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      
      {hovered && (
        <>
          <Text
            position={[0, size + 0.8, 0]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6xpmIyXjU1pg.woff"
          >
            {skill.name}
          </Text>
          <Text
            position={[0, size + 0.4, 0]}
            fontSize={0.3}
            color={getColor(skill.category)}
            anchorX="center"
            anchorY="middle"
          >
            {skill.level}%
          </Text>
        </>
      )}
      
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[size + 0.2, 0.02, 16, 100]} />
        <meshBasicMaterial color={getColor(skill.category)} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

const SkillsScene = () => {
  const { skills } = portfolioConfig;

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00fff2" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, 10, 0]} intensity={0.7} color="#ff006e" />
      
      {/* Central sun (You) */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {skills.map((skill, index) => (
        <SkillPlanet key={skill.name} skill={skill} index={index} position={[0, 0, 0]} />
      ))}
      
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
};

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Group skills by category
  const groupedSkills = portfolioConfig.skills.reduce((acc, skill) => {
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
            Each skill is a planet in my technology solar system. Hover to explore proficiency levels.
          </p>
        </motion.div>

        {/* 3D Skill Visualization */}
        <motion.div
          className="h-[500px] mb-12 rounded-xl overflow-hidden border border-[#00fff2]/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
            <SkillsScene />
          </Canvas>
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
                        transition={{ duration: 1, delay: catIndex * 0.1 }}
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