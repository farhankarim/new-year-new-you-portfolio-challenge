
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import Skills from './components/Skills.tsx';
import Projects from './components/Projects.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import Footer from './components/Footer.tsx';
import Modal from './components/Modal.tsx';
import ParallaxBackground from './components/ParallaxBackground.tsx';
// The styles.css import is used by the build process, not the browser in dev mode.
import './styles.css';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="text-gray-100 min-h-screen relative overflow-x-hidden">
      <ParallaxBackground scrollY={scrollY} mousePosition={mousePosition} />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 md:px-8 py-8 md:py-16">
          <Hero />
          <Skills />
          <Projects onShowModal={handleOpenModal} />
          <AIAssistant />
        </main>
        <Footer />
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default App;
