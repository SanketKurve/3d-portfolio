import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Github, Linkedin, Send, Copy, Check } from 'lucide-react';
import portfolioConfig from '../config/portfolio';
import { toast } from '../hooks/use-toast';

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [emailCopied, setEmailCopied] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create mailto link
    const subject = encodeURIComponent(`Portfolio Contact: ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoLink = `mailto:${portfolioConfig.contact.email}?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoLink;
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioConfig.contact.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const socialLinks = [
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:${portfolioConfig.contact.email}`,
      label: portfolioConfig.contact.email,
      color: '#00fff2',
      hoverAction: copyEmail
    },
    {
      name: 'GitHub',
      icon: Github,
      url: portfolioConfig.contact.github.url,
      label: `@${portfolioConfig.contact.github.username}`,
      color: '#8b5cf6'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: portfolioConfig.contact.linkedin.url,
      label: portfolioConfig.contact.linkedin.handle,
      color: '#00fff2'
    },
  ];

  return (
    <section id="contact" ref={ref} className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00fff2] to-[#8b5cf6]">In Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00fff2] to-[#8b5cf6] mx-auto rounded-full" />
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Let's collaborate on your next project. I'm always open to discussing new opportunities.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-8 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] border border-[#00fff2]/30 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Launch Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-gray-300 text-sm mb-2">
                    Hey, what's your name?
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#00fff2]/30 rounded-lg text-white focus:outline-none focus:border-[#00fff2] transition-colors"
                    placeholder="Your name"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-gray-300 text-sm mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#00fff2]/30 rounded-lg text-white focus:outline-none focus:border-[#00fff2] transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label htmlFor="message" className="block text-gray-300 text-sm mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#00fff2]/30 rounded-lg text-white focus:outline-none focus:border-[#00fff2] transition-colors resize-none"
                    placeholder="Tell me about your project or just say hi!"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-[#00fff2] to-[#8b5cf6] text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-[#00fff2]/50 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send size={20} />
                  <span>Launch Message</span>
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Right: Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Connect With Me
            </h3>

            {/* Social Links */}
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              
              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {link.name === 'Email' ? (
                    <div
                      onClick={link.hoverAction}
                      className="relative p-6 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] border border-[#00fff2]/30 rounded-xl group cursor-pointer overflow-hidden"
                    >
                      <div className="relative flex items-center space-x-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#00fff2] to-[#8b5cf6] rounded-lg flex items-center justify-center">
                          <IconComponent className="text-white" size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm">{link.name}</p>
                          <p className="text-white font-semibold">{link.label}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {emailCopied ? (
                            <Check className="text-[#00ff88]" size={20} />
                          ) : (
                            <Copy className="text-[#00fff2]" size={20} />
                          )}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00fff2]/0 via-[#00fff2]/10 to-[#00fff2]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <motion.a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative p-6 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] border border-[#00fff2]/30 rounded-xl group block overflow-hidden"
                      whileHover={{ scale: 1.03, borderColor: `${link.color}80` }}
                    >
                      <div className="relative flex items-center space-x-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#00fff2] to-[#8b5cf6] rounded-lg flex items-center justify-center">
                          <IconComponent className="text-white" size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm">{link.name}</p>
                          <p className="text-white font-semibold">{link.label}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00fff2]/0 via-[#00fff2]/10 to-[#00fff2]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.a>
                  )}
                </motion.div>
              );
            })}

            {/* Quick Info Card */}
            <motion.div
              className="p-6 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] border border-[#8b5cf6]/30 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1 }}
            >
              <h4 className="text-lg font-bold text-white mb-3">Quick Response</h4>
              <p className="text-gray-300 text-sm mb-2">
                I typically respond within 24 hours.
              </p>
              <p className="text-gray-400 text-xs">
                Based in {portfolioConfig.personal.location} | {portfolioConfig.personal.availability}
              </p>
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

export default Contact;