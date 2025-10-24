import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, X, Calendar, Tag } from 'lucide-react';
import portfolioConfig from '../config/portfolio';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ProjectCard = ({ project, onClick }) => {
  const isPlaceholder = project.status === 'planned';

  return (
    <motion.div
      className={`relative p-6 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] rounded-xl overflow-hidden group cursor-pointer ${
        isPlaceholder ? 'border-2 border-dashed border-[#00fff2]/20' : 'border border-[#00fff2]/30'
      }`}
      whileHover={{ scale: 1.03, y: -5 }}
      onClick={() => !isPlaceholder && onClick(project)}
      layout
    >
      {/* Status Badge */}
      {project.status === 'completed' && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-[#00ff88]/20 border border-[#00ff88] rounded-full">
          <span className="text-[#00ff88] text-xs font-semibold">✓ Completed</span>
        </div>
      )}

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00fff2]/0 via-[#00fff2]/10 to-[#00fff2]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Image Placeholder */}
      <div className="relative mb-6 h-48 bg-[#0a0a0f] rounded-lg overflow-hidden">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl font-bold text-[#00fff2]/20" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              {project.title[0]}{project.title[1]}
            </div>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Category Tag */}
        {project.category && (
          <div className="flex items-center space-x-2 mb-2">
            <Tag className="text-[#8b5cf6]" size={14} />
            <span className="text-[#8b5cf6] text-xs font-semibold">{project.category}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          {project.title}
        </h3>

        {/* Tagline */}
        <p className="text-[#00fff2] text-sm mb-3">{project.tagline}</p>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>

        {/* Tech Stack */}
        {project.tech && project.tech.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-[#00fff2]/10 border border-[#00fff2]/30 text-[#00fff2] text-xs rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Year */}
        {project.year && (
          <div className="flex items-center space-x-2 text-gray-500 text-xs">
            <Calendar size={12} />
            <span>{project.year}</span>
          </div>
        )}

        {isPlaceholder && (
          <div className="mt-4 px-4 py-2 bg-[#1a1a2e] border border-[#00fff2]/20 text-[#00fff2]/50 rounded-lg text-sm text-center">
            Coming Soon...
          </div>
        )}
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
        initial={{ x: '-100%' }}
        whileHover={{ x: '200%' }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] rounded-2xl border border-[#00fff2]/30 p-8"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#0a0a0f] rounded-lg hover:bg-[#00fff2]/10 transition-colors"
        >
          <X className="text-white" size={24} />
        </button>

        {/* Modal Content */}
        <div>
          {/* Title */}
          <h2 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            {project.title}
          </h2>
          <p className="text-[#00fff2] text-lg mb-6">{project.tagline}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 mb-6">
            {project.category && (
              <div className="flex items-center space-x-2">
                <Tag className="text-[#8b5cf6]" size={16} />
                <span className="text-gray-300 text-sm">{project.category}</span>
              </div>
            )}
            {project.year && (
              <div className="flex items-center space-x-2">
                <Calendar className="text-[#00fff2]" size={16} />
                <span className="text-gray-300 text-sm">{project.year}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-3">About This Project</h3>
            <p className="text-gray-300 leading-relaxed">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Tech Stack */}
          {project.tech && project.tech.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-gradient-to-r from-[#00fff2]/20 to-[#8b5cf6]/20 border border-[#00fff2]/30 text-white rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">Key Features</h3>
              <ul className="space-y-2">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#00fff2] rounded-full mt-2" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.demoUrl && (
              <motion.a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#00fff2] to-[#8b5cf6] text-white rounded-lg font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink size={18} />
                <span>Live Demo</span>
              </motion.a>
            )}
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-6 py-3 border-2 border-[#00fff2] text-[#00fff2] rounded-lg font-medium hover:bg-[#00fff2]/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={18} />
                <span>View Code</span>
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/projects`);
        setProjects(response.data.filter(p => p.visible !== false && p.status !== 'planned'));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        // Fallback to config if API fails
        setProjects(portfolioConfig.projects);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" ref={ref} className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#1a1a2e]">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00fff2] to-[#8b5cf6]">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00fff2] to-[#8b5cf6] mx-auto rounded-full" />
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Showcasing innovation, problem-solving, and technical expertise
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {loading ? (
            <div className="col-span-full text-center text-gray-400">Loading projects...</div>
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
              }}
            >
              <ProjectCard project={project} onClick={setSelectedProject} />
            </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#00fff2]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
    </section>
  );
};

export default Projects;
