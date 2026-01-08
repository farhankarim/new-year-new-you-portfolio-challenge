
import React from 'react';
import { PROJECTS } from '../constants';
import { Project } from '../types';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20">
    <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity" />
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
      <p className="text-gray-400 mb-4 text-sm">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map(tag => (
          <span key={tag} className="bg-indigo-900/50 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
        ))}
      </div>
      <div className="flex items-center space-x-4 mt-auto">
        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 font-semibold">Live Demo</a>}
        <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white font-semibold">Source Code</a>
      </div>
    </div>
  </div>
);


const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Featured Projects
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
