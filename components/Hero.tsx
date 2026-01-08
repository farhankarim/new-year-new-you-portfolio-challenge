
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-32 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 animate-fadeInUp"
          style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
        >
          <span className="block">Hi, I'm Farhan Karim.</span>
          <span className="block text-indigo-400">A Full-Stack Software Engineer.</span>
        </h1>
        <p 
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 animate-fadeInUp"
          style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
        >
          With 3+ years of experience specializing in the Laravel/PHP ecosystem, I design and maintain robust enterprise solutions like CRM, CMS, and ERP systems, translating complex requirements into high-value features.
        </p>
        <div
          className="animate-fadeInUp"
          style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}
        >
          <a
            href="#ai-assistant"
            className="inline-block bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105"
          >
            Chat with my AI Assistant
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
