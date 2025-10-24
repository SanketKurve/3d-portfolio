import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, ExternalLink, Calendar, Building2 } from 'lucide-react';
import portfolioConfig from '../config/portfolio';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Certificates = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/certificates`);
        setCertificates(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
        setCertificates(portfolioConfig.certificates);
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <section id="certificates" ref={ref} className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00fff2] to-[#8b5cf6]">Certificates</span> & Credentials
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00fff2] to-[#8b5cf6] mx-auto rounded-full" />
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Validated expertise and continuous learning
          </p>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-400">Loading certificates...</div>
          ) : certificates.length > 0 ? (
            certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              className="relative p-6 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] rounded-xl overflow-hidden group border border-[#00fff2]/30"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, borderColor: 'rgba(0, 255, 242, 0.6)' }}
            >
              {/* Achievement Unlocked Badge */}
              <motion.div
                className="absolute top-4 right-4 px-3 py-1 bg-[#00ff88]/20 border border-[#00ff88] rounded-full"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
              >
                <span className="text-[#00ff88] text-xs font-semibold flex items-center gap-1">
                  <Award size={12} />
                  Verified
                </span>
              </motion.div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00fff2]/0 via-[#00fff2]/10 to-[#00fff2]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00fff2] to-[#8b5cf6] rounded-lg flex items-center justify-center">
                    <Award className="text-white" size={32} />
                  </div>
                </div>

                {/* Certificate Name */}
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {cert.name}
                </h3>

                {/* Issuer */}
                <div className="flex items-center space-x-2 mb-2">
                  <Building2 className="text-[#8b5cf6]" size={16} />
                  <p className="text-gray-400 text-sm">{cert.issuer}</p>
                </div>

                {/* Date */}
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="text-[#00fff2]" size={16} />
                  <p className="text-gray-400 text-sm">{cert.date}</p>
                </div>

                {/* Description */}
                {cert.description && (
                  <p className="text-gray-300 text-sm mb-4">{cert.description}</p>
                )}

                {/* Credential ID */}
                {cert.credentialId && (
                  <p className="text-xs text-gray-500 mb-4">
                    ID: {cert.credentialId}
                  </p>
                )}

                {/* Verify Button */}
                {cert.verifyUrl ? (
                  <motion.a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-[#00fff2]/10 border border-[#00fff2] text-[#00fff2] rounded-lg text-sm font-medium hover:bg-[#00fff2]/20 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Verify Certificate</span>
                    <ExternalLink size={14} />
                  </motion.a>
                ) : null}
              </div>

              {/* Shine effect on hover */}
              <motion.div
                className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.8 }}
              />
            </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400">
              <Award className="mx-auto mb-4 text-6xl text-gray-600" />
              <p className="text-xl mb-2">No certificates yet</p>
              <p className="text-sm">Add your certificates through the admin panel</p>
            </div>
          )}
        </div>


      </div>

      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-[#00fff2]/5 rounded-full blur-3xl" />
    </section>
  );
};

export default Certificates;
