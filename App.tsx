
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import AIAssistant from './components/AIAssistant';
import Footer from './components/Footer';

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
