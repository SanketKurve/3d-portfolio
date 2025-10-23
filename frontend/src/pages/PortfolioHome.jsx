import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// Components
import LoadingScreen from '../components/LoadingScreen';
import Navigation from '../components/Navigation';
import ParticleBackground from '../components/ParticleBackground';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills2D';
import Certificates from '../components/Certificates';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { Toaster } from '../components/ui/sonner';

function PortfolioHome() {
  const [loading, setLoading] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingScreen key="loading" onLoadComplete={() => setLoading(false)} />
      ) : (
        <div key="main" className="relative">
          {/* Particle Background */}
          <ParticleBackground />

          {/* Navigation */}
          <Navigation />

          {/* Main Content */}
          <main className="relative z-10">
            <Hero />
            <About />
            <Skills />
            <Certificates />
            <Projects />
            <Contact />
          </main>

          {/* Footer */}
          <Footer />

          {/* Toast Notifications */}
          <Toaster />
        </div>
      )}
    </AnimatePresence>
  );
}

export default PortfolioHome;
