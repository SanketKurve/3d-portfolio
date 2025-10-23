import React, { useState, useEffect } from 'react';
import { fetchProjects, fetchSkills, fetchCertificates, submitContact } from '../services/api';
import { Github, Linkedin, Mail, ExternalLink, Code2, Award, Briefcase, Send } from 'lucide-react';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsRes, skillsRes, certsRes] = await Promise.all([
        fetchProjects(),
        fetchSkills(),
        fetchCertificates()
      ]);
      setProjects(projectsRes.data);
      setSkills(skillsRes.data);
      setCertificates(certsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    try {
      await submitContact(formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus(''), 3000);
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus(''), 3000);
    }
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-6 z-10 text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Sanket Kurve
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-4">Full-Stack Developer</p>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              From back-end logic to front-end magic. The full-stack advantage.
            </p>
            <p className="text-lg text-purple-300 mb-12">
              ⚡ Lightning-fast technology adoption & AI integration
            </p>
            <div className="flex gap-6 justify-center">
              <a href="https://github.com/SanketKurve" target="_blank" rel="noopener noreferrer" 
                className="p-4 bg-gray-800 rounded-full hover:bg-gray-700 transition-all hover:scale-110">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/sanket-kurve-03a8b3196" target="_blank" rel="noopener noreferrer"
                className="p-4 bg-gray-800 rounded-full hover:bg-gray-700 transition-all hover:scale-110">
                <Linkedin size={24} />
              </a>
              <a href="mailto:sanketkurve.2005@gmail.com"
                className="p-4 bg-gray-800 rounded-full hover:bg-gray-700 transition-all hover:scale-110">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <Code2 className="inline-block mr-3" />
            About Me
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                I'm a passionate <span className="text-purple-400 font-semibold">Full-Stack Developer</span> from India with expertise in building scalable web applications. 
                My journey in tech is driven by a love for problem-solving and creating innovative solutions.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                I specialize in modern web technologies including React, Node.js, Python, and AI/ML integration. 
                Currently open to exciting opportunities to build impactful products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <Award className="inline-block mr-3" />
            Skills & Expertise
          </h2>
          <div className="max-w-6xl mx-auto space-y-8">
            {Object.keys(skillsByCategory).map((category) => (
              <div key={category} className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                <h3 className="text-2xl font-semibold mb-6 text-purple-300">{category}</h3>
                <div className="grid gap-6">
                  {skillsByCategory[category].map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-200 font-medium">
                          {skill.icon} {skill.name}
                        </span>
                        <span className="text-purple-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <Briefcase className="inline-block mr-3" />
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {projects.map((project) => (
              <div key={project.id} 
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-500/60 transition-all hover:scale-105">
                <div className="h-48 overflow-hidden">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-purple-400 mb-3">{project.tagline}</p>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-500/20 rounded-full text-sm text-purple-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition">
                        <Github size={20} /> Code
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition">
                        <ExternalLink size={20} /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <Award className="inline-block mr-3" />
            Certificates & Achievements
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {certificates.map((cert) => (
              <div key={cert.id} 
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/60 transition-all">
                {cert.imageUrl && (
                  <div className="h-32 mb-4 overflow-hidden rounded-lg">
                    <img src={cert.imageUrl} alt={cert.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{cert.name}</h3>
                <p className="text-purple-400 mb-2">{cert.issuer}</p>
                <p className="text-gray-400 text-sm mb-3">{cert.date}</p>
                {cert.verifyUrl && (
                  <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
                    <ExternalLink size={16} /> Verify
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <Mail className="inline-block mr-3" />
            Get In Touch
          </h2>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleContactSubmit} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-purple-500 transition"
              />
              <textarea
                placeholder="Your Message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-purple-500 transition"
              ></textarea>
              
              {formStatus === 'success' && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300">
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}
              {formStatus === 'error' && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
                  Failed to send message. Please try again.
                </div>
              )}
              
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {formStatus === 'sending' ? 'Sending...' : 'Send Message'} <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>© 2024 Sanket Kurve. Built with React & FastAPI</p>
          <p className="mt-2">Open to opportunities • India</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
