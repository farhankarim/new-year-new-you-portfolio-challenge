
import React from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import Skills from './components/Skills.tsx';
import Projects from './components/Projects.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import Footer from './components/Footer.tsx';
// The styles.css import is used by the build process, not the browser in dev mode.
import './styles.css';

const App: React.FC = () => {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-16">
        <Hero />
        <Skills />
        <Projects />
        <AIAssistant />
      </main>
      <Footer />
    </div>
  );
};

export default App;
