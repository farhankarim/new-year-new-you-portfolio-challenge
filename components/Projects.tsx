
import React, { useRef, useState, useEffect } from 'react';
import { PROJECTS } from '../constants.tsx';
import { Project } from '../types.ts';

interface ProjectCardProps {
  project: Project;
  onShowModal: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onShowModal }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onShowModal();
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 h-full flex flex-col hover:-translate-y-2">
      <img
        src={project.imageUrl}
        alt={project.title}
        className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity"
        width="600"
        height="400"
        loading="lazy"
        decoding="async"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-400 mb-4 text-sm flex-grow">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(tag => (
            <span key={tag} className="bg-indigo-900/50 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="flex items-center space-x-4 mt-auto">
          <a href="#" onClick={handleLinkClick} className="text-indigo-400 hover:text-indigo-300 font-semibold">Live Demo</a>
          <a href="#" onClick={handleLinkClick} className="text-gray-400 hover:text-white font-semibold">Source Code</a>
        </div>
      </div>
    </div>
  );
};

interface ProjectsProps {
  onShowModal: () => void;
}

const Projects: React.FC<ProjectsProps> = ({ onShowModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="projects" className="py-20" ref={sectionRef}>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Featured Projects
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project, index) => (
           <div
            key={project.title}
            className={`transition-all duration-500 ease-out ${
              isVisible
                ? 'opacity-100 translate-y-0 scale-100 rotate-0'
                : 'opacity-0 translate-y-8 scale-95 rotate-[-2deg]'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <ProjectCard project={project} onShowModal={onShowModal} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;