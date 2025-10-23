import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import portfolioConfig from '../config/portfolio';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0a0a0f] border-t border-[#00fff2]/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Copyright */}
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {portfolioConfig.personal.name}. All rights reserved.
            </p>
          </div>

          {/* Center: Quick Links */}
          <div className="flex items-center space-x-6">
            <a
              href={portfolioConfig.contact.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00fff2] transition-colors text-sm"
            >
              GitHub
            </a>
            <a
              href={portfolioConfig.contact.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00fff2] transition-colors text-sm"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${portfolioConfig.contact.email}`}
              className="text-gray-400 hover:text-[#00fff2] transition-colors text-sm"
            >
              Contact
            </a>
          </div>

          {/* Right: Back to Top */}
          <motion.button
            onClick={scrollToTop}
            className="flex items-center space-x-2 px-4 py-2 bg-[#1a1a2e] border border-[#00fff2]/30 rounded-lg text-[#00fff2] text-sm hover:bg-[#00fff2]/10 transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Back to Top</span>
            <ArrowUp size={16} />
          </motion.button>
        </div>

        {/* Bottom: Version/Status */}
        <div className="mt-6 pt-6 border-t border-[#1a1a2e] text-center">
          <p className="text-gray-600 text-xs">
            Portfolio v1.0
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
